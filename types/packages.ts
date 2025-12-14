/**
 * Package Types
 * Type definitions for package-related data structures
 */

export type AssetClass = 'FOREX' | 'CRYPTO' | 'PSX';
export type DurationType = 'SHORT_TERM' | 'LONG_TERM';
export type BillingCycle = 'MONTHLY' | 'SIX_MONTHS' | 'YEARLY';

export interface Package {
  id: number;
  name: string;
  asset_class: AssetClass;
  duration_type: DurationType;
  billing_cycle: BillingCycle;
  duration_days: number;
  price: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackagesResponse {
  status: string;
  type: string;
  data: {
    limit: number;
    offset: number;
    packages: Package[];
    total: number;
  };
  message: string;
}

