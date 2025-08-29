"""
AI Evidence Analysis Engine
Core intelligence for VA claims document analysis
"""

import asyncio
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, date
import re
import json
from dataclasses import dataclass, asdict
import numpy as np
from enum import Enum

import spacy
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer
import torch
from anthropic import AsyncAnthropic
from sklearn.metrics.pairwise import cosine_similarity

from app.core.logging import logger
from app.models.claims import ClaimType, EvidenceType, ConfidenceLevel
from app.services.va_knowledge import VAKnowledgeBase

class EvidenceRelevance(Enum):
    """Evidence relevance levels"""
    DIRECT = "direct"  # Directly supports claim
    SUPPORTING = "supporting"  # Provides context
    CONTRADICTORY = "contradictory"  # Conflicts with claim
    NEUTRAL = "neutral"  # Not relevant

@dataclass
class Evidence:
    """Evidence item from document"""
    document_id: str
    page_number: int
    text: str
    type: EvidenceType
    relevance: EvidenceRelevance
    confidence: float
    condition: str
    date: Optional[date] = None
    provider: Optional[str] = None
    diagnosis_codes: List[str] = None
    highlights: List[Tuple[int, int]] = None  # Start, end positions
    
@dataclass
class MedicalCondition:
    """Identified medical condition"""
    name: str
    icd10_codes: List[str]
    evidence_items: List[Evidence]
    in_service_event: Optional[str] = None
    nexus_statement: Optional[str] = None
    continuity_evidence: List[Evidence] = None
    severity_rating: Optional[int] = None
    secondary_to: Optional[str] = None

@dataclass
class ClaimAnalysis:
    """Complete claim analysis results"""
    claim_id: str
    claim_type: ClaimType
    conditions: List[MedicalCondition]
    timeline: List[Dict[str, Any]]
    evidence_strength: float
    missing_evidence: List[str]
    recommendations: List[str]
    dbq_needed: List[str]
    presumptive_conditions: List[str]
    confidence_score: float
    processing_time: float

