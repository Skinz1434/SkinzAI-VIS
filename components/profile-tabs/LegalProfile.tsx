'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { Scale, FileText, AlertTriangle, Shield, Gavel, Users } from 'lucide-react';

interface LegalProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function LegalProfile({ veteran }: LegalProfileProps) {
  const legalInfo = veteran.profileServices?.legalInfo;
  
  return (
    <div className="space-y-6">
      {/* Legal Status Overview */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Legal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Power of Attorney</p>
            <p className="text-white font-semibold">
              {legalInfo?.powerOfAttorney?.name || 'Not Designated'}
            </p>
            {legalInfo?.powerOfAttorney && (
              <p className="text-skinz-text-secondary text-sm mt-1">
                Type: {legalInfo.powerOfAttorney.type}
              </p>
            )}
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Will Status</p>
            <p className="text-white font-semibold">
              {legalInfo?.willStatus ? 'On File' : 'Not on File'}
            </p>
            {legalInfo?.willStatus && (
              <p className="text-skinz-text-secondary text-sm mt-1">
                Last Updated: {new Date(legalInfo.willLastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Advance Directives</p>
            <p className="text-white font-semibold">
              {legalInfo?.advanceDirectives ? 'Completed' : 'Not Completed'}
            </p>
          </div>
          
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Legal Representation</p>
            <p className="text-white font-semibold">
              {legalInfo?.representation?.attorney || 'None'}
            </p>
            {legalInfo?.representation && (
              <p className="text-skinz-text-secondary text-sm mt-1">
                VSO: {legalInfo.representation.vso}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pending Legal Matters */}
      {legalInfo?.pendingActions && legalInfo.pendingActions.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Pending Legal Actions</h3>
          </div>
          
          <div className="space-y-3">
            {legalInfo.pendingActions.map((action, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4 border border-yellow-500/20">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white font-medium">{action.type}</p>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
                    {action.status}
                  </span>
                </div>
                <p className="text-skinz-text-secondary text-sm">{action.description}</p>
                <p className="text-skinz-text-secondary text-xs mt-2">
                  Filed: {new Date(action.filingDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Beneficiaries */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Beneficiaries</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legalInfo?.beneficiaries?.map((beneficiary, index) => (
            <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
              <p className="text-white font-medium">{beneficiary.name}</p>
              <p className="text-skinz-text-secondary text-sm">{beneficiary.relationship}</p>
              <div className="mt-2 text-xs">
                <span className="text-skinz-accent">{beneficiary.percentage}%</span>
                <span className="text-skinz-text-secondary ml-2">of benefits</span>
              </div>
            </div>
          )) || (
            <div className="col-span-2 text-center py-8">
              <p className="text-skinz-text-secondary">No beneficiaries designated</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}