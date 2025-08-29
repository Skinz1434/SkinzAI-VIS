'use client';

import React from 'react';
import { VeteranProfileEnhanced } from '@/lib/veteran-profile-enhanced';
import { DollarSign, TrendingUp, CreditCard, PiggyBank, Receipt, AlertCircle } from 'lucide-react';

interface FinancialProfileProps {
  veteran: VeteranProfileEnhanced;
}

export default function FinancialProfile({ veteran }: FinancialProfileProps) {
  const financialData = veteran.profileServices?.financial;
  
  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <div className="bg-gradient-to-br from-skinz-bg-secondary to-skinz-bg-tertiary backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Financial Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Monthly Income</p>
            <p className="text-white font-bold text-2xl">
              ${(veteran.benefits.monthlyAmount + (financialData?.monthlyIncome || 0)).toLocaleString()}
            </p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Annual Income</p>
            <p className="text-white font-bold text-2xl">
              ${((veteran.benefits.monthlyAmount + (financialData?.monthlyIncome || 0)) * 12).toLocaleString()}
            </p>
          </div>
          <div className="bg-skinz-bg-primary/50 rounded-lg p-4">
            <p className="text-skinz-text-secondary text-sm mb-2">Credit Score</p>
            <p className="text-white font-bold text-2xl">{financialData?.creditScore || 750}</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Payment History</h3>
        </div>
        
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return (
              <div key={i} className="flex justify-between items-center p-3 bg-skinz-bg-tertiary/30 rounded-lg">
                <div>
                  <p className="text-white">{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  <p className="text-skinz-text-secondary text-sm">Disability Compensation</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${veteran.benefits.monthlyAmount.toLocaleString()}</p>
                  <p className="text-green-400 text-sm">Deposited</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Debt Information */}
      {financialData?.debts && financialData.debts.length > 0 && (
        <div className="bg-skinz-bg-secondary/50 backdrop-blur-md rounded-xl p-6 border border-skinz-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Outstanding Debts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financialData.debts.map((debt, index) => (
              <div key={index} className="bg-skinz-bg-tertiary/50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-white font-medium">{debt.type}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    debt.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' : 
                    debt.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                    debt.status === 'waived' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {debt.status}
                  </span>
                </div>
                <p className="text-white text-xl font-bold">${debt.amount.toLocaleString()}</p>
                <p className="text-skinz-text-secondary text-sm mt-1">Monthly: ${debt.monthlyPayment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}