import { VeteranDetails } from './veteran-details';

export interface VeteranProfileEnhanced extends VeteranDetails {
  // Profile Services API Data
  profileServices: {
    // Eligibility & Entitlements
    eligibility: {
      vaHealthcare: {
        eligible: boolean;
        enrollmentGroup: string;
        enrollmentDate: Date;
        copayRequired: boolean;
        catastrophicCap: number;
        medicareEligible: boolean;
        medicaidEligible: boolean;
      };
      compensationBenefits: {
        eligible: boolean;
        currentRating: number;
        combinedRating: number;
        individualRatings: Array<{
          condition: string;
          rating: number;
          effectiveDate: Date;
          static: boolean;
        }>;
        futureExams: Array<{
          condition: string;
          examDate: Date;
          location: string;
        }>;
      };
      educationBenefits: {
        chapter33: boolean;
        chapter30: boolean;
        monthsRemaining: number;
        exhaustionDate: Date;
        certificateOfEligibility: string;
        yellowRibbon: boolean;
        stemExtension: boolean;
      };
      homeLoan: {
        eligible: boolean;
        entitlement: number;
        used: number;
        available: number;
        coe: string;
        previousLoans: number;
      };
      burialBenefits: {
        eligible: boolean;
        prePlanned: boolean;
        cemetery: string;
        plotAllowance: number;
      };
      vocationalRehab: {
        eligible: boolean;
        chapter31: boolean;
        monthsRemaining: number;
        counselorAssigned: string;
        plan: string;
      };
    };

    // Awards & Decorations
    awards: Array<{
      name: string;
      date: Date;
      citation: string;
      image: string;
      precedence: number;
      category: 'valor' | 'achievement' | 'service' | 'campaign';
    }>;

    // Service Treatment Records
    treatmentRecords: Array<{
      date: Date;
      facility: string;
      provider: string;
      chiefComplaint: string;
      diagnosis: string;
      treatment: string;
      followUp: string;
      documents: string[];
    }>;

    // Dependent Information
    dependents: Array<{
      id: string;
      relationship: 'spouse' | 'child' | 'parent';
      firstName: string;
      lastName: string;
      dateOfBirth: Date;
      ssn: string;
      onAward: boolean;
      schoolEnrollment?: {
        school: string;
        startDate: Date;
        endDate: Date;
        fullTime: boolean;
      };
    }>;

    // Financial Information
    financial: {
      directDeposit: {
        accountType: 'checking' | 'savings';
        routingNumber: string;
        accountNumber: string;
        bankName: string;
      };
      debts: Array<{
        type: string;
        amount: number;
        reason: string;
        dateIncurred: Date;
        status: 'active' | 'paid' | 'waived' | 'compromise';
      }>;
      payments: Array<{
        date: Date;
        amount: number;
        type: string;
        description: string;
      }>;
      taxDocuments: Array<{
        year: number;
        type: string;
        available: boolean;
        downloadUrl: string;
      }>;
    };

    // Power of Attorney / Fiduciary
    representation: {
      hasPOA: boolean;
      poaName?: string;
      poaOrganization?: string;
      poaPhone?: string;
      poaEmail?: string;
      fiduciary?: {
        name: string;
        relationship: string;
        appointmentDate: Date;
      };
    };

    // Appeals & Reviews
    appeals: Array<{
      id: string;
      type: 'supplemental' | 'higher-level' | 'board';
      issueDate: Date;
      status: string;
      issues: string[];
      docketNumber?: string;
      hearingDate?: Date;
    }>;

    // Environmental Exposures
    exposures: Array<{
      type: string;
      location: string;
      startDate: Date;
      endDate: Date;
      confirmed: boolean;
      presumptive: boolean;
      relatedConditions: string[];
    }>;

    // Travel & Mileage
    travel: {
      benefitEligible: boolean;
      specialMode: boolean;
      reimbursements: Array<{
        date: Date;
        miles: number;
        amount: number;
        status: string;
        claimNumber: string;
      }>;
    };
  };

