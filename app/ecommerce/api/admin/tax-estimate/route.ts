import { NextRequest, NextResponse } from 'next/server';
import { estimateBusinessTaxes } from '@/ecommerce/lib/tax';

/**
 * POST /api/admin/tax-estimate
 *
 * Accepts:
 *   annual_gross_revenue — total sales INCLUDING VAT collected (MAD)
 *   average_cost_of_goods_sold — COGS (MAD)
 *   annual_employee_payroll_gross — sum of gross salaries (MAD)
 *   is_financial_entity — optional, defaults to false
 *
 * Returns: CIT, PIT, CNSS breakdown for admin financial forecasting.
 * These are BUSINESS taxes — they never appear on customer invoices.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { annual_gross_revenue, average_cost_of_goods_sold, annual_employee_payroll_gross, is_financial_entity } = body;

    if (typeof annual_gross_revenue !== 'number' || annual_gross_revenue < 0) {
      return NextResponse.json({ error: 'annual_gross_revenue must be a non-negative number' }, { status: 400 });
    }
    if (typeof average_cost_of_goods_sold !== 'number' || average_cost_of_goods_sold < 0) {
      return NextResponse.json({ error: 'average_cost_of_goods_sold must be a non-negative number' }, { status: 400 });
    }
    if (typeof annual_employee_payroll_gross !== 'number' || annual_employee_payroll_gross < 0) {
      return NextResponse.json({ error: 'annual_employee_payroll_gross must be a non-negative number' }, { status: 400 });
    }

    const result = estimateBusinessTaxes({
      annual_gross_revenue,
      average_cost_of_goods_sold,
      annual_employee_payroll_gross,
      is_financial_entity: Boolean(is_financial_entity),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Tax estimation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to estimate taxes' },
      { status: 400 },
    );
  }
}
