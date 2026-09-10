# Impact Explorer Suite

Build an interactive Experiment Impact Explorer for an enterprise AI visibility and content optimization analytics platform.

Key specifications to implement:

1. Header & Experiment Context:
- Title: "Experiment Impact", Subtitle: "Understand how optimization affected citation visibility, content coverage, and brand presence across AI responses."
- Context bar: Experiment: Q3 Content Optimization | Status: Completed | Pre period: Jul 1–Jul 14 | Post period: Jul 15–Jul 28 | Optimized URLs: 24 | Tracked prompts: 40 | LLM providers: ChatGPT, Gemini, Perplexity | Opportunity types: RCV, Summarization, TOC.

2. Impact Explorer Component:
- Category Tabs: Citation Visibility (default), Content Coverage, Mention Visibility, Citation Share, Attribution, Diagnostics.
- Contextual hierarchy notice for Content Coverage: "First understand how frequently optimized content appears, then examine how much of that content is captured." (Citation → Content Match → Depth).
- Metric Selector pills per category:
  * Citation Visibility: Citation Rate (28%→41%), Citation Lift (+13pp / +46.4%), Citation Reach Rate (52%→68%), New URLs Cited (0→7).
  * Content Coverage: Claim Citation Rate (22%→57%), Claim Capture Rate (1.3→2.7 claims), URLs with Content Match (6→16).
  * Mention Visibility: Mention Rate (46%→54%), Mention Lift (+8pp), Mention Share of Voice (31%→38%).
  * Citation Share: Citation Share of Voice (24%→35%), Competitor comparison series (Competitor A, B, C).
  * Attribution: Treated vs Competitor (DiD: +12pp), Treated vs Within-Brand Control (DiD: +12pp), Citation Share DiD (+8pp), Mention DiD (+5pp), Placebo (+1pp). Includes horizontal 0 reference line.
  * Diagnostics: Citations per Answer (3.4→4.1), Content Visibility (61%→94%).
- Metric info icon with popover tooltip showing friendly definition and calculation explanation.

3. Analytical View Selector:
- Pills: [Absolute] [Lift] [vs Competitor] [vs Control].
- Automatically enable/disable views based on mathematical applicability to the chosen metric.

4. Dynamic KPI Summary:
- Responsive single KPI tile above chart displaying current value, baseline, delta (+pp or %), and pre/post comparison.

5. Interactive Main Line Chart (Recharts):
- X-axis timeline: Jul 1, Jul 4, Jul 7, Jul 10, Jul 14, Jul 17, Jul 20, Jul 23, Jul 26, Jul 28.
- Vertical reference line & annotation: "Optimization deployed" (Jul 15).
- Subtle background shading to distinguish Pre and Post periods.
- Series lines for Treated (Optimized URLs), Competitor, Within-brand control, or breakdown lines.
- Rich hover tooltip with date, phase (Pre/Post), metric value, baseline, lift, executions, and comparison differences.

6. Breakdown Controls & Active Filters:
- Breakdown by: [Overall] [Prompt] [URL] [LLM Provider] [Opportunity] [Competitor].
- Active filter chips with removal (e.g. "Prompt: Best health insurance providers ×", "Provider: ChatGPT ×") and "Clear all" button.
- Clicking series or table rows updates active filters.

7. Top Drivers Table:
- Dimension, Pre, Post, Change, Executions, and "Filter" / "View Evidence" action.
- Updates dynamically when breakdown dimension switches.

8. Evidence Drawer / Sheet:
- "View evidence" trigger button and drawer displaying sample AI executions:
  * Prompt, URL, LLM Provider, Optimization deployed.
  * AI response text with highlighted semantic matches against optimized content.
  * Content Match % score badge (e.g. 91% Match).

9. Enterprise SaaS UI:
- Clean, refined enterprise styling (Tailwind, Lucide icons, shadcn/ui components). Responsive state management ensuring all charts, tables, KPIs, and tooltips stay in sync. Realistic mock data across all dimensions and categories.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5a905ee6-3016-4169-bfca-c4af29380f45).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
