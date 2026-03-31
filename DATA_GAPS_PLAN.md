# Data Gaps & Roadmap

An audit of every dataset in the site, what's missing, and a proposed plan to close the gaps.

---

## Current data maturity

| Category | Live (charts) | Snapshot (headline only) | Coming next | Completeness |
|---|---|---|---|---|
| **Population** | 6/6 | 0 | 0 | 100% |
| **Economics** | 2/3 | 0 | 1 | 67% |
| **Education** | 1/4 | 3 | 0 | 25% live |
| **Health** | 1/6 | 1 | 4 | 17% live |
| **Households** | 1/5 | 3 | 1 | 20% live |
| **Culture & Geography** | 1/7 | 6 | 0 | 14% live |

---

## Gap 1 — Snapshot topics that could be promoted to live

These topics already have data files but only show a single headline figure. Promoting them to full pages with charts and tables would add significant depth.

| Topic | Current data file | What's needed |
|---|---|---|
| GCSE & A-level attainment | `gcse-attainment-national.json`, `a-level-achievement-national.json` | Build chart components, add time-series if EFF publishes history |
| University entry & degree results | `university-entry-national.json`, `undergraduate-degree-results-national.json` | Same — chart build + subgroup comparison |
| Census 2021 qualifications | `census-2021-qualifications-national.json` | Age-group cross-tab would enrich the page |
| Low-income households | `low-income-households-national.json` | Chart build, add subgroup comparison vs baseline |
| Religion | `census-2021-religion-national.json` | Subgroup bar chart, comparison with national profile |
| Heritage & migration | `census-2021-country-of-birth-national.json` | Map or ranked bar of countries of birth |
| Crime victims | `crime-victims-national.json` | Trend chart + subgroup breakdown |

### Suggested priority order
1. GCSE/A-level and university (high public interest, data ready)
2. Low-income households (complements home-ownership page)
3. Religion and heritage/migration (Census data is rich, straightforward build)
4. Crime victims (completes the justice section)

---

## Gap 2 — Topics with no data yet ("Coming next")

These are mapped to official sources but have no data files in the repo.

| Topic | Expected source | Barriers | Suggested timeline |
|---|---|---|---|
| **Life expectancy** | ONS linked life-expectancy tables | Ethnicity is not on death certificates; requires ONS linked-data release | Depends on ONS publication schedule |
| **Obesity** | Health Survey for England (NHS Digital) | Need to extract ethnicity-disaggregated tables from HSE microdata or published tables | Medium effort — published tables exist |
| **HIV/AIDS** | UKHSA surveillance tables | Annual surveillance report publishes ethnicity breakdowns | Medium effort |
| **COVID-19** | ONS / UKHSA mortality and vaccination analysis | Multiple publications exist; need to decide scope (mortality, vaccination, or both) | Medium effort |
| **Maternal health** | MBRRACE-UK confidential enquiry | Currently a manual headline (35.1 per 100k Black women). Full data requires digitising report tables | Higher effort — PDF source |
| **Business ownership** | Small Business Survey (DBT) | No official register of business owners by ethnicity; survey-based estimates only | Lower confidence data |
| **Marriage / civil partnership** | Census 2021 / APS | Ethnicity not on marriage certificates; Census 2021 marital status by ethnicity is available | Medium effort — Census cross-tab |

### Suggested priority order
1. Obesity (HSE tables are published and structured)
2. COVID-19 (high public relevance, multiple ONS datasets available)
3. HIV/AIDS (UKHSA publishes annual breakdowns)
4. Marriage (Census 2021 cross-tab is straightforward)
5. Maternal health (impactful but PDF-based source)
6. Life expectancy (blocked on ONS linked-data schedule)
7. Business ownership (weakest source — survey-based)

---

## Gap 3 — Ethnic subgroup disaggregation

The most important analytical gap across the site.

