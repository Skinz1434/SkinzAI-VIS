"""
VA Claims AI Document Review System
Main FastAPI Application
"""

from fastapi import FastAPI, File, UploadFile, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
from typing import List, Optional
import asyncio
from datetime import datetime
import os
from dotenv import load_dotenv

# Import custom modules
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.api import claims, documents, analysis, examinations, admin
from app.models.database import init_db
from app.services.ai_engine import AIEngine
from app.services.document_processor import DocumentProcessor

# Load environment variables
load_dotenv()

# Setup logging
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting VA Claims AI Review System...")
    
    # Initialize database
    await init_db()
    
    # Initialize AI models
    app.state.ai_engine = AIEngine()
    await app.state.ai_engine.initialize()
    
    # Initialize document processor
    app.state.doc_processor = DocumentProcessor()
    
    logger.info("✅ System initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("🔄 Shutting down system...")
    await app.state.ai_engine.cleanup()
    logger.info("👋 System shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="VA Claims AI Document Review System",
    description="AI-powered document review and evidence analysis for VA disability claims",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(claims.router, prefix="/api/v1/claims", tags=["Claims"])
app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["Analysis"])
app.include_router(examinations.router, prefix="/api/v1/examinations", tags=["Examinations"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/")
async def root():
    """Root endpoint with system status"""
    return {
        "service": "VA Claims AI Document Review System",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "claims": "/api/v1/claims",
            "documents": "/api/v1/documents",
            "analysis": "/api/v1/analysis",
            "examinations": "/api/v1/examinations",
            "admin": "/api/v1/admin",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check AI engine
        ai_status = app.state.ai_engine.health_check()
        
        # Check database
        # db_status = await check_database_health()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "components": {
                "ai_engine": ai_status,
                "document_processor": "operational",
                "database": "operational"
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.post("/api/v1/process-claim")
async def process_claim(
    background_tasks: BackgroundTasks,
    claim_number: str,
    files: List[UploadFile] = File(...),
    priority: str = "normal"
):
    """
    Process a complete VA disability claim
    """
    try:
        logger.info(f"Processing claim {claim_number} with {len(files)} documents")
        
        # Create claim record
        claim_id = await create_claim_record(claim_number, priority)
        
        # Queue background processing
        background_tasks.add_task(
            process_claim_async,
            claim_id,
            files,
            app.state.doc_processor,
            app.state.ai_engine
        )
        
        return {
            "claim_id": claim_id,
            "claim_number": claim_number,
            "status": "processing",
            "document_count": len(files),
            "message": "Claim queued for processing"
        }
        
    except Exception as e:
        logger.error(f"Error processing claim: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_claim_async(claim_id, files, doc_processor, ai_engine):
    """Background task to process claim"""
    try:
        # Process documents
        documents = []
        for file in files:
            doc = await doc_processor.process_document(file)
            documents.append(doc)
        
        # Analyze evidence
        analysis = await ai_engine.analyze_claim_evidence(claim_id, documents)
        
        # Generate annotations
        annotations = await ai_engine.generate_annotations(analysis)
        
        # Create examination request
        exam_request = await ai_engine.generate_exam_request(analysis)
        
        # Update claim status
        await update_claim_status(claim_id, "completed", {
            "analysis": analysis,
            "annotations": annotations,
            "exam_request": exam_request
        })
        
        logger.info(f"Successfully processed claim {claim_id}")
        
    except Exception as e:
        logger.error(f"Error in background processing: {e}")
        await update_claim_status(claim_id, "error", {"error": str(e)})

async def create_claim_record(claim_number: str, priority: str):
    """Create initial claim record in database"""
    # Implementation would go here
    import uuid
    return str(uuid.uuid4())

async def update_claim_status(claim_id: str, status: str, data: dict):
    """Update claim processing status"""
    # Implementation would go here
    pass

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )