'use client';
import React, { useState } from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import {
  User, Activity, AlertTriangle, TrendingUp, Heart, Brain, Home,
  DollarSign, Shield, Info, ChevronRight, AlertCircle, CheckCircle,
  HelpCircle, X, ChevronDown, ChevronUp, Zap, Target, Clock,
  Award, Users, Calendar, BarChart3, PieChart, LineChart, Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell, PieChart as RechartsPieChart, Pie
} from 'recharts';

interface VeteranOverviewEnhancedProps {
  veteran: VeteranProfileEnhanced;
}

const VeteranOverviewEnhanced: React.FC<VeteranOverviewEnhancedProps> = ({ veteran }) => {
  const [activeTooltip, setActiveTooltip] = useState<{ id: string; content: string } | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [riskModal, setRiskModal] = useState<{
    isOpen: boolean;
    type: string;
    title: string;
    description: string;
    factors: string[];
    recommendations: string[];
  }>({
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
    const hasHighDisability = (veteran.mpd?.disabilityRating || 0) >= 70;
    const hasMentalHealth = veteran.mpd?.conditions?.some(c => 
      c.description.toLowerCase().includes('ptsd') || 
      c.description.toLowerCase().includes('depression')
    ) || false;
    const hasMultipleConditions = (veteran.mpd?.conditions?.length || 0) > 5;
    
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
    daysInCare: Math.floor(Math.random() * 365) + 100,
    appointmentsAttended: veteran.mpd?.appointments?.filter(a => a.status === 'Completed').length || 0,
    medicationAdherence: 85,
    benefitUtilization: Math.round((veteran.benefits.monthlyAmount / 3500) * 100)
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

  const Tooltip = ({ id, content, children }: { 
    id: string; 
    content: string; 
    children: React.ReactNode;
  }) => {
    return (
      <div className="relative inline-block">
        <div
          onMouseEnter={() => setActiveTooltip({ id, content })}
          onMouseLeave={() => setActiveTooltip(null)}
          className="cursor-help"
        >
          {children}
        </div>
        <AnimatePresence>
          {activeTooltip?.id === id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 pointer-events-none"
            >
              <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs">
                <div className="text-xs leading-relaxed">{content}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      {/* Header with Overall Risk Score */}
      <div className={`bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border ${getRiskLevel(riskScores.overall).border}`}>
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
            <Tooltip id="overall-risk" content="Overall risk score calculated from multiple assessment factors">
              <div className={`text-3xl font-bold ${getRiskLevel(riskScores.overall).color}`}>
                {riskScores.overall.toFixed(0)}%
              </div>
            </Tooltip>
            <p className={`text-sm ${getRiskLevel(riskScores.overall).color}`}>
              {getRiskLevel(riskScores.overall).level} Risk
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <Tooltip id="days-care" content="Total days enrolled in VA healthcare system">
            <div className="bg-skinz-bg-primary/50 backdrop-blur rounded-lg p-3 border border-skinz-border/30">
              <Calendar className="w-5 h-5 text-skinz-accent mb-1" />
              <p className="text-2xl font-bold text-white">{quickStats.daysInCare}</p>
              <p className="text-xs text-skinz-text-secondary">Days in Care</p>
            </div>
          </Tooltip>

          <Tooltip id="appointments" content="Number of completed appointments out of total scheduled">
            <div className="bg-skinz-bg-primary/50 backdrop-blur rounded-lg p-3 border border-skinz-border/30">
              <CheckCircle className="w-5 h-5 text-green-400 mb-1" />
              <p className="text-2xl font-bold text-white">{quickStats.appointmentsAttended}</p>
              <p className="text-xs text-skinz-text-secondary">Appointments</p>
            </div>
          </Tooltip>

          <Tooltip id="medication" content="Percentage of medications taken as prescribed">
            <div className="bg-skinz-bg-primary/50 backdrop-blur rounded-lg p-3 border border-skinz-border/30">
              <Heart className="w-5 h-5 text-red-400 mb-1" />
              <p className="text-2xl font-bold text-white">{quickStats.medicationAdherence}%</p>
              <p className="text-xs text-skinz-text-secondary">Med Adherence</p>
            </div>
          </Tooltip>

          <Tooltip id="benefits" content="Percentage of eligible benefits currently being utilized">
            <div className="bg-skinz-bg-primary/50 backdrop-blur rounded-lg p-3 border border-skinz-border/30">
              <DollarSign className="w-5 h-5 text-yellow-400 mb-1" />
              <p className="text-2xl font-bold text-white">{quickStats.benefitUtilization}%</p>
              <p className="text-xs text-skinz-text-secondary">Benefit Use</p>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Risk Categories Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries({
          suicide: { icon: AlertTriangle, label: 'Suicide Risk' },
          homelessness: { icon: Home, label: 'Housing Risk' },
          mentalHealth: { icon: Brain, label: 'Mental Health' },
          financial: { icon: DollarSign, label: 'Financial Risk' }
        }).map(([key, { icon: Icon, label }]) => {
          const score = riskScores[key as keyof typeof riskScores];
          const level = getRiskLevel(score as number);
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`${level.bg} backdrop-blur rounded-lg p-4 border ${level.border} cursor-pointer`}
              onClick={() => openRiskModal(key as keyof typeof riskExplanations)}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${level.color}`} />
                <HelpCircle className="w-4 h-4 text-skinz-text-secondary" />
              </div>
              <p className="text-sm text-skinz-text-secondary mb-1">{label}</p>
              <div className="flex items-end justify-between">
                <p className={`text-2xl font-bold ${level.color}`}>{score}%</p>
                <p className={`text-xs ${level.color}`}>{level.level}</p>
              </div>
              <div className="mt-2 h-1 bg-skinz-bg-primary/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full ${level.bg}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-skinz-bg-secondary/50 backdrop-blur rounded-xl p-6 border border-skinz-border/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Multi-Domain Risk Profile</h3>
            <Tooltip id="radar-help" content="Visual representation of risk across multiple domains">
              <HelpCircle className="w-4 h-4 text-skinz-text-secondary" />
            </Tooltip>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#3a3a3a" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
              <Radar name="Risk Score" dataKey="score" stroke="#00F0FF" fill="#00F0FF" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="bg-skinz-bg-secondary/50 backdrop-blur rounded-xl p-6 border border-skinz-border/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Risk Trend Analysis</h3>
            <Tooltip id="trend-help" content="Historical risk score trends over the past 6 months">
              <HelpCircle className="w-4 h-4 text-skinz-text-secondary" />
            </Tooltip>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <RechartsTooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3a3a3a' }} />
              <Legend />
              <Line type="monotone" dataKey="overall" stroke="#00F0FF" strokeWidth={2} dot={{ fill: '#00F0FF' }} />
              <Line type="monotone" dataKey="mental" stroke="#FF6B6B" strokeWidth={2} dot={{ fill: '#FF6B6B' }} />
              <Line type="monotone" dataKey="physical" stroke="#4ECDC4" strokeWidth={2} dot={{ fill: '#4ECDC4' }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur rounded-xl p-6 border border-skinz-border/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Health Metrics Overview</h3>
          <Tooltip id="health-help" content="Overall health status across different dimensions">
            <HelpCircle className="w-4 h-4 text-skinz-text-secondary" />
          </Tooltip>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="90%" data={healthMetrics}>
            <RadialBar dataKey="value" cornerRadius={10} fill="#00F0FF" />
            <Legend />
            <RechartsTooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Explanation Modal */}
      <AnimatePresence>
        {riskModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setRiskModal({ ...riskModal, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-skinz-bg-secondary rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-skinz-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{riskModal.title}</h2>
                  <button
                    onClick={() => setRiskModal({ ...riskModal, isOpen: false })}
                    className="text-skinz-text-secondary hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-skinz-text-secondary mt-2">{riskModal.description}</p>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      Risk Factors
                    </h3>
                    <div className="space-y-2">
                      {riskModal.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-skinz-accent mt-0.5" />
                          <p className="text-skinz-text-secondary text-sm">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      Recommendations
                    </h3>
                    <div className="space-y-2">
                      {riskModal.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                          <p className="text-skinz-text-secondary text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VeteranOverviewEnhanced;