# UK Black Demographics

Official, citation-grade UK demographic data focused on Black British populations and related mixed White/Black groups.

Project documentation:

- [docs/project-overview.md](docs/project-overview.md)

## Current Live Routes

- `/`
- `/key-findings`
- `/search`
- `/about`
- `/population`
- `/households`
- `/economics`
- `/education`
- `/health`
- `/justice-policing`
- `/identity-civic-life`
- `/culture-geography` as a legacy bridge route
- `/methodology`
- `/{category}/[subcategory]` for every configured category and subcategory

The current production build prerenders 46 static routes.

## Current Data Coverage

Implemented charted slices now:

- Population
  - ONS Census 2021 `TS021` totals, regions, and local authorities
  - ONS Census 2021 `RM032` age and sex breakdowns
- Households
  - Ethnicity Facts and Figures home ownership release for England
- Economics
  - ONS Annual Population Survey via Nomis `NM_17_5`
  - UK labour-market rates for Black or Black British and all ethnicities
  - regional employment comparisons, sex split, and occupation shares
- Education
  - DfE suspensions and permanent exclusions national characteristic extract
  - ethnicity, education phase, FSM eligibility, counts, and rates
- Health
  - Ethnicity Facts and Figures detentions under the Mental Health Act for England
- Justice & Policing
  - Ethnicity Facts and Figures stop and search release for England and Wales
- Identity & Civic Life
  - Census 2021 religion and country-of-birth snapshots
- Key Findings / Search / About
  - public entry pages for discovery, citation, and project context
- Methodology
  - source registry generated from live datasets

Remaining topic pages are now either `snapshot` pages with a real official headline figure or explicit `coming-next` pages with a target window and mapped source base.

## Research

The main source inventory lives at [research/uk_black_demographics_data_sources.md](research/uk_black_demographics_data_sources.md).

## Data Workflow

Raw and curated datasets live under `data/`.

- `data/fetched/`: machine-fetched source datasets
- `data/manual/`: manually curated datasets for sources that do not expose structured downloads
- `data/derived/`: homepage and section summary data derived from fetched/manual datasets
- `data/schemas/`: Zod schemas and validation scripts

## Scripts

```bash
npm run dev
npm run lint
npm run data:validate
npm run fetch:population
npm run fetch:households
npm run fetch:households:supplemental
npm run fetch:economics
npm run fetch:education
npm run fetch:health
npm run fetch:culture
npm run fetch:census-topics
npm run build:derived
npm run data:sync
npm run build
```

## Build Principles

- Use official UK sources first
- Keep provenance and caveats attached to every dataset
- Prefer the most disaggregated ethnic breakdown available
- Be explicit about structural UK data gaps where ethnicity is not collected directly
- Treat the methodology and source pages as part of the product, not optional extras
- Prefer honest unavailable states over synthetic or over-smoothed figures
