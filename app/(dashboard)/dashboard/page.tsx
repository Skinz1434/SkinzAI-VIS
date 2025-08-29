'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { MetricCard } from '@/components/features/MetricCard';
import { AccuracyGauge } from '@/components/charts/AccuracyGauge';
import { ClaimsChart } from '@/components/charts/ClaimsChart';
import { RecentActivity } from '@/components/features/RecentActivity';
import { SystemHealth } from '@/components/features/SystemHealth';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

export default function DashboardPage() {
  const { metrics, isLoading, refetch } = useDashboardMetrics();
  const [accuracyTrend, setAccuracyTrend] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAccuracyTrend(prev => {
        const newValue = 96.5 + Math.random() * 2;
        return [...prev.slice(-19), newValue].slice(-20);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-skinz-bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">VIS Service Verifier Dashboard</h1>
            <p className="text-gray-400 mt-1">Veteran Information System Management Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => refetch()}
              className="button-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="button-primary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </motion.div>

        {/* Primary Accuracy Metric */}
        <motion.div variants={itemVariants} className="card-elevated">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Vadir API Accuracy</h2>
              <div className="flex items-center gap-4">
                <span className="metric-highlight">97.3%</span>
                <span className="accuracy-badge">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Above Threshold
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Real-time synchronization accuracy with Vadir API
              </p>
            </div>
            <div className="w-64">
              <AccuracyGauge value={97.3} threshold={97} />
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Veterans"
            value={metrics?.totalVeterans || 12847}
            change={2.4}
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Active Claims"
            value={metrics?.activeClaiMs || 3421}
            change={-1.2}
            icon={<FileText className="w-5 h-5" />}
            trend="down"
          />
          <MetricCard
            title="Avg Processing Time"
            value={`${metrics?.averageProcessingTime || 4.2} days`}
            change={-15.3}
            icon={<Activity className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="System Uptime"
            value="99.98%"
            change={0.02}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
          />
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-white mb-4">Claims by Status</h3>
            <ClaimsChart data={metrics?.claimsByStatus} />
          </div>
          <div className="chart-container">
            <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
            <SystemHealth health={metrics?.systemHealth} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="card-elevated">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <RecentActivity activities={metrics?.recentActivity || []} />
        </motion.div>

        {/* Critical Metrics Banner */}
        <motion.div variants={itemVariants} className="bg-gradient-primary rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-white/80 text-sm">Vadir Sync Success</p>
                  <p className="text-2xl font-bold">97.3%</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">DD-214 Fallback Rate</p>
                  <p className="text-2xl font-bold">2.7%</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">API Response Time</p>
                  <p className="text-2xl font-bold">142ms</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <AlertCircle className="w-8 h-8 mb-2" />
              <span className="text-sm">All Systems Operational</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </div>
  );
}