| Data source | Current granularity | Ideal granularity | Can it be fixed? |
|---|---|---|---|
| APS labour market (employment, unemployment) | Broad "Black or Black British" only | Black African, Black Caribbean, Other Black separately | **No** — APS does not publish subgroup rates for these measures. Would require ONS commissioned table or microdata access |
| EFF education snapshots (GCSE, A-level, university) | Broad "Black" in some tables | Subgroup splits where DfE publishes them | **Partially** — DfE exclusions data does have subgroups; attainment data varies |
| Crime victims (CSEW) | Varies by table | Full subgroup | **Partially** — depends on published table granularity |

### Recommended action
- File a formal data request with ONS/Nomis for APS labour-market rates by detailed Black ethnic group
- Audit each EFF dataset for maximum available disaggregation
- Note clearly on each page where subgroup data is unavailable and why

---

## Gap 4 — Geographic scope inconsistencies

| Category | Current scope | Missing |
|---|---|---|
| Population (Census) | England & Wales | Scotland, Northern Ireland |
| Education (DfE) | England only | Wales, Scotland, NI |
| Health (MHA) | England only | Wales, Scotland, NI |
| Households (EFF) | England only | Wales, Scotland, NI |
| Economics (APS) | United Kingdom | Complete |
| Stop & search | England & Wales | Scotland, NI |

### Recommended action
- Add a visible "geographic scope" badge to each section header so users immediately know which nations are covered
- Investigate Scottish and Welsh equivalents (e.g., StatsWales, Scottish Government statistics) for education, health, and housing data
- Accept that full UK-wide consistency may not be achievable for all topics and be transparent about it

---

## Gap 5 — Stale data

| Dataset | Latest available | Age |
|---|---|---|
| Census 2021 population | March 2021 | 5 years |
| Wealth & class (WAS) | 2016–18 | 8 years |
| Deprivation (IMD) | 2019 | 7 years |
| Stop & search | 2022/23 | 3 years |
| Mental health detentions | 2022/23 | 3 years |
| Home ownership | 2022/23 | 3 years |

### Recommended action
- Set up a release calendar tracking when each source publishes new data
- Prioritise refreshing the wealth snapshot (WAS Round 8 may be available)
- Check for newer IMD release
- Monitor for 2023/24 stop-and-search and MHA publications

---

## Gap 6 — Manual snapshots that need digitising

These topics currently rely on a single hand-transcribed headline figure with no structured data file.

| Topic | Source | Current state |
|---|---|---|
| Political representation | House of Commons Library 2024 | "90 ethnic minority MPs (14%)" — no Black-specific breakdown |
| Incarceration | HMPPS 2024–25 | "12.9% of remand, 12.1% of sentenced" — single snapshot |
| Segregation/deprivation | IMD 2019 | "15.2% of Black people in 10% most deprived areas" |
| Wealth | ONS WAS 2016–18 | "Black African median net wealth £34k vs £314k White British" |
| Maternal mortality | MBRRACE-UK 2022–24 | "35.1 per 100k Black women, 2.9x vs White" |

### Recommended action
- Create structured JSON data files for each, even if they contain a single observation
- This enables consistent rendering via the topic-guide component and makes the data API-accessible
- Prioritise wealth (high impact) and incarceration (completes justice section)

---

## Summary: proposed priority roadmap

### Phase 1 — Quick wins (data exists, needs chart build)
1. Promote GCSE/A-level/university snapshots to full pages
2. Promote low-income households to full page
3. Promote religion and heritage/migration to full pages

### Phase 2 — New data ingestion (official sources identified)
4. Obesity (Health Survey for England)
5. COVID-19 (ONS/UKHSA)
6. HIV/AIDS (UKHSA)
7. Marriage/civil partnership (Census 2021 cross-tab)

### Phase 3 — Structural improvements
8. Add geographic scope badges to every section
9. Digitise manual snapshots into structured JSON
10. Set up a data freshness tracker / release calendar

### Phase 4 — Harder problems
11. File ONS data request for APS Black subgroup labour-market rates
12. Investigate Scottish/Welsh equivalent datasets
13. Life expectancy (dependent on ONS linked-data publication)
14. Business ownership (Small Business Survey — lower confidence)
