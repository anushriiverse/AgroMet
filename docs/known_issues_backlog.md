# Known Issues and Methodological Backlog (R8 / R9)

- Upwind ray-exit NA handling: Stations whose 250° moisture trajectory exits the SRTM DEM bounding box ([12.9°N, 17.6°N]) must be assigned x_cross = NA and excluded from regression design matrices rather than clipped.
- Residualized barrier-term collinearity: Barrier column null tests must be evaluated via partial (residualized) correlation against the 0.90 ceiling with explicit column scaling.
- Leverage audit under NA exclusion: Confirm zone-restricted leverage maxima and retention status of Mangalore/Bajpe (IN009130300) under the ray-exit NA rule.
- Plateau CV metric formal definition: Formally define the plateau structure metric previously reported as 'CV = 0.2001' or drop it from the diagnostic specification.
- Unconstrained lag-1 autocorrelation: Recompute Kolhapur lag-1 serial autocorrelation without zero-clamping, and update n_eff and standard errors accordingly.
- Measurement flag sub-daily audit: Quantify per-season frequency of M_FLAG = 'P' (missing presumed zero) and M_FLAG = 'T' (trace) across historical daily records.
- Wet-day frequency tier demotion rule: Establish an automated tier demotion rule for seasons whose wet-day count is anomalously depressed relative to seasonal total rainfall, and re-screen year 1922.
- Git blob CRLF reconciliation: Document the exact interaction between Windows working-tree CRLF byte counts and committed git blob sizes (git cat-file -s) for IN012131800_parsed.csv.
- Transect selection recommendation: Formally evaluate shifting the primary regional downscaling transect from Maharashtra to Karnataka based on cross-barrier station availability.
- Empirical representativeness replicate clusters: Exploit station clusters within 3 km of cross-barrier distance (e.g. Mudigere, Thirthahalli, Sringeri) to empirically measure local scatter instead of assuming CV = 0.30.
- Predictor/target temporal overlap constraints: Reconcile historical gauge multi-decadal coverage (concentrated in 1901–1970 Era I) against modern ERA5 forcing (1940–present) and IMERG satellite precipitation (2000–present).
- Fixed-width .dly parsing and metrication audit: Parse full fixed-width .dly records to extract MDPR/DAPR/DWPR elements and perform modulo-25 tenths quantization tests for pre-1957 British-era inch rounding.
- Observational provenance metadata qualifications: Explicitly document 08:30 IST observation time, Symons manual gauges, and IMD Pune QC as unverified hypotheses rather than GHCN-documented metadata for source flag I.
- Domain bounding box outlier retention: Formalize the retention or exclusion rationale for IN022030400 (Bombay/Santacruz, 19.12°N) which lies north of the declared 12.5°N–18.0°N bounding box.
- Ridge-envelope smoothing scale selection: Evaluated candidate scales (3 km, 10 km, 15 km) for bounded lateral mixing; 3 km was retained as the fixed a-priori scale because 10 km and 15 km failed the 20% lee error target while degrading windward parity (>5%); scale was selected from three candidates, not formally fitted.
- Goa coastal baseline anchor calibration: All 402 Goa villages exceed 3,300 mm because the coastal anchor was fitted from Karnataka coastal gauges only; no Goa gauge exists in the calibration set, so Goa totals are unvalidated and may be biased high.
