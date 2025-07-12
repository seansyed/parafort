/**
 * States That DO NOT Require Annual Filing by Entity Type
 * Based on official state requirements and user-provided data
 */

export interface EntityFilingExemption {
  state: string;
  LLC: boolean;
  Corporation: boolean;
  'Professional Corporation': boolean;
  'Non-Profit Corporation': boolean;
  notes?: string;
}

// States that are EXEMPT from annual filing (marked with ❌ in user data)
export const stateAnnualFilingExemptions: { [state: string]: EntityFilingExemption } = {
  Alaska: {
    state: 'Alaska',
    LLC: true, // ❌ - Biennial only (every 2 years)
    Corporation: true, // ❌ - Biennial only (every 2 years)
    'Professional Corporation': true,
    'Non-Profit Corporation': true,
    notes: 'Biennial only (every 2 years)'
  },
  Arizona: {
    state: 'Arizona',
    LLC: true, // ❌ - Only corporations file annually
    Corporation: false, // ✅ - Only corporations file annually
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'Only corporations file annually'
  },
  Delaware: {
    state: 'Delaware',
    LLC: true, // ❌ - LLCs pay flat tax, no report
    Corporation: false, // ✅ - Corporations file annually
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'LLCs pay flat tax, no report'
  },
  Indiana: {
    state: 'Indiana',
    LLC: true, // ❌ - Biennial for both
    Corporation: true, // ❌ - Biennial for both
    'Professional Corporation': true,
    'Non-Profit Corporation': true,
    notes: 'Biennial for both'
  },
  Iowa: {
    state: 'Iowa',
    LLC: true, // ❌ - Biennial for both
    Corporation: true, // ❌ - Biennial for both
    'Professional Corporation': true,
    'Non-Profit Corporation': true,
    notes: 'Biennial for both'
  },
  Michigan: {
    state: 'Michigan',
    LLC: true, // ❌ - LLCs: Annual after 1st year; Corps: Annual
    Corporation: false, // ✅ - Corps file annually
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'LLCs exempt from annual filing'
  },
  Mississippi: {
    state: 'Mississippi',
    LLC: true, // ❌ - LLCs exempt; Corps file annually
    Corporation: false, // ✅ - Corps file annually
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'LLCs exempt; Corps file annually'
  },
  Missouri: {
    state: 'Missouri',
    LLC: true, // ❌ - LLCs exempt; Corps optional report
    Corporation: false, // ✅ (optional) - Corps optional report
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'LLCs exempt; Corps optional report'
  },
  Nebraska: {
    state: 'Nebraska',
    LLC: true, // ❌ - Biennial filing required
    Corporation: true, // ❌ - Biennial filing required
    'Professional Corporation': true,
    'Non-Profit Corporation': true,
    notes: 'Biennial filing required'
  },
  'New Mexico': {
    state: 'New Mexico',
    LLC: true, // ❌ - LLCs exempt; Corps file
    Corporation: false, // ✅ - Corps file
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'LLCs exempt; Corps file'
  },
  'New York': {
    state: 'New York',
    LLC: true, // ❌ - LLCs file biennial, Corps file annually
    Corporation: false, // ✅ - Corps file annually
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'LLCs file biennial, Corps file annually'
  },
  Ohio: {
    state: 'Ohio',
    LLC: true, // ❌ - No annual report required
    Corporation: true, // ❌ - No annual report required
    'Professional Corporation': true,
    'Non-Profit Corporation': true,
    notes: 'No annual report required'
  },
  Pennsylvania: {
    state: 'Pennsylvania',
    LLC: true, // ❌ - Corps: Annual; LLCs: Change form only
    Corporation: false, // ✅ - Corps: Annual
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'Corps: Annual; LLCs: Change form only'
  },
  'South Carolina': {
    state: 'South Carolina',
    LLC: true, // ❌ - LLCs exempt; Corps file with DOR
    Corporation: false, // ✅ - Corps file with DOR
    'Professional Corporation': false,
    'Non-Profit Corporation': false,
    notes: 'LLCs exempt; Corps file with DOR'
  }
};

/**
 * Check if a state/entity combination is exempt from annual filing
 */
export function isExemptFromAnnualFiling(state: string, entityType: string): boolean {
  const exemption = stateAnnualFilingExemptions[state];
  if (!exemption) return false;
  
  switch (entityType) {
    case 'LLC':
      return exemption.LLC;
    case 'Corporation':
      return exemption.Corporation;
    case 'Professional Corporation':
      return exemption['Professional Corporation'];
    case 'Non-Profit Corporation':
      return exemption['Non-Profit Corporation'];
    default:
      return false;
  }
}

/**
 * Get exemption message for a state/entity combination
 */
export function getExemptionMessage(state: string, entityType: string): string {
  const exemption = stateAnnualFilingExemptions[state];
  if (!exemption || !isExemptFromAnnualFiling(state, entityType)) {
    return '';
  }
  
  const baseMessage = `${state} ${entityType}s are exempt from annual filing requirements.`;
  const notes = exemption.notes ? ` ${exemption.notes}` : '';
  
  return baseMessage + notes;
}