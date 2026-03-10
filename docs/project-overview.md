# Project Overview

Last updated: 2026-03-10

## Purpose

UK Black Demographics is a citation-grade data product for Black British demographics, built from official UK sources wherever possible.

The core rule is that the platform should not treat "Black" as one undifferentiated category when the source allows more detail. The current canonical tracked groups are:

- `black_african`
- `black_caribbean`
- `other_black`
- `mixed_white_black_caribbean`
- `mixed_white_black_african`
- `all_black`
- `all_black_including_mixed`

The project is designed to mirror the clarity of products like `blackdemographics.com`, but for the UK statistical system and its constraints.

## Current Status

The project is now a real multi-section site rather than a scaffold. As of 2026-03-10:

- The homepage route `/` is live and renders real data.
- All six top-level category routes are live: `/population`, `/households`, `/economics`, `/education`, `/health`, `/culture-geography`.
- The methodology route `/methodology` is live and exposes implemented publications, caveats, and source links.
- Every category now has statically generated subcategory pages under `/{category}/[subcategory]`.
- Some subcategory pages are fully data-backed today; the rest are source-backed briefing pages with official links, caveats, and next-build guidance.
- The current production build prerenders 41 static routes.
- `npm run data:sync`, `npm run data:validate`, `npm run lint`, and `npm run build` all pass.

Current charted live slices:

- Population
  - ONS Census 2021 `TS021` totals, regions, and local authorities
  - ONS Census 2021 `RM032` age and sex breakdowns
- Households
  - Ethnicity Facts and Figures home ownership release for England
- Economics
  - ONS Annual Population Survey via Nomis `NM_17_5`
- Education
  - DfE suspensions and permanent exclusions national characteristic extract
- Health
  - Ethnicity Facts and Figures detentions under the Mental Health Act for England
- Culture & Geography
  - Ethnicity Facts and Figures stop and search release for England and Wales

Current snapshot from the live population slice:

- Core Black population in England and Wales: `2,409,279`
- Female share of the core Black population: `52.6%`
- Largest age band for the core Black population: `24 and under`
- Share of the core Black population aged 24 and under: `39.1%`

Current snapshot from the live households slice:

- Latest live release: `2021-22, 2022-23`
- All Black home ownership rate: `24.3%`
- All-households England baseline: `64.5%`
- Black Caribbean home ownership rate: `31.3%`
- The live housing slice is England-only and uses a pooled two-year estimate

Current snapshot from the live economics slice:

- Latest live release: `Oct 2024-Sep 2025`
- Black employment rate: `71.1%`
- UK all-ethnicities employment rate: `75.5%`
- Black unemployment rate: `8.2%`
- Black inactivity rate: `22.5%`
- Highest published regional Black employment rate: `South East, 80.0%`
- Largest published occupation shares for employed Black workers: `Professional 23.8%`, `Caring and leisure 23.5%`

Current snapshot from the live education slice:

- Latest live release: `Autumn term 2024/25`
- White and Black Caribbean suspension rate: `7.21%`
- Black Caribbean suspension rate: `5.10%`
- All-pupil England suspension rate: `4.00%`
- All Black including mixed suspension rate: `3.39%`
- White and Black Caribbean suspension rate in state-funded secondary schools: `14.20%`
- White and Black Caribbean suspension rate for FSM-eligible pupils: `11.19%`

Current snapshot from the live health slice:

- Latest live release: `2022/23`
- All Black Mental Health Act detention rate: `227.9` per 100,000
- Black Caribbean detention rate: `222.8` per 100,000
- Other Black detention rate: `715.4` per 100,000
- The source publishes sparse subgroup time series outside `Other Black`, so historical gaps are shown as unavailable rather than filled in

Current snapshot from the live culture and geography slice:

- Latest live release: `2022/23`
- All Black stop and search rate: `24.5` per 1,000
- Overall England and Wales rate: `8.9` per 1,000
- Published Black disproportionality ratio: `2.8x`
- Black Caribbean stop and search rate: `20.9` per 1,000

Important live caveats:

- `TS021` and `RM032` can differ by a handful of counts because Census tables apply disclosure control and perturbation separately. The `/population` page uses `RM032` consistently for age/sex-derived totals, while the homepage headline uses `TS021`.
- In the current live APS percentages route, labour-market rates are only published as a broad `Black or Black British` series for this measure set. The `/economics` page makes that limitation explicit rather than implying subgroup precision that is not available.
- The live households slice currently covers England only and uses a pooled two-year release.
- The live health slice currently covers England only, and the latest publication does not expose every subgroup denominator consistently.
- The live culture and geography slice currently covers national stop and search only, using all-force England and Wales rows including BTP.

## Product Scope

Target sections:

- Population
- Households
- Economics
- Education
- Health
- Culture & Geography

All six sections are now present in the site structure.

Current implementation model:

- Category pages are live and navigable.
- Live/charted subcategories currently include:
  - Population: `total`, `by-region`, `by-local-authority`, `male`, `female`, `age-distribution`
  - Households: `housing`
  - Economics: `employment`, `unemployment`
  - Education: `exclusions`
  - Health: `mental-health`
  - Culture & Geography: `stop-search`
- Remaining subcategories are source-backed route pages rather than empty placeholders.

## Data Principles

- Use official UK sources first.
- Keep provenance, methodology, and caveats on every dataset.
- Prefer the most disaggregated ethnic breakdown available.
- Preserve structural UK data gaps rather than hiding them with false precision.
- Distinguish primary-source facts from derived aggregates.

## Research Source of Truth

The main source inventory is:

- [research/uk_black_demographics_data_sources.md](../research/uk_black_demographics_data_sources.md)

That file catalogs the intended long-run source base across all categories and notes structural UK gaps such as:

- no ethnicity on death certificates
- no ethnicity on marriage registrations
- no official business register by owner ethnicity
- no official government dataset for MPs/councillors by ethnicity

## Technical Architecture

### Frontend

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS v4 plus custom CSS variables
- Charts: Recharts

Current app routes:

- `/`
- `/population`
- `/households`
- `/economics`
- `/education`
- `/health`
- `/culture-geography`
- `/methodology`
- `/{category}/[subcategory]` for every configured category and subcategory

### Data Model

Core project types live in:

- [src/lib/types.ts](../src/lib/types.ts)

Important model choices:

- every dataset has source metadata
- every observation is normalized by geography, time, ethnicity, and optional age/sex/category dimensions
- dataset-specific dimensions beyond the core model are stored in `observation.attributes`
- derived aggregates like `all_black` are produced in-project, not assumed to exist upstream
- source-backed topic routes are modeled separately from fetched datasets so the site can stay complete without inventing data coverage

### Data Validation

Dataset schema:

- [data/schemas/dataset.schema.ts](../data/schemas/dataset.schema.ts)

Validation script:

- [data/schemas/validate.ts](../data/schemas/validate.ts)

### Data Fetch / Transform

Current fetch pipeline:

- [scripts/fetch-nomis-population.ts](../scripts/fetch-nomis-population.ts)
- [scripts/fetch-eff-households.ts](../scripts/fetch-eff-households.ts)
- [scripts/fetch-nomis-economics.ts](../scripts/fetch-nomis-economics.ts)
- [scripts/fetch-dfe-education.ts](../scripts/fetch-dfe-education.ts)
- [scripts/fetch-eff-health.ts](../scripts/fetch-eff-health.ts)
- [scripts/fetch-eff-culture.ts](../scripts/fetch-eff-culture.ts)
- [scripts/build-derived.ts](../scripts/build-derived.ts)

Loader and summary logic:

- [src/lib/data-loader.ts](../src/lib/data-loader.ts)
- [src/lib/population-summary.ts](../src/lib/population-summary.ts)
- [src/lib/households-summary.ts](../src/lib/households-summary.ts)
- [src/lib/economics-summary.ts](../src/lib/economics-summary.ts)
- [src/lib/education-summary.ts](../src/lib/education-summary.ts)
- [src/lib/health-summary.ts](../src/lib/health-summary.ts)
- [src/lib/culture-summary.ts](../src/lib/culture-summary.ts)
- [src/lib/topic-guides.ts](../src/lib/topic-guides.ts)
- [src/lib/topic-snapshots.ts](../src/lib/topic-snapshots.ts)
- [src/lib/source-registry.ts](../src/lib/source-registry.ts)

## Repository Layout

Relevant directories:

- `data/fetched/`
  - machine-fetched source datasets
- `data/manual/`
  - manually curated datasets for sources without structured exports
- `data/derived/`
  - homepage and section summary data derived from fetched/manual datasets
- `data/schemas/`
  - runtime validation
- `docs/`
  - standing project documentation
- `research/`
  - source planning and research notes
- `scripts/`
  - fetch and transform scripts
- `src/app/`
  - Next.js routes
- `src/components/`
  - reusable UI and chart shells
- `src/lib/`
  - types, formatters, loaders, constants, source registries, and summary logic

## Current Commands

Development:

```bash
npm run dev
```

Data:

