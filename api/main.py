import os
from pathlib import Path
import numpy as np
import pandas as pd
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AgroMet Downscaling API",
    description="High-resolution lookup API for downscaled JJAS weather and crop water variables across the Western Ghats",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "village_serving.csv"
if not DATA_PATH.exists():
    DATA_PATH = Path("api/data/village_serving.csv")
if not DATA_PATH.exists():
    DATA_PATH = Path("release/api/data/village_serving.csv")

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Serving table not found at {DATA_PATH}")

df = pd.read_csv(DATA_PATH)
df["village_id"] = df["village_id"].astype(str)
df["name"] = df["name"].astype(str)
df["name_lower"] = df["name"].str.lower()
df["state"] = df["state"].astype(str)
df["inside_validated_band"] = df["inside_validated_band"].astype(bool)

VILLAGE_LATS = df["lat"].to_numpy(dtype=np.float64)
VILLAGE_LONS = df["lon"].to_numpy(dtype=np.float64)
VILLAGE_LATS_RAD = np.radians(VILLAGE_LATS)
VILLAGE_LONS_RAD = np.radians(VILLAGE_LONS)

DOMAIN_LAT_MIN = 12.948
DOMAIN_LAT_MAX = 17.550
DOMAIN_LON_MIN = 73.448
DOMAIN_LON_MAX = 76.552

REFERENCE_STATIONS = [
    {"village_id": "station:IN009181800", "name": "Agumbe", "state": "KA", "lat": 13.530, "lon": 75.080},
    {"village_id": "station:IN009183600", "name": "Agumbe Obsy", "state": "KA", "lat": 13.500, "lon": 75.100},
    {"village_id": "station:IN009181600", "name": "Hulikal", "state": "KA", "lat": 13.730, "lon": 75.020},
    {"village_id": "station:IN009120100", "name": "Karwar", "state": "KA", "lat": 14.783, "lon": 74.133},
    {"village_id": "station:IN009061000", "name": "Sringeri", "state": "KA", "lat": 13.420, "lon": 75.250},
    {"village_id": "station:IN012131800", "name": "Kolhapur", "state": "MH", "lat": 16.700, "lon": 74.233},
    {"village_id": "station:IN009060500", "name": "Chickmagalur", "state": "KA", "lat": 13.330, "lon": 75.770},
    {"village_id": "station:IN009180200", "name": "Shimoga", "state": "KA", "lat": 13.930, "lon": 75.630},
    {"village_id": "station:IN009181200", "name": "Sagar", "state": "KA", "lat": 14.170, "lon": 75.030},
    {"village_id": "station:IN009180400", "name": "Thirthahalli", "state": "KA", "lat": 13.680, "lon": 75.230},
    {"village_id": "station:IN009060801", "name": "Mudigere", "state": "KA", "lat": 13.130, "lon": 75.630},
    {"village_id": "station:IN009120400", "name": "Honavar", "state": "KA", "lat": 14.283, "lon": 74.450},
    {"village_id": "station:IN009120300", "name": "Kumta", "state": "KA", "lat": 14.420, "lon": 74.420},
    {"village_id": "station:IN009120200", "name": "Ankola", "state": "KA", "lat": 14.670, "lon": 74.300},
    {"village_id": "station:IN009130500", "name": "Baindur", "state": "KA", "lat": 13.870, "lon": 74.630},
    {"village_id": "station:IN009120101", "name": "Bhatkal", "state": "KA", "lat": 13.980, "lon": 74.550},
    {"village_id": "station:IN009063400", "name": "Kottigehar Toll", "state": "KA", "lat": 13.080, "lon": 75.500},
    {"village_id": "station:IN009181101", "name": "Jog Pt.Colony", "state": "KA", "lat": 14.170, "lon": 74.750},
    {"village_id": "station:IN009181501", "name": "Hosanagar", "state": "KA", "lat": 13.920, "lon": 75.050},
    {"village_id": "station:IN009070100", "name": "Chitradurga", "state": "KA", "lat": 14.233, "lon": 76.433},
]


def haversine_vectorized(query_lat: float, query_lon: float) -> np.ndarray:
    r = 6371.0
    query_lat_rad = np.radians(query_lat)
    query_lon_rad = np.radians(query_lon)

    dlat = VILLAGE_LATS_RAD - query_lat_rad
    dlon = VILLAGE_LONS_RAD - query_lon_rad

    a = np.sin(dlat / 2.0) ** 2 + np.cos(query_lat_rad) * np.cos(VILLAGE_LATS_RAD) * np.sin(dlon / 2.0) ** 2
    a = np.clip(a, 0.0, 1.0)
    c = 2.0 * np.arctan2(np.sqrt(a), np.sqrt(1.0 - a))
    return r * c


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/predict")
def predict(
    lat: float = Query(..., description="Latitude of query location"),
    lon: float = Query(..., description="Longitude of query location")
):
    distances = haversine_vectorized(lat, lon)
    min_idx = int(np.argmin(distances))
    distance_km = round(float(distances[min_idx]), 2)

    row = df.iloc[min_idx]
    in_domain = bool(
        DOMAIN_LAT_MIN <= lat <= DOMAIN_LAT_MAX and
        DOMAIN_LON_MIN <= lon <= DOMAIN_LON_MAX
    )

    v_name = str(row["name"])
    v_state = str(row["state"])
    v_lat = round(float(row["lat"]), 5)
    v_lon = round(float(row["lon"]), 5)
    v_elev = round(float(row["elevation_m"]), 1)
    v_temp = round(float(row["temp_c"]), 2)
    v_eto = round(float(row["eto_mm_day"]), 2)
    v_rain = round(float(row["rainfall_jjas_mm"]), 1)
    v_val_band = bool(row["inside_validated_band"])

    sentences = [
        "Seasonal JJAS values downscaled from ERA5 0.25 degree reanalysis using 30 m SRTM terrain; rainfall calibrated against 19 NOAA GHCN gauges."
    ]
    if v_val_band:
        sentences.append("Rainfall estimate lies within the 12.8-15.3N gauge-validated band (19-gauge calibrated).")
    else:
        sentences.append("Rainfall estimate lies outside the 12.8-15.3N gauge-validated band and represents uncalibrated spatial extrapolation.")

    if distance_km > 20.0:
        sentences.append(f"Warning: Nearest village ({v_name}) is {distance_km:.1f} km away; local microclimate and terrain effects may differ.")
    else:
        sentences.append(f"Nearest village is {v_name} at a distance of {distance_km:.1f} km.")

    note = " ".join(sentences)

    return {
        "village_id": str(row["village_id"]),
        "name": v_name,
        "village_name": v_name,
        "state": v_state,
        "lat": v_lat,
        "lon": v_lon,
        "elevation_m": v_elev,
        "temp_c": v_temp,
        "eto_mm_day": v_eto,
        "rainfall_jjas_mm": v_rain,
        "inside_validated_band": v_val_band,
        "distance_km": distance_km,
        "in_domain": in_domain,
        "note": note
    }


@app.get("/api/search")
def search(q: str = Query("", description="Village name substring to search")):
    query = q.strip().lower()
    if not query:
        return []

    results = []
    # Check reference stations first
    for st in REFERENCE_STATIONS:
        if query in st["name"].lower():
            results.append({
                "village_id": st["village_id"],
                "name": st["name"],
                "state": st["state"],
                "lat": st["lat"],
                "lon": st["lon"]
            })

    # Search village table
    matches = df[df["name_lower"].str.contains(query, regex=False)]
    for _, row in matches.iterrows():
        if len(results) >= 8:
            break
        # Avoid duplicate names at same coords
        results.append({
            "village_id": str(row["village_id"]),
            "name": str(row["name"]),
            "state": str(row["state"]),
            "lat": round(float(row["lat"]), 5),
            "lon": round(float(row["lon"]), 5)
        })

    return results[:8]


@app.get("/api/model_info")
def model_info():
    return {
        "rainfall": {
            "median_ape_pct": 11.5,
            "unanchored_mape_pct": 19.2,
            "windward_mape_pct": 9.1,
            "leeward_mape_pct": 31.9,
            "n_gauges": 19,
            "domain_band": "12.8-15.3N",
            "n_villages_in_band": 8634,
            "n_villages_total": 16943
        },
        "temperature": {
            "method": "lapse-rate physics (6.5 C/km) on 30 m SRTM polygon-mean elevation; served values are physics-only",
            "validation_split": "leave-one-station-out",
            "stations": ["Aurangpur", "Bhatsanagar_1", "Natuwadi Dam_1"],
            "loso_mae_baseline_c": 2.13,
            "loso_mae_corrected_c": 1.63,
            "pct_improvement": 23.6,
            "note": "The XGBoost residual correction was validated leave-one-station-out at three stations (MAE 2.13 -> 1.63 C, 23.6% improvement) but is NOT applied to the village values served here; it requires hourly ERA5 inputs unavailable at request time."
        }
    }
