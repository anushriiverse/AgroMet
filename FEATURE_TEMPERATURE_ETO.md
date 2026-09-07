# Village-Level Temperature and Reference Evapotranspiration (ETo) Downscaling

# Quickstart: Five-File Minimum Path (Offline Reproduction)

> **Notice**: This quickstart defines the minimum five-file critical path required to understand, execute, and verify the village-level temperature and ETo downscaling module. Everything following this quickstart is reference material.

### 1. The Five Files in Run Order
1. **`data/cache/signed_village_results.json`**: Pre-computed Google Earth Engine cache containing fine 30 m SRTM polygon-mean elevations and signed relief offsets ($\Delta z$) for 16,943 villages.
2. **`data/cache/in_window_daily_extremes.npz`**: Pre-computed gridded ERA5 24-hour daily temperature extremes ($T_{\max}, T_{\min}, T_{\text{mean}}$) across the Western Ghats domain for pre-monsoon and monsoon dates.
3. **`update_village_corrections_final.py`**: Assembly script that merges village administrative metadata, joins $-6.5^\circ\text{C/km}$ lapse-rate adjustments, and initializes the downscaled table.
4. **`rebuild_village_corrections.py`**: Authoritative offline compilation script that injects authentic daily extremes, calculates Hargreaves-Samani reference evapotranspiration (ETo), and compiles the verified final table.
5. **`outputs/village_corrections.csv`**: The authoritative output product (16,943 rows, 43 columns; 5,622,589 bytes, MD5 `52b119f0b4f2441592f2d3af866eef3f`).

### 2. Single Offline Reproduction Command (<5 Seconds Runtime, No Credentials Needed)
```bash
python rebuild_village_corrections.py
```

### 3. Expected Integrity Check
- **Expected Output File**: `outputs/village_corrections.csv`
- **Expected File Size**: `5,622,589 bytes`
- **Expected MD5 Checksum**: `52b119f0b4f2441592f2d3af866eef3f`
- **Expected SHA-256 Checksum**: `0c0748815cb9e9005e06a2063c14b7bbc27bbd9e4caad48874f57e8d4b236f2f`

---

> [!NOTE]
> **Repository Context & Workstream Separation**:
> This branch (`feature/temperature-eto-downscaling`) was created from the `release/` snapshot tree that contains shared and historical files from earlier project tracks. It deliberately does **not** contain the outputs of the high-resolution orographic rainfall downscaling workstream (`outputs/rainfall_downscaled_250m.tif`, `outputs/village_rainfall.csv`, `figs/`, or `docs/demo_summary.md`), which live in a separate tree. Those rainfall artifacts reside on the main prototype workspace and are maintained independently.

---

## 1. Feature Description

Global numerical weather prediction models and reanalyses such as ECMWF ERA5 operate at a coarse 0.25-degree horizontal resolution (approximately 28 km × 28 km). Across rugged mountainous terrain like the Western Ghats of India, this grid spacing averages away sharp topographic relief, treating valleys, steep mountain slopes, and high ridgelines as a single uniform elevation. Consequently, operational weather models suffer from severe elevation-induced temperature biases—overestimating temperatures on cool mountain ridges and failing to resolve intense localized heat stress and moisture deficits in sheltered valleys. This module bridges that spatial scale mismatch by downscaling coarse atmospheric reanalysis data to the exact boundaries of 16,943 revenue villages spanning Karnataka (12,366 villages), Maharashtra (4,175 villages), and Goa (402 villages).

