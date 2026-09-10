export type ViewId = "absolute" | "lift" | "competitor" | "control";
export type CategoryId =
  | "citation"
  | "coverage"
  | "mention"
  | "share"
  | "attribution"
  | "diagnostics";
export type BreakdownId =
  | "overall"
  | "prompt"
  | "url"
  | "provider"
  | "opportunity"
  | "competitor";

export type Unit = "percent" | "count" | "pp" | "claims";

export interface Metric {
  id: string;
  label: string;
  short: string;
  unit: Unit;
  pre: number;
  post: number;
  decimals?: number;
  definition: string;
  calculation: string;
  views: ViewId[];
  competitorFactor?: number;
  controlFactor?: number;
  zeroLine?: boolean;
}

export interface Category {
  id: CategoryId;
  label: string;
  notice?: { text: string; steps: string[] };
  metrics: Metric[];
}

export const TIMELINE = [
  "Jul 1",
  "Jul 4",
  "Jul 7",
  "Jul 10",
  "Jul 14",
  "Jul 17",
  "Jul 20",
  "Jul 23",
  "Jul 26",
  "Jul 28",
];

export const DEPLOY_LABEL = "Jul 14";
export const POST_START_INDEX = 5;

export const EXPERIMENT = {
  name: "Q3 Content Optimization",
  status: "Completed",
  pre: "Jul 1 – Jul 14",
  post: "Jul 15 – Jul 28",
  urls: 24,
  prompts: 40,
  providers: ["ChatGPT", "Gemini", "Perplexity"],
  opportunities: ["RCV", "Summarization", "TOC"],
};

