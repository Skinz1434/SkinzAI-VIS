'use client';

import { useRouter } from 'next/navigation';
import { Shield, Brain, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <Shield className="w-16 h-16 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
            Skinz' Better VIS
          </h1>
          <p className="text-xl text-gray-400">VA Service Verification & Claims Analysis Suite</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dashboard Card */}
          <div 
            onClick={() => router.push('/dashboard-full')}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">VIS Dashboard</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Complete veteran service verification suite with profile management, claims tracking, and VA integration.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                Veteran profile management
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                Claims tracking & analysis
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                VA profile synchronization
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                Comprehensive reporting
              </li>
            </ul>
            <div className="flex items-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <span className="font-semibold">Open Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* VA Claims AI Card */}
          <div 
            onClick={() => router.push('/va-claims-ai')}
            className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-bl-lg">
              NEW
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">VA Claims AI</h2>
            </div>
            <p className="text-gray-400 mb-6">
              AI-powered document review system for VA disability claims with automated evidence analysis and annotation.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Intelligent document processing & OCR
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                AI evidence analysis & scoring
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Automated annotations & tabbing
              </li>
              <li className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                C&P exam request generation
              </li>
            </ul>
            <div className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
              <span className="font-semibold">Launch AI Review</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="mt-12 p-6 bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-cyan-400">95%</p>
              <p className="text-sm text-gray-500">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">30s</p>
              <p className="text-sm text-gray-500">Avg Processing</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">100+</p>
              <p className="text-sm text-gray-500">Concurrent Claims</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">24/7</p>
              <p className="text-sm text-gray-500">Availability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}