The downscaling engine extracts the true fine-scale surface elevation for every village polygon by computing the areal mean over each boundary from the NASA/USGS Shuttle Radar Topography Mission (SRTM) 30-meter (1 arc-second) Digital Elevation Model (`USGS/SRTMGL1_003`). It derives the signed vertical relief offset $\Delta z = z_{\text{village}} - z_{\text{ERA5}}$ between the authentic village surface and the coarse model orography. Applying an environmental lapse-rate adjustment ($\Gamma = -6.5^\circ\text{C/km}$ or $-0.0065^\circ\text{C/m}$), the system adjusts 2-meter daily maximum, minimum, and mean temperatures. Combining downscaled temperatures with extraterrestrial solar radiation ($R_a$) derived from orbital geometry and day-of-year, the engine evaluates agricultural vulnerability metrics via the FAO-recommended Hargreaves-Samani method: daily reference evapotranspiration ($\text{ETo}$ in mm/day), extreme heat stress flags ($T_{\max} \ge 35^\circ\text{C}$), and high irrigation demand indicators ($T_{\max} \ge 35^\circ\text{C}$ with $\text{ETo} \ge 5.0\text{ mm/day}$) across both pre-monsoon and monsoon time windows.

---

## 2. File Manifest Tables

### Table 2.1: Temperature/ETo Critical Path (26 Files)
The following 26 files constitute the exact dependency set identified in D9-1 required to generate, execute, and verify `outputs/village_corrections.csv`:

| File Path | Specific Functional Purpose |
| :--- | :--- |
| `outputs/village_corrections.csv` | Authoritative downscaling output table containing 43 columns of fine elevation, relief offsets, downscaled temperatures, and Hargreaves-Samani ETo for 16,943 villages (5,622,589 bytes, MD5 `52b119f0b4f2441592f2d3af866eef3f`). |
| `run_at_au.py` | Google Earth Engine script extracting 30 m SRTM polygon-mean elevations and signed relief offsets ($\Delta z$) vs ERA5 0.25° nodes via `reduceRegions` at scale 30. |
| `update_village_corrections_final.py` | Initial assembly script merging village metadata, joining $-6.5^\circ\text{C/km}$ lapse-rate temperature adjustments, and calculating preliminary Hargreaves-Samani ETo. |
| `rebuild_village_corrections.py` | Authoritative offline rebuild script that injects authentic daily extremes from `in_window_daily_extremes.npz` and compiles the verified final table. |
| `compute_in_window_b42_b43_b44.py` | Extraction script parsing authentic 24-hour daily extremes from ERA5 atmospheric slices for 2017-07-15 (monsoon) and 2018-04-30 (pre-monsoon). |
| `rebuild_node_grid.py` | Extraction script computing 0.25° grid node coordinates and corresponding ERA5 and SRTM node elevations across the Western Ghats domain. |
| `run_pipeline_b1_b10.py` | Automated regression runner executing boundary assertions, physical range guards, and validation checks. |
| `compute_g0.py` | Statistical analysis script computing relief distribution percentiles, top-decile relief nodes ($P_{90} \ge 617.3\text{ m}$), and materiality classifications. |
| `demo_flagship.py` | Demonstration script generating single-node demonstration tables for the flagship high-relief node $(15.75^\circ\text{N}, 74.00^\circ\text{E})$. |
| `data/cache/signed_village_results.json` | Intermediate cache artifact storing Google Earth Engine 30 m SRTM polygon-mean elevations and signed $\Delta z$ for all 16,943 villages (3.16 MB). |
| `data/cache/in_window_daily_extremes.npz` | Intermediate cache artifact containing gridded 2-meter air temperature extremes ($T_{\max}, T_{\min}, T_{\text{mean}}$) across ERA5 grid nodes for 2017-07-15 and 2018-04-30 (8.19 KB). |
| `data/cache/node_orography_grids.npz` | Intermediate cache artifact storing gridded coarse orography heights ($z_{\text{ERA5}}$ and $z_{\text{SRTM\_node}}$) across the 0.25° domain (6.45 KB). |
| `data/cache/d2m_grid.npz` | Intermediate cache artifact storing gridded 2-meter dewpoint temperature arrays used for thermodynamic relative humidity and boundary-layer checks (3.21 KB). |
| `data/cache/provenance_manifest.json` | Intermediate cache artifact providing machine-readable SHA-256 and MD5 provenance hashes for all input datasets (16.1 KB). |
| `engine/deterministic/temperature.py` | Core physical module implementing environmental lapse-rate temperature downscaling calculations ($\Gamma = -6.5^\circ\text{C/km}$). |
| `engine/deterministic/eto.py` | Core physical module implementing extraterrestrial solar radiation ($R_a$) and Hargreaves-Samani reference evapotranspiration equations. |
| `engine/deterministic/agronomic.py` | Core physical module evaluating extreme heat stress thresholds ($T_{\max} \ge 35^\circ\text{C}$), diurnal thermal range, and high irrigation demand indicators. |
| `engine/deterministic/humidity.py` | Core physical module computing vapor pressure, saturation vapor pressure, and relative humidity via the Magnus-Tetens formulation. |
| `engine/deterministic/wind.py` | Core physical module implementing vertical logarithmic wind profile adjustments and terrain roughness length scaling. |
| `engine/deterministic/config.py` | Core physical configuration module centralizing domain bounding coordinates, lapse-rate constants ($-0.0065^\circ\text{C/m}$), and agronomic thresholds. |
| `engine/deterministic/validation.py` | Core physical module executing physical range assertions and thermodynamic sanity bounds across downscaled variables. |
| `requirements.txt` | Environment specification file pinning pip package versions required for pipeline execution. |
| `environment.yml` | Environment specification file defining Conda virtual environment dependencies for reproducible local execution. |
| `.gitignore` | Repository configuration preventing accidental tracking of large rasters (>50 MB), raw boundary GeoJSONs, and credentials. |
| `.gitattributes` | Repository configuration enforcing binary handling (`*.csv -text`) on tabular outputs to eliminate line-ending byte drift across platforms. |
| `FEATURE_TEMPERATURE_ETO.md` | Feature specification and documentation providing the five-file quickstart, file manifests, data dictionary, reproduction guide, and limitations audit. |

---

### Table 2.2: Repository Context (Not on the Critical Path — 71 Files)
The following 71 files are part of the shared repository snapshot inherited from earlier project phases or parallel tracks. They are **not** required to reproduce the temperature/ETo downscaling feature:

| File Path | Specific Functional Purpose & Verification Scope |
| :--- | :--- |
| `data/cache/ghcn_daily/IN012131800_parsed.csv` | Belongs to the rainfall calibration workstream (authentic NOAA GHCN daily precipitation series for station Kolhapur used in orographic transect fitting), not temperature/ETo. |
| `fetch_ghcn_daily.py` | Belongs to the rainfall calibration workstream (automated downloader for NOAA GHCN daily weather station precipitation records), not temperature/ETo. |
| `engine/feasibility/probe_chirps_urls.py` | Belongs to the rainfall calibration workstream (checks URL availability and remote connectivity for CHIRPS satellite precipitation archives), not temperature/ETo. |
| `fetch_station_hourly_era5.py` | Belongs to the rainfall calibration workstream (extracts hourly ERA5 precipitation time series at station locations for rainfall diurnal cycle verification), not temperature/ETo. |
| `engine/__init__.py` | Package initializer declaring the root `engine` namespace package. |
| `engine/application/__init__.py` | Package initializer declaring the `engine.application` subpackage for stateless downscaling operators. |
| `engine/checks/__init__.py` | Package initializer declaring the `engine.checks` subpackage for physical assertion and runtime validation routines. |
| `engine/config/__init__.py` | Package initializer declaring the `engine.config` subpackage providing YAML configuration loading utilities. |
| `engine/feasibility/__init__.py` | Package initializer declaring the `engine.feasibility` subpackage for satellite signal-to-noise gate evaluation. |
| `engine/ingestion/__init__.py` | Package initializer declaring the `engine.ingestion` subpackage for structured remote data fetching. |
| `engine/weights/__init__.py` | Package initializer declaring the `engine.weights` subpackage for fine-grid spatial weight field generation. |
| `tests/__init__.py` | Package initializer declaring the `tests` package for pytest test discovery. |
| `logs/assertion_log.jsonl` | Structured JSONL log recording automated pass/fail results for physical elevation and temperature sanity assertions. |
| `logs/fetch_log.jsonl` | Structured JSONL audit log recording timestamps, URLs, byte counts, and MD5 hashes for external data downloads. |
| `logs/item0ef.log` | Records verification of Items 0, E, and F auditing station record lengths, completeness thresholds, and retracting structural claims for Mahabaleshwar. |
| `logs/item5_item6.log` | Records verification of Items 5 and 6 auditing relative humidity saturation boundary clamping and physical upper bounds. |
| `logs/item_ag_aj.log` | Records verification of Items AG through AJ validating coastal plain station elevations and geographic coordinates against surveyor benchmarks. |
| `logs/item_ag_ar.log` | Records verification of Items AG through AR evaluating point-query vs areal-mean DEM offsets and documenting the Mahabaleshwar summit gap. |
| `logs/item_as_bb.log` | Records verification of Items AS through BB validating the 16,943 village polygon boundary topology and centroid-to-cell mappings. |
| `logs/item_b0_b16.log` | Records verification of Items B0 through B16 establishing the initial village elevation reduction, signed relief $\Delta z$, and materiality filters. |
| `logs/item_b17_b25.log` | Records verification of Items B17 through B25 evaluating flagship high-relief node exhibits and checking multi-cell village boundary flags. |
| `logs/item_b26_b10.log` | Records verification of Items B26 through B10 auditing village census code duplication, location code mappings, and cadastral survey identifiers. |
| `logs/item_b28_b34.log` | Records verification of Items B28 through B34 evaluating temperature adjustments across top-decile relief nodes and testing extreme heat stress criteria. |
| `logs/item_b35_b39.log` | Records verification of Items B35 through B39 establishing that Karnataka state survey codes are internal identifiers rather than official Census codes. |
| `logs/item_b40_b48.log` | Records verification of Items B40 through B48 verifying authentic 24-hr daily extremes for pre-monsoon and monsoon windows and deprecating out-of-window slices. |
| `logs/item_b49_b52.log` | Records verification of Items B49 through B52 establishing the authoritative CSV checksum (MD5 `52b119f0b4f2441592f2d3af866eef3f`) and locking column definitions. |
| `logs/item_bc_bl.log` | Records verification of Items BC through BL testing terrain slope gradients, aspect angles, and boundary-layer decoupling criteria. |
| `logs/item_bm_bw.log` | Records verification of Items BM through BW evaluating nocturnal boundary-layer inversion frequencies and testing topographic position index (TPI) thresholds. |
| `logs/item_cdg.log` | Records verification of Items C, D, and G auditing ERA5 geopotential height conventions, elevation unit conversions, and gravity constants. |
| `logs/item_f13_f17.log` | Records verification of Items F13 through F17 reconciling thermal warming/cooling regime classifications and auditing elevation distribution symmetry. |
| `logs/item_f1_f5.log` | Records verification of Items F1 through F5 assessing agricultural frost occurrence probability and cold-air pooling risk in high Western Ghats valleys. |
| `logs/item_f6_f12.log` | Records verification of Items F6 through F12 resolving ERA5 atmospheric vs ERA5-Land provenance and eliminating circularity risks. |
| `logs/item_g0_g6.log` | Records verification of Items G0 through G6 auditing the top-decile relief threshold ($P_{90} \ge 617.3\text{ m}$) across all 210 populated grid nodes. |
| `logs/item_hij.log` | Records verification of Items H, I, and J auditing dewpoint depression, atmospheric humidity profiles, and diurnal vapor pressure variations. |
| `logs/item_kle.log` | Records verification of Items K, L, and E evaluating surface roughness lengths, log-law wind speed scaling, and terrain exposure factors. |
| `logs/item_mfno.log` | Records verification of Items M, F, N, and O auditing solar radiation models, extraterrestrial irradiance ($R_a$), and day-of-year orbital geometry. |
| `logs/item_pv.log` | Records verification of Items P through V comparing satellite precipitation contrast against station observations at feasibility test pairs. |
| `logs/item_r1_r10.log` | Records verification of Items R1 through R10 auditing GHCN station record spans, multi-day accumulation flags, and data quality tiers. |
| `logs/item_w_af.log` | Records verification of Items W through AF auditing DEM resolution provenance, native posting intervals, and interpolation artifacts. |
| `logs/rh_clamping.log` | Records execution trace of physical boundary clamping for relative humidity fields exceeding 100% saturation or falling below 0%. |
| `outputs/figures/flagship_node_33_villages.csv` | Data subset table containing 33 villages situated within the flagship high-relief node $(15.75^\circ\text{N}, 74.00^\circ\text{E})$ used for demonstration exhibits. |
| `outputs/figures/flagship_node_exhibit.png` | Visualization figure demonstrating fine elevation downscaling across the 33 villages of the flagship node. |
| `docs/orography_diff_map.png` | Diagnostic map displaying the spatial distribution of signed relief offsets between 30 m SRTM and coarse ERA5 orography across the domain. |
| `docs/orography_diff_histogram.png` | Diagnostic histogram visualizing the frequency distribution of signed relief offsets ($\Delta z$) across domain villages. |
| `docs/elevation_vs_sat_ratio.png` | Diagnostic scatter plot comparing terrain elevation against satellite precipitation contrast ratios. |
| `docs/feasibility_gate.md` | Technical specification for the initial feasibility gate assessing satellite resolution of orographic gradients. |
| `docs/feasibility_gate_preliminary.md` | Initial draft specification for satellite precipitation signal detection across Western Ghats transects. |
| `docs/deterministic_track.md` | Technical overview document of the deterministic temperature and lapse-rate downscaling track. |
| `docs/deterministic_validation.md` | Ground validation report comparing lapse-rate adjusted temperatures against independent weather stations. |
| `docs/numbers_pack.md` | Reference compendium of physical constants, threshold values, and baseline statistics across earlier workstreams. |
| `docs/credentials_required.md` | Reference document outlining external credentials required for Copernicus CDS and Google Earth Engine services. |
| `docs/PROVENANCE.md` | Non-circularity protocol confirming ERA5 atmospheric data is maintained strictly independent of validation targets. |
| `AUDIT.md` | Project-wide audit trail and methodological compliance log across project tracks. |
| `DATA_SOURCES.md` | Catalogue of external data sources, licensing, and access credentials. |
| `LICENSE` | Apache 2.0 open-source repository license terms. |
| `README.md` | Top-level repository overview and architectural layout documentation. |
| `run_reproduction.py` | Master multi-workstream reproduction harness for running historical batch suites. |
| `engine/checks/guard.py` | Implements numerical range guards, NaN prevention, and array shape verification assertions. |
| `engine/checks/terrain_assertions.py` | Implements physical assertions validating terrain elevation ranges and gradient limits. |
| `engine/config/default.yaml` | YAML configuration specifying spatial domain bounds, epoch dates, and baseline constants. |
| `engine/feasibility/gate.py` | Implements the formal feasibility gate evaluating satellite precipitation contrast ratios across mountain barriers. |
| `engine/feasibility/preliminary_gate.py` | Prototype script implementing early heuristic checks on satellite precipitation gradients. |
| `engine/feasibility/test_gradient.py` | Statistical test suite assessing spatial precipitation gradient significance across the Western Ghats. |
| `engine/feasibility/test_hypotheses.py` | Formal hypothesis testing framework evaluating windward-to-leeward contrast ratios. |
| `engine/feasibility/test_provenance.py` | Automated test suite asserting non-circularity and independence of data sources. |
| `engine/feasibility/update_report.py` | Automated markdown report generator compiling feasibility gate findings. |
| `engine/ingestion/logging_utils.py` | Structured JSONL logging utility recording remote fetch requests, byte counts, and MD5 hashes. |
| `tests/conftest.py` | Pytest configuration fixture defining mock datasets and shared testing paths. |
| `tests/range_test.py` | Unit tests asserting that downscaled temperatures and ETo remain within physically bounded ranges. |
| `tests/test_physics.py` | Unit tests verifying that lapse-rate cooling and radiative formulas adhere to physical conservation laws. |
| `tests/test_pipeline.py` | Integration tests exercising the downscaling pipeline from input arrays through final output generation. |