export const CATEGORIES: Category[] = [
  {
    id: "citation",
    label: "Citation Visibility",
    metrics: [
      {
        id: "citation-rate",
        label: "Citation Rate",
        short: "Citation rate",
        unit: "percent",
        pre: 28,
        post: 41,
        definition:
          "How often your optimized URLs are cited as a source in AI answers.",
        calculation:
          "Executions where at least one optimized URL was cited ÷ total tracked executions.",
        views: ["absolute", "lift", "competitor", "control"],
        competitorFactor: 0.82,
        controlFactor: 0.9,
      },
      {
        id: "citation-lift",
        label: "Citation Lift",
        short: "Citation lift",
        unit: "pp",
        pre: 0,
        post: 13,
        definition: "Change in citation rate between the pre and post periods.",
        calculation: "Post citation rate − pre citation rate (+13pp, +46.4% relative).",
        views: ["lift", "competitor", "control"],
        competitorFactor: 0.25,
        controlFactor: 0.35,
        zeroLine: true,
      },
      {
        id: "citation-reach",
        label: "Citation Reach Rate",
        short: "Reach rate",
        unit: "percent",
        pre: 52,
        post: 68,
        definition:
          "Share of tracked prompts where your brand was cited at least once.",
        calculation: "Prompts with ≥1 citation ÷ tracked prompts.",
        views: ["absolute", "lift", "competitor"],
        competitorFactor: 0.86,
      },
      {
        id: "new-urls",
        label: "New URLs Cited",
        short: "New URLs",
        unit: "count",
        pre: 0,
        post: 7,
        definition: "Optimized URLs cited in the post period that were never cited before.",
        calculation: "Distinct URLs cited post − distinct URLs cited pre.",
        views: ["absolute", "lift"],
      },
    ],
  },
  {
    id: "coverage",
    label: "Content Coverage",
    notice: {
      text: "First understand how frequently optimized content appears, then examine how much of that content is captured.",
      steps: ["Citation", "Content Match", "Depth"],
    },
    metrics: [
      {
        id: "claim-citation-rate",
        label: "Claim Citation Rate",
        short: "Claim citation rate",
        unit: "percent",
        pre: 22,
        post: 57,
        definition: "How often specific claims from your content appear in AI answers.",
        calculation: "Executions containing ≥1 matched claim ÷ total executions.",
        views: ["absolute", "lift", "control"],
        controlFactor: 0.6,
      },
      {
        id: "claim-capture-rate",
        label: "Claim Capture Rate",
        short: "Claims captured",
        unit: "claims",
        pre: 1.3,
        post: 2.7,
        decimals: 1,
        definition: "Average number of your claims captured within a single AI answer.",
        calculation: "Total matched claims ÷ executions with a content match.",
        views: ["absolute", "lift"],
      },
      {
        id: "urls-content-match",
        label: "URLs with Content Match",
        short: "URLs matched",
        unit: "count",
        pre: 6,
        post: 16,
        definition: "Optimized URLs whose text is semantically reflected in AI answers.",
        calculation: "Distinct URLs with a semantic match score above 70%.",
        views: ["absolute", "lift"],
      },
    ],
  },
  {
    id: "mention",
    label: "Mention Visibility",
    metrics: [
      {
        id: "mention-rate",
        label: "Mention Rate",
        short: "Mention rate",
        unit: "percent",
        pre: 46,
        post: 54,
        definition: "How often your brand is named in AI answers, cited or not.",
        calculation: "Executions mentioning the brand ÷ total executions.",
        views: ["absolute", "lift", "competitor", "control"],
        competitorFactor: 0.93,
        controlFactor: 0.95,
      },
      {
        id: "mention-lift",
        label: "Mention Lift",
        short: "Mention lift",
        unit: "pp",
        pre: 0,
        post: 8,
        definition: "Change in mention rate between the pre and post periods.",
        calculation: "Post mention rate − pre mention rate.",
        views: ["lift", "competitor"],
        competitorFactor: 0.3,
        zeroLine: true,
      },
      {
        id: "mention-sov",
        label: "Mention Share of Voice",
        short: "Mention SOV",
        unit: "percent",
        pre: 31,
        post: 38,
        definition: "Your share of all brand mentions across tracked answers.",
        calculation: "Brand mentions ÷ all brand mentions (you + competitors).",
        views: ["absolute", "lift", "competitor"],
        competitorFactor: 0.78,
      },
    ],
  },
  {
    id: "share",
    label: "Citation Share",
    metrics: [
      {
        id: "citation-sov",
        label: "Citation Share of Voice",
        short: "Citation SOV",
        unit: "percent",
        pre: 24,
        post: 35,
        definition: "Your share of all cited sources across tracked answers.",
        calculation: "Your citations ÷ all citations in tracked answers.",
        views: ["absolute", "lift", "competitor"],
        competitorFactor: 0.8,
      },
      {
        id: "competitor-series",
        label: "Competitor comparison",
        short: "Competitor set",
        unit: "percent",
        pre: 24,
        post: 35,
        definition: "Your citation share plotted against Competitor A, B and C.",
        calculation: "Per-brand citations ÷ all citations, per period.",
        views: ["absolute", "competitor"],
      },
    ],
  },
  {
    id: "attribution",
    label: "Attribution",
    metrics: [
      {
        id: "did-competitor",
        label: "Treated vs Competitor",
        short: "DiD vs competitor",
        unit: "pp",
        pre: 0,
        post: 12,
        definition:
          "Difference-in-differences: your change minus the competitor's change.",
        calculation: "(Post − pre for treated) − (post − pre for competitor) = +12pp.",
        views: ["lift", "competitor"],
        competitorFactor: 0.2,
        zeroLine: true,
      },
      {
        id: "did-control",
        label: "Treated vs Within-Brand Control",
        short: "DiD vs control",
        unit: "pp",
        pre: 0,
        post: 12,
        definition:
          "Difference-in-differences against untouched pages on your own domain.",
        calculation: "(Post − pre for treated) − (post − pre for control) = +12pp.",
        views: ["lift", "control"],
        controlFactor: 0.22,
        zeroLine: true,
      },
      {
        id: "did-share",
        label: "Citation Share DiD",
        short: "Share DiD",
        unit: "pp",
        pre: 0,
        post: 8,
        definition: "Difference-in-differences applied to citation share of voice.",
        calculation: "Treated share change − control share change = +8pp.",
        views: ["lift", "competitor", "control"],
        competitorFactor: 0.2,
        controlFactor: 0.25,
        zeroLine: true,
      },
      {
        id: "did-mention",
        label: "Mention DiD",
        short: "Mention DiD",
        unit: "pp",
        pre: 0,
        post: 5,
        definition: "Difference-in-differences applied to brand mention rate.",
        calculation: "Treated mention change − control mention change = +5pp.",
        views: ["lift", "control"],
        controlFactor: 0.3,
        zeroLine: true,
      },
      {
        id: "placebo",
        label: "Placebo",
        short: "Placebo test",
        unit: "pp",
        pre: 0,
        post: 1,
        definition:
          "A falsification test on untouched pages — a near-zero result supports the finding.",
        calculation: "Same DiD math applied to a fake deployment date.",
        views: ["lift"],
        zeroLine: true,
      },
    ],
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    metrics: [
      {
        id: "citations-per-answer",
        label: "Citations per Answer",
        short: "Citations / answer",
        unit: "count",
        pre: 3.4,
        post: 4.1,
        decimals: 1,
        definition: "Average number of sources an AI answer cites.",
        calculation: "Total citations ÷ total executions.",
        views: ["absolute", "lift", "competitor"],
        competitorFactor: 0.95,
      },
      {
        id: "content-visibility",
        label: "Content Visibility",
        short: "Content visibility",
        unit: "percent",
        pre: 61,
        post: 94,
        definition: "Share of optimized content crawled and indexed by AI providers.",
        calculation: "Optimized URLs seen by providers ÷ optimized URLs published.",
        views: ["absolute", "lift"],
      },
    ],
  },
];