```bash
npm run fetch:population
npm run fetch:households
npm run fetch:economics
npm run fetch:education
npm run fetch:health
npm run fetch:culture
npm run build:derived
npm run data:sync
npm run data:validate
```

Quality / production:

```bash
npm run lint
npm run build
```

## What Is Implemented Right Now

Homepage:

- editorial, visitor-facing hero built around the big-picture population figure
- latest official snapshot cards for all six categories
- guided topic-entry cards for the most common questions visitors ask
- regional population chart
- top local-authority table
- public-facing citation and methodology framing rather than build-status language

Population page:

- age profile comparison chart
- sex composition chart
- subgroup summary cards
- exact figures tables and source context

Households page:

- latest home-ownership ranking chart
- exact figures table with counts and rates
- England-only pooled-period caveat handling
- subcategory grid linking into live and source-backed topic pages

Economics page:

- APS labour-market comparison chart for Black vs all ethnicities
- regional employment chart with confidence-margin tooltip context
- occupation-share chart across SOC major groups
- sex split cards
- exact national and regional tables
- shared citation guidance block

Education page:

- latest-term suspension-rate ranking chart
- phase comparison chart
- FSM comparison chart
- exact national metrics table
- shared source card with caveats and methodology link

Health page:

- latest subgroup ranking chart
- published time-series chart with honest gaps where the official source is sparse
- exact figures table with unpublished denominators shown as `n/a`
- source and citation framing for Mental Health Act detentions

Culture & Geography page:

- long-run stop and search trend chart
- latest subgroup ranking chart
- legislation split cards for `Section 1 (PACE)` and `Section 60 (CJPOA)`
- exact figures table plus citation block

Topic guide pages:

- every configured subcategory now has a route
- live topics show snapshot stats and a pointer back to the charted section
- source-backed topics show official source links, core caveats, and scope notes instead of empty placeholders

Methodology page:

- implemented source registry generated from live datasets
- citation-oriented source cards by publication
- clear project rules for provenance and disaggregation

## Important Decisions Already Made

- The live official Nomis dataset for ethnicity by sex by age is `RM032`.
- The repo research note has been corrected to reflect that.
- Population totals by geography come from `TS021`.
- Population age/sex structure comes from `RM032`.
- The first households slice uses the official Ethnicity Facts and Figures home-ownership release and derives `all_black` aggregates from published subgroup counts rather than averaging percentages.
- The first education slice uses the stable Explore Education Statistics data-catalogue extract for suspensions and permanent exclusions in England.
- The first economics slice uses Nomis APS dataset `NM_17_5`.
- The current live APS implementation is broad-group only for labour-market rates, because the machine-readable percentage dataset does not expose Black African, Black Caribbean, and Other Black separately for these measures.
- Regional APS figures are live, but local-authority APS economics figures are intentionally held back for now because confidence margins are too weak for a citation-grade first release.
- The education implementation keeps national rows first, then derives `all_black` and `all_black_including_mixed` from published DfE counts.
- Education rates in the current DfE characteristic extract are percentages, not per-10,000 values.
- The first health slice keeps the official standardised detention rate as the primary comparison measure and does not derive missing subgroup denominators from rounded crude-rate values.
- The first culture and geography slice uses the official all-force England and Wales stop-and-search release and keeps legislation splits visible.
- Every subcategory now has a route, even where the underlying dataset is not yet implemented.
- Derived pages should use a single source consistently for any one analytical view.
- Client-only chart loading is handled through client wrapper components, not directly inside server route files.
- A public methodology route is part of the product, not just internal documentation.

## Recommended Next Steps

The next sensible work items are:

1. Expand households into low income and poverty using HBAI plus Ethnicity Facts and Figures, keeping England/UK coverage distinctions explicit.
2. Extend education beyond the national characteristic extract, especially region and local-authority exclusions from the wider DfE release files.
3. Extend economics into self-employment and business-ownership proxy work, while keeping the current broad-group limitation explicit.
4. Add the next health slices with the strongest official evidence base: life expectancy, HIV, and maternal health.
5. Add deeper culture and geography slices, especially religion, heritage and migration, and incarceration.
6. Add tests around derived aggregate correctness, sparse-series handling, and latest-release selection logic.

## Definition of Done for Future Slices

A charted category or subcategory should not be treated as live until it has all of the following:

- at least one official source fetched or entered into `data/`
- schema-valid dataset files
- derived summaries where needed
- a real route or visible UI surface
- documented caveats and provenance
- exact figures exposed alongside the visual treatment
- passing `npm run data:validate`, `npm run lint`, and `npm run build`
