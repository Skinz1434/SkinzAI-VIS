'use client';

import { useState, useEffect } from 'react';
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

export default function DashboardStaticPage() {
  const [accuracy, setAccuracy] = useState(97.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setAccuracy(96.5 + Math.random() * 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">VIS Service Verifier Dashboard</h1>
            <p className="text-gray-400 mt-1">Veteran Information System Management Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Refresh
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 inline mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Primary Accuracy Metric */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Vadir API Accuracy</h2>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-blue-400">{accuracy.toFixed(1)}%</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Above Threshold
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Real-time synchronization accuracy with Vadir API
              </p>
            </div>
            <div className="w-32 h-32 relative">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(59, 130, 246, 0.2)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - accuracy / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{accuracy.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Veterans"
            value="12,847"
            change={2.4}
            icon={<Users className="w-5 h-5" />}
            trend="up"
          />
          <MetricCard
            title="Active Claims"
            value="3,421"
            change={-1.2}
            icon={<FileText className="w-5 h-5" />}
            trend="down"
          />
          <MetricCard
            title="Avg Processing Time"
            value="4.2 days"
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
        </div>

        {/* System Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-3">
            <ServiceStatus name="Vadir API" status="up" responseTime={142} />
            <ServiceStatus name="Profile Service" status="up" responseTime={98} />
            <ServiceStatus name="Database" status="up" responseTime={12} />
          </div>
        </div>

        {/* Critical Metrics Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-blue-100 text-sm">Vadir Sync Success</p>
                  <p className="text-2xl font-bold">97.3%</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">DD-214 Fallback Rate</p>
                  <p className="text-2xl font-bold">2.7%</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">API Response Time</p>
                  <p className="text-2xl font-bold">142ms</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <AlertCircle className="w-8 h-8 mb-2" />
              <span className="text-sm">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon, trend }: any) {
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${trendColor}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div className="p-2 bg-gray-700 rounded-lg text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ServiceStatus({ name, status, responseTime }: any) {
  const statusColor = status === 'up' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <span className="text-white">{name}</span>
      </div>
      <span className="text-gray-400 text-sm">{responseTime}ms</span>
    </div>
  );
}