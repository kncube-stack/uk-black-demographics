# Devolved Nations Data Sources — Feasibility Assessment

An investigation of equivalent data sources across Scotland, Wales, and Northern Ireland for topics currently limited to England or England & Wales.

---

## Scotland

### Population

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| Scotland's Census 2022 | https://www.scotlandscensus.gov.uk/ | Yes — includes Black African, Black Caribbean, Other Black | CSV, API | High — similar ethnic categories to E&W Census |
| National Records of Scotland (NRS) | https://www.nrscotland.gov.uk/ | Mid-year estimates by broad ethnic group | CSV | Medium — less subgroup detail |

### Education

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| Scottish Government school statistics | https://www.gov.scot/collections/school-education-statistics/ | Yes — exclusions and attainment by ethnic group | CSV, Excel | Medium — different ethnic categories from DfE |
| SQA attainment statistics | https://www.sqa.org.uk/sqa/99432.html | Limited ethnicity detail | PDF, Excel | Low — aggregated categories |

### Health

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| Scottish Health Survey | https://www.gov.scot/collections/scottish-health-survey/ | Broad ethnic groups only | CSV, SPSS | Low — very small Black sample in Scotland |
| Public Health Scotland | https://publichealthscotland.scot/ | Some datasets include ethnicity | Various | Medium — depends on topic |

### Housing

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| Scottish Household Survey | https://www.gov.scot/collections/scottish-household-survey/ | Broad ethnic groups | CSV | Low — small sample sizes |

### Justice

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| Scottish Government justice statistics | https://www.gov.scot/collections/criminal-justice-statistics/ | Limited ethnicity data | Excel | Low — ethnicity recording is inconsistent |

**Overall Scotland assessment**: Census data is the strongest route. For ongoing surveys (health, housing, education), the Black population in Scotland is small (~40,000), leading to wide confidence intervals and limited subgroup analysis.

---

## Wales

### Population

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| Census 2021 (included in ONS E&W data) | https://www.ons.gov.uk/census | Full ethnic detail | Already integrated | Already covered — Wales is included in E&W Census data |
| StatsWales population estimates | https://statswales.gov.wales/ | Broad ethnic groups | CSV, API (OData) | Medium |

### Education

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| StatsWales education data | https://statswales.gov.wales/Catalogue/Education-and-Skills | Yes — exclusions and attainment by ethnic group | CSV, OData API | Medium — different curriculum/exam system (GCSEs broadly comparable) |
| Welsh Government school statistics | https://www.gov.wales/statistics-and-research?topic=Education | Ethnicity breakdowns in some releases | Excel, ODS | Medium |

### Health

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| National Survey for Wales | https://www.gov.wales/national-survey-wales | Very limited ethnicity data | SPSS, CSV | Low — small ethnic minority sample |
| Digital Health and Care Wales | https://dhcw.nhs.wales/ | Hospital data may include ethnicity | Varies | Low — access barriers |

### Housing

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| StatsWales housing data | https://statswales.gov.wales/Catalogue/Housing | Limited ethnicity detail | CSV, OData | Low |

**Overall Wales assessment**: Census data is already integrated (E&W). Education data from StatsWales is the most feasible addition. Health and housing surveys have very small ethnic minority samples.

---

## Northern Ireland

### Population

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| NISRA Census 2021 | https://www.nisra.gov.uk/statistics/census | Yes — includes Black African, Black Caribbean | CSV, Excel | Medium — separate census from E&W |
| NISRA mid-year estimates | https://www.nisra.gov.uk/statistics/population | Broad ethnic groups only | Excel | Low |

### Education

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| Department of Education NI | https://www.education-ni.gov.uk/topics/statistics-and-research | Very limited ethnicity data | Excel | Low — different education system, minimal ethnic breakdowns |

### Health

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| NI Health Survey | https://www.health-ni.gov.uk/topics/dhssps-statistics-and-research | Very limited | Excel | Low — tiny Black population (~7,000) |

### Justice

| Source | URL | Ethnicity breakdowns | Format | Feasibility |
|---|---|---|---|---|
| PSNI statistics | https://www.psni.police.uk/inside-psni/statistics | Stop and search by ethnicity | CSV, Excel | Low — different policing framework |

**Overall NI assessment**: The Black population in NI is very small (~7,000 in Census 2021). Statistical analyses by ethnicity are rarely meaningful at this population size. Census data is the only feasible addition.

---

## Summary: Realistic additions

| Topic | Scotland | Wales | Northern Ireland |
|---|---|---|---|
| **Population (Census)** | Feasible (Census 2022) | Already covered (E&W) | Feasible (Census 2021) |
| **Education exclusions** | Possible (different system) | Possible (StatsWales) | Not feasible |
| **Health** | Not feasible (sample size) | Not feasible (sample size) | Not feasible |
| **Housing** | Not feasible (sample size) | Not feasible | Not feasible |
| **Employment (APS)** | Already covered (UK-wide APS) | Already covered | Already covered |
| **Stop & search** | Different legal framework | Already covered (E&W) | Different framework |

### Recommended priorities

1. **Scotland Census 2022** — add population totals for a UK-wide picture
2. **NI Census 2021** — add population totals
3. **Welsh education data** — exclusions/attainment via StatsWales API
4. **Scottish education data** — exclusions via Scottish Government statistics

All other topics should remain scoped to their current geographic coverage with clear badges indicating scope.