---

## 3. Data Dictionary: `outputs/village_corrections.csv` (All 43 Columns)

| # | Column Name | Units / Format | Description & Scientific Derivation |
| :-: | :--- | :--- | :--- |
| 1 | `village_id` | String (`src:idx`) | Unique village identifier composed of source file prefix and feature index (e.g. `ka.geojson:0`). |
| 2 | `src_file` | String | Source boundary GeoJSON file name (`ka.geojson`, `mh1.geojson`, `mh2.geojson`, `ga.geojson`). |
| 3 | `feature_idx` | Integer | Zero-indexed sequential feature index within the source boundary GeoJSON file. |
| 4 | `village_name` | String | Official village name extracted from cadastral records or Census attribute tables. |
| 5 | `state` | String (Code) | Two-letter state identifier: `KA` (Karnataka), `MH` (Maharashtra), `GA` (Goa). |
| 6 | `district` | String | Administrative district name containing the village polygon. |
| 7 | `taluka` | String | Sub-district, taluk, or tehsil administrative unit name. |
| 8 | `census_code` | String | Official 2001 Census code; marked `unavailable` for Karnataka survey polygons. |
| 9 | `state_loc_code` | String | State cadastral survey department location identifier (`LOC_CODE` or `V_CT_CODE`). |
| 10 | `polygon_area_km2` | $\text{km}^2$ | Planar polygon surface area calculated using spherical latitude-corrected geometry. |
| 11 | `multi_cell_flag` | Boolean (0/1) | Flag indicating whether the village polygon boundary intersects multiple 0.25° ERA5 grid cells. |
| 12 | `duplicate_code_flag` | Boolean (0/1) | Flag indicating whether the location identifier occurs multiple times in cadastral records. |
| 13 | `centroid_lat` | Decimal Degrees (°N) | Geographic latitude of the village polygon boundary centroid (WGS84). |
| 14 | `centroid_lon` | Decimal Degrees (°E) | Geographic longitude of the village polygon boundary centroid (WGS84). |
| 15 | `node_lat` | Decimal Degrees (°N) | Center latitude of the nearest coarse ERA5 0.25° grid node assigned to the centroid. |
| 16 | `node_lon` | Decimal Degrees (°E) | Center longitude of the nearest coarse ERA5 0.25° grid node assigned to the centroid. |
| 17 | `node_i` | Integer (0–18) | Latitude row index within the domain's 0.25° atmospheric grid array. |
| 18 | `node_j` | Integer (0–12) | Longitude column index within the domain's 0.25° atmospheric grid array. |
| 19 | `fine_elev_m` | Metres (m) | Areal polygon-mean elevation sampled from NASA/USGS SRTM 30 m DEM (`USGS/SRTMGL1_003`). |
| 20 | `era5_elev_m` | Metres (m) | Coarse orographic surface height of the assigned ERA5 0.25° grid cell. |
| 21 | `srtm_node_elev_m` | Metres (m) | Areal mean SRTM elevation aggregated across the assigned 0.25° grid node. |
| 22 | `dz_era5_m` | Metres (m) | Signed vertical relief offset against coarse ERA5 surface ($z_{\text{fine}} - z_{\text{ERA5}}$). |
| 23 | `dt_era5_c` | °C | Downscaling temperature adjustment ($-\Delta z_{\text{ERA5}} \times 0.0065^\circ\text{C/m}$). |
| 24 | `direction` | Categorical | Topographic thermal regime: `WARMING` ($\Delta z < 0$) or `COOLING` ($\Delta z > 0$). |
| 25 | `materiality` | Categorical | Relief materiality flag: `MATERIAL` ($|\Delta z| \ge 150\text{ m}$) or `SUB-THRESHOLD` ($|\Delta z| < 150\text{ m}$). |
| 26 | `dz_srtm_m` | Metres (m) | Signed vertical relief offset against the SRTM node mean ($z_{\text{fine}} - z_{\text{SRTM\_node}}$). |
| 27 | `dt_srtm_c` | °C | Alternative temperature adjustment against aggregated SRTM node mean ($-\Delta z_{\text{SRTM}} \times 0.0065^\circ\text{C/m}$). |
| 28 | `real_jjas_tmax_c` | °C | Downscaled daily maximum 2-meter air temperature for monsoon date (2017-07-15). |
| 29 | `real_jjas_tmin_c` | °C | Downscaled daily minimum 2-meter air temperature for monsoon date (2017-07-15). |
| 30 | `real_jjas_tmean_c` | °C | Downscaled 24-hour mean 2-meter air temperature for monsoon date (2017-07-15). |
| 31 | `real_jjas_eto_mm_day` | mm/day | Hargreaves-Samani daily reference evapotranspiration for monsoon date (2017-07-15). |
| 32 | `real_jjas_heat_stress` | Binary (0/1) | Monsoon heat stress flag ($1$ if downscaled $T_{\max} \ge 35.0^\circ\text{C}$, else $0$). |
| 33 | `real_jjas_irrig_demand`| Binary (0/1) | Monsoon high irrigation demand flag ($1$ if $T_{\max} \ge 35^\circ\text{C}$ and $\text{ETo} \ge 5.0\text{ mm/day}$, else $0$). |
| 34 | `real_prem_tmax_c` | °C | Downscaled daily maximum 2-meter air temperature for pre-monsoon date (2018-04-30). |
| 35 | `real_prem_tmin_c` | °C | Downscaled daily minimum 2-meter air temperature for pre-monsoon date (2018-04-30). |
| 36 | `real_prem_tmean_c` | °C | Downscaled 24-hour mean 2-meter air temperature for pre-monsoon date (2018-04-30). |
| 37 | `real_prem_eto_mm_day` | mm/day | Hargreaves-Samani daily reference evapotranspiration for pre-monsoon date (2018-04-30). |
| 38 | `real_prem_heat_stress`| Binary (0/1) | Pre-monsoon heat stress flag ($1$ if downscaled $T_{\max} \ge 35.0^\circ\text{C}$, else $0$). |
| 39 | `real_prem_irrig_demand`| Binary (0/1) | Pre-monsoon high irrigation demand flag ($1$ if $T_{\max} \ge 35^\circ\text{C}$ and $\text{ETo} \ge 5.0\text{ mm/day}$, else $0$). |
| 40 | `rh_2020_04_30_pct` | % | Near-surface relative humidity percentage (legacy out-of-window diagnostic). |
| 41 | `rh_2020_04_30_clamped_flag`| Binary (0/1)| Clamping audit indicator ($1$ if RH was bounded within physical limits, else $0$). |
| 42 | `wind_block_status` | Categorical | Provenance status for 10-meter wind forcing (`SOURCED FROM ARCO ERA5 10M WIND`). |
| 43 | `wind_tpi_status` | Categorical | Topographic Position Index wind adjustment status (`ESTIMATED – NO SOURCE`). |

---

## 4. Reproduction Section (Step-by-Step Execution Guide)

This feature is designed for complete offline reproducibility. The authoritative output table `outputs/village_corrections.csv` is committed directly to the repository (5,622,589 bytes, MD5 `52b119f0b4f2441592f2d3af866eef3f`), allowing collaborators to use the downscaled metrics immediately without re-running data extraction.

### A. Environment Setup
- **Python Version**: Python 3.10, 3.11, or 3.12.
- **Package Installation**:
  ```bash
  pip install earthengine-api numpy pandas scipy
  ```

### B. Immediate Offline Verification & Rebuild (No Credentials Required)
If you do not wish to re-query Google Earth Engine, you can reproduce and verify the final table in under 5 seconds from the cached artifacts:
```bash
python rebuild_village_corrections.py
```
- **Inputs Consumed**: `data/cache/in_window_daily_extremes.npz`, `outputs/village_corrections.csv`.
- **Integrity Assertion**: Re-generates `outputs/village_corrections.csv` and verifies its exact checksum:
  - Expected Size: `5,622,589 bytes`
  - Expected MD5: `52b119f0b4f2441592f2d3af866eef3f`
  - Expected SHA-256: `0c0748815cb9e9005e06a2063c14b7bbc27bbd9e4caad48874f57e8d4b236f2f`

### C. Full End-to-End Reproduction from Earth Engine
To re-extract fine-scale village elevations from scratch:

1. **Authenticate Google Earth Engine**:
   ```bash
   earthengine authenticate
   ```
   Requires a valid GEE-enabled Google account.

2. **Obtain Boundary GeoJSON Files**:
   The raw state boundary GeoJSON files exceed GitHub's 50 MB file size limit and are excluded from git:
   - `data/cache/geojson/ga.geojson` (1.2 MB)
   - `data/cache/geojson/ka.geojson` (86.5 MB)
   - `data/cache/geojson/mh1.geojson` (69.2 MB)
   - `data/cache/geojson/mh2.geojson` (78.6 MB)
   Place these files into `data/cache/geojson/` from project cold storage or state survey department archives.

3. **Run Stage 1: Earth Engine Polygon Reduction**:
   ```bash
   python run_at_au.py
   ```
   - **Runtime**: Approximately 15 to 20 minutes across 16,943 village boundaries.
   - **Operation**: Samples `USGS/SRTMGL1_003` at 30 m resolution via `reduceRegions(reducer=ee.Reducer.mean(), scale=30)`.
   - **Writes**: `data/cache/signed_village_results.json` (3.16 MB).

4. **Run Stage 2: Atmospheric Extremes & Grid Nodes Extraction (Offline)**:
   ```bash
   python compute_in_window_b42_b43_b44.py
   python rebuild_node_grid.py
   ```
   - **Runtime**: ~2 seconds.
   - **Writes**: `data/cache/in_window_daily_extremes.npz` and `data/cache/node_orography_grids.npz`.

5. **Run Stage 3: Assemble & Verify Final Village Table (Offline)**:
   ```bash
   python update_village_corrections_final.py
   python rebuild_village_corrections.py
   ```
   - **Runtime**: ~3 seconds.
   - **Writes**: `outputs/village_corrections.csv` (MD5 `52b119f0b4f2441592f2d3af866eef3f`).

---

## 5. Limitations & Operational Scope

1. **Tabular Coverage vs. Continuous Raster**: This product is strictly a tabular per-village summary, not a continuous 2D raster map. Each row represents the areal mean of an entire village administrative unit. (The project's only continuous 2D downscaled raster is the 250 m orographic rainfall GeoTIFF).
2. **Fixed Atmospheric Lapse Rate**: Elevation corrections assume a uniform environmental lapse rate ($\Gamma = -6.5^\circ\text{C/km}$). While accurate for daytime convective conditions and regional lapse, it does not simulate nocturnal cold-air drainage, thermal inversions in valley bottoms, or micro-climatic aspect/slope shading.
3. **Absence of 90-Meter Data**: All elevation values derive from native 30 m SRTM (1 arc-second) polygon-mean reductions or 250 m downsampled grids. No 90 m (3 arc-second) raster data is used in this pipeline.
4. **Wind & Boundary-Layer Diagnostics**: Wind speeds and relative humidity indicators are tied to the nearest ERA5 0.25° grid node rather than high-resolution computational fluid dynamic wind simulations over ridge crests.
