# Village-Level Temperature and Reference Evapotranspiration (ETo) Downscaling

## 1. Feature Description

Global numerical weather prediction models and reanalyses such as ECMWF ERA5 operate at a coarse 0.25-degree horizontal resolution (approximately 28 km × 28 km). Across rugged mountainous terrain like the Western Ghats of India, this grid spacing averages away sharp topographic relief, treating valleys, steep mountain slopes, and high ridgelines as a single uniform elevation. Consequently, operational weather models suffer from severe elevation-induced temperature biases—overestimating temperatures on cool mountain ridges and failing to resolve intense localized heat stress and moisture deficits in sheltered valleys. This module bridges that spatial scale mismatch by downscaling coarse atmospheric reanalysis data to the exact boundaries of 16,943 revenue villages spanning Karnataka (12,366 villages), Maharashtra (4,175 villages), and Goa (402 villages).

The downscaling engine extracts the true fine-scale surface elevation for every village polygon by computing the areal mean over each boundary from the NASA/USGS Shuttle Radar Topography Mission (SRTM) 30-meter (1 arc-second) Digital Elevation Model (`USGS/SRTMGL1_003`). It derives the signed vertical relief offset $\Delta z = z_{	ext{village}} - z_{	ext{ERA5}}$ between the authentic village surface and the coarse model orography. Applying an environmental lapse-rate adjustment ($\Gamma = -6.5^\circ	ext{C/km}$ or $-0.0065^\circ	ext{C/m}$), the system adjusts 2-meter daily maximum, minimum, and mean temperatures. Combining downscaled temperatures with extraterrestrial solar radiation ($R_a$) derived from orbital geometry and day-of-year, the engine evaluates agricultural vulnerability metrics via the FAO-recommended Hargreaves-Samani method: daily reference evapotranspiration ($	ext{ETo}$ in mm/day), extreme heat stress flags ($T_{\max} \ge 35^\circ	ext{C}$), and high irrigation demand indicators ($T_{\max} \ge 35^\circ	ext{C}$ with $	ext{ETo} \ge 5.0	ext{ mm/day}$) across both pre-monsoon and monsoon time windows.

---

## 2. File Manifest Table

| File Path | Category | Purpose & Description |
| :--- | :--- | :--- |
| `outputs/village_corrections.csv` | Final Output | Authoritative downscaling output table containing 43 columns of fine elevation, relief offsets, downscaled temperatures, and Hargreaves-Samani ETo for 16,943 villages (5.62 MB, MD5 `52b119f0b4f2441592f2d3af866eef3f`). |
| `run_at_au.py` | Generation Script | Queries Google Earth Engine to compute 30 m SRTM areal polygon-mean elevations and signed elevation offsets $\Delta z$ vs ERA5 0.25° nodes for all domain features. |
| `update_village_corrections_final.py` | Generation Script | Assembles village metadata, joins lapse-rate temperature adjustments, and computes initial Hargreaves-Samani reference evapotranspiration. |
| `rebuild_village_corrections.py` | Generation Script | Authoritative offline rebuild script that injects authentic in-window daily extremes (`in_window_daily_extremes.npz`) and compiles the verified final table. |
| `compute_in_window_b42_b43_b44.py` | Generation Script | Extracts authentic 24-hour daily extremes from ERA5 atmospheric slices for 2017-07-15 (monsoon) and 2018-04-30 (pre-monsoon). |
| `rebuild_node_grid.py` | Generation Script | Extracts 0.25° grid node coordinates and corresponding ERA5 / SRTM node elevations across the Western Ghats domain. |
| `run_pipeline_b1_b10.py` | Generation Script | Pipeline runner for regression guards, boundary assertions, and physical validation checks. |
| `compute_g0.py` | Generation Script | Evaluates relief distribution percentiles, top-decile relief nodes ($P_{90} \ge 617.3	ext{ m}$), and materiality classifications. |
| `demo_flagship.py` | Generation Script | Generates single-node demonstration tables for the flagship high-relief node $(15.75^\circ	ext{N}, 74.00^\circ	ext{E})$. |
| `data/cache/signed_village_results.json` | Intermediate Artifact | Cached Google Earth Engine reduction output storing polygon-mean 30m SRTM elevations and signed $\Delta z$ for all 16,943 villages (3.16 MB). |
| `data/cache/in_window_daily_extremes.npz` | Intermediate Artifact | Gridded daily extremes ($T_{\max}, T_{\min}, T_{	ext{mean}}$) for 2017-07-15 and 2018-04-30 across domain ERA5 grid nodes (8.19 KB). |
| `data/cache/node_orography_grids.npz` | Intermediate Artifact | Gridded coarse orography heights ($z_{	ext{ERA5}}$ and $z_{	ext{SRTM\_node}}$) across the 0.25° grid (6.45 KB). |
| `data/cache/d2m_grid.npz` | Intermediate Artifact | Gridded 2-meter dewpoint temperature arrays used for relative humidity and boundary-layer diagnostic checks (3.21 KB). |
| `data/cache/provenance_manifest.json` | Intermediate Artifact | Machine-readable SHA-256 and MD5 provenance manifest tracking input dataset integrity. |
| `engine/deterministic/temperature.py` | Core Engine Library | Core mathematical module implementing environmental lapse-rate temperature downscaling. |
| `engine/deterministic/eto.py` | Core Engine Library | Core mathematical module implementing extraterrestrial radiation ($R_a$) and Hargreaves-Samani ETo equations. |
| `engine/deterministic/agronomic.py` | Core Engine Library | Agronomic classification module for heat stress, diurnal thermal range, and irrigation demand thresholds. |
| `engine/deterministic/humidity.py` | Core Engine Library | Atmospheric thermodynamics module for Magnus-Tetens vapor pressure and relative humidity calculations. |
| `engine/deterministic/wind.py` | Core Engine Library | Log-law wind speed vertical profiling and roughness-length normalization routines. |
| `engine/deterministic/config.py` | Core Engine Library | Domain bounds, physical constants (lapse rate $-6.5^\circ	ext{C/km}$), and default thresholds configuration. |
| `engine/deterministic/validation.py` | Core Engine Library | Physical constraint assertions and distribution sanity checks. |
| `requirements.txt` | Environment Specification | Pinned Python package dependencies for offline and Earth Engine execution. |
| `environment.yml` | Environment Specification | Conda environment specification for reproducible virtual environments. |
| `.gitignore` | Repository Configuration | Git ignore rules explicitly excluding >50 MB rasters, raw GeoJSONs, and API credentials. |
| `FEATURE_TEMPERATURE_ETO.md` | Feature Documentation | Comprehensive feature guide, architecture manifest, data dictionary, reproduction guide, and limitations audit. |

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
| 10 | `polygon_area_km2` | $	ext{km}^2$ | Planar polygon surface area calculated using spherical latitude-corrected geometry. |
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
| 22 | `dz_era5_m` | Metres (m) | Signed vertical relief offset against coarse ERA5 surface ($z_{	ext{fine}} - z_{	ext{ERA5}}$). |
| 23 | `dt_era5_c` | °C | Downscaling temperature adjustment ($-\Delta z_{	ext{ERA5}} 	imes 0.0065^\circ	ext{C/m}$). |
| 24 | `direction` | Categorical | Topographic thermal regime: `WARMING` ($\Delta z < 0$) or `COOLING` ($\Delta z > 0$). |
| 25 | `materiality` | Categorical | Relief materiality flag: `MATERIAL` ($|\Delta z| \ge 150	ext{ m}$) or `SUB-THRESHOLD` ($|\Delta z| < 150	ext{ m}$). |
| 26 | `dz_srtm_m` | Metres (m) | Signed vertical relief offset against the SRTM node mean ($z_{	ext{fine}} - z_{	ext{SRTM\_node}}$). |
| 27 | `dt_srtm_c` | °C | Alternative temperature adjustment against aggregated SRTM node mean ($-\Delta z_{	ext{SRTM}} 	imes 0.0065^\circ	ext{C/m}$). |
| 28 | `real_jjas_tmax_c` | °C | Downscaled daily maximum 2-meter air temperature for monsoon date (2017-07-15). |
| 29 | `real_jjas_tmin_c` | °C | Downscaled daily minimum 2-meter air temperature for monsoon date (2017-07-15). |
| 30 | `real_jjas_tmean_c` | °C | Downscaled 24-hour mean 2-meter air temperature for monsoon date (2017-07-15). |
| 31 | `real_jjas_eto_mm_day` | mm/day | Hargreaves-Samani daily reference evapotranspiration for monsoon date (2017-07-15). |
| 32 | `real_jjas_heat_stress` | Binary (0/1) | Monsoon heat stress flag ($1$ if downscaled $T_{\max} \ge 35.0^\circ	ext{C}$, else $0$). |
| 33 | `real_jjas_irrig_demand`| Binary (0/1) | Monsoon high irrigation demand flag ($1$ if $T_{\max} \ge 35^\circ	ext{C}$ and $	ext{ETo} \ge 5.0	ext{ mm/day}$, else $0$). |
| 34 | `real_prem_tmax_c` | °C | Downscaled daily maximum 2-meter air temperature for pre-monsoon date (2018-04-30). |
| 35 | `real_prem_tmin_c` | °C | Downscaled daily minimum 2-meter air temperature for pre-monsoon date (2018-04-30). |
| 36 | `real_prem_tmean_c` | °C | Downscaled 24-hour mean 2-meter air temperature for pre-monsoon date (2018-04-30). |
| 37 | `real_prem_eto_mm_day` | mm/day | Hargreaves-Samani daily reference evapotranspiration for pre-monsoon date (2018-04-30). |
| 38 | `real_prem_heat_stress`| Binary (0/1) | Pre-monsoon heat stress flag ($1$ if downscaled $T_{\max} \ge 35.0^\circ	ext{C}$, else $0$). |
| 39 | `real_prem_irrig_demand`| Binary (0/1) | Pre-monsoon high irrigation demand flag ($1$ if $T_{\max} \ge 35^\circ	ext{C}$ and $	ext{ETo} \ge 5.0	ext{ mm/day}$, else $0$). |
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
2. **Fixed Atmospheric Lapse Rate**: Elevation corrections assume a uniform environmental lapse rate ($\Gamma = -6.5^\circ	ext{C/km}$). While accurate for daytime convective conditions and regional lapse, it does not simulate nocturnal cold-air drainage, thermal inversions in valley bottoms, or micro-climatic aspect/slope shading.
3. **Absence of 90-Meter Data**: All elevation values derive from native 30 m SRTM (1 arc-second) polygon-mean reductions or 250 m downsampled grids. No 90 m (3 arc-second) raster data is used in this pipeline.
4. **Wind & Boundary-Layer Diagnostics**: Wind speeds and relative humidity indicators are tied to the nearest ERA5 0.25° grid node rather than high-resolution computational fluid dynamic wind simulations over ridge crests.