/* Deterministic jitter so SSR and client agree. */
function wobble(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 2;
}

export interface Point {
  date: string;
  phase: "Pre" | "Post";
  treated: number;
  competitor: number;
  control: number;
  compA: number;
  compB: number;
  compC: number;
  baseline: number;
  lift: number;
  executions: number;
}

export function buildSeries(metric: Metric, scale = 1): Point[] {
  const amp = metric.unit === "percent" ? 1.6 : metric.pre > 5 ? 0.4 : 0.12;
  const dec = metric.decimals ?? (metric.unit === "count" ? 0 : 0);
  const round = (n: number) => Number(n.toFixed(dec === 0 ? 1 : dec));

  return TIMELINE.map((date, i) => {
    const isPost = i >= POST_START_INDEX;
    const ramp = isPost ? Math.min(1, (i - POST_START_INDEX + 1) / 3) : 0;
    const base = metric.pre + (metric.post - metric.pre) * ramp;
    const noise = wobble(i + 1 + metric.id.length) * amp;
    const treated = Math.max(0, (base + noise) * scale);
    const cf = metric.competitorFactor ?? 0.85;
    const ctrl = metric.controlFactor ?? 0.92;
    const competitor =
      Math.max(0, metric.pre * cf + wobble(i + 7) * amp) * scale;
    const control = Math.max(0, metric.pre * ctrl + wobble(i + 13) * amp) * scale;
    return {
      date,
      phase: isPost ? "Post" : "Pre",
      treated: round(treated),
      competitor: round(competitor),
      control: round(control),
      compA: round(Math.max(0, 30 + wobble(i + 3) * 2 - ramp * 4)),
      compB: round(Math.max(0, 22 + wobble(i + 5) * 2 - ramp * 2)),
      compC: round(Math.max(0, 15 + wobble(i + 9) * 2)),
      baseline: round(metric.pre * scale),
      lift: round(treated - metric.pre * scale),
      executions: 110 + Math.round(wobble(i + 2) * 18) + (isPost ? 24 : 0),
    };
  });
}

export interface DriverRow {
  id: string;
  dimension: string;
  pre: number;
  post: number;
  executions: number;
}

export const BREAKDOWNS: { id: BreakdownId; label: string }[] = [
  { id: "overall", label: "Overall" },
  { id: "prompt", label: "Prompt" },
  { id: "url", label: "URL" },
  { id: "provider", label: "LLM Provider" },
  { id: "opportunity", label: "Opportunity" },
  { id: "competitor", label: "Competitor" },
];

