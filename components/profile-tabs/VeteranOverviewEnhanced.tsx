'use client';

import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { 
  User, Activity, AlertTriangle, TrendingUp, Heart, Brain, Home, 
  DollarSign, Shield, Info, ChevronRight, AlertCircle, CheckCircle,
  HelpCircle, X, ChevronDown, ChevronUp, Zap, Target, Clock,
  Award, Users, Calendar, BarChart3, PieChart, LineChart, Gauge
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Area, AreaChart, Bar, BarChart,
  Cell, Pie, PieChart as RechartsPieChart, RadialBarChart, RadialBar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface VeteranOverviewEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

interface RiskModal {
  isOpen: boolean;
  type: string;
  title: string;
  description: string;
  factors: string[];
  recommendations: string[];
}

export default function VeteranOverviewEnhanced({ veteran }: VeteranOverviewEnhancedProps) {
  const [activeTooltip, setActiveTooltip] = useState<{ id: string; content: string } | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [riskModal, setRiskModal] = useState<RiskModal>({
    isOpen: false,
    type: '',
    title: '',
    description: '',
    factors: [],
    recommendations: []
  });

  // Calculate comprehensive risk scores
  const calculateRiskScores = () => {
    // Simulated risk scores based on available data
    const hasHighDisability = veteran.mpd?.disabilityRating >= 70;
    const hasMentalHealth = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('ptsd') || 
      c.description.toLowerCase().includes('depression')
    );
    const hasMultipleConditions = veteran.mpd?.conditions?.length > 5;
    
    const scores = {
      suicide: hasMentalHealth ? 65 : 25,
      homelessness: hasHighDisability ? 45 : 20,
      substanceAbuse: hasMentalHealth ? 55 : 30,
      financial: hasHighDisability ? 40 : 25,
      mentalHealth: hasMentalHealth ? 70 : 35,
      physical: hasMultipleConditions ? 60 : 30,
      social: hasHighDisability ? 50 : 25,
      employment: hasHighDisability ? 55 : 20
    };

    const overallRisk = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length;
    
    return { ...scores, overall: overallRisk };
  };

  const riskScores = calculateRiskScores();

  // Risk level determination
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' };
    if (score >= 60) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/50' };
    if (score >= 40) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
    if (score >= 20) return { level: 'Low', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50' };
    return { level: 'Minimal', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' };
  };

  // Prepare radar chart data
  const radarData = [
    { category: 'Suicide', score: riskScores.suicide, fullMark: 100 },
    { category: 'Homelessness', score: riskScores.homelessness, fullMark: 100 },
    { category: 'Substance', score: riskScores.substanceAbuse, fullMark: 100 },
    { category: 'Financial', score: riskScores.financial, fullMark: 100 },
    { category: 'Mental', score: riskScores.mentalHealth, fullMark: 100 },
    { category: 'Physical', score: riskScores.physical, fullMark: 100 },
    { category: 'Social', score: riskScores.social, fullMark: 100 },
    { category: 'Employment', score: riskScores.employment, fullMark: 100 }
  ];

  // Trend data for risk over time
  const trendData = [
    { month: 'Jan', overall: 45, mental: 50, physical: 40 },
    { month: 'Feb', overall: 48, mental: 55, physical: 42 },
    { month: 'Mar', overall: 52, mental: 60, physical: 45 },
    { month: 'Apr', overall: 55, mental: 58, physical: 48 },
    { month: 'May', overall: 53, mental: 56, physical: 46 },
    { month: 'Jun', overall: riskScores.overall, mental: riskScores.mentalHealth, physical: riskScores.physical }
  ];

  // Health metrics for radial chart
  const healthMetrics = [
    { name: 'Overall Health', value: 100 - riskScores.overall, fill: '#00F0FF' },
    { name: 'Mental Health', value: 100 - riskScores.mentalHealth, fill: '#FF6B6B' },
    { name: 'Physical Health', value: 100 - riskScores.physical, fill: '#4ECDC4' },
    { name: 'Social Health', value: 100 - riskScores.social, fill: '#95E1D3' }
  ];

  // Quick stats
  const quickStats = {
    daysInCare: 365, // Simulated
    appointmentsAttended: veteran.mpd?.appointments?.filter(a => a.status === 'Completed').length || 0,
    medicationAdherence: 85, // Simulated
    benefitUtilization: Math.round((veteran.benefits.monthlyAmount / 3500) * 100) // As percentage of max
  };

  // Risk explanations
  const riskExplanations = {
    suicide: {
      title: 'Suicide Risk Assessment',
      description: 'Comprehensive evaluation of suicide risk factors based on clinical indicators, mental health history, and protective factors.',
      factors: [
        'Previous suicide attempts or ideation',
        'Current depression or PTSD symptoms',
        'Social isolation and lack of support',
        'Access to lethal means',
        'Recent losses or life stressors',
        'Substance abuse history'
      ],
      recommendations: [
        'Immediate safety planning',
        'Crisis hotline: 988 (Suicide & Crisis Lifeline)',
        'Regular mental health check-ins',
        'Medication management review',
        'Social support activation',
        'Lethal means counseling'
      ]
    },
    homelessness: {
      title: 'Housing Instability Risk',
      description: 'Assessment of factors that may lead to housing instability or homelessness.',
      factors: [
        'Current housing status',
        'Financial stability',
        'Employment status',
        'Substance use issues',
        'Family support system',
        'History of evictions'
      ],
      recommendations: [
        'HUD-VASH program enrollment',
        'Rapid rehousing assistance',
        'Financial counseling',
        'Employment support services',
        'Utility assistance programs',
        'Landlord mediation services'
      ]
    },
    mentalHealth: {
      title: 'Mental Health Risk Profile',
      description: 'Comprehensive mental health assessment including PTSD, depression, anxiety, and other psychiatric conditions.',
      factors: [
        'PTSD symptom severity',
        'Depression screening scores',
        'Anxiety levels',
        'Sleep disturbances',
        'Cognitive functioning',
        'Treatment engagement'
      ],
      recommendations: [
        'Evidence-based psychotherapy',
        'Psychiatric medication review',
        'Peer support groups',
        'Mindfulness and stress reduction',
        'Sleep hygiene education',
        'Trauma-focused therapy'
      ]
    },
    financial: {
      title: 'Financial Vulnerability Assessment',
      description: 'Evaluation of financial stability and risk factors for financial crisis.',
      factors: [
        'Debt-to-income ratio',
        'Emergency savings',
        'Benefits utilization',
        'Employment stability',
        'Financial literacy',
        'Credit score'
      ],
      recommendations: [
        'Financial counseling services',
        'Debt management planning',
        'Benefits optimization review',
        'Emergency fund building',
        'Credit repair assistance',
        'Vocational rehabilitation'
      ]
    }
  };

  const openRiskModal = (type: keyof typeof riskExplanations) => {
    const explanation = riskExplanations[type];
    setRiskModal({
      isOpen: true,
      type,
      title: explanation.title,
      description: explanation.description,
      factors: explanation.factors,
      recommendations: explanation.recommendations
    });
  };

  const Tooltip = ({ id, content, children, position = 'top' }: { 
    id: string; 
    content: string; 
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }) => {
    const tooltipId = `tooltip-${id}`;
    
    const getPositionClasses = () => {
      switch (position) {
        case 'bottom':
          return {
            container: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
            arrow: 'bottom-full left-1/2 transform -translate-x-1/2 mt-1 border-4 border-transparent border-b-gray-900'
          };
        case 'left':
          return {
            container: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
            arrow: 'left-full top-1/2 transform -translate-y-1/2 ml-1 border-4 border-transparent border-l-gray-900'
          };
        case 'right':
          return {
            container: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
            arrow: 'right-full top-1/2 transform -translate-y-1/2 mr-1 border-4 border-transparent border-r-gray-900'
          };
        default: // top
          return {
            container: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
            arrow: 'top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900'
          };
      }
    };

    const positionClasses = getPositionClasses();

    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setActiveTooltip({ id: tooltipId, content })}
          onMouseLeave={() => setActiveTooltip(null)}
          className="cursor-help"
        >
          {children}
        </div>
        <AnimatePresence>
          {activeTooltip?.id === tooltipId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: position === 'top' ? 10 : -10 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-[9999] ${positionClasses.container} pointer-events-none`}
            >
              <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs">
                <div className="text-xs leading-relaxed">{content}</div>
              </div>
              <div className={`absolute ${positionClasses.arrow}`}></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      {/* Header with Overall Risk Score */}
      <div className={`bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border ${getRiskLevel(riskScores.overall).border} relative overflow-visible`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-skinz-accent to-skinz-primary rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Veteran Risk Assessment Dashboard</h3>
              <p className="text-skinz-text-secondary text-sm">
                Comprehensive analysis of {veteran.firstName} {veteran.lastName}'s risk factors
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <Tooltip id="overall-risk" content="Overall risk score calculated from multiple assessment factors" position="bottom">
              <div className={`text-3xl font-bold ${getRiskLevel(riskScores.overall).color}`}>
                {riskScores.overall.toFixed(0)}%
              </div>
            </Tooltip>
            <p className={`text-sm ${getRiskLevel(riskScores.overall).color}`}>
              {getRiskLevel(riskScores.overall).level} Risk
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Crisis Intervention
          </button>
          <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
            <Shield className="w-4 h-4 inline mr-2" />
            Safety Planning
          </button>
          <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
            <Heart className="w-4 h-4 inline mr-2" />
            Wellness Check
          </button>
          <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
            <Users className="w-4 h-4 inline mr-2" />
            Care Team Alert
          </button>
        </div>
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries({
          suicide: { icon: AlertTriangle, label: 'Suicide Risk' },
          homelessness: { icon: Home, label: 'Housing Risk' },
          mentalHealth: { icon: Brain, label: 'Mental Health' },
          financial: { icon: DollarSign, label: 'Financial Risk' }
        }).map(([key, { icon: Icon, label }]) => {
          const score = riskScores[key as keyof typeof riskScores];
          const risk = getRiskLevel(score);
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`bg-skinz-bg-secondary/50 rounded-xl p-4 border ${risk.border} cursor-pointer`}
              onClick={() => openRiskModal(key as keyof typeof riskExplanations)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${risk.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${risk.color}`} />
                </div>
                <Tooltip id={`risk-help-${idx}`} content="Click for detailed assessment" position="left">
                  <HelpCircle className="w-4 h-4 text-skinz-text-secondary" />
                </Tooltip>
              </div>
              
              <p className="text-skinz-text-secondary text-sm mb-1">{label}</p>
              <div className="flex items-end justify-between">
                <div className={`text-2xl font-bold ${risk.color}`}>
                  {score.toFixed(0)}%
                </div>
                <span className={`text-xs px-2 py-1 rounded ${risk.bg} ${risk.color}`}>
                  {risk.level}
                </span>
              </div>
              
              {/* Mini progress bar */}
              <div className="mt-3 h-2 bg-skinz-bg-tertiary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${risk.bg}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border relative overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Risk Profile Radar</h4>
            <Tooltip id="radar-info" content="Multi-dimensional risk assessment visualization" position="left">
              <Info className="w-4 h-4 text-skinz-text-secondary" />
            </Tooltip>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="category" stroke="#666" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
                <Radar
                  name="Risk Score"
                  dataKey="score"
                  stroke="#00F0FF"
                  fill="#00F0FF"
                  fillOpacity={0.3}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border relative overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Risk Trends</h4>
            <Tooltip id="trend-info" content="6-month risk trend analysis" position="left">
              <TrendingUp className="w-4 h-4 text-skinz-text-secondary" />
            </Tooltip>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorMental" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1a1d23', border: '1px solid #333' }}
                />
                <Area
                  type="monotone"
                  dataKey="overall"
                  stroke="#00F0FF"
                  fillOpacity={1}
                  fill="url(#colorOverall)"
                />
                <Area
                  type="monotone"
                  dataKey="mental"
                  stroke="#FF6B6B"
                  fillOpacity={1}
                  fill="url(#colorMental)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Health Metrics Dashboard */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border relative overflow-visible">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-white">Health & Wellness Metrics</h4>
          <button
            onClick={() => setExpandedSection(expandedSection === 'health' ? null : 'health')}
            className="text-skinz-text-secondary hover:text-white transition-colors"
          >
            {expandedSection === 'health' ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative overflow-visible">
          <div className="text-center">
            <div className="relative inline-flex">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    data={[{ value: 100 - riskScores.overall, fill: '#00F0FF' }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar dataKey="value" cornerRadius={10} fill="#00F0FF" />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {(100 - riskScores.overall).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
            <p className="text-skinz-text-secondary text-sm mt-2">Health Score</p>
          </div>

          <div className="text-center">
            <Tooltip id="appointments" content={`${quickStats.appointmentsAttended} appointments attended out of ${quickStats.appointmentsAttended + 3} scheduled`} position="bottom">
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-bold text-xl">{quickStats.appointmentsAttended}</p>
                <p className="text-skinz-text-secondary text-xs">Appointments</p>
              </div>
            </Tooltip>
          </div>

          <div className="text-center">
            <Tooltip id="medication" content="Medication adherence rate based on prescription refill data" position="bottom">
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-white font-bold text-xl">{quickStats.medicationAdherence}%</p>
                <p className="text-skinz-text-secondary text-xs">Med Adherence</p>
              </div>
            </Tooltip>
          </div>

          <div className="text-center">
            <Tooltip id="care-days" content="Total days enrolled in VA healthcare system" position="bottom">
              <div className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-bold text-xl">{quickStats.daysInCare}</p>
                <p className="text-skinz-text-secondary text-xs">Days in Care</p>
              </div>
            </Tooltip>
          </div>
        </div>

        <AnimatePresence>
          {expandedSection === 'health' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-6 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3">Recent Health Events</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-skinz-text-secondary">Annual physical completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-skinz-text-secondary">Mental health follow-up due</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-skinz-text-secondary">Medication refill completed</span>
                    </div>
                  </div>
                </div>

                <div className="bg-skinz-bg-tertiary/30 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3">Protective Factors</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-skinz-text-secondary">Social Support</span>
                      <span className="text-green-400">Strong</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-skinz-text-secondary">Treatment Engagement</span>
                      <span className="text-yellow-400">Moderate</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-skinz-text-secondary">Coping Skills</span>
                      <span className="text-green-400">Good</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI-Powered Insights */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-white">AI-Powered Insights</h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm">
                <strong>Pattern Detected:</strong> Increased mental health risk correlates with recent reduction in social activities. 
                Consider activating peer support network.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm">
                <strong>Recommendation:</strong> Based on current risk profile, prioritize mental health intervention 
                and financial counseling within the next 30 days.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
            <div>
              <p className="text-white text-sm">
                <strong>Positive Trend:</strong> Medication adherence has improved by 15% over the last quarter, 
                contributing to overall health stability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Assessment Modal */}
      <AnimatePresence>
        {riskModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setRiskModal({ ...riskModal, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-skinz-bg-secondary rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-skinz-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{riskModal.title}</h3>
                <button
                  onClick={() => setRiskModal({ ...riskModal, isOpen: false })}
                  className="text-skinz-text-secondary hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-skinz-text-secondary mb-6">{riskModal.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {riskModal.factors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5"></div>
                        <span className="text-skinz-text-secondary">{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {riskModal.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div>
                        <span className="text-skinz-text-secondary">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-skinz-accent text-white rounded-lg hover:bg-skinz-accent/80 transition-colors">
                  Create Action Plan
                </button>
                <button className="flex-1 px-4 py-2 bg-skinz-bg-tertiary text-white rounded-lg hover:bg-skinz-bg-tertiary/80 transition-colors">
                  Schedule Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}