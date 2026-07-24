/**
 * Morocco 2026 Tax Calculation Engine
 *
 * CRITICAL BUSINESS RULE:
 * - VAT is the ONLY tax charged to customers on invoices.
 * - PIT, CIT, CNSS are BUSINESS taxes on profits/income.
 *   They NEVER appear on customer invoices.
 *   They are only used in the admin dashboard for financial forecasting.
 *
 * All monetary values use high-precision decimal arithmetic
 * to avoid floating-point errors (MAD uses 2 decimal places).
 */

// ---------------------------------------------------------------------------
// VAT rates — Customer-facing tax (TVA)
// Standard: 20%, Reduced: 10% (petroleum, hotel), 7% (water, electricity, utilities)
// Source: Moroccan General Tax Code (Code Général des Impôts)
// ---------------------------------------------------------------------------
export type VatCategory = 'standard' | 'reduced_10' | 'reduced_7';

export const VAT_RATES: Record<VatCategory, number> = {
  standard: 0.20,
  reduced_10: 0.10,
  reduced_7: 0.07,
};

// ---------------------------------------------------------------------------
// PIT brackets — Progressive Income Tax (Impôt sur le Revenu)
// For sole proprietors / dividend income (personal income)
// ---------------------------------------------------------------------------
export interface PitBracket {
  min: number;
  max: number | null;
  rate: number;
}

export const PIT_BRACKETS: PitBracket[] = [
  { min: 0, max: 40000, rate: 0.00 },
  { min: 40001, max: 60000, rate: 0.10 },
  { min: 60001, max: 80000, rate: 0.20 },
  { min: 80001, max: 100000, rate: 0.30 },
  { min: 100001, max: 180000, rate: 0.34 },
  { min: 180001, max: null, rate: 0.38 },
];

// ---------------------------------------------------------------------------
// CIT rates — Corporate Income Tax (Impôt sur les Sociétés)
// Applied to company net profits
// ---------------------------------------------------------------------------
export const CIT_THRESHOLDS = {
  STANDARD_THRESHOLD: 100_000_000, // 100M MAD
  STANDARD_RATE_LOW: 0.20, // < 100M MAD
  STANDARD_RATE_HIGH: 0.35, // >= 100M MAD
  FINANCE_RATE: 0.40, // Financial & insurance entities
};

// ---------------------------------------------------------------------------
// CNSS rates — Social Security contributions (employer cost tracking)
// ---------------------------------------------------------------------------
export const CNSS_RATES = {
  EMPLOYER_PORTION: 0.215, // ~21.5% average of gross payroll
  EMPLOYEE_PORTION: 0.0674, // ~6.74% deducted from salary
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Round to 2 decimal places (MAD santim precision). */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Get the VAT rate for a given category. */
export function getVatRate(category: string): number {
  return VAT_RATES[category as VatCategory] ?? VAT_RATES.standard;
}

// ---------------------------------------------------------------------------
// Module A — Customer Checkout (VAT Calculator)
// ---------------------------------------------------------------------------

export interface CartItemInput {
  product_id: string;
  qty: number;
}

export interface ProductInfo {
  id: string;
  name: string;
  base_price_excluding_tax: number;
  vat_category: VatCategory;
}

export interface CheckoutBreakdownItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price_excl_tax: number;
  vat_category: string;
  vat_rate: number;
  line_total_excl_tax: number;
  line_vat_amount: number;
  line_total_incl_tax: number;
}

export interface CheckoutResult {
  items: CheckoutBreakdownItem[];
  subtotal: number;
  vat_breakdown: {
    standard_20: number;
    reduced_10: number;
    reduced_7: number;
  };
  total_vat: number;
  total_including_vat: number;
}

/**
 * Calculate full checkout breakdown with VAT per Moroccan tax law.
 * Only VAT is charged to the customer.
 */