class AIEngine:
    """Main AI engine for evidence analysis"""
    
    def __init__(self):
        self.nlp = None
        self.classifier = None
        self.embedder = None
        self.anthropic = None
        self.knowledge_base = VAKnowledgeBase()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
    async def initialize(self):
        """Initialize AI models"""
        logger.info("Initializing AI models...")
        
        # Load spaCy model with custom NER for VA terms
        self.nlp = spacy.load("en_core_web_lg")
        await self._add_va_entities()
        
        # Load classifier for document types
        self.classifier = pipeline(
            "text-classification",
            model="bert-base-uncased",
            device=0 if torch.cuda.is_available() else -1
        )
        
        # Load sentence embedder for semantic search
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize Anthropic client
        self.anthropic = AsyncAnthropic()
        
        logger.info("✅ AI models initialized")
    
    async def _add_va_entities(self):
        """Add VA-specific entities to NLP model"""
        # Add custom entity patterns for VA terminology
        patterns = [
            {"label": "CONDITION", "pattern": "PTSD"},
            {"label": "CONDITION", "pattern": "tinnitus"},
            {"label": "CONDITION", "pattern": "hearing loss"},
            {"label": "CONDITION", "pattern": "TBI"},
            {"label": "CONDITION", "pattern": "traumatic brain injury"},
            {"label": "VA_FORM", "pattern": "DD-214"},
            {"label": "VA_FORM", "pattern": "VA Form 21-526EZ"},
            {"label": "VA_FORM", "pattern": "DBQ"},
            {"label": "MILITARY_UNIT", "pattern": [{"TEXT": {"REGEX": r"\d{1,3}(st|nd|rd|th)\s+\w+"}}]},
        ]
        
        ruler = self.nlp.add_pipe("entity_ruler", before="ner")
        ruler.add_patterns(patterns)
    
    async def analyze_claim_evidence(
        self, 
        claim_id: str, 
        documents: List[Dict]
    ) -> ClaimAnalysis:
        """
        Main analysis pipeline for claim evidence
        """
        start_time = datetime.now()
        logger.info(f"Analyzing claim {claim_id} with {len(documents)} documents")
        
        # Extract claimed conditions
        claimed_conditions = await self._extract_claimed_conditions(documents)
        
        # Process each document
        all_evidence = []
        for doc in documents:
            evidence = await self._extract_evidence(doc, claimed_conditions)
            all_evidence.extend(evidence)
        
        # Group evidence by condition
        conditions = await self._group_evidence_by_condition(all_evidence, claimed_conditions)
        
        # Build timeline
        timeline = await self._build_timeline(all_evidence)
        
        # Analyze evidence strength
        evidence_strength = await self._calculate_evidence_strength(conditions)
        
        # Identify missing evidence
        missing_evidence = await self._identify_missing_evidence(conditions, claimed_conditions)
        
        # Generate recommendations
        recommendations = await self._generate_recommendations(conditions, missing_evidence)
        
        # Determine needed DBQs
        dbq_needed = await self._determine_dbqs(conditions)
        
        # Check for presumptive conditions
        presumptive = await self._check_presumptive_conditions(documents, conditions)
        
        # Calculate overall confidence
        confidence = await self._calculate_confidence(conditions, evidence_strength)
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return ClaimAnalysis(
            claim_id=claim_id,
            claim_type=await self._determine_claim_type(claimed_conditions),
            conditions=conditions,
            timeline=timeline,
            evidence_strength=evidence_strength,
            missing_evidence=missing_evidence,
            recommendations=recommendations,
            dbq_needed=dbq_needed,
            presumptive_conditions=presumptive,
            confidence_score=confidence,
            processing_time=processing_time
        )
    
    async def _extract_claimed_conditions(self, documents: List[Dict]) -> List[str]:
        """Extract claimed conditions from 526EZ or similar forms"""
        conditions = []
        
        for doc in documents:
            if "21-526" in doc.get("type", "").lower():
                # Use NLP to extract conditions
                doc_nlp = self.nlp(doc["text"])
                
                for ent in doc_nlp.ents:
                    if ent.label_ == "CONDITION":
                        conditions.append(ent.text)
                
                # Also use pattern matching for common conditions
                patterns = [
                    r"claiming?\s+(?:for\s+)?(.+?)(?:\.|,|;|$)",
                    r"conditions?\s+claimed:\s*(.+?)(?:\.|$)",
                    r"disability\s+for\s+(.+?)(?:\.|,|$)"
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, doc["text"], re.IGNORECASE)
                    conditions.extend(matches)
        
        # Normalize and deduplicate
        conditions = list(set([c.strip().lower() for c in conditions]))
        
        logger.info(f"Identified claimed conditions: {conditions}")
        return conditions
    
    async def _extract_evidence(
        self, 
        document: Dict, 
        claimed_conditions: List[str]
    ) -> List[Evidence]:
        """Extract evidence from a single document"""
        evidence_items = []
        doc_text = document["text"]
        doc_id = document["id"]
        
        # Split into paragraphs for analysis
        paragraphs = doc_text.split("\n\n")
        
        for page_num, paragraph in enumerate(paragraphs):
            if len(paragraph.strip()) < 20:
                continue
            
            # Check relevance to claimed conditions
            relevance, condition = await self._check_relevance(paragraph, claimed_conditions)
            
            if relevance != EvidenceRelevance.NEUTRAL:
                # Extract structured information
                nlp_doc = self.nlp(paragraph)
                
                # Extract dates
                dates = self._extract_dates(nlp_doc)
                
                # Extract medical providers
                providers = self._extract_providers(nlp_doc)
                
                # Extract diagnosis codes
                icd_codes = self._extract_icd_codes(paragraph)
                
                # Calculate confidence
                confidence = await self._calculate_evidence_confidence(
                    paragraph, condition, relevance
                )
                
                # Identify key phrases to highlight
                highlights = self._identify_highlights(paragraph, condition)
                
                evidence_items.append(Evidence(
                    document_id=doc_id,
                    page_number=page_num,
                    text=paragraph[:500],  # Truncate for storage
                    type=self._determine_evidence_type(document),
                    relevance=relevance,
                    confidence=confidence,
                    condition=condition,
                    date=dates[0] if dates else None,
                    provider=providers[0] if providers else None,
                    diagnosis_codes=icd_codes,
                    highlights=highlights
                ))
        
        return evidence_items
    
    async def _check_relevance(
        self, 
        text: str, 
        claimed_conditions: List[str]
    ) -> Tuple[EvidenceRelevance, Optional[str]]:
        """Check if text is relevant to claimed conditions"""
        
        # Embed text and conditions
        text_embedding = self.embedder.encode(text)
        
        best_match = None
        best_score = 0
        
        for condition in claimed_conditions:
            condition_embedding = self.embedder.encode(condition)
            similarity = cosine_similarity(
                [text_embedding], 
                [condition_embedding]
            )[0][0]
            
            if similarity > best_score:
                best_score = similarity
                best_match = condition
        
        # Determine relevance level
        if best_score > 0.7:
            # Check for contradictory language
            if any(word in text.lower() for word in ["denied", "no evidence", "not related", "unrelated"]):
                return EvidenceRelevance.CONTRADICTORY, best_match
            return EvidenceRelevance.DIRECT, best_match
        elif best_score > 0.4:
            return EvidenceRelevance.SUPPORTING, best_match
        else:
            return EvidenceRelevance.NEUTRAL, None
    
    def _extract_dates(self, doc) -> List[date]:
        """Extract dates from text"""
        dates = []
        for ent in doc.ents:
            if ent.label_ == "DATE":
                try:
                    # Parse various date formats
                    from dateutil import parser
                    parsed_date = parser.parse(ent.text, fuzzy=True)
                    dates.append(parsed_date.date())
                except:
                    pass
        return sorted(dates) if dates else []
    
    def _extract_providers(self, doc) -> List[str]:
        """Extract medical provider names"""
        providers = []
        for ent in doc.ents:
            if ent.label_ in ["PERSON", "ORG"]:
                # Check if likely medical provider
                if any(title in ent.text.lower() for title in ["dr", "md", "clinic", "hospital", "medical"]):
                    providers.append(ent.text)
        return providers
    
    def _extract_icd_codes(self, text: str) -> List[str]:
        """Extract ICD-10 diagnosis codes"""
        # Pattern for ICD-10 codes
        pattern = r'[A-Z]\d{2}(?:\.\d{1,2})?'
        codes = re.findall(pattern, text)
        return codes
    
    async def _calculate_evidence_confidence(
        self, 
        text: str, 
        condition: str, 
        relevance: EvidenceRelevance
    ) -> float:
        """Calculate confidence score for evidence"""
        base_score = {
            EvidenceRelevance.DIRECT: 0.8,
            EvidenceRelevance.SUPPORTING: 0.5,
            EvidenceRelevance.CONTRADICTORY: 0.7,
            EvidenceRelevance.NEUTRAL: 0.1
        }[relevance]
        
        # Adjust based on evidence quality indicators
        if "diagnosed" in text.lower() or "diagnosis" in text.lower():
            base_score += 0.1
        if "nexus" in text.lower() or "due to" in text.lower() or "caused by" in text.lower():
            base_score += 0.15
        if any(phrase in text.lower() for phrase in ["more likely than not", "at least as likely"]):
            base_score += 0.15
        
        return min(base_score, 1.0)
    
    def _identify_highlights(self, text: str, condition: str) -> List[Tuple[int, int]]:
        """Identify text segments to highlight"""
        highlights = []
        
        # Find condition mentions
        for match in re.finditer(re.escape(condition), text, re.IGNORECASE):
            highlights.append((match.start(), match.end()))
        
        # Find key phrases
        key_phrases = [
            "diagnosed with", "nexus", "caused by", "due to", 
            "secondary to", "aggravated by", "more likely than not"
        ]
        
        for phrase in key_phrases:
            for match in re.finditer(phrase, text, re.IGNORECASE):
                highlights.append((match.start(), match.end()))
        
        return highlights
    
    def _determine_evidence_type(self, document: Dict) -> EvidenceType:
        """Determine type of evidence document"""
        doc_type = document.get("type", "").lower()
        
        if "dd-214" in doc_type:
            return EvidenceType.SERVICE_RECORD
        elif "treatment" in doc_type or "medical" in doc_type:
            return EvidenceType.MEDICAL_RECORD
        elif "buddy" in doc_type or "statement" in doc_type:
            return EvidenceType.LAY_STATEMENT
        elif "nexus" in doc_type:
            return EvidenceType.NEXUS_LETTER
        elif "dbq" in doc_type or "exam" in doc_type:
            return EvidenceType.CP_EXAM
        else:
            return EvidenceType.OTHER
    
    async def _group_evidence_by_condition(
        self, 
        all_evidence: List[Evidence], 
        claimed_conditions: List[str]
    ) -> List[MedicalCondition]:
        """Group evidence by medical condition"""
        conditions = []
        
        for condition_name in claimed_conditions:
            # Filter evidence for this condition
            condition_evidence = [e for e in all_evidence if e.condition == condition_name]
            
            if not condition_evidence:
                continue
            
            # Find in-service event
            in_service = next(
                (e.text for e in condition_evidence 
                 if e.type == EvidenceType.SERVICE_RECORD),
                None
            )
            
            # Find nexus statement
            nexus = next(
                (e.text for e in condition_evidence 
                 if "nexus" in e.text.lower() or "caused by" in e.text.lower()),
                None
            )
            
            # Find continuity evidence
            continuity = [e for e in condition_evidence 
                         if e.date and e.type == EvidenceType.MEDICAL_RECORD]
            
            # Get ICD codes
            icd_codes = []
            for e in condition_evidence:
                if e.diagnosis_codes:
                    icd_codes.extend(e.diagnosis_codes)
            icd_codes = list(set(icd_codes))
            
            conditions.append(MedicalCondition(
                name=condition_name,
                icd10_codes=icd_codes,
                evidence_items=condition_evidence,
                in_service_event=in_service,
                nexus_statement=nexus,
                continuity_evidence=continuity
            ))
        
        return conditions
    
    async def _build_timeline(self, evidence: List[Evidence]) -> List[Dict]:
        """Build chronological timeline of evidence"""
        timeline = []
        
        # Filter evidence with dates
        dated_evidence = [e for e in evidence if e.date]
        dated_evidence.sort(key=lambda x: x.date)
        
        for e in dated_evidence:
            timeline.append({
                "date": e.date.isoformat(),
                "event": e.text[:200],
                "type": e.type.value,
                "condition": e.condition,
                "source": e.document_id
            })
        
        return timeline
    
    async def _calculate_evidence_strength(
        self, 
        conditions: List[MedicalCondition]
    ) -> float:
        """Calculate overall evidence strength"""
        if not conditions:
            return 0.0
        
        strengths = []
        
        for condition in conditions:
            strength = 0.0
            
            # Check for key elements
            if condition.in_service_event:
                strength += 0.25
            if condition.nexus_statement:
                strength += 0.35
            if condition.continuity_evidence:
                strength += 0.2
            if condition.icd10_codes:
                strength += 0.1
            
            # Adjust based on evidence quality
            avg_confidence = np.mean([e.confidence for e in condition.evidence_items])
            strength *= avg_confidence
            
            strengths.append(strength)
        
        return np.mean(strengths)
    
    async def _identify_missing_evidence(
        self, 
        conditions: List[MedicalCondition], 
        claimed_conditions: List[str]
    ) -> List[str]:
        """Identify missing evidence for claims"""
        missing = []
        
        # Check each claimed condition
        for claimed in claimed_conditions:
            condition = next((c for c in conditions if c.name == claimed), None)
            
            if not condition:
                missing.append(f"No evidence found for {claimed}")
                continue
            
            # Check for required elements
            if not condition.in_service_event:
                missing.append(f"Missing in-service event documentation for {claimed}")
            
            if not condition.nexus_statement:
                missing.append(f"Missing nexus letter connecting {claimed} to service")
            
            if not condition.continuity_evidence or len(condition.continuity_evidence) < 2:
                missing.append(f"Insufficient continuity of care evidence for {claimed}")
            
            if not condition.icd10_codes:
                missing.append(f"Missing formal diagnosis with ICD codes for {claimed}")
        
        return missing
    
    async def _generate_recommendations(
        self, 
        conditions: List[MedicalCondition], 
        missing_evidence: List[str]
    ) -> List[str]:
        """Generate recommendations for claim improvement"""
        recommendations = []
        
        # Based on missing evidence
        for missing in missing_evidence:
            if "nexus" in missing.lower():
                recommendations.append("Obtain medical opinion letter from treating physician")
            elif "in-service" in missing.lower():
                recommendations.append("Request service treatment records from National Archives")
            elif "continuity" in missing.lower():
                recommendations.append("Gather additional treatment records showing ongoing symptoms")
            elif "diagnosis" in missing.lower():
                recommendations.append("Schedule appointment for formal diagnosis and ICD coding")
        
        # Based on evidence strength
        for condition in conditions:
            if condition.evidence_items:
                avg_confidence = np.mean([e.confidence for e in condition.evidence_items])
                if avg_confidence < 0.5:
                    recommendations.append(f"Strengthen evidence for {condition.name} with additional documentation")
        
        # Check for secondary conditions
        for condition in conditions:
            secondaries = self.knowledge_base.get_secondary_conditions(condition.name)
            if secondaries:
                recommendations.append(f"Consider claiming secondary conditions to {condition.name}: {', '.join(secondaries)}")
        
        return recommendations
    
    async def _determine_dbqs(self, conditions: List[MedicalCondition]) -> List[str]:
        """Determine which DBQs are needed"""
        dbqs = []
        
        for condition in conditions:
            # Map conditions to appropriate DBQs
            dbq = self.knowledge_base.get_dbq_for_condition(condition.name)
            if dbq and dbq not in dbqs:
                dbqs.append(dbq)
        
        return dbqs
    
    async def _check_presumptive_conditions(
        self, 
        documents: List[Dict], 
        conditions: List[MedicalCondition]
    ) -> List[str]:
        """Check for presumptive conditions based on service history"""
        presumptive = []
        
        # Extract service information
        service_info = await self._extract_service_info(documents)
        
        # Check Agent Orange presumptives
        if service_info.get("vietnam_service"):
            ao_conditions = self.knowledge_base.get_agent_orange_conditions()
            for condition in conditions:
                if condition.name in ao_conditions:
                    presumptive.append(f"{condition.name} (Agent Orange presumptive)")
        
        # Check Gulf War presumptives
        if service_info.get("gulf_war_service"):
            gw_conditions = self.knowledge_base.get_gulf_war_conditions()
            for condition in conditions:
                if condition.name in gw_conditions:
                    presumptive.append(f"{condition.name} (Gulf War presumptive)")
        
        # Check PACT Act presumptives
        if service_info.get("burn_pit_exposure"):
            pact_conditions = self.knowledge_base.get_pact_act_conditions()
            for condition in conditions:
                if condition.name in pact_conditions:
                    presumptive.append(f"{condition.name} (PACT Act presumptive)")
        
        return presumptive
    
    async def _extract_service_info(self, documents: List[Dict]) -> Dict:
        """Extract military service information"""
        info = {}
        
        for doc in documents:
            if "dd-214" in doc.get("type", "").lower():
                text = doc["text"].lower()
                
                # Check for Vietnam service
                if any(term in text for term in ["vietnam", "republic of vietnam", "rvn"]):
                    info["vietnam_service"] = True
                
                # Check for Gulf War service
                if any(term in text for term in ["desert storm", "desert shield", "iraq", "kuwait"]):
                    info["gulf_war_service"] = True
                
                # Check for burn pit exposure locations
                burn_pit_locations = ["iraq", "afghanistan", "djibouti", "syria", "jordan"]
                if any(loc in text for loc in burn_pit_locations):
                    info["burn_pit_exposure"] = True
        
        return info
    
    async def _determine_claim_type(self, conditions: List[str]) -> ClaimType:
        """Determine the type of claim"""
        condition_text = " ".join(conditions).lower()
        
        if "increase" in condition_text:
            return ClaimType.INCREASE
        elif "secondary" in condition_text:
            return ClaimType.SECONDARY
        elif any(term in condition_text for term in ["ptsd", "mst", "trauma"]):
            return ClaimType.PTSD
        else:
            return ClaimType.INITIAL
    
    async def _calculate_confidence(
        self, 
        conditions: List[MedicalCondition], 
        evidence_strength: float
    ) -> float:
        """Calculate overall confidence in claim success"""
        if not conditions:
            return 0.0
        
        # Base confidence on evidence strength
        confidence = evidence_strength
        
        # Adjust based on completeness
        for condition in conditions:
            if condition.nexus_statement:
                confidence += 0.1
            if condition.in_service_event:
                confidence += 0.1
            if len(condition.continuity_evidence) >= 3:
                confidence += 0.1
        
        # Cap at 0.95 (never 100% certain)
        return min(confidence, 0.95)
    
    async def generate_annotations(self, analysis: ClaimAnalysis) -> Dict:
        """Generate smart annotations for documents"""
        annotations = {
            "tabs": [],
            "bookmarks": [],
            "highlights": [],
            "summary": ""
        }
        
        # Create tabs for each condition
        for condition in analysis.conditions:
            annotations["tabs"].append({
                "name": condition.name,
                "pages": [e.page_number for e in condition.evidence_items],
                "color": self._get_condition_color(condition.name)
            })
        
        # Create bookmarks for key evidence
        for condition in analysis.conditions:
            for evidence in condition.evidence_items:
                if evidence.relevance == EvidenceRelevance.DIRECT:
                    annotations["bookmarks"].append({
                        "page": evidence.page_number,
                        "title": f"{condition.name} - {evidence.type.value}",
                        "note": evidence.text[:100]
                    })
        
        # Compile highlights
        for condition in analysis.conditions:
            for evidence in condition.evidence_items:
                if evidence.highlights:
                    for start, end in evidence.highlights:
                        annotations["highlights"].append({
                            "page": evidence.page_number,
                            "start": start,
                            "end": end,
                            "color": "yellow" if evidence.relevance == EvidenceRelevance.DIRECT else "blue",
                            "note": condition.name
                        })
        
        # Generate summary
        annotations["summary"] = await self._generate_summary(analysis)
        
        return annotations
    
    def _get_condition_color(self, condition: str) -> str:
        """Get consistent color for condition tabs"""
        colors = ["red", "blue", "green", "orange", "purple", "cyan", "magenta", "brown"]
        return colors[hash(condition) % len(colors)]
    
    async def _generate_summary(self, analysis: ClaimAnalysis) -> str:
        """Generate executive summary of claim"""
        summary = f"Claim Analysis Summary\n"
        summary += f"="*50 + "\n"
        summary += f"Claim Type: {analysis.claim_type.value}\n"
        summary += f"Conditions Claimed: {len(analysis.conditions)}\n"
        summary += f"Evidence Strength: {analysis.evidence_strength:.1%}\n"
        summary += f"Confidence Score: {analysis.confidence_score:.1%}\n\n"
        
        summary += "Conditions:\n"
        for condition in analysis.conditions:
            summary += f"- {condition.name}: {len(condition.evidence_items)} evidence items\n"
        
        if analysis.missing_evidence:
            summary += "\nMissing Evidence:\n"
            for missing in analysis.missing_evidence[:5]:
                summary += f"- {missing}\n"
        
        if analysis.recommendations:
            summary += "\nTop Recommendations:\n"
            for rec in analysis.recommendations[:3]:
                summary += f"- {rec}\n"
        
        return summary
    
    async def generate_exam_request(self, analysis: ClaimAnalysis) -> Dict:
        """Generate examination request for contract clinicians"""
        exam_request = {
            "claim_id": analysis.claim_id,
            "exam_type": "Compensation & Pension",
            "conditions": [],
            "dbqs_required": analysis.dbq_needed,
            "special_instructions": [],
            "evidence_summary": {},
            "opinions_needed": []
        }
        
        # Add condition details
        for condition in analysis.conditions:
            condition_detail = {
                "name": condition.name,
                "icd10_codes": condition.icd10_codes,
                "evidence_count": len(condition.evidence_items),
                "has_nexus": bool(condition.nexus_statement),
                "has_in_service_event": bool(condition.in_service_event),
                "severity_estimate": condition.severity_rating
            }
            exam_request["conditions"].append(condition_detail)
            
            # Add evidence summary
            exam_request["evidence_summary"][condition.name] = {
                "strongest_evidence": condition.evidence_items[0].text if condition.evidence_items else None,
                "timeline": [e.date.isoformat() if e.date else "undated" 
                           for e in condition.continuity_evidence[:5]] if condition.continuity_evidence else []
            }
            
            # Determine needed opinions
            if not condition.nexus_statement:
                exam_request["opinions_needed"].append(
                    f"Medical opinion on whether {condition.name} is at least as likely as not related to military service"
                )
        
        # Add special instructions based on claim type
        if analysis.claim_type == ClaimType.PTSD:
            exam_request["special_instructions"].append(
                "Please assess PTSD symptoms using DSM-5 criteria and complete PTSD DBQ"
            )
            exam_request["special_instructions"].append(
                "Document any reported stressors and assess credibility"
            )
        
        # Add instructions for missing evidence
        for missing in analysis.missing_evidence:
            if "nexus" in missing.lower():
                exam_request["special_instructions"].append(
                    "Please provide nexus opinion based on review of evidence and examination"
                )
            elif "diagnosis" in missing.lower():
                exam_request["special_instructions"].append(
                    "Please provide current diagnosis with appropriate ICD-10 coding"
                )
        
        return exam_request
    
    def health_check(self) -> Dict:
        """Check health of AI engine"""
        return {
            "status": "operational",
            "models_loaded": bool(self.nlp and self.classifier and self.embedder),
            "device": str(self.device),
            "knowledge_base": "loaded"
        }
    
    async def cleanup(self):
        """Cleanup resources"""
        logger.info("Cleaning up AI engine resources")
        # Clear models from memory if needed
        pass