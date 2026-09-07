# Orographic Rainfall Downscaling Proof-of-Concept: Scope, Physics Specification & Validation Register
*Workstream: Orographic Rainfall (R0–R7) | Version: R7-9 Post-Gate Revision | Date: 2026-09-06*

---

## 1. Context & Architectural Boundary

This document establishes the scientific formulation, parameterization scheme, empirical limits, validation target register, and sampling requirements for orographic precipitation downscaling across the Western Ghats domain ($13.0^\circ\text{N} \text{ to } 17.5^\circ\text{N}$, $73.5^\circ\text{E} \text{ to } 76.5^\circ\text{E}$).

Station gate evaluation (R2 / R8-1) returns a verdict of **FULL–CONTINGENT** based on regional NOAA GHCN-Daily inventory availability across the entire transect (30 coastal, 10–15 escarpment/crest, and 141 lee stations with $\ge 20$ years of record). The qualification **CONTINGENT** denotes that while station counts permit full-domain modeling, parameter identification across the steep orographic ramp is strictly contingent upon: (1) retention of the 10 authoritative multi-decadal escarpment stations without boundary attrition; (2) resolving sub-20-year coverage at key crest breakout points (e.g. Agumbe, Hulikal, Jog); (3) absence of design-matrix collinearity collapse ($\rho < 0.90$) under candidate pilot subsets; and (4) separation of systematic aerodynamic wind-loss from the random error floor. Consequently, this document defines the **crest-anchored convolution model** with separated Maharashtra and Karnataka transects.

*(Under the alternative REDUCED branch, all claims would be strictly restricted to coast-to-plateau macro-contrasts, acknowledging in the very first paragraph that the localized crest maximum is unvalidatable with available data, and that amplitude, barrier-envelope shape, and fit quality are unclaimable at $N \approx 4$.)*

---

## 2. Mathematical Model: One-Sided Downstream Advection Convolution

The downscaling operator is formulated strictly as an integral **convolution**, not an arbitrary additive or multiplicative empirical regression:

$$P(x) = \left[ S(x) * K(x) \right] + P_\infty$$

where the spatial coordinate $x$ is oriented along the prevailing low-level monsoon moisture flux vector $\hat{u}_{250}$ (fixed at azimuth $250^\circ$, blowing towards $70^\circ$, with $x = 0$ anchored at the topographic crest, negative windward, positive leeward).

### 2.1 One-Sided Downstream Advection Kernel
Condensation produced aloft advects downstream with horizontal wind speed $U$ during its hydrometeor conversion and fallout timescale $\tau$:

$$K(x) = \begin{cases} \frac{1}{L} \exp\left(-\frac{x}{L}\right) & \text{for } x \ge 0 \\ 0 & \text{for } x < 0 \end{cases}$$

Here, the advective drift length $L = U \cdot \tau$ is a **single unified physical parameter** governing both:
1. The **smoothing length** over the windward escarpment.
2. The **lee-side decay length** across the leeward plateau.

Because the same low-level monsoon jet advects hydrometeors across the escarpment and past the crest, separating the smoothing length from the lee decay length is physically unjustifiable.

### 2.2 Two-Scale Source Formulation & Identifiability Status
The general two-scale source term separates local slope-forced ascent from the broad barrier envelope:

$$S(x) = \eta \cdot \left[ C_w \, U \max\left(0, \frac{\partial h_{\text{smooth}}}{\partial x}\right) \exp\left(-\frac{h}{H_w}\right) + S_{\text{coast}} \cdot \Omega_{\text{barrier}}(x) \right]$$

- **Design-Matrix Identifiability (R7-2 Diagnostic)**:
  - Evaluation of the design matrix $[\mathbf{1}, \text{lat}, X_{\text{slope}}, X_{\text{barrier}}]$ across 181 retained multi-decadal stations yields residualized correlation $\rho \approx 0.07\text{--}0.14$, condition number $\kappa \approx 1.10\text{--}1.15$, and $\text{VIF} \approx 1.01$.
  - The leverage map demonstrates that distinguishing leverage concentrates overwhelmingly on coastal plain gauges ($x < -20\text{ km}$, mean leverage $-0.43$), where the upstream ocean footprint gives near-zero convolved slope forcing while observed rainfall is high ($2,500\text{--}3,500\text{ mm}$).
  - *Decision Criterion*: If residualized $\rho$ exceeds $\sim 0.90$ under refined candidate coordinates, the two terms are declared degenerate and collapsed to ONE term. Because $\rho \ll 0.90$ across the full regional network, the two-term form remains mathematically identifiable, but its empirical separation is contingent on coastal and ramp gauge retention.

### 2.3 Absence of Leeward Subsidence & $h_{\text{max}}$ Step Functions
The formulation strictly omits an ad-hoc leeward subsidence term and omits any $h_{\text{max}}$-crossed trigger:
- The Deccan plateau east of the crest sits at $600\text{ to }900\text{ m}$ with an almost horizontal slope ($\partial h / \partial x \approx 0.002$).
- Maximum upwind crest height $h_{\text{max}}$ is constant for all points east of the ridgeline; an $h_{\text{max}}$ trigger degenerates into a non-physical step function.
- Leeward drying is naturally produced by source termination $S(x) \to 0$ east of the crest, followed by exponential downstream decay governed continuously by kernel $K(x)$.

### 2.4 Mechanics of the Windward-Slope Maximum
The rainfall maximum occurs mid-escarpment (at $300\text{--}700\text{ m}$ elevation), not at the crest:
- It is physically produced by the combination of maximal mid-escarpment slope $\partial h / \partial x$ and high moisture content aloft ($\exp(-h/H_w)$).
- The downstream kernel $K(x)$ displaces precipitation *towards* the crest and therefore slightly opposes the mid-slope maximum. Kernel advection is a smoothing modifier, not the cause of the maximum.

### 2.5 Pre-Filter Scale Justification & Coordinate Sensitivity
- The terrain pre-filter scale ($R_{\text{filter}} \approx 3\text{ to }5\text{ km}$) is justified by the planetary boundary layer depth ($z_{\text{PBL}} \sim 1\text{ km}$, yielding a multi-kilometer horizontal mixing scale) and empirical terrain–rainfall coherence collapse.
- *Coordinate Precision Sensitivity (R7-1)*: Point queries on raw 30 m DEMs exhibit extreme sensitivity to station coordinate truncation. Stated GHCN coordinates at $0.01^\circ$ (~1.1 km) resolution produce elevation shifts of $\pm 50\text{ to }257\text{ m}$ and local slope changes of $\pm 10\text{ to }18\%$ on the steep escarpment ramp (e.g. Gaganbawada, Karwar). Pre-filtering terrain at $\ge 3\text{ km}$ is mandatory to prevent station coordinate noise from dominating the predictor.

---

## 3. Parameter Count & Estimation Protocol

### 3.1 Primary Configuration: TWO Fitted Parameters ($L, \eta$ with $P_\infty$ Joint)
Following withdrawal of the drying-ratio prior (Appendix A.1), the primary operational configuration features **two fitted parameters**:
1. **$L$** (Downstream advective decay length, km).
2. **$\eta$** (Precipitation efficiency factor, non-dimensional), fitted jointly with $P_\infty$ (far-lee background rainfall).
- The far-lee anchor is dropped so those stations return to the residual evaluation pool.
- $\tau$ is **fixed at $\sim 1,000\text{ s}$** from generic literature (Smith–Barstad 2004) under the **fix-then-validate protocol**: fixing $\tau$ and fitting $L$ allows an independent test of whether the observed local decay length ($20\text{--}25\text{ km}$) is reproduced.

### 3.2 Fallback Configuration: ONE Fitted Parameter ($L$)
If design-matrix conditioning collapses under refined candidate pilot subsets ($\rho > 0.90$), the fallback configuration takes force:
- The source collapses to ONE term ($S_{\text{slope}}$).
- $\eta$ is pinned by physical constraints, leaving strictly **one fitted parameter ($L$)**.

> [!WARNING]
> **Prohibited Configuration**: Anchoring both ends ($P_{\text{coast}}$ and $P_\infty$) while fitting three parameters leaves zero residual degrees of freedom across sparse transects. Any fit-quality statistic from such a configuration is mathematically vacuous and is strictly prohibited.

### 3.3 Sampling-Geometry Promotion Condition (R7-7 Revision)
The flat twenty-station promotion trigger is replaced by a rigorous **sampling-geometry condition**:
- **Geometry Requirement**: Approximately **20–30 stations** distributed across the transect:
  - 3–7 km cross-barrier spacing across the steep escarpment ramp ($x \in [-20, +10]\text{ km}$).
  - 10–15 km cross-barrier spacing across the coastal plain ($x < -20\text{ km}$).
  - Spanning 4–6 latitudinally distributed transects, with separate immediate-lee anchors.
- *Elevation Warning*: Any collection of 20–30 gauges situated predominantly below 500 m does NOT satisfy this condition. Elevation cannot serve as a windward/lee classifier since crest and plateau both sit at 600–900 m.
- *Promotion Test*: Leave-one-out cross-validation is promoted from an influence diagnostic to a statistical skill score **only when**:
  1. The sampling-geometry condition is met.
  2. Synthetic-recovery simulations at the real candidate coordinates confirm parameter recovery.
  3. The R7-2 identifiability diagnostic passes ($\rho < 0.90$).

---

## 4. Statistical Fitting, Error Budgets & Validation Boundaries

### 4.1 Statistical Specification of Noise Floor & Error Budget (R7-9b)
The representativeness noise floor of $\pm 30\%$ is explicitly defined as a **multiplicative lognormal distribution with $\text{CV} = 0.30$**, corresponding to:

$$\sigma_{\log} = \sqrt{\ln(1 + \text{CV}^2)} = \sqrt{\ln(1 + 0.09)} \approx 0.294$$

Residual errors below $\sim 0.12$ in $\log_{10}$ ($\approx 0.28$ in natural log) represent uninterpretable fitting noise.
- **Decomposition of Station Error Budget**:
  1. *Persistent Random Spatial Discrepancy* (unresolved micro-topography, unmodelled local valley sheltering, and coordinate precision; random floor $\pm 30\%$).
  2. *Spatially Coherent Systematic Channel* (gauge exposure, aerodynamic orifice wind loss undercatch, and wind-curvature bias; modeled explicitly in Sections 4.5 and 4.6, NOT pooled into the random floor).
  3. *Interannual Sampling Variance* (finite sample of JJAS seasons; for Kolhapur, $228.1 / \sqrt{58} \approx 29.9\text{ mm}$, representing $\sim 3.8\%$ sampling uncertainty under Tier 1).
  4. *Averaged Measurement Error* (gauge reading precision, daily resolution).
- **Double-Count Removal**: The random representativeness noise floor of $\pm 30\%$ ($\sigma_{\log} \approx 0.294$) subsumes ONLY random micro-topographic variability, unmodelled local sheltering, and coordinate error. Aerodynamic orifice wind loss and gauge exposure are strictly removed from the random floor and assigned exclusively to the spatially coherent systematic channel (Sections 4.5 and 4.6). Independent random variances must not be added across components to avoid artificial inflation of apparent uncertainty.

### 4.2 Synthetic Recovery Design (R7-9c)
Validation is evaluated across two separate simulation tracks at real candidate station coordinates:
1. **Track 1 (Two-Term Baseline Recovery)**: Generate synthetic observations from the two-term model under realistic station coordinates; evaluate parameter bias, confidence interval coverage, interval width, power to detect the barrier term, and false-positive rate when $S_{\text{coast}} = 0$.
2. **Track 2 (Omitted Mechanism Stress Test)**: Generate synthetic observations from richer physical alternatives:
   - Latitude-varying background moisture.
   - Mixed wind directions and variable kernel lengths.
   - Localized windward or leeward mechanisms absent from the fit.
   - Exposure-correlated catch efficiency.
   - Real station-year missingness masks.
- *Covariance Structure*: Resample whole regional years jointly. Propagate reference-station covariance $\text{Cov}(r_i, r_j) = C_{ij} - C_{ir} - C_{rj} + C_{rr}$ with anisotropic exponential covariance ($\ell_\perp \in \{5, 15, 40\}\text{ km}$, $\ell_\parallel \in \{25, 75, 200\}\text{ km}$) and Matérn ($\nu = 3/2$).

### 4.3 Split Pass Criteria & Honest Fallback (R7-9d)
Mechanism attribution and rainfall prediction are strictly separated:
- **Attribution Claim**: Requires nominal parameter coverage, power $\ge 80\%$ to detect the barrier term, and bounded parameter bias across all Track 2 scenarios.
- **Prediction Claim**: Requires held-out cross-validated whole-transect RMSE within noise floor and bounded coastal-to-crest systematic bias.
- **Honest Fallback Protocol (Verbatim)**:
  > *If prediction survives but attribution does not, the claim is that the model reproduces the observed cross-barrier contrast while the two amplitudes are not separately interpretable.*

### 4.4 R7-0 / R9-1 Completeness Gate, Flag Semantics & Tier Definitions
Monsoon seasons (122 observation days in JJAS) are partitioned into four explicit tiers:
- **Measurement Flag Semantics (`M_FLAG`)**:
  - `B` = daily precipitation total formed from two 12-hour totals (within-day composition, NOT multi-day accumulation).
  - `D` = daily precipitation total formed from four six-hour totals (within-day composition, NOT multi-day accumulation).
  - Neither `B` nor `D` denotes multiday accumulation across calendar day boundaries.
- **Source Flag `S` Caution (NOAA GHCN-Daily README Verbatim)**:
  > `"S" = Global Summary of the Day (NCDC DSI-9618)`  
  > `NOTE: "S" values are derived from hourly synoptic reports exchanged on the Global Telecommunications System (GTS). Daily values derived in this fashion may differ significantly from "true" daily data, particularly for precipitation (i.e., use with caution).`
- **Tier 1 (T1) Complete Daily Coverage**: Exactly 122/122 daily valid records present, zero missing days, and all quality flags blank (`Q_FLAG == ''`).
- **Tier 1b (T1b) Quality-Flag Filtered Coverage**: 120–121 clean days with $\le 2$ quality-flagged days, reported with and without the flagged days.
- **Tier 2 (T2) Complete via Multi-Day Accumulation**: Missing daily intervals fully accounted for by valid multi-day accumulation periods, detectable strictly through dedicated GHCN elements `MDPR` (multiday total), `DAPR` (number of days in accumulation), and `DWPR` (days with precipitation).
  - *CDO CSV Limitation*: On-disk NOAA CDO CSV exports omit `MDPR`/`DAPR`/`DWPR`. Consequently, for on-disk CSV files, **Tier T2 is undetermined**.
- **Tier 3 (T3) Incomplete / Sensitivity Set**: Seasons with $>2$ missing days or unassignable straddling accumulations.
  - *Missingness Policy*: Dropout during extreme events is missing-not-at-random (MNAR). Simple day-fraction scaling is prohibited. Primary fits use T1 (or T1+T1b); T3 is retained only for sensitivity stress-testing.
  - *Decision Rule*: If plausible T3 reconstructions materially alter fitted amplitudes or generate false evidence for the barrier term, the inference is declared missingness-sensitive and not robust.

### 4.5 Aerodynamic Gauge Catch Efficiency (R7-9f)
- Fractional aerodynamic gauge undercatch is governed by wind speed at the gauge orifice, exposure, and droplet size distribution (larger drops in heavy convective rain deflect less, so catch loss does not universally increase with intensity).
- Differential catch efficiency between windward crest (high wind) and coastal plain (lower wind) does not cancel in log ratios: plausible differentials of 0.90 vs 0.97 and 0.80 vs 0.97 suppress observed orographic enhancement by **7.2% and 17.5%**.
- Corrections keyed directly to rainfall totals are prohibited. Sensitivity is evaluated under exposure-susceptibility scenarios $\log c_i = \alpha - \gamma E_i$ at 0, 5, 10, and 20 percentage points (WMO-No. 8).

### 4.6 Spatially Coherent Wind Bias (R7-9a)
- The full-domain spatial integral of the convolved source is exactly linear in wind speed $U$, so temporal wind variability redistributes rainfall without biasing open-domain totals.
- At a fixed cross-barrier position, the second-order curvature carries the factor $r(r-2)$ (where $r = x/L$), yielding negative curvature within two kernel lengths ($x < 2L$) and positive curvature beyond.
- While a constant-slope estimate gives $-0.29 \cdot \text{CV}^2 \approx -7\%$ (at $\text{CV} = 0.5$), this bias is **spatially coherent in the cross-barrier direction** and does not average down. It is declared as a systematic sensitivity scenario evaluated via a credential-free NCEP/NCAR wind–moisture–direction regime ensemble.

### 4.7 Reporting Separation (R7-9g)
In all performance tables and outputs, **random uncertainty** (station scatter, interannual sampling) and **coherent systematic sensitivity** (wind curvature, catch deficiency, coordinate truncation) must be reported in **separate columns**, never pooled into a single error term.

---

## 5. R6 — Validation-Target Register (Reclassified)

### 5.1 Excluded as Validation Truth; Admissible for Contextual Comparison
The following gridded datasets are excluded as validation truth because validating against them is circular, but are admissible as clearly labeled contextual or sensitivity comparisons:
1. **IMD 0.25° Gridded Daily Rainfall**: Inverse-distance interpolation of the exact same sparse national gauge network; evaluates smoothed gauge data with no independent physical validation value.
2. **APHRODITE (0.25° / 0.05°)**: Incorporates Daly-style elevation-weighted orographic corrections over IMD gauges; represents the same gauges pre-blended with a DEM prior (doubly circular).
3. **CHIRPS v2.0 (0.05°)**: Incorporates CHPclim climatology, which uses elevation as a primary regression covariate; testing our downscaled model against it tests one terrain regression against another.

### 5.2 Contingent Target: GPM IMERG Climatology
- **Role**: Admitted strictly as a **shape-only, normalized cross-barrier profile check with amplitude discarded**.
- **Physical Rationale**: Satellite passive-microwave retrievals miss shallow warm-rain orographic clouds and heavily underestimate precipitation along the Western Ghats windward slope.
- **Access & Prerequisite**: Requires free NASA Earthdata registration with zero queue; evaluated only after station gate clearance.

---

## 6. Missing-Pieces Register & Lead Verification Protocol

### 6.1 Programmatic Data Leads
1. **NOAA GHCN-Daily `.dly` Station Records**:
   - *Status*: Primary cheap unblock; 181 multi-decadal stations exist in inventory; requires zero credentials.
   - *Plan*: Stratified pilot of 15–20 stations before bulk fetch.
2. **Offshore Inflow Winds (NCEP/NCAR PSL Reanalysis)**:
   - *Status*: Replaces CDS ERA5 as the primary credential-free route for inflow wind conditioning and regime ensemble tests.
3. **Palghat Gap Transect (127 Multi-Decadal Stations)**:
   - *Status*: Unblocks downslope lee-descent evaluation ($10.0^\circ\text{--}12.5^\circ\text{N}$).

### 6.2 External State & Institutional Leads (Verification Required Before Ingestion)
The following potential data sources represent investigatory leads requiring verification before any operational use:
1. **Karnataka KSNDMC Network**: State telemetric rain gauge and AWS network.
2. **Maharashtra Mahavedh Network**: State agricultural weather portal.
3. **State Water Resources & Reservoir Gauges**: Irrigation department catchment gauges.
4. **India-WRIS Portal**: Data access portal, not an independent observing network.
5. **IITM Mahabaleshwar High-Altitude Cloud Physics Laboratory**: Specialized campaign radar and microphysics records.

*Mandatory Verification Protocol Before Use*:
For each candidate network, six questions must be answered:
1. What is the operator crosswalk and station identifier history?
2. What are the exact coordinates, elevation, and instrument relocation history?
3. What observation-day convention is used (08:30 IST vs 00:00 UTC)?
4. What are the missing-data, trace, and multi-day accumulation codes?
5. Were historical records imported from or shared with IMD?
6. Did this network feed published IMD or satellite-gauge gridded products?
*(Note: Independently operated instruments that contributed to IMD gridded products are not independent validation truth).*

---

## 7. Explicit Non-Claims (Hard Validation Boundaries)

The downscaling PoC strictly disclaims and will NOT claim:
1. No daily convective arrival timing or squall-line passage predictions.
2. No extreme cloudburst or 100-year return period extrapolations.
3. No ungauged interior gorge micro-catchment runoff claims without local gauge validation.
4. No spatial rainfall surface published without a Froude-number saturation cap over the highest 1,900 m peaks (e.g. Kudremukh, Pushpagiri).
5. No claim of independence from IMD observational networks for GHCN-Daily records. Published results must state: *Validated against held-out station observations distributed through GHCN-Daily, with possible observational-network overlap with IMD-derived products.*

---

## Appendix: Open Physics Discrepancies & Scientific Corrections

### A.1 Withdrawal of the Drying-Ratio Efficiency Prior
- **The Issue**: A domain-scale atmospheric drying ratio is not a cloud precipitation efficiency and cannot serve as the amplitude coefficient of a land-slope rainfall model.
- **Discrepancy Reconciliation**:
  - A land-only cross-barrier strip calculation (mean precipitation depth $3.5\text{ m}$ over $100\text{ km}$ across 122 days against cross-barrier moisture flux $\text{IVT} \approx 400\text{ kg m}^{-1}\text{ s}^{-1}$) yields:
    $$\text{DR}_{\text{land}} = \frac{3.5\text{ m} \times 10^3\text{ kg m}^{-3} \times 10^5\text{ m}}{400\text{ kg m}^{-1}\text{ s}^{-1} \times (122 \times 86400\text{ s})} \approx \frac{3.5 \times 10^8}{4.22 \times 10^9} \approx 0.083 \quad (8.3\%)$$
  - Our preliminary budget figure of $\sim 7\%$ is physically consistent with land-only orographic extraction.
  - In contrast, published literature values of $\text{DR} \approx 0.3\text{ to }0.5$ over the same 100 km footprint would require an implausibly low inflow IVT of only $66\text{ to }111\text{ kg m}^{-1}\text{ s}^{-1}$ (or inclusion of offshore precipitation over hundreds of kilometers).
- **Formal Status**: The drying-ratio efficiency prior is **withdrawn, not deferred**. Efficiency $\eta$ floats as a free parameter, and the **two-parameter configuration ($L, \eta$) is primary**.

### A.2 Corrected Condensation Rate $C_w$ & Flux Ceiling
- **Magnitude Correction**: Pseudo-adiabatic ascent at $T = 25^\circ\text{C}$ and $p = 950\text{ hPa}$ has $C_w = \rho_a (\partial q_{\text{sat}} / \partial z) \approx 0.017\text{ to }0.025\text{ kg m}^{-3}$ (correcting an earlier order-of-magnitude unit error of $1.5 \times 10^{-3}$).
- **Physical Implication**: Unblocked upslope condensation ($C_w \cdot U \cdot \nabla h$) over-predicts crest rainfall roughly **fivefold**, exceeding the incoming column moisture flux ceiling ($\sim 475\text{ mm/day}$).
- **Parameterization**: This reduction is caused by upstream blocking, low-level boundary-layer deceleration, and along-barrier deflection at dry Froude number $Fr < 1$. It is parameterized via efficiency $\eta$, not resolved. Any efficiency previously inferred alongside the wrong $C_w$ is discarded rather than rescaled.
