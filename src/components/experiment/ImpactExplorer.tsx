import { useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ChevronRight,
  Filter,
  Info,
  Minus,
  ScrollText,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import {
  BREAKDOWNS,
  CATEGORIES,
  DEPLOY_LABEL,
  EVIDENCE,
  EXPERIMENT,
  TIMELINE,
  buildSeries,
  driversFor,
  formatValue,
  type BreakdownId,
  type Metric,
  type ViewId,
} from "@/lib/experiment-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const VIEWS: { id: ViewId; label: string }[] = [
  { id: "absolute", label: "Absolute" },
  { id: "lift", label: "Lift" },
  { id: "competitor", label: "vs Competitor" },
  { id: "control", label: "vs Control" },
];

const SERIES_COLOR = {
  treated: "var(--color-chart-1)",
  competitor: "var(--color-chart-4)",
  control: "var(--color-chart-2)",
  compB: "var(--color-chart-3)",
  compC: "var(--color-chart-5)",
};

interface ActiveFilter {
  id: string;
  dimension: string;
  value: string;
}

export function ImpactExplorer() {
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const category = CATEGORIES.find((c) => c.id === categoryId)!;
  const [metricId, setMetricId] = useState(category.metrics[0].id);
  const metric: Metric =
    category.metrics.find((m) => m.id === metricId) ?? category.metrics[0];
  const [view, setView] = useState<ViewId>(metric.views[0]);
  const [breakdown, setBreakdown] = useState<BreakdownId>("overall");
  const [filters, setFilters] = useState<ActiveFilter[]>([]);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const activeView = metric.views.includes(view) ? view : metric.views[0];

  const scale = useMemo(
    () => 1 + filters.length * 0.06 - (filters.length ? 0.02 : 0),
    [filters.length],
  );
  const data = useMemo(() => buildSeries(metric, scale), [metric, scale]);
  const rows = useMemo(() => driversFor(metric, breakdown), [metric, breakdown]);

  const last = data[data.length - 1];
  const baseline = Number((metric.pre * scale).toFixed(metric.decimals ?? 1));
  const current = last.treated;
  const delta = Number((current - baseline).toFixed(1));
  const relative = baseline ? (delta / baseline) * 100 : 0;

  const selectCategory = (id: typeof categoryId) => {
    const next = CATEGORIES.find((c) => c.id === id)!;
    setCategoryId(id);
    setMetricId(next.metrics[0].id);
    setView(next.metrics[0].views[0]);
  };

  const selectMetric = (m: Metric) => {
    setMetricId(m.id);
    if (!m.views.includes(view)) setView(m.views[0]);
  };

  const addFilter = (dimension: string, value: string) => {
    const id = `${dimension}:${value}`;
    setFilters((f) => (f.some((x) => x.id === id) ? f : [...f, { id, dimension, value }]));
  };

  const showCompetitorSet = metric.id === "competitor-series";
  const showCompetitor = activeView === "competitor" || showCompetitorSet;
  const showControl = activeView === "control";
  const isLift = activeView === "lift";
  const valueKey = isLift ? "lift" : "treated";

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => selectCategory(c.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              c.id === categoryId
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {category.notice && (
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{category.notice.text}</p>
          <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-foreground">
            {category.notice.steps.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="rounded-md border border-border bg-background px-2 py-1">{s}</span>
                {i < category.notice!.steps.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metric pills */}
      <div className="flex flex-wrap gap-2">
        {category.metrics.map((m) => {
          const on = m.id === metric.id;
          return (
            <div
              key={m.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                on
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <button onClick={() => selectMetric(m)} className="font-medium">
                {m.label}
              </button>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatValue(m.pre, m.unit, m.decimals)} →{" "}
                {formatValue(m.post, m.unit, m.decimals)}
              </span>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    aria-label={`About ${m.label}`}
                    className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 text-sm">
                  <p className="font-semibold">{m.label}</p>
                  <p className="mt-1.5 text-muted-foreground">{m.definition}</p>
                  <Separator className="my-3" />
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    How it's calculated
                  </p>
                  <p className="mt-1 text-muted-foreground">{m.calculation}</p>
                </PopoverContent>
              </Popover>
            </div>
          );
        })}
      </div>

      {/* View selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Analytical view
        </span>
        {VIEWS.map((v) => {
          const enabled = metric.views.includes(v.id);
          return (
            <button
              key={v.id}
              disabled={!enabled}
              onClick={() => setView(v.id)}
              title={enabled ? undefined : `Not applicable for ${metric.label}`}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                v.id === activeView && enabled
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
                enabled ? "hover:bg-accent hover:text-foreground" : "cursor-not-allowed opacity-40",
                v.id === activeView && enabled && "hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* KPI tile */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {metric.label} · {VIEWS.find((v) => v.id === activeView)?.label}
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-semibold tabular-nums tracking-tight">
                {formatValue(isLift ? delta : current, metric.unit, metric.decimals)}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium",
                  delta > 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : delta < 0
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {delta > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : delta < 0 ? (
                  <TrendingDown className="h-3.5 w-3.5" />
                ) : (
                  <Minus className="h-3.5 w-3.5" />
                )}
                {delta > 0 ? "+" : ""}
                {delta}
                {metric.unit === "percent" || metric.unit === "pp" ? "pp" : ""}
                {baseline ? ` / ${relative > 0 ? "+" : ""}${relative.toFixed(1)}%` : ""}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Baseline (pre)</p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatValue(baseline, metric.unit, metric.decimals)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Post period</p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatValue(current, metric.unit, metric.decimals)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Comparison</p>
              <p className="mt-1 flex items-center gap-1 font-semibold">
                {EXPERIMENT.pre.split(" – ")[0]}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                {EXPERIMENT.post.split(" – ")[1]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">{metric.label} over time</h2>
            <p className="text-sm text-muted-foreground">
              Pre and post periods shaded; optimization deployed {DEPLOY_LABEL}.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setEvidenceOpen(true)}>
            <ScrollText className="mr-1.5 h-4 w-4" />
            View evidence
          </Button>
        </div>
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 16, right: 16, bottom: 8, left: 0 }}>
              <defs>
                <linearGradient id="treatedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES_COLOR.treated} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={SERIES_COLOR.treated} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <ReferenceArea
                x1={TIMELINE[0]}
                x2={DEPLOY_LABEL}
                fill="var(--color-muted)"
                fillOpacity={0.55}
              />
              <ReferenceArea
                x1={DEPLOY_LABEL}
                x2={TIMELINE[TIMELINE.length - 1]}
                fill="var(--color-chart-1)"
                fillOpacity={0.05}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                width={48}
              />
              {metric.zeroLine && (
                <ReferenceLine y={0} stroke="var(--color-muted-foreground)" strokeWidth={1} />
              )}
              <ReferenceLine
                x={DEPLOY_LABEL}
                stroke="var(--color-chart-1)"
                strokeDasharray="4 4"
                label={{
                  value: "Optimization deployed",
                  position: "insideTopRight",
                  fill: "var(--color-muted-foreground)",
                  fontSize: 11,
                }}
              />
              <Tooltip
                content={(props) => (
                  <ChartTooltip {...props} metric={metric} isLift={isLift} />
                )}
              />
              <Area
                type="monotone"
                dataKey={valueKey}
                stroke="none"
                fill="url(#treatedFill)"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey={valueKey}
                name="Treated (optimized URLs)"
                stroke={SERIES_COLOR.treated}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
              {showCompetitor && !showCompetitorSet && (
                <Line
                  type="monotone"
                  dataKey="competitor"
                  name="Competitor"
                  stroke={SERIES_COLOR.competitor}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
              )}
              {showCompetitorSet && (
                <>
                  <Line type="monotone" dataKey="compA" name="Competitor A" stroke={SERIES_COLOR.competitor} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="compB" name="Competitor B" stroke={SERIES_COLOR.compB} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="compC" name="Competitor C" stroke={SERIES_COLOR.compC} strokeWidth={2} dot={false} />
                </>
              )}
              {showControl && (
                <Line
                  type="monotone"
                  dataKey="control"
                  name="Within-brand control"
                  stroke={SERIES_COLOR.control}
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <Legend color={SERIES_COLOR.treated} label="Treated (optimized URLs)" />
          {showCompetitor && !showCompetitorSet && (
            <Legend color={SERIES_COLOR.competitor} label="Competitor" dashed />
          )}
          {showCompetitorSet && (
            <>
              <Legend color={SERIES_COLOR.competitor} label="Competitor A" />
              <Legend color={SERIES_COLOR.compB} label="Competitor B" />
              <Legend color={SERIES_COLOR.compC} label="Competitor C" />
            </>
          )}
          {showControl && <Legend color={SERIES_COLOR.control} label="Within-brand control" dashed />}
        </div>
      </div>

      {/* Breakdown + filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Breakdown by
        </span>
        {BREAKDOWNS.map((b) => (
          <button
            key={b.id}
            onClick={() => setBreakdown(b.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              b.id === breakdown
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {b.label}
          </button>
        ))}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Active filters
          </span>
          {filters.map((f) => (
            <Badge key={f.id} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1.5">
              <span className="font-normal text-muted-foreground">{f.dimension}:</span>
              {f.value}
              <button
                aria-label={`Remove ${f.value}`}
                onClick={() => setFilters((x) => x.filter((y) => y.id !== f.id))}
                className="rounded-full p-0.5 hover:bg-background"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setFilters([])}>
            Clear all
          </Button>
        </div>
      )}

      {/* Top drivers */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Top drivers</h2>
            <p className="text-sm text-muted-foreground">
              {metric.label} by {BREAKDOWNS.find((b) => b.id === breakdown)?.label.toLowerCase()}
            </p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dimension</TableHead>
              <TableHead className="text-right">Pre</TableHead>
              <TableHead className="text-right">Post</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Executions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => {
              const change = Number((r.post - r.pre).toFixed(1));
              return (
                <TableRow
                  key={r.id}
                  className="cursor-pointer"
                  onClick={() =>
                    addFilter(BREAKDOWNS.find((b) => b.id === breakdown)!.label, r.dimension)
                  }
                >
                  <TableCell className="font-medium">{r.dimension}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatValue(r.pre, metric.unit, metric.decimals)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatValue(r.post, metric.unit, metric.decimals)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right tabular-nums font-medium",
                      change > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : change < 0
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    {change > 0 ? "+" : ""}
                    {change}
                    {metric.unit === "percent" || metric.unit === "pp" ? "pp" : ""}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {r.executions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addFilter(
                            BREAKDOWNS.find((b) => b.id === breakdown)!.label,
                            r.dimension,
                          );
                        }}
                      >
                        <Filter className="mr-1 h-3.5 w-3.5" />
                        Filter
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEvidenceOpen(true);
                        }}
                      >
                        View evidence
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Sheet open={evidenceOpen} onOpenChange={setEvidenceOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Evidence</SheetTitle>
            <SheetDescription>
              Sample AI executions with semantic matches against your optimized content.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-8">
            {EVIDENCE.map((e) => (
              <div key={e.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{e.prompt}</p>
                  <Badge className="shrink-0 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400">
                    {e.match}% Match
                  </Badge>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                  <div>
                    <dt className="text-muted-foreground">URL</dt>
                    <dd className="truncate font-medium">{e.url}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">LLM provider</dt>
                    <dd className="font-medium">{e.provider}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Optimization deployed</dt>
                    <dd className="font-medium">{e.deployed}</dd>
                  </div>
                </dl>
                <p className="mt-3 rounded-md bg-muted/60 p-3 text-sm leading-relaxed">
                  {e.response.map((part, i) => (
                    <span
                      key={i}
                      className={cn(
                        part.match &&
                          "rounded bg-emerald-500/15 px-0.5 font-medium text-emerald-800 dark:text-emerald-300",
                      )}
                    >
                      {part.text}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block h-0.5 w-5 rounded"
        style={{
          backgroundColor: dashed ? "transparent" : color,
          borderTop: dashed ? `2px dashed ${color}` : undefined,
        }}
      />
      {label}
    </span>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  metric,
  isLift,
}: {
  active?: boolean;
  payload?: { payload: Record<string, number | string> }[];
  label?: string;
  metric: Metric;
  isLift: boolean;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload as Record<string, number | string>;
  const value = Number(isLift ? p.lift : p.treated);
  const baseline = Number(p.baseline);
  const lift = Number(p.lift);
  return (
    <div className="min-w-56 rounded-lg border border-border bg-popover p-3 text-xs shadow-md">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-popover-foreground">{label}</span>
        <Badge variant={p.phase === "Post" ? "default" : "secondary"} className="text-[10px]">
          {p.phase} period
        </Badge>
      </div>
      <Separator className="my-2" />
      <Row label={metric.label} value={formatValue(value, metric.unit, metric.decimals)} strong />
      <Row label="Baseline" value={formatValue(baseline, metric.unit, metric.decimals)} />
      <Row
        label="Lift vs baseline"
        value={`${lift > 0 ? "+" : ""}${lift}${metric.unit === "percent" || metric.unit === "pp" ? "pp" : ""}`}
      />
      <Row label="Executions" value={String(p.executions)} />
      <Separator className="my-2" />
      <Row
        label="vs Competitor"
        value={`${(Number(p.treated) - Number(p.competitor)).toFixed(1)}`}
      />
      <Row label="vs Control" value={`${(Number(p.treated) - Number(p.control)).toFixed(1)}`} />
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("tabular-nums", strong && "font-semibold")}>{value}</span>
    </div>
  );
}