const DRIVERS: Record<BreakdownId, { id: string; dimension: string; f: number; g: number; ex: number }[]> = {
  overall: [{ id: "all", dimension: "All optimized URLs", f: 1, g: 1, ex: 1240 }],
  prompt: [
    { id: "p1", dimension: "Best health insurance providers", f: 1.15, g: 1.32, ex: 186 },
    { id: "p2", dimension: "How to compare PPO vs HMO plans", f: 0.92, g: 1.18, ex: 154 },
    { id: "p3", dimension: "Cheapest family health coverage 2026", f: 1.04, g: 1.11, ex: 141 },
    { id: "p4", dimension: "What does dental insurance cover", f: 0.78, g: 0.86, ex: 128 },
    { id: "p5", dimension: "Medicare supplement plan guide", f: 0.88, g: 0.94, ex: 97 },
  ],
  url: [
    { id: "u1", dimension: "/guides/health-insurance-comparison", f: 1.22, g: 1.41, ex: 212 },
    { id: "u2", dimension: "/plans/ppo-vs-hmo", f: 1.06, g: 1.27, ex: 174 },
    { id: "u3", dimension: "/resources/family-coverage-costs", f: 0.95, g: 1.14, ex: 149 },
    { id: "u4", dimension: "/glossary/deductible", f: 0.71, g: 0.82, ex: 96 },
    { id: "u5", dimension: "/blog/open-enrollment-checklist", f: 0.84, g: 0.9, ex: 88 },
  ],
  provider: [
    { id: "chatgpt", dimension: "ChatGPT", f: 1.12, g: 1.3, ex: 512 },
    { id: "gemini", dimension: "Gemini", f: 0.95, g: 1.08, ex: 421 },
    { id: "perplexity", dimension: "Perplexity", f: 0.88, g: 1.02, ex: 307 },
  ],
  opportunity: [
    { id: "rcv", dimension: "RCV", f: 1.18, g: 1.36, ex: 468 },
    { id: "summarization", dimension: "Summarization", f: 0.97, g: 1.12, ex: 402 },
    { id: "toc", dimension: "TOC", f: 0.83, g: 0.91, ex: 370 },
  ],
  competitor: [
    { id: "ca", dimension: "Competitor A", f: 1.24, g: 1.05, ex: 388 },
    { id: "cb", dimension: "Competitor B", f: 0.9, g: 0.87, ex: 344 },
    { id: "cc", dimension: "Competitor C", f: 0.62, g: 0.6, ex: 291 },
  ],
};

export function driversFor(metric: Metric, breakdown: BreakdownId): DriverRow[] {
  const dec = metric.decimals ?? (metric.unit === "count" ? 0 : 0);
  const r = (n: number) => Number(n.toFixed(dec === 0 ? 1 : dec));
  return DRIVERS[breakdown].map((d) => ({
    id: d.id,
    dimension: d.dimension,
    pre: r(Math.max(0, metric.pre * d.f)),
    post: r(Math.max(0, metric.post * d.g)),
    executions: d.ex,
  }));
}

export interface Evidence {
  id: string;
  prompt: string;
  url: string;
  provider: string;
  deployed: string;
  match: number;
  response: { text: string; match?: boolean }[];
}

export const EVIDENCE: Evidence[] = [
  {
    id: "e1",
    prompt: "Best health insurance providers",
    url: "/guides/health-insurance-comparison",
    provider: "ChatGPT",
    deployed: "Jul 15, 2026",
    match: 91,
    response: [
      { text: "When comparing providers, the strongest plans balance premium cost with network breadth. " },
      { text: "A PPO typically costs 18–24% more per month than a comparable HMO, but removes referral requirements.", match: true },
      { text: " Independent guides also recommend checking the out-of-pocket maximum before the deductible, " },
      { text: "since the out-of-pocket maximum caps your total annual exposure regardless of plan tier.", match: true },
      { text: " Several comparison guides list these tradeoffs side by side." },
    ],
  },
  {
    id: "e2",
    prompt: "How to compare PPO vs HMO plans",
    url: "/plans/ppo-vs-hmo",
    provider: "Gemini",
    deployed: "Jul 15, 2026",
    match: 84,
    response: [
      { text: "The core difference is network flexibility. " },
      { text: "HMO plans require a primary care physician to coordinate referrals, while PPO plans allow direct specialist access.", match: true },
      { text: " For families that travel often, out-of-network coverage is usually the deciding factor. " },
      { text: "PPO plans reimburse a portion of out-of-network care; most HMO plans cover none outside emergencies.", match: true },
    ],
  },
  {
    id: "e3",
    prompt: "Cheapest family health coverage 2026",
    url: "/resources/family-coverage-costs",
    provider: "Perplexity",
    deployed: "Jul 15, 2026",
    match: 76,
    response: [
      { text: "Costs vary widely by state and household size. " },
      { text: "A bronze-tier family plan averages roughly $1,430 per month before subsidies in 2026.", match: true },
      { text: " Subsidy eligibility phases out gradually above four times the federal poverty level, so it's worth modelling both scenarios." },
    ],
  },
];

export function formatValue(v: number, unit: Unit, decimals?: number) {
  const d = decimals ?? (unit === "percent" || unit === "pp" ? 0 : unit === "claims" ? 1 : 0);
  const n = Number(v).toFixed(d);
  if (unit === "percent") return `${n}%`;
  if (unit === "pp") return `${Number(v) > 0 ? "+" : ""}${n}pp`;
  if (unit === "claims") return `${n} claims`;
  return n;
}