  // Analytics & Insights
  analytics: {
    // Risk Scores
    riskScores: {
      suicideRisk: 'low' | 'medium' | 'high';
      homelessnessRisk: 'low' | 'medium' | 'high';
      financialRisk: 'low' | 'medium' | 'high';
      healthRisk: 'low' | 'medium' | 'high';
      substanceAbuseRisk: 'low' | 'medium' | 'high';
    };

    // Predictive Models
    predictions: {
      nextClaimApprovalProbability: number;
      estimatedProcessingDays: number;
      ratingIncreaselikelihood: number;
      appealSuccessProbability: number;
    };

    // Engagement Metrics
    engagement: {
      lastPortalLogin: Date;
      portalUsageMinutes: number;
      appointmentShowRate: number;
      medicationAdherence: number;
      benefitUtilization: number;
    };

    // Comparative Analysis
    comparisons: {
      vsNationalAverage: {
        rating: number;
        benefits: number;
        healthcare: number;
      };
      vsPeerGroup: {
        rating: number;
        benefits: number;
        healthcare: number;
      };
    };

    // Trends
    trends: {
      ratingHistory: Array<{ date: Date; rating: number }>;
      benefitHistory: Array<{ date: Date; amount: number }>;
      healthScores: Array<{ date: Date; score: number }>;
      claimHistory: Array<{ date: Date; status: string }>;
    };
  };

  // Communication Center
  communications: {
    // Messages
    messages: Array<{
      id: string;
      date: Date;
      from: string;
      subject: string;
      body: string;
      read: boolean;
      category: string;
      attachments: string[];
    }>;

    // Notifications
    notifications: Array<{
      id: string;
      date: Date;
      type: string;
      message: string;
      priority: 'low' | 'medium' | 'high';
      actionRequired: boolean;
      actionUrl?: string;
    }>;

    // Appointments Reminders
    reminders: Array<{
      id: string;
      appointmentDate: Date;
      reminderDate: Date;
      method: 'email' | 'sms' | 'phone';
      sent: boolean;
      confirmed: boolean;
    }>;

    // Contact Preferences
    preferences: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      phoneCallsAllowed: boolean;
      preferredContactTime: string;
      language: string;
    };
  };

  // Audit Trail
  auditTrail: Array<{
    timestamp: Date;
    action: string;
    user: string;
    details: string;
    ipAddress: string;
    userAgent: string;
    result: 'success' | 'failure';
  }>;

  // Integration Status
  integrations: {
    myHealtheVet: {
      connected: boolean;
      lastSync: Date;
      recordsAvailable: number;
    };
    dod: {
      connected: boolean;
      lastSync: Date;
      tricare: boolean;
    };
    ssa: {
      connected: boolean;
      lastSync: Date;
      ssdi: boolean;
      retirement: boolean;
    };
    irs: {
      connected: boolean;
      lastSync: Date;
      taxExempt: boolean;
    };
  };

  // Quality Metrics
  qualityMetrics: {
    dataCompleteness: number;
    dataAccuracy: number;
    lastVerification: Date;
    verificationMethod: string;
    outstandingIssues: Array<{
      field: string;
      issue: string;
      priority: string;
    }>;
  };

  // Emergency Information
  emergency: {
    contacts: Array<{
      name: string;
      relationship: string;
      phone: string;
      altPhone?: string;
      address: string;
      priority: number;
    }>;
    bloodType: string;
    allergies: string[];
    medications: string[];
    conditions: string[];
    advanceDirectives: {
      hasLivingWill: boolean;
      hasPowerOfAttorney: boolean;
      dnr: boolean;
      organDonor: boolean;
    };
  };

  // Legal Information
  legal: {
    courtOrders: Array<{
      type: string;
      court: string;
      date: Date;
      description: string;
      documents: string[];
    }>;
    guardianship: {
      hasGuardian: boolean;
      guardianName?: string;
      guardianContact?: string;
      courtAppointed: boolean;
    };
    incarceration: {
      currentlyIncarcerated: boolean;
      facility?: string;
      releaseDate?: Date;
    };
  };
}

