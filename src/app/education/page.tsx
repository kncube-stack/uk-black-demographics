import { CensusCaveatBanner } from "@/components/census-caveat-banner";
import { EducationFsmChartShell } from "@/components/education-fsm-chart-shell";
import { EducationGcseChartShell } from "@/components/education-gcse-chart-shell";
import { EducationAlevelChartShell } from "@/components/education-alevel-chart-shell";
import { EducationQualificationsChartShell } from "@/components/education-qualifications-chart-shell";
import { EducationUniversityEntryChartShell } from "@/components/education-university-entry-chart-shell";
import { EducationDegreeResultsChartShell } from "@/components/education-degree-results-chart-shell";
import { EducationPhaseChartShell } from "@/components/education-phase-chart-shell";
import { EducationSuspensionRateChartShell } from "@/components/education-suspension-rate-chart-shell";
import { GeographicScopeBadge } from "@/components/geographic-scope-badge";
import { SourceCard } from "@/components/source-card";
import { SubcategoryGrid } from "@/components/subcategory-grid";
import { formatNumber, formatPercent } from "@/lib/format";
import { loadEducationPageData } from "@/lib/education-summary";
import { loadAttainmentPageData } from "@/lib/education-attainment-summary";
import { loadUniversityPageData } from "@/lib/education-university-summary";

