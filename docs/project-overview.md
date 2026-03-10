# Project Overview

Last updated: 2026-03-10

## Purpose

UK Black Demographics is a citation-first public data product for Black life in the UK.

The project is built around four rules:

- use official UK sources first
- keep provenance, caveats, and publication timing visible beside the number
- keep Black African, Black Caribbean, Other Black, and mixed White/Black groups separate whenever the source allows
- be explicit about structural UK data gaps instead of smoothing over them with false precision

The long-run source inventory remains:

- [research/uk_black_demographics_data_sources.md](../research/uk_black_demographics_data_sources.md)

## Current Product State

The site is now a real public-facing reference product rather than a scaffold.

Live public routes:

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
- `/{category}/[subcategory]` for every configured topic page

Current production build status:

- 46 prerendered static routes
- `npm run data:sync` passes
- `npm run data:validate` passes
- `npm run lint` passes
- `npm run build` passes

## Information Architecture

Research structure still follows the six original pillars:

- Population
- Households
- Economics
- Education
- Health
- Culture & Geography

Public navigation now splits the old culture bucket into two clearer visitor-facing entry points:

- Justice & Policing
- Identity & Civic Life

The legacy `/culture-geography` route remains available so existing links still work and the stop-and-search build stays accessible.

## Coverage Model

The site now uses three clear topic states:

- `live`
  - full section or topic page with charts, exact figures, source metadata, and caveats
- `snapshot`
  - minimum viable official data card with a real headline figure, source, and download where available
- `coming-next`
  - explicit next-build state with a target window and source base, instead of an empty placeholder

This replaced the earlier placeholder-style topic presentation.

## Current Data Coverage

### Live charted sections

- Population
  - Census 2021 `TS021` totals, regions, and local authorities
  - Census 2021 `RM032` age and sex profile
- Households
  - Ethnicity Facts and Figures home ownership
- Economics
  - APS labour-market rates and occupation shares
- Education
  - DfE suspensions and exclusions
- Health
  - Mental Health Act detentions
- Justice & Policing
  - stop and search live build

### Snapshot-backed topics now in place

- Households
  - income
  - poverty
- Education
  - qualifications
  - GCSE & A-Level
  - university
- Health
  - maternal health
- Identity & Civic Life
  - politics
  - religion
  - heritage & migration
- Justice & Policing
  - crime
  - incarceration

### Explicit coming-next topics

- Households
  - marriage
  - wealth
- Economics
  - businesses
- Health
  - life expectancy
  - obesity
  - HIV & AIDS
  - COVID-19

## Current Headline Findings

These are the main public-facing findings currently surfaced on the site:

- Nearly `3.17 million` people in England and Wales identified as Black or in a mixed White/Black group in Census 2021.
- `39.1%` of the core Black population is aged `24 and under`, compared with a lower overall population share.
- Black home ownership stands at `24.3%`, versus `64.5%` for all households in England.
- `39.0%` of Black households are in the low-income measure, versus `21.0%` overall in the latest official three-year average.
- Black employment is `71.1%`, versus `75.5%` UK-wide in the latest APS release.
- Black state-school pupils enter higher education at `48.0%`, versus `34.3%` overall.
- White and Black Caribbean pupils have a `7.21%` suspension rate versus `4.00%` for all pupils in Autumn term 2024/25.
- Black maternal mortality is currently surfaced at `35.1 per 100,000`, `2.9x` the White rate in the MBRRACE-UK snapshot.
- Black stop-and-search rates are `24.5 per 1,000`, versus `8.9 per 1,000` overall.
- Black Christian affiliation stands at `67.0%`, versus `46.2%` across all people.

## UX Changes Landed In This Pass

- Homepage shortened and restructured around one hero, a key findings band, section cards, and geography
- new `/key-findings` page with shareable permalink anchors for each finding
- new `/search` page for keyword discovery across sections and topics
- new `/about` page explaining purpose and editorial stance
- navigation now points to Justice and Identity rather than the old broad Culture label
- source download links now surface more consistently on live pages
- topic pages now clearly distinguish `Live data`, `Data snapshot`, and `Coming next`

## Repository Structure

- `data/fetched/`
  - machine-fetched source datasets
- `data/manual/`
  - manually curated or hand-modeled source snapshots
- `data/derived/`
  - homepage and overview outputs
- `data/schemas/`
  - runtime dataset validation
- `docs/`
  - standing project documentation
- `research/`
  - source planning and evidence notes
- `scripts/`
  - fetch and transform scripts
- `src/app/`
  - Next.js routes
- `src/components/`
  - cards, charts, shared UI
- `src/lib/`
  - types, loaders, summaries, search index, findings, and topic-state logic

## Core Scripts

Development:

```bash
npm run dev
```

Verification:

```bash
npm run data:sync
npm run data:validate
npm run lint
npm run build
```

## Important Caveats

- Census `TS021` and `RM032` can differ slightly because disclosure control is applied independently across tables.
- APS labour-market percentages are currently a broad `Black or Black British` series, not subgroup-split Black African / Black Caribbean / Other Black.
- Home ownership is England-only and pooled over two years.
- Mental Health Act detention data has sparse subgroup history; unavailable published values stay unavailable.
- Maternal health, incarceration, and politics currently open with official snapshots rather than fully structured machine-fetched series.
- The UK still lacks routine ethnicity fields for several important domains, including death registrations, marriage registrations, and business registers.

## Near-Term Next Build Areas

- economics: add a fuller earnings/pay layer and then self-employment / business-owner proxy work
- education: add more geography and time-context tooling
- health: convert more snapshot topics into structured fetched datasets
- justice: extend beyond victimisation and prison snapshots into wider MoJ race statistics
- usability: keep improving mobile table handling and stat-level sharing/download affordances