// Generate enhanced mock data
export function generateEnhancedVeteranProfile(basicProfile: VeteranDetails): VeteranProfileEnhanced {
  const enhancedProfile: VeteranProfileEnhanced = {
    ...basicProfile,
    profileServices: {
      eligibility: {
        vaHealthcare: {
          eligible: true,
          enrollmentGroup: `Group ${Math.floor(Math.random() * 8) + 1}`,
          enrollmentDate: new Date(2020, Math.floor(Math.random() * 12), 1),
          copayRequired: Math.random() > 0.5,
          catastrophicCap: Math.floor(Math.random() * 5000) + 1000,
          medicareEligible: Math.random() > 0.3,
          medicaidEligible: Math.random() > 0.7,
        },
        compensationBenefits: {
          eligible: true,
          currentRating: basicProfile.mpd.disabilityRating,
          combinedRating: basicProfile.mpd.disabilityRating,
          individualRatings: basicProfile.mpd.conditions.map(c => ({
            condition: c.description,
            rating: c.rating,
            effectiveDate: new Date(2020, Math.floor(Math.random() * 12), 1),
            static: Math.random() > 0.7,
          })),
          futureExams: Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
            condition: ['PTSD', 'Hearing Loss', 'Back Pain'][Math.floor(Math.random() * 3)],
            examDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            location: 'VA Medical Center',
          })),
        },
        educationBenefits: {
          chapter33: true,
          chapter30: Math.random() > 0.5,
          monthsRemaining: basicProfile.benefits.education.giBlllRemaining,
          exhaustionDate: new Date(2026, Math.floor(Math.random() * 12), 1),
          certificateOfEligibility: `COE-${Math.floor(Math.random() * 900000) + 100000}`,
          yellowRibbon: Math.random() > 0.6,
          stemExtension: Math.random() > 0.8,
        },
        homeLoan: {
          eligible: true,
          entitlement: 144000,
          used: Math.floor(Math.random() * 100000),
          available: 144000 - Math.floor(Math.random() * 100000),
          coe: `COE-${Math.floor(Math.random() * 900000) + 100000}`,
          previousLoans: Math.floor(Math.random() * 3),
        },
        burialBenefits: {
          eligible: true,
          prePlanned: Math.random() > 0.7,
          cemetery: 'Arlington National Cemetery',
          plotAllowance: 2000,
        },
        vocationalRehab: {
          eligible: Math.random() > 0.5,
          chapter31: Math.random() > 0.6,
          monthsRemaining: Math.floor(Math.random() * 48),
          counselorAssigned: `${['Smith', 'Johnson', 'Williams'][Math.floor(Math.random() * 3)]}, VRC`,
          plan: 'Computer Science Degree',
        },
      },
      
      awards: Array.from({ length: Math.floor(Math.random() * 10) + 3 }, () => ({
        name: ['Bronze Star', 'Purple Heart', 'Good Conduct Medal', 'Combat Action Ribbon', 'Navy Achievement Medal'][Math.floor(Math.random() * 5)],
        date: new Date(2000 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), 1),
        citation: 'For exceptional service and valor in combat operations',
        image: '/medals/placeholder.png',
        precedence: Math.floor(Math.random() * 100) + 1,
        category: ['valor', 'achievement', 'service', 'campaign'][Math.floor(Math.random() * 4)] as any,
      })),

      treatmentRecords: Array.from({ length: 20 }, () => ({
        date: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        facility: `VA Medical Center - ${['Tampa', 'Miami', 'Orlando'][Math.floor(Math.random() * 3)]}`,
        provider: `Dr. ${['Smith', 'Johnson', 'Williams'][Math.floor(Math.random() * 3)]}`,
        chiefComplaint: ['Back pain', 'Headache', 'Joint pain', 'Anxiety'][Math.floor(Math.random() * 4)],
        diagnosis: ['Chronic pain', 'PTSD', 'Hypertension', 'Diabetes'][Math.floor(Math.random() * 4)],
        treatment: ['Physical therapy', 'Medication', 'Counseling', 'Surgery'][Math.floor(Math.random() * 4)],
        followUp: '3 months',
        documents: [`/documents/treatment-${Date.now()}.pdf`],
      })),

      dependents: Array.from({ length: Math.floor(Math.random() * 4) }, (_, i) => ({
        id: `dep-${i}`,
        relationship: i === 0 ? 'spouse' : 'child' as any,
        firstName: ['Jane', 'John', 'Sarah', 'Michael'][i] || 'Dependent',
        lastName: basicProfile.lastName,
        dateOfBirth: new Date(i === 0 ? 1970 : 2000 + (i * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        ssn: `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000) + 1000}`,
        onAward: true,
        schoolEnrollment: i > 0 && Math.random() > 0.5 ? {
          school: 'State University',
          startDate: new Date(2023, 8, 1),
          endDate: new Date(2027, 5, 1),
          fullTime: true,
        } : undefined,
      })),

      financial: {
        directDeposit: {
          accountType: Math.random() > 0.5 ? 'checking' : 'savings',
          routingNumber: `${Math.floor(Math.random() * 900000000) + 100000000}`,
          accountNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
          bankName: ['Bank of America', 'Wells Fargo', 'Chase', 'Navy Federal'][Math.floor(Math.random() * 4)],
        },
        debts: Math.random() > 0.7 ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
          type: ['Overpayment', 'Medical', 'Education'][Math.floor(Math.random() * 3)],
          amount: Math.floor(Math.random() * 5000) + 500,
          reason: 'Administrative error',
          dateIncurred: new Date(2023, Math.floor(Math.random() * 12), 1),
          status: ['active', 'paid', 'waived', 'compromise'][Math.floor(Math.random() * 4)] as any,
        })) : [],
        payments: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i, 1),
          amount: basicProfile.benefits.monthlyAmount,
          type: 'Disability Compensation',
          description: `Monthly compensation payment`,
        })),
        taxDocuments: Array.from({ length: 3 }, (_, i) => ({
          year: 2024 - i,
          type: '1099-G',
          available: true,
          downloadUrl: `/tax/1099-${2024 - i}.pdf`,
        })),
      },

      representation: {
        hasPOA: Math.random() > 0.6,
        poaName: Math.random() > 0.6 ? 'Veterans Service Organization' : undefined,
        poaOrganization: Math.random() > 0.6 ? 'DAV' : undefined,
        poaPhone: Math.random() > 0.6 ? '(800) 555-0100' : undefined,
        poaEmail: Math.random() > 0.6 ? 'representative@vso.org' : undefined,
        fiduciary: Math.random() > 0.9 ? {
          name: 'John Doe',
          relationship: 'Spouse',
          appointmentDate: new Date(2022, 5, 1),
        } : undefined,
      },

      appeals: Math.random() > 0.5 ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        id: `appeal-${Math.floor(Math.random() * 900000) + 100000}`,
        type: ['supplemental', 'higher-level', 'board'][Math.floor(Math.random() * 3)] as any,
        issueDate: new Date(2023, Math.floor(Math.random() * 12), 1),
        status: ['Pending', 'Under Review', 'Scheduled', 'Decided'][Math.floor(Math.random() * 4)],
        issues: ['Rating increase', 'Service connection', 'Effective date'][Math.floor(Math.random() * 3)].split(','),
        docketNumber: `${Math.floor(Math.random() * 900000) + 100000}`,
        hearingDate: Math.random() > 0.5 ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : undefined,
      })) : [],

      exposures: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        type: ['Agent Orange', 'Burn Pits', 'Gulf War', 'Radiation'][Math.floor(Math.random() * 4)],
        location: ['Vietnam', 'Iraq', 'Afghanistan', 'Kuwait'][Math.floor(Math.random() * 4)],
        startDate: new Date(2000 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), 1),
        endDate: new Date(2001 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), 1),
        confirmed: Math.random() > 0.3,
        presumptive: Math.random() > 0.5,
        relatedConditions: ['Respiratory', 'Cancer', 'Neurological'].filter(() => Math.random() > 0.5),
      })),

      travel: {
        benefitEligible: Math.random() > 0.3,
        specialMode: Math.random() > 0.8,
        reimbursements: Array.from({ length: 10 }, () => ({
          date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          miles: Math.floor(Math.random() * 200) + 10,
          amount: (Math.floor(Math.random() * 200) + 10) * 0.415,
          status: ['Pending', 'Approved', 'Paid'][Math.floor(Math.random() * 3)],
          claimNumber: `TR${Math.floor(Math.random() * 900000) + 100000}`,
        })),
      },
    },

    analytics: {
      riskScores: {
        suicideRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        homelessnessRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        financialRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        healthRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        substanceAbuseRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
      },
      predictions: {
        nextClaimApprovalProbability: Math.random() * 100,
        estimatedProcessingDays: Math.floor(Math.random() * 180) + 30,
        ratingIncreaselikelihood: Math.random() * 100,
        appealSuccessProbability: Math.random() * 100,
      },
      engagement: {
        lastPortalLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        portalUsageMinutes: Math.floor(Math.random() * 500) + 100,
        appointmentShowRate: 70 + Math.random() * 30,
        medicationAdherence: 60 + Math.random() * 40,
        benefitUtilization: 50 + Math.random() * 50,
      },
      comparisons: {
        vsNationalAverage: {
          rating: Math.random() * 40 - 20,
          benefits: Math.random() * 40 - 20,
          healthcare: Math.random() * 40 - 20,
        },
        vsPeerGroup: {
          rating: Math.random() * 30 - 15,
          benefits: Math.random() * 30 - 15,
          healthcare: Math.random() * 30 - 15,
        },
      },
      trends: {
        ratingHistory: Array.from({ length: 10 }, (_, i) => ({
          date: new Date(2020 + Math.floor(i / 2), (i * 2) % 12, 1),
          rating: Math.min(100, 30 + (i * 7) + Math.floor(Math.random() * 10)),
        })),
        benefitHistory: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2023, i, 1),
          amount: 1500 + Math.floor(Math.random() * 500),
        })),
        healthScores: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2023, i, 1),
          score: 60 + Math.floor(Math.random() * 30),
        })),
        claimHistory: Array.from({ length: 5 }, (_, i) => ({
          date: new Date(2020 + i, Math.floor(Math.random() * 12), 1),
          status: ['Submitted', 'Under Review', 'Approved', 'Denied'][Math.floor(Math.random() * 4)],
        })),
      },
    },

    communications: {
      messages: Array.from({ length: 15 }, (_, i) => ({
        id: `msg-${i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        from: ['VA Benefits', 'Healthcare Team', 'Claims Department'][Math.floor(Math.random() * 3)],
        subject: ['Appointment Reminder', 'Claim Update', 'Benefits Change'][Math.floor(Math.random() * 3)],
        body: 'Important information regarding your VA benefits...',
        read: Math.random() > 0.3,
        category: ['Medical', 'Benefits', 'Claims'][Math.floor(Math.random() * 3)],
        attachments: Math.random() > 0.7 ? [`attachment-${i}.pdf`] : [],
      })),
      notifications: Array.from({ length: 10 }, (_, i) => ({
        id: `notif-${i}`,
        date: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        type: ['Payment', 'Appointment', 'Document'][Math.floor(Math.random() * 3)],
        message: 'Your monthly compensation has been deposited',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        actionRequired: Math.random() > 0.6,
        actionUrl: Math.random() > 0.6 ? '/action' : undefined,
      })),
      reminders: Array.from({ length: 5 }, (_, i) => ({
        id: `rem-${i}`,
        appointmentDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        reminderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        method: ['email', 'sms', 'phone'][Math.floor(Math.random() * 3)] as any,
        sent: Math.random() > 0.3,
        confirmed: Math.random() > 0.5,
      })),
      preferences: {
        emailNotifications: true,
        smsNotifications: Math.random() > 0.3,
        phoneCallsAllowed: Math.random() > 0.5,
        preferredContactTime: '9AM-5PM',
        language: 'English',
      },
    },

    auditTrail: Array.from({ length: 50 }, (_, i) => ({
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
      action: ['Login', 'View Benefits', 'Update Profile', 'Download Document'][Math.floor(Math.random() * 4)],
      user: ['Veteran', 'VSO Rep', 'VA Staff'][Math.floor(Math.random() * 3)],
      details: 'Action completed successfully',
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0...',
      result: Math.random() > 0.1 ? 'success' : 'failure' as any,
    })),

    integrations: {
      myHealtheVet: {
        connected: true,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
        recordsAvailable: Math.floor(Math.random() * 1000) + 100,
      },
      dod: {
        connected: Math.random() > 0.3,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        tricare: Math.random() > 0.5,
      },
      ssa: {
        connected: Math.random() > 0.4,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        ssdi: Math.random() > 0.7,
        retirement: Math.random() > 0.5,
      },
      irs: {
        connected: Math.random() > 0.6,
        lastSync: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
        taxExempt: Math.random() > 0.5,
      },
    },

    qualityMetrics: {
      dataCompleteness: 70 + Math.random() * 30,
      dataAccuracy: 85 + Math.random() * 15,
      lastVerification: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      verificationMethod: ['Automated', 'Manual', 'Hybrid'][Math.floor(Math.random() * 3)],
      outstandingIssues: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
        field: ['SSN', 'Address', 'Phone', 'Email'][Math.floor(Math.random() * 4)],
        issue: 'Needs verification',
        priority: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      })),
    },

    emergency: {
      contacts: Array.from({ length: 2 }, (_, i) => ({
        name: `Emergency Contact ${i + 1}`,
        relationship: ['Spouse', 'Child', 'Parent', 'Sibling'][Math.floor(Math.random() * 4)],
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        altPhone: Math.random() > 0.5 ? `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : undefined,
        address: '123 Emergency St, City, ST 12345',
        priority: i + 1,
      })),
      bloodType: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      allergies: ['Penicillin', 'Sulfa', 'None'].filter(() => Math.random() > 0.5),
      medications: basicProfile.mpd.medications.filter(m => m.status === 'Active').map(m => m.name),
      conditions: basicProfile.mpd.conditions.filter(c => c.status === 'Active').map(c => c.description),
      advanceDirectives: {
        hasLivingWill: Math.random() > 0.5,
        hasPowerOfAttorney: Math.random() > 0.5,
        dnr: Math.random() > 0.8,
        organDonor: Math.random() > 0.6,
      },
    },

    legal: {
      courtOrders: Math.random() > 0.9 ? Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => ({
        type: ['Divorce', 'Child Support', 'Garnishment'][Math.floor(Math.random() * 3)],
        court: 'Circuit Court',
        date: new Date(2022, Math.floor(Math.random() * 12), 1),
        description: 'Court order details',
        documents: [`court-order-${Date.now()}.pdf`],
      })) : [],
      guardianship: {
        hasGuardian: Math.random() > 0.95,
        guardianName: Math.random() > 0.95 ? 'Guardian Name' : undefined,
        guardianContact: Math.random() > 0.95 ? '(555) 555-5555' : undefined,
        courtAppointed: Math.random() > 0.95,
      },
      incarceration: {
        currentlyIncarcerated: false,
        facility: undefined,
        releaseDate: undefined,
      },
    },
  };

  return enhancedProfile;
}