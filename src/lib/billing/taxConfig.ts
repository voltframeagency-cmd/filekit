/**
 * Configurable Tax & VAT Management
 * Decoupled from core entitlement logic. Tax treatment is explicitly configurable
 * and validated rather than silently hardcoded as a universal 25% VAT rule.
 */

import { TaxConfiguration, TaxTreatment, JOB_PASS_PRICE_CENTS } from './types';

export interface TaxResolutionResult {
  taxConfig: TaxConfiguration;
  baseAmountCents: number;
  taxAmountCents: number;
  totalGrossCents: number;
  currency: string;
}

/**
 * Standard known default rates by jurisdiction when provider dynamic tax is disabled.
 * In production, Stripe Tax or provider tax tables calculate precise rates per zip/country.
 */
const JURISDICTION_DEFAULTS: Record<string, { rate: number; label: string; treatment: TaxTreatment }> = {
  SE: { rate: 25.0, label: 'Swedish MOMS (25%)', treatment: 'INCLUSIVE' },
  DE: { rate: 19.0, label: 'German MwSt (19%)', treatment: 'INCLUSIVE' },
  FR: { rate: 20.0, label: 'French TVA (20%)', treatment: 'INCLUSIVE' },
  GB: { rate: 20.0, label: 'UK VAT (20%)', treatment: 'INCLUSIVE' },
  US: { rate: 0.0, label: 'US Sales Tax (Calculated at checkout)', treatment: 'EXCLUSIVE' },
  GLOBAL_DEFAULT: { rate: 0.0, label: 'Standard Rate', treatment: 'INCLUSIVE' },
};

/**
 * Resolves tax configuration based on user location, env overrides, or explicit customer input.
 * Does NOT hardcode a single global rule.
 */
export function resolveTaxConfiguration(
  countryCode?: string,
  explicitTreatment?: TaxTreatment,
  explicitRate?: number
): TaxResolutionResult {
  const envTreatment = (process.env.TAX_TREATMENT_DEFAULT as TaxTreatment) || 'INCLUSIVE';
  const envDefaultRate = process.env.TAX_RATE_PERCENT_DEFAULT
    ? parseFloat(process.env.TAX_RATE_PERCENT_DEFAULT)
    : undefined;

  const normalizedCountry = (countryCode || process.env.DEFAULT_TAX_JURISDICTION || 'GLOBAL_DEFAULT').toUpperCase();
  const preset = JURISDICTION_DEFAULTS[normalizedCountry] || JURISDICTION_DEFAULTS.GLOBAL_DEFAULT;

  const treatment: TaxTreatment = explicitTreatment || envTreatment || preset.treatment;
  const ratePercentage = explicitRate !== undefined ? explicitRate : envDefaultRate !== undefined ? envDefaultRate : preset.rate;
  const jurisdictionCode = normalizedCountry;
  const taxLabel = preset.label;

  const taxConfig: TaxConfiguration = {
    treatment,
    ratePercentage,
    jurisdictionCode,
    taxLabel,
  };

  let baseAmountCents: number;
  let taxAmountCents: number;
  let totalGrossCents: number;

  if (treatment === 'INCLUSIVE' && ratePercentage > 0) {
    // Total price is fixed at €4.90 (490 cents), tax is extracted
    totalGrossCents = JOB_PASS_PRICE_CENTS;
    baseAmountCents = Math.round(totalGrossCents / (1 + ratePercentage / 100));
    taxAmountCents = totalGrossCents - baseAmountCents;
  } else if (treatment === 'EXCLUSIVE' && ratePercentage > 0) {
    // Net price is €4.90, tax is added on top
    baseAmountCents = JOB_PASS_PRICE_CENTS;
    taxAmountCents = Math.round(baseAmountCents * (ratePercentage / 100));
    totalGrossCents = baseAmountCents + taxAmountCents;
  } else {
    // Zero-rate, exempt, or dynamically calculated at provider checkout
    baseAmountCents = JOB_PASS_PRICE_CENTS;
    taxAmountCents = 0;
    totalGrossCents = JOB_PASS_PRICE_CENTS;
  }

  return {
    taxConfig,
    baseAmountCents,
    taxAmountCents,
    totalGrossCents,
    currency: 'eur',
  };
}
