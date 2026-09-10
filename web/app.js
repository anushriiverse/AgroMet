const API_BASE = "http://localhost:8000";

// Domain boundaries: 12.948-17.550N, 73.448-76.552E
const DOMAIN = {
  latMin: 12.948,
  latMax: 17.550,
  lonMin: 73.448,
  lonMax: 76.552,
};

const DEFAULT_CENTER = [75.1046, 13.5345]; // [lon, lat] for Tallur
const DEFAULT_ZOOM = 10;

// Initialize MapLibre GL map with OSM raster tiles
const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {
      "osm-raster": {
        type: "raster",
        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    },
    layers: [
      {
        id: "osm-raster-layer",
        type: "raster",
        source: "osm-raster",
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  },
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
});

let activeMarker = null;

function updateMarker(lon, lat) {
  if (activeMarker) {
    activeMarker.setLngLat([lon, lat]);
  } else {
    activeMarker = new maplibregl.Marker({ color: "#2563eb" })
      .setLngLat([lon, lat])
      .addTo(map);
  }
}

// Update the frosted glass panel with API response data
function updatePanel(data, customNotice = null) {
  const nameEl = document.getElementById("village-name");
  const stateEl = document.getElementById("village-state");
  const noticeEl = document.getElementById("domain-notice");
  const tempEl = document.getElementById("temperature");
  const etoEl = document.getElementById("stat-eto");
  const rainEl = document.getElementById("stat-rainfall");
  const noteEl = document.getElementById("panel-note");
  const badgeEl = document.getElementById("badge-pill");

  nameEl.textContent = data.name || data.village_name || "Unknown Village";
  stateEl.textContent = data.state || "";

  if (customNotice) {
    noticeEl.textContent = customNotice;
    noticeEl.classList.remove("hidden");
  } else {
    noticeEl.classList.add("hidden");
    noticeEl.textContent = "";
  }

  tempEl.innerHTML = `${Number(data.temp_c).toFixed(1)}<span class="temperature-unit">°C</span>`;
  etoEl.textContent = `${Number(data.eto_mm_day).toFixed(1)} mm/day`;
  rainEl.textContent = `${Math.round(data.rainfall_jjas_mm)} mm JJAS`;
  noteEl.textContent = data.note || "";

  if (data.inside_validated_band) {
    badgeEl.textContent = "Gauge-validated band";
    badgeEl.className = "badge-pill badge-validated";
  } else {
    badgeEl.textContent = "Outside validated band";
    badgeEl.className = "badge-pill badge-unvalidated";
  }
}

// Fetch prediction from /api/predict
async function fetchPrediction(lat, lon, customNotice = null) {
  try {
    const res = await fetch(`${API_BASE}/api/predict?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    updatePanel(data, customNotice);
    updateMarker(lon, lat);
  } catch (err) {
    console.error("Failed to fetch prediction:", err);
  }
}

// Map click event
map.on("click", (e) => {
  const lon = e.lngLat.lng;
  const lat = e.lngLat.lat;
  updateMarker(lon, lat);
  fetchPrediction(lat, lon);
});

// Geolocation on load
function handleGeolocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const inside =
          lat >= DOMAIN.latMin &&
          lat <= DOMAIN.latMax &&
          lon >= DOMAIN.lonMin &&
          lon <= DOMAIN.lonMax;

        if (inside) {
          map.flyTo({ center: [lon, lat], zoom: 11 });
          fetchPrediction(lat, lon);
        } else {
          map.flyTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
          fetchPrediction(
            DEFAULT_CENTER[1],
            DEFAULT_CENTER[0],
            "showing Tallur, Karnataka - your location is outside the mapped domain"
          );
        }
      },
      () => {
        // Geolocation denied or failed -> default Tallur
        fetchPrediction(DEFAULT_CENTER[1], DEFAULT_CENTER[0]);
      },
      { timeout: 5000 }
    );
  } else {
    fetchPrediction(DEFAULT_CENTER[1], DEFAULT_CENTER[0]);
  }
}

// Search functionality with 300ms debounce
const searchInput = document.getElementById("search-input");
const searchDropdown = document.getElementById("search-dropdown");
let debounceTimer = null;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  const q = e.target.value.trim();
  if (!q) {
    searchDropdown.classList.add("hidden");
    searchDropdown.innerHTML = "";
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const items = await res.json();
      if (!items || items.length === 0) {
        searchDropdown.innerHTML = '<div class="search-item muted">No villages found</div>';
        searchDropdown.classList.remove("hidden");
        return;
      }
      searchDropdown.innerHTML = items
        .map(
          (item) => `
        <div class="search-item" data-lat="${item.lat}" data-lon="${item.lon}">
          <span class="search-item-name">${escapeHtml(item.name)}</span>
          <span class="search-item-state">${escapeHtml(item.state)}</span>
        </div>`
        )
        .join("");
      searchDropdown.classList.remove("hidden");
    } catch (err) {
      console.error("Search error:", err);
    }
  }, 300);
});

searchDropdown.addEventListener("click", (e) => {
  const item = e.target.closest(".search-item");
  if (!item || !item.dataset.lat) return;
  const lat = parseFloat(item.dataset.lat);
  const lon = parseFloat(item.dataset.lon);
  const name = item.querySelector(".search-item-name").textContent;

  searchInput.value = name;
  searchDropdown.classList.add("hidden");

  map.flyTo({ center: [lon, lat], zoom: 12 });
  fetchPrediction(lat, lon);
});

document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
    searchDropdown.classList.add("hidden");
  }
});

// Initial load
updateMarker(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
map.on("load", () => {
  handleGeolocation();
});