export default async function EducationPage() {
  const [
    { latestLabel, previousLabel, metricRows, phaseRows, fsmRows, source },
    attainment,
    university,
  ] = await Promise.all([
    loadEducationPageData(),
    loadAttainmentPageData(),
    loadUniversityPageData(),
  ]);

  const allPupils = metricRows.find((row) => row.key === "all_ethnicities");
  const allBlackIncludingMixed = metricRows.find(
    (row) => row.key === "all_black_including_mixed"
  );
  const mixedWhiteBlackCaribbean = metricRows.find(
    (row) => row.key === "mixed_white_black_caribbean"
  );
  const blackCaribbean = metricRows.find((row) => row.key === "black_caribbean");

  if (
    !allPupils ||
    !allBlackIncludingMixed ||
    !mixedWhiteBlackCaribbean ||
    !blackCaribbean
  ) {
    throw new Error("Education summary is missing required comparison rows.");
  }

  return (
    <main className="px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_80px_rgba(19,31,22,0.08)]">
          <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-10">
            <div className="space-y-5">
              <div className="inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-white/65 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
                Education
              </div>
              <div className="max-w-3xl space-y-4">
                <h1 className="font-[family-name:var(--font-newsreader)] text-5xl leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-6xl">
                  School suspensions and exclusions by ethnic group.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                  Compare suspension and exclusion rates across Black Caribbean,
                  Black African, Other Black, and mixed White/Black pupils in
                  England — drawn from the latest Department for Education
                  release.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    White and Black Caribbean
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(mixedWhiteBlackCaribbean.suspensionRate, 2)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Suspension rate, {latestLabel}
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    Black Caribbean
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(blackCaribbean.suspensionRate, 2)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Suspension rate, {latestLabel}
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    All pupils
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(allPupils.suspensionRate, 2)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    England baseline
                  </p>
                </article>
                <article className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="text-sm font-medium text-[var(--muted)]">
                    All Black incl. mixed
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                    {formatPercent(allBlackIncludingMixed.suspensionRate, 2)}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {previousLabel
                      ? `${formatSignedDelta(
                          allBlackIncludingMixed.suspensionRateChange
                        )} vs ${previousLabel}`
                      : latestLabel}
                  </p>
                </article>
              </div>
            </div>

            <SourceCard
              metadata={source}
              eyebrow="Current release"
              downloadHref={source.apiEndpoint}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Latest ranking
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Suspension rates remain highest for White and Black Caribbean pupils
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Rates below are percentages of pupils in each group with published
              DfE ethnicity detail, using the latest available term in the live
              dataset.
            </p>
            <div className="mt-6">
              <EducationSuspensionRateChartShell data={metricRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Read this carefully
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              What this page does and does not claim
            </h2>
            <div className="mt-5 grid gap-3 text-sm leading-7 text-[var(--muted)]">
              <p>
                The live education slice currently covers England only, because
                that is how DfE exclusions statistics are published.
              </p>
              <p>
                The rate fields shown here are percentages of pupils in the group,
                not per-10,000 rates.
              </p>
              <p>
                White and Black Caribbean is not folded into a single Black bucket
                because it has a distinct published profile in DfE data.
              </p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              By school phase
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Secondary schools drive the highest rates
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Comparing broad phases shows how much suspension exposure changes
              across school contexts.
            </p>
            <div className="mt-6">
              <EducationPhaseChartShell data={phaseRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              By FSM eligibility
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Rates are materially higher for FSM-eligible pupils
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              The latest term shows a clear socio-economic gradient across both
              the all-pupil baseline and the highlighted Black-related groups.
            </p>
            <div className="mt-6">
              <EducationFsmChartShell data={fsmRows} />
            </div>
          </article>
        </section>

        <section className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Exact figures
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
            Latest national exclusion metrics by group
          </h2>
          <div className="mt-6 overflow-x-auto rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)]">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  <th className="px-4 py-3 font-semibold">Group</th>
                  <th className="px-4 py-3 font-semibold">Headcount</th>
                  <th className="px-4 py-3 font-semibold">Suspension rate</th>
                  <th className="px-4 py-3 font-semibold">Perm. excl. rate</th>
                  <th className="px-4 py-3 font-semibold">One+ suspension</th>
                  <th className="px-4 py-3 font-semibold">Change</th>
                </tr>
              </thead>
              <tbody>
                {metricRows
                  .slice()
                  .sort((left, right) => right.suspensionRate - left.suspensionRate)
                  .map((row) => (
                    <tr
                      key={row.key}
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{row.label}</td>
                      <td className="px-4 py-3">{formatNumber(row.headcount)}</td>
                      <td className="px-4 py-3">
                        {formatPercent(row.suspensionRate, 2)}
                      </td>
                      <td className="px-4 py-3">
                        {formatPercent(row.permanentExclusionRate, 3)}
                      </td>
                      <td className="px-4 py-3">{formatPercent(row.onePlusRate, 2)}</td>
                      <td className="px-4 py-3 text-[var(--muted)]">
                        {formatSignedDelta(row.suspensionRateChange)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              GCSE attainment <GeographicScopeBadge scope="England" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Attainment 8 scores by ethnic group
            </h2>
            <div className="mt-6">
              <EducationGcseChartShell data={attainment.gcseRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              A-Level achievement <GeographicScopeBadge scope="England" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Percentage achieving 3+ A grades at A-level
            </h2>
            <div className="mt-6">
              <EducationAlevelChartShell data={attainment.aLevelRows} />
            </div>
          </article>
        </section>

        <CensusCaveatBanner />

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Qualifications <GeographicScopeBadge scope="England & Wales" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Highest qualification level, Census 2021
            </h2>
            <div className="mt-6">
              <EducationQualificationsChartShell data={attainment.qualificationRows} />
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              University entry <GeographicScopeBadge scope="England" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Black university entry rate over time
            </h2>
            <div className="mt-6">
              <EducationUniversityEntryChartShell data={university.entryRows} />
            </div>
          </article>
        </section>

        <section>
          <article className="rounded-[30px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_50px_rgba(19,31,22,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Degree results <GeographicScopeBadge scope="England" />
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-newsreader)] text-3xl tracking-[-0.04em]">
              Undergraduate degree classifications: Black vs all students
            </h2>
            <div className="mt-6">
              <EducationDegreeResultsChartShell data={university.degreeRows} />
            </div>
          </article>
        </section>

        <SubcategoryGrid category="education" />
      </div>
    </main>
  );
}

function formatSignedDelta(value: number | null): string {
  if (value === null) {
    return "n/a";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)} pts`;
}
