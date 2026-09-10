import { createFileRoute } from "@tanstack/react-router";

import { ImpactExplorer } from "@/components/experiment/ImpactExplorer";
import { EXPERIMENT } from "@/lib/experiment-data";
import { Badge } from "@/components/ui/badge";

const TITLE = "Experiment Impact Explorer | AI Visibility Analytics";
const DESCRIPTION =
  "Measure how content optimization changed citation visibility, content coverage, and brand presence across ChatGPT, Gemini, and Perplexity answers.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function ContextItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Experiment Impact</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Understand how optimization affected citation visibility, content coverage, and brand
            presence across AI responses.
          </p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          <ContextItem label="Experiment" value={EXPERIMENT.name} />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Status
            </span>
            <Badge className="w-fit bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
              {EXPERIMENT.status}
            </Badge>
          </div>
          <ContextItem label="Pre period" value={EXPERIMENT.pre} />
          <ContextItem label="Post period" value={EXPERIMENT.post} />
          <ContextItem label="Optimized URLs" value={String(EXPERIMENT.urls)} />
          <ContextItem label="Tracked prompts" value={String(EXPERIMENT.prompts)} />
          <ContextItem label="LLM providers" value={EXPERIMENT.providers.join(", ")} />
          <ContextItem label="Opportunity types" value={EXPERIMENT.opportunities.join(", ")} />
        </section>

        <section className="mt-8">
          <ImpactExplorer />
        </section>
      </div>
    </main>
  );
}