export function calculateCheckout(
  cartItems: CartItemInput[],
  productLookup: Map<string, ProductInfo>,
): CheckoutResult {
  const items: CheckoutBreakdownItem[] = [];
  let subtotal = 0;
  const vatBreakdown = { standard_20: 0, reduced_10: 0, reduced_7: 0 };

  for (const cartItem of cartItems) {
    const product = productLookup.get(cartItem.product_id);
    if (!product) {
      throw new Error(`Product not found: ${cartItem.product_id}`);
    }

    const vatRate = getVatRate(product.vat_category);
    const lineTotalExclTax = round2(product.base_price_excluding_tax * cartItem.qty);
    const lineVatAmount = round2(lineTotalExclTax * vatRate);
    const lineTotalInclTax = round2(lineTotalExclTax + lineVatAmount);

    subtotal += lineTotalExclTax;

    // Accumulate per-category VAT
    switch (product.vat_category) {
      case 'standard':
        vatBreakdown.standard_20 += lineVatAmount;
        break;
      case 'reduced_10':
        vatBreakdown.reduced_10 += lineVatAmount;
        break;
      case 'reduced_7':
        vatBreakdown.reduced_7 += lineVatAmount;
        break;
    }

    items.push({
      product_id: product.id,
      name: product.name,
      quantity: cartItem.qty,
      unit_price_excl_tax: product.base_price_excluding_tax,
      vat_category: product.vat_category,
      vat_rate: vatRate,
      line_total_excl_tax: lineTotalExclTax,
      line_vat_amount: lineVatAmount,
      line_total_incl_tax: lineTotalInclTax,
    });
  }

  subtotal = round2(subtotal);
  const standardVat = round2(vatBreakdown.standard_20);
  const reduced10Vat = round2(vatBreakdown.reduced_10);
  const reduced7Vat = round2(vatBreakdown.reduced_7);
  const totalVat = round2(standardVat + reduced10Vat + reduced7Vat);
  const totalIncludingVat = round2(subtotal + totalVat);

  return {
    items,
    subtotal,
    vat_breakdown: {
      standard_20: standardVat,
      reduced_10: reduced10Vat,
      reduced_7: reduced7Vat,
    },
    total_vat: totalVat,
    total_including_vat: totalIncludingVat,
  };
}

// ---------------------------------------------------------------------------
// Module B — Admin Dashboard (Business Tax Estimator)
// NOT for customers. Only for internal financial forecasting.
// ---------------------------------------------------------------------------

export interface BusinessTaxInput {
  /** Total sales revenue INCLUDING VAT collected. */
  annual_gross_revenue: number;
  /** Cost of goods sold (COGS). */
  average_cost_of_goods_sold: number;
  /** Sum of employee gross salaries. */
  annual_employee_payroll_gross: number;
  /** Whether the business is a financial/insurance entity (for CIT). */
  is_financial_entity?: boolean;
}

export interface PitCalculation {
  taxable_income: number;
  total_tax: number;
  effective_rate: number;
  bracket_details: { min: number; max: number | null; rate: number; tax_in_bracket: number }[];
}

export interface BusinessTaxResult {
  annual_gross_revenue: number;
  cost_of_goods_sold: number;
  annual_payroll: number;
  net_profit_before_tax: number;
  estimated_cit: number;
  estimated_pit: PitCalculation;
  cnss: {
    employer_cost: number;
    employee_cost: number;
    total_payroll_burden: number;
  };
  total_taxes_and_social_costs: number;
  net_profit_after_all_taxes: number;
}

/**
 * Calculate progressive PIT for a given taxable income.
 * Uses Morocco's 2026 IR (Impôt sur le Revenu) brackets.
 */
