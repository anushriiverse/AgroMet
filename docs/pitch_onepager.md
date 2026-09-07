# High-Resolution Orographic Rainfall Downscaling for Village-Level Resilience
**Executive Briefing for Hackathon Judges | Ministry of Earth Sciences & Government of Karnataka**

---

### The Problem: Global Models Cannot See the Mountains
Coarse numerical weather prediction models and global climate reanalyses operate on 25-to-30 kilometer grid cells. Across the Western Ghats, this spatial resolution is blind to the steep mountain wall, completely smoothing away topographic ridges and river gorges. As a result, standard operational models blur a ferocious **22-fold rainfall gradient**—collapsing a real physical transition from over 7,000 mm of annual monsoon deluge at the mountain crest to under 320 mm in the parched Deccan rain shadow across a distance of just 200 kilometers. Mountain communities and farmers in the rain shadow receive severely distorted forecasts that fail to capture localized climate risk.

---

### The Rule: Physics-Based Advective Convolution
Instead of treating rainfall downscaling as a black-box machine learning problem or running computationally prohibitive numerical fluid solvers, our engine applies a physically grounded, **one-sided advective convolution rule**:

- **Moisture Ascent & Condensation**: Moist maritime air entering from the Arabian Sea along the prevailing southwest monsoon jet (250° azimuth) is forced upward by the terrain ramp. Theoretical condensation is generated in direct proportion to local slope and atmospheric moisture scale height.
- **Downwind Hydrometeor Drift**: Condensing droplets do not fall vertically; they drift downwind with the monsoon winds before falling out as precipitation. We model this drift using a one-sided exponential relaxation kernel.
- **Only Two Fitted Knobs**: The entire physical downscaling operator requires just two calibrated parameters: an **advective decay scale ($L = 20.8$ km)** representing the downwind hydrometeor fallout distance, and an **orographic precipitation efficiency ($\eta = 7.7\%$)** capturing lateral air diversion and cloud droplet evaporation. All baseline boundaries are anchored directly to empirical observations (3,300 mm coastal baseline and 318 mm Chitradurga rain shadow floor).

![Transect Profile](../figs/transect_profile.png)

---

### The Evidence: Gauge-Verified Accuracy and Natural Noise Floor
We validated the downscaling engine against the multi-decadal NOAA Global Historical Climatology Network (GHCN) across the Western Ghats:
1. **Calibrated 1D Model**: Achieves **11.5% median absolute percent error** across all 19 stations, and **19.2% on the 12 unanchored stations** that were never used to set baseline boundaries.
2. **250-Meter Field Windward Reproduction**: The continuous 2D raster reproduces the calibrated windward profile to within **0.8% to 3.8%** across seven independent coastal plain stations and the Agumbe summit anchor.
3. **250-Meter Field Overall Accuracy**: The full 2D field delivers **16.6% median error overall**, though error increases to **31.9% in the leeward rain shadow**.
4. **Inside the Natural Noise Floor**: Gauges that the 1D model cannot distinguish, because they share the same crest-distance to within about 1 km, disagree with each other by $\sigma_{\log} \approx 0.29$ (+20 km cluster; pairwise ground separations 29.0–74.9 km) and $0.27$ (crest cluster; ground separations 56.9–145.8 km), while the model's own scatter is **0.109** ($\pm 11.5\%$). This representativeness noise floor applies to the 1D model specifically, demonstrating that **the model's prediction error sits comfortably inside the natural variation of indistinguishable physical gauges**.

![Downscaled Rainfall Map](../figs/rainfall_map.png)

---

### The Product: Actionable Rainfall for Validated Band (8,634 Villages, 12.8–15.3°N) and Demonstrated Coverage (8,309 Villages)
- **Primary Deliverable (Validated Band: 8,634 Villages, 12.8–15.3°N)**: All 8,634 villages inside the validated Karnataka latitude band (12.8–15.3°N; 8,514 in Karnataka, 120 in Goa; flagged `inside_validated_band = True`) receive downscaled rainfall with verified accuracy: windward villages carry 9.1% field error and lee villages carry 31.9% field error (16.6% median error overall; 11.5% in 1D).
- **Demonstrated Coverage Pending Gauge Calibration (8,309 Villages, Outside 12.8–15.3°N)**: The remaining 8,309 villages outside the 12.8–15.3°N validated band (3,852 northern Karnataka, 4,175 Maharashtra, 282 Goa; flagged `inside_validated_band = False`) receive continuous 250 m coverage from the identical physics operator: 3,210 villages sit at the anchored rain-shadow floor ($\le 349.9\text{ mm}$) and 5,099 receive substantive extrapolated values. Maharashtra represents the largest uncalibrated exposure (3,597 villages receiving substantive values with zero state gauges in the calibration set).
- **Operational Scale**: Downscaled continuous rainfall generated at **250-meter resolution** across the entire Western Ghats domain in **under 10 seconds** without supercomputing infrastructure; no rows are deleted and the 2D GeoTIFF is unclipped, with the `inside_validated_band` flag separating the validated 12.8–15.3°N band from northern coverage.
- **Material Topographic Impact**: Authoritatively, **66.9% of all villages** (11,338 villages) receive an active, non-baseline topographic adjustment above the rain-shadow floor (villages above 349.9 mm, i.e. above the anchored 318.1 mm floor plus 10%), resolving sharp seasonal monsoon accumulation gradients along mountain flanks that coarse global models entirely miss.

---

### Honest Engineering Limits
- **Validated Band Only**: The downscaling parameters are strictly validated within the Karnataka transect band ($12.8^\circ\text{--}15.3^\circ\text{N}$). 8,634 villages (51%) lie inside the validated 12.8–15.3°N band; all 4,175 Maharashtra villages and 282 of 402 Goa villages lie outside it; of the outside-band villages, 3,210 sit at the anchored floor and 5,099 receive substantive extrapolated values. Maharashtra represents the largest extrapolation exposure: 3,597 of 4,175 Maharashtra villages receive substantive extrapolated values with no Maharashtra gauge in the calibration set, and the Maharashtra escarpment differs in crest height and barrier width from the Karnataka transect. Validating the northern extension would require long-term JJAS gauge records in the 15.3–17.6°N band; while GHCN station IN022030400 (Bombay/Santacruz, ~19.1°N) was identified earlier, it lies outside even the extended domain. All raster cells north of $15.3^\circ\text{N}$ represent physical extrapolation across changing mountain geometry.
- **Leeward Wake Dispersion**: Accuracy is lower in the leeward rain shadow (31.9% error) because 1D ray tracing cannot fully resolve secondary 3D turbulent mixing behind isolated massifs (such as the Bababudan ridge).
- **Physical Extrapolation at High Ridges**: Model values lead with the measured maximum of 7,061 mm at Agumbe; values exceeding 7,061 mm (reaching 9,830.9 mm on Kudremukh peak) represent physical extrapolation above the highest available ground station, covering 4,769 cells (288.5 km²) and only 7 out of 16,943 villages.

---

### 60-Second Spoken Pitch Script (For Live Presentation to Judges)

> "Global weather models have a severe blind spot: their coarse 25-kilometer grid completely misses the steep wall of the Western Ghats, smearing out a massive 22-fold rainfall contrast between the coast and the interior plateau.  
> To solve this without expensive supercomputers, our physics engine applies an elegant two-knob rule that models how moist monsoon winds condense as they hit the mountains and drift downwind before raining out.  
> When verified against long-term NOAA weather stations, our model predicts seasonal monsoon rainfall with 11.5% median error across all 19 stations, and reaches 19.2% on gauges we never used to tune it.  
> Crucially, this prediction error is smaller than the disagreement between gauges that share the same crest distance to within about 1 km, which differ by nearly thirty percent despite being tens of kilometers apart on the ground.  
> Our 250-meter map delivers seasonal monsoon totals for seventeen thousand villages, with gauge validation across the central Karnataka Ghats, 12.8–15.3°N, about half our total.  
> We anchor to the measured record of seven thousand millimetres at Agumbe, and label anything above that as extrapolation, not fact."
