import { Router } from 'express';

const router = Router();

type Insight = {
  analysis: string;
  score?: number;
  recommendations?: string[];
  warnings?: string[];
};

function toLabel(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase();
}

router.post('/analyze', async (req, res) => {
  try {
    const { field, value, context } = req.body || {};

    if (!field || typeof field !== 'string') {
      return res.status(400).json({ message: 'field is required' });
    }

    const currentValue: string = typeof value === 'string' ? value : (value?.toString?.() ?? '');
    const industry: string = context?.industryPack || '';

    const aiInsightDatabase: Record<string, Insight> = {
      founderName: {
        analysis: `Founder profile analysis for ${currentValue || 'your business'}. Strong leadership presence is crucial for investor confidence and team building.`,
        score: currentValue ? 85 : 0,
        recommendations: currentValue
          ? [
              'Develop a compelling founder story for investor pitches',
              'Build your personal brand on LinkedIn and industry platforms',
              'Consider joining founder peer groups in South Africa',
            ]
          : ['Complete founder information to enable AI analysis'],
      },
      businessName: {
        analysis: currentValue
          ? `Business name "${currentValue}" analysis: Strong brand potential with good memorability. Consider trademark protection in South Africa.`
          : 'Business name is critical for brand recognition and legal protection.',
        score: currentValue ? Math.min(90, currentValue.length * 10) : 0,
        recommendations: currentValue
          ? [
              'Check CIPC database for name availability',
              'Secure matching domain name and social media handles',
              'Consider trademark registration for brand protection',
            ]
          : ['Enter business name for comprehensive analysis'],
        warnings: currentValue && currentValue.length < 3 ? ['Business name appears too short for effective branding'] : [],
      },
      vision: {
        analysis: currentValue
          ? `Vision statement analysis: ${currentValue.length > 50 ? 'Comprehensive vision with clear direction' : 'Vision could be more detailed'}. Aligns with transformational leadership principles.`
          : 'Vision statement provides strategic direction and inspires stakeholders.',
        score: currentValue
          ? Math.min(100, currentValue.length / 2 + (currentValue.includes('South Africa') || currentValue.includes('Africa') ? 20 : 0))
          : 0,
        recommendations: currentValue
          ? [
              'Ensure vision is measurable with 10-year outcome indicators',
              'Align with UN SDGs for South African market relevance',
              'Consider broader African market expansion in vision',
            ]
          : ['Craft an inspiring 10-year vision statement'],
        warnings: currentValue && currentValue.length < 30 ? ['Vision statement should be more detailed and inspiring'] : [],
      },
      coreProblem: {
        analysis: currentValue
          ? `Problem-opportunity analysis: ${currentValue.includes('South Africa') ? 'Good local market context' : 'Consider adding South African market context'}. Problem validation strength depends on customer evidence.`
          : 'Core problem definition is fundamental to product-market fit.',
        score: currentValue
          ? Math.min(
              95,
              currentValue.length / 5 + (currentValue.includes('customer') || currentValue.includes('user') ? 15 : 0) +
                (currentValue.includes('research') || currentValue.includes('interview') ? 15 : 0)
            )
          : 0,
        recommendations: currentValue
          ? [
              'Validate problem through minimum 20 customer interviews',
              'Quantify the economic impact of this problem',
              'Research if this problem exists in other African markets',
            ]
          : ['Define and validate your core customer problem'],
        warnings: currentValue && !currentValue.includes('customer') ? ['Problem should be defined from customer perspective'] : [],
      },
      targetMarket: {
        analysis: currentValue
          ? `Target market definition: ${currentValue.includes('SME') || currentValue.includes('enterprise') ? 'Clear B2B focus' : currentValue.includes('consumer') ? 'B2C market identified' : 'Market segment needs more specificity'}`
          : 'Target market definition shapes all strategic decisions.',
        score: currentValue
          ? Math.min(90, currentValue.length / 3 + (currentValue.includes('South Africa') ? 20 : 0) + (currentValue.includes('size') || currentValue.includes('R') ? 15 : 0))
          : 0,
        recommendations: currentValue
          ? [
              'Define clear customer segments within target market',
              'Research market size and growth trends in South Africa',
              'Identify early adopter segment for initial launch',
            ]
          : ['Define your target market segments'],
      },
      directCompetitors: {
        analysis: currentValue
          ? `Competitive analysis: ${currentValue.split(',').length} competitors identified. Understanding competitive landscape is crucial for differentiation.`
          : 'Competitive analysis informs positioning and pricing strategy.',
        score: currentValue ? Math.min(85, currentValue.split(',').length * 15 + currentValue.length / 4) : 0,
        recommendations: currentValue
          ? [
              "Analyze competitors' pricing strategies",
              "Identify gaps in competitors' offerings",
              "Monitor competitors' funding and expansion plans",
            ]
          : ['Research and list your main competitors'],
        warnings: currentValue && currentValue.split(',').length < 2 ? ['Consider researching more competitors for comprehensive analysis'] : [],
      },
      revenueModel: {
        analysis: currentValue
          ? `Revenue model assessment: ${currentValue.includes('subscription') ? 'SaaS model detected - strong recurring revenue potential' : currentValue.includes('transaction') ? 'Transaction-based model' : 'Custom revenue model'}`
          : 'Revenue model determines business scalability and investor appeal.',
        score: currentValue
          ? Math.min(
              95,
              currentValue.length / 3 + (currentValue.includes('recurring') || currentValue.includes('subscription') ? 25 : 0) +
                (industry === 'technology' && currentValue.includes('SaaS') ? 15 : 0)
            )
          : 0,
        recommendations: currentValue
          ? [
              'Model different pricing tiers for market segments',
              'Plan for revenue diversification over time',
              'Consider South African payment preferences (EFT, card, mobile)',
            ]
          : ['Define your revenue generation strategy'],
      },
      startupCosts: {
        analysis: currentValue
          ? `Startup cost analysis: ${currentValue.includes('R') ? 'ZAR amounts specified - good local context' : 'Consider adding specific ZAR amounts'}. Comprehensive cost planning reduces funding risks.`
          : 'Accurate startup cost estimation is crucial for funding planning.',
        score: currentValue
          ? Math.min(90, currentValue.length / 4 + (currentValue.includes('R') || currentValue.includes('rand') ? 20 : 0) + (currentValue.includes('staff') || currentValue.includes('salary') ? 15 : 0))
          : 0,
        recommendations: currentValue
          ? [
              'Include 20% contingency buffer for unexpected costs',
              'Research South African supplier pricing',
              'Consider phased approach to reduce initial capital needs',
            ]
          : ['Estimate your startup costs in ZAR'],
      },
      mission: {
        analysis: currentValue
          ? `Mission clarity: ${currentValue.length > 40 ? 'clear scope and audience' : 'could specify who/what/why more precisely'}.`
          : 'Mission states who you serve, what you deliver, and why it matters.',
        score: currentValue ? Math.min(95, currentValue.length / 2) : 0,
        recommendations: currentValue
          ? ['Ensure mission drives day-to-day decisions', 'Keep it concise and concrete', 'Validate with team alignment']
          : ['Define a concise mission covering who/what/why'],
      },
      coreValues: {
        analysis: currentValue
          ? `Cultural alignment: ${currentValue.split(',').length >= 3 ? 'solid set of 3+ values' : 'consider expanding to 3–5 values'}.`
          : 'Core values shape hiring, reviews, and decisions.',
        score: currentValue ? Math.min(90, currentValue.split(',').length * 20) : 0,
        recommendations: ['Operationalize values in interviews and reviews', 'Publish values for stakeholder trust'],
      },
      marketSize: {
        analysis: currentValue
          ? `Sizing approach: ${/\b(R|ZAR|rand)\b/i.test(currentValue) ? 'ZAR-based bottom-up present' : 'add ZAR bottom-up sizing for SA'}.`
          : 'Include TAM/SAM/SOM with ZAR figures and sources.',
        score: currentValue ? Math.min(95, currentValue.length / 3) : 0,
        recommendations: ['Cite credible SA data sources', 'Validate assumptions with customer counts and ARPU'],
      },
      pricingStrategy: {
        analysis: currentValue
          ? `Pricing: ${/tier|plan|bundle|discount/i.test(currentValue) ? 'tiered/bundled hints found' : 'consider tiered plans for segments'}.`
          : 'Pricing should reflect value, segments, and payment preferences in SA.',
        score: currentValue ? Math.min(90, currentValue.length / 3) : 0,
        recommendations: ['Test willingness-to-pay', 'Offer EFT/card/mobile options', 'Consider entry, core, premium tiers'],
      },
      operationalPlan: {
        analysis: currentValue
          ? `Ops detail: ${/SLA|SOP|KPI|SOPs/i.test(currentValue) ? 'process artifacts identified' : 'add SOPs/SLAs/KPIs'} for reliability.`
          : 'Outline processes, SLAs, suppliers, and KPIs to scale.',
        score: currentValue ? Math.min(85, currentValue.length / 4) : 0,
        recommendations: ['Document SOPs and responsibilities', 'Define quality checks and SLAs'],
      },
      organizationalStructure: {
        analysis: currentValue
          ? `Org readiness: ${/cto|coo|cfo|vp|lead|manager/i.test(currentValue) ? 'leadership roles present' : 'define leadership roles and reporting lines'}.`
          : 'Clarify roles, reporting lines, and hiring sequence.',
        score: currentValue ? Math.min(85, currentValue.length / 4) : 0,
        recommendations: ['Define hiring plan by milestone', 'Map responsibilities (RACI)'],
      },
      fundingRequirements: {
        analysis: currentValue
          ? `Funding ask: ${/\b(R|ZAR|rand|million|m)\b/i.test(currentValue) ? 'amount indicated' : 'add explicit ZAR amount and runway'}.`
          : 'Specify amount, runway, milestones, and instrument.',
        score: currentValue ? Math.min(90, currentValue.length / 3) : 0,
        recommendations: ['Breakdown use of funds', 'Align tranches to milestones'],
      },
      useOfFunds: {
        analysis: currentValue ? 'Allocation clarity improves investor trust.' : 'Provide % allocations across key categories.',
        score: currentValue ? Math.min(90, currentValue.length / 3) : 0,
        recommendations: ['Capex vs Opex split', 'Include 12–18 month runway assumptions'],
      },
      marketingStrategy: {
        analysis: currentValue ? 'Check channel–segment fit and CAC payback.' : 'Outline channels, messaging, and budget split.',
        score: currentValue ? Math.min(85, currentValue.length / 3) : 0,
        recommendations: ['Define ICP messaging', 'Track CAC, LTV, and payback'],
      },
      salesStrategy: {
        analysis: currentValue ? 'Define motion (PLG/inside/field) and pipeline math.' : 'Outline motion, funnel stages, and quotas.',
        score: currentValue ? Math.min(85, currentValue.length / 3) : 0,
        recommendations: ['Set conversion benchmarks', 'Align comp with quotas'],
      },
      businessRisks: {
        analysis: currentValue ? 'Ensure risks are prioritized by likelihood/impact.' : 'List top 5 risks with severity and owners.',
        score: currentValue ? Math.min(80, currentValue.length / 4) : 0,
        recommendations: ['Add owner per risk', 'Track residual risk after mitigation'],
      },
      mitigation_strategies: {
        analysis: currentValue ? 'Tie mitigations to triggers and playbooks.' : 'Define preventive and reactive measures.',
        score: currentValue ? Math.min(80, currentValue.length / 4) : 0,
        recommendations: ['Establish monitoring thresholds', 'Run tabletop exercises'],
      },
      mitigationStrategies: {
        analysis: currentValue ? 'Tie mitigations to triggers and playbooks.' : 'Define preventive and reactive measures.',
        score: currentValue ? Math.min(80, currentValue.length / 4) : 0,
        recommendations: ['Establish monitoring thresholds', 'Run tabletop exercises'],
      },
      companyCulture: {
        analysis: currentValue ? 'Ensure values are operationalized in hiring, reviews, and decisions.' : 'Describe the cultural norms and practices you promote.',
        score: currentValue ? Math.min(85, currentValue.length / 4) : 0,
        recommendations: ['Document explicit behaviors for each value', 'Embed values in onboarding and feedback cycles'],
      },
      companyculture: {
        analysis: currentValue ? 'Ensure values are operationalized in hiring, reviews, and decisions.' : 'Describe the cultural norms and practices you promote.',
        score: currentValue ? Math.min(85, currentValue.length / 4) : 0,
        recommendations: ['Document explicit behaviors for each value', 'Embed values in onboarding and feedback cycles'],
      },
      milestones: {
        analysis: currentValue ? 'Use time-bound, measurable milestones.' : 'Add 6–12 month roadmap with dates.',
        score: currentValue ? Math.min(85, currentValue.length / 4) : 0,
        recommendations: ['Attach KPIs per milestone', 'Link to funding tranches'],
      },
      timeline: {
        analysis: currentValue ? 'Check dependency risks and critical path.' : 'Provide Gantt-style phases with dependencies.',
        score: currentValue ? Math.min(85, currentValue.length / 4) : 0,
        recommendations: ['Highlight critical path', 'Add risk buffers'],
      },
    };

    const defaultInsight: Insight = {
      analysis: 'AI analysis available once you provide input for this field.',
      score: 0,
      recommendations: ['Complete this field to receive strategic insights'],
      warnings: [],
    };

    // Simulate latency for UX
    await new Promise((r) => setTimeout(r, 300));

    const data = aiInsightDatabase[field] || defaultInsight;
    return res.json({ field, insight: data });
  } catch (err: any) {
    return res.status(500).json({ message: 'AI analyze failed', detail: err?.message || String(err) });
  }
});

export { router as aiRouter };