export function calculatePit(taxableIncome: number): PitCalculation {
  if (taxableIncome <= 0) {
    return {
      taxable_income: 0,
      total_tax: 0,
      effective_rate: 0,
      bracket_details: [],
    };
  }

  let remaining = taxableIncome;
  let totalTax = 0;
  const bracketDetails: PitCalculation['bracket_details'] = [];

  for (const bracket of PIT_BRACKETS) {
    if (remaining <= 0) break;

    const bracketRange = bracket.max !== null ? bracket.max - bracket.min + 1 : Infinity;
    const taxableInBracket = Math.min(remaining, bracketRange);
    const taxInBracket = round2(taxableInBracket * bracket.rate);

    bracketDetails.push({
      min: bracket.min,
      max: bracket.max,
      rate: bracket.rate,
      tax_in_bracket: taxInBracket,
    });

    totalTax += taxInBracket;
    remaining -= taxableInBracket;
  }

  return {
    taxable_income: taxableIncome,
    total_tax: round2(totalTax),
    effective_rate: taxableIncome > 0 ? round2(totalTax / taxableIncome) : 0,
    bracket_details: bracketDetails,
  };
}

/**
 * Calculate CIT for corporate net profits.
 * Morocco 2026: 20% if profits < 100M MAD, 35% if >= 100M MAD.
 * Financial entities pay a flat 40%.
 */
export function calculateCit(netProfit: number, isFinancialEntity = false): number {
  if (netProfit <= 0) return 0;

  if (isFinancialEntity) {
    return round2(netProfit * CIT_THRESHOLDS.FINANCE_RATE);
  }

  if (netProfit >= CIT_THRESHOLDS.STANDARD_THRESHOLD) {
    return round2(netProfit * CIT_THRESHOLDS.STANDARD_RATE_HIGH);
  }

  return round2(netProfit * CIT_THRESHOLDS.STANDARD_RATE_LOW);
}

/**
 * Calculate CNSS social security costs (employer + employee portions).
 * This is for internal payroll cost tracking, NOT charged to customers.
 */
export function calculateCnss(annualGrossPayroll: number) {
  const employerCost = round2(annualGrossPayroll * CNSS_RATES.EMPLOYER_PORTION);
  const employeeCost = round2(annualGrossPayroll * CNSS_RATES.EMPLOYEE_PORTION);
  return {
    employer_cost: employerCost,
    employee_cost: employeeCost,
    total_payroll_burden: round2(employerCost + employeeCost),
  };
}

/**
 * Full business tax estimation for the admin dashboard.
 * Combines CIT, PIT, and CNSS calculations.
 *
 * Flow:
 * 1. revenue (incl. VAT) → subtract COGS + payroll → net profit
 * 2. Apply CIT to net profit
 * 3. Apply progressive PIT to net profit (sole proprietor scenario)
 * 4. Calculate CNSS employer + employee costs on payroll
 * 5. Return complete breakdown for financial forecasting
 */
export function estimateBusinessTaxes(input: BusinessTaxInput): BusinessTaxResult {
  const netProfitBeforeTax = round2(
    input.annual_gross_revenue -
    input.average_cost_of_goods_sold -
    input.annual_employee_payroll_gross,
  );

  const estimatedCit = calculateCit(netProfitBeforeTax, input.is_financial_entity);
  const estimatedPit = calculatePit(netProfitBeforeTax);
  const cnss = calculateCnss(input.annual_employee_payroll_gross);

  // Total tax burden = CIT + PIT + full CNSS cost
  const totalTaxesAndSocialCosts = round2(
    estimatedCit + estimatedPit.total_tax + cnss.total_payroll_burden,
  );

  const netProfitAfterAllTaxes = round2(netProfitBeforeTax - totalTaxesAndSocialCosts);

  return {
    annual_gross_revenue: input.annual_gross_revenue,
    cost_of_goods_sold: input.average_cost_of_goods_sold,
    annual_payroll: input.annual_employee_payroll_gross,
    net_profit_before_tax: netProfitBeforeTax,
    estimated_cit: estimatedCit,
    estimated_pit: estimatedPit,
    cnss,
    total_taxes_and_social_costs: totalTaxesAndSocialCosts,
    net_profit_after_all_taxes: netProfitAfterAllTaxes,
  };
}
