# PARAM AgroMet Advisory App — Project Structure & File Purpose Manifest

## Branch Purpose
- **Branch**: `feature/param-agromet-advisory-app`
- **Objective**: Integrates the frontend client application for **PARAM** (Precision Agro-Advisory & Real-time Agro-Meteorology) into the **AgroMet** project ecosystem.
- **Scope**: Provides a mobile-first progressive web application tailored for farmers in India (with deep localization for Maharashtra and Western Ghats revenue villages). It connects downscaled meteorological models (temperature, rainfall, evapotranspiration) directly with on-ground agricultural decisions: stage-specific crop advisory, rain-adjusted irrigation scheduling, split-dose fertilizer calculation, disease outbreak alerts, AI crop doctor scanning, and live APMC mandi market intelligence.

---

## Comprehensive File-by-File Manifest

| File Path | Classification | Primary Purpose & Functionality |
| :--- | :--- | :--- |
| **`index.html`** | Web Entrypoint | HTML5 document shell configured for mobile-first viewport scaling (`maximum-scale=1.0`, `viewport-fit=cover`), SEO & OpenGraph meta tags, and CDN font preloads (Google Fonts *Plus Jakarta Sans*, *Noto Sans Devanagari*, and *Material Symbols Outlined*). |
| **`package.json`** | Dependencies & Scripts | Project manifest defining npm dependencies (React 19, Vite 6, Tailwind CSS 4, `@google/genai`, Lucide icons, Motion) and operational scripts (`dev`, `build`, `preview`, `lint`). |
| **`tsconfig.json`** | TypeScript Configuration | TypeScript compiler options enforcing strict type-checking, JSX transform (`react-jsx`), ES2022 target module resolution, and path alias mapping (`@/*`). |
| **`vite.config.ts`** | Build Configuration | Vite bundler pipeline configuration integrating `@vitejs/plugin-react` and `@tailwindcss/vite`, setting development server port 3000, and configuring hot module replacement (HMR) conditional switches. |
| **`.env.example`** | Environment Template | Reference template for application secrets, specifying placeholders for `GEMINI_API_KEY` and deployment `APP_URL`. |
| **`.gitignore`** | Git Rules | Excludes build directories (`dist/`, `build/`), dependency caches (`node_modules/`), test coverage reports, log files, and environment variable files (`.env*`) while preserving `.env.example`. |
| **`metadata.json`** | Application Metadata | AI Studio / Applet deployment specification describing application capabilities (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`), description, and runtime permission bounds. |
| **`README.md`** | Documentation | Master repository overview outlining project architecture, branch purpose, quickstart instructions, and summary documentation. |
| **`PROJECT_STRUCTURE.md`** | Architectural Manifest | Detailed technical reference documenting the role, responsibilities, and data flows for every single file in the PARAM App. |
| **`public/assets/aistudio/.gitignore`** | Public Asset Gitkeep | Retains the static assets directory structure within Git version tracking while ignoring runtime scratch files. |

---

### Core Application Layer (`src/`)

| File Path | Classification | Primary Purpose & Functionality |
| :--- | :--- | :--- |
| **`src/main.tsx`** | Application Bootstrapper | Client bootstrapping file. Mounts the root React component tree (`<App />`) into the `#root` DOM container wrapped inside `React.StrictMode`. |
| **`src/App.tsx`** | Root Controller & State Manager | Top-level state and navigation coordinator. Maintains user preferences, selected language (`mr`, `en`, `hi`), farmer profile, crop list, active screen routing (`AppScreen`), and browser `localStorage` persistence. Renders the mobile shell container with responsive borders and global modals. |
| **`src/types.ts`** | Domain Models & Types | Authoritative TypeScript interface and type definitions: `FarmerProfile`, `CropItem`, `WeatherDay`, `AppLanguage`, and `AppScreen`. |
| **`src/index.css`** | Theme & Design System | Tailwind CSS v4 design token theme definitions. Configures custom Material Design 3 agricultural palette (deep greens, earthy tones, warning ambers, surface tints), font families, and utility styles for hidden scrollbars. |

---

### Services & Data Layer (`src/utils/`, `src/data/`)

| File Path | Classification | Primary Purpose & Functionality |
| :--- | :--- | :--- |
| **`src/utils/audio.ts`** | Speech Synthesis Utility | Provides text-to-speech audio guidance using the browser `window.speechSynthesis` API. Dynamically selects appropriate voice synthesizers and regional language tags (`mr-IN` for Marathi, `hi-IN` for Hindi, `en-IN` for Indian English) with custom speech rates and cancellation safety. |
| **`src/data/mockData.ts`** | Mock Database & Fixtures | Realistic agronomic and meteorological datasets: default farmer profile for Rajesh Patil (Shiroli GP, Radhanagari, Kolhapur), crop records (Indrayani Rice, Lokwan Wheat, JS-335 Soybean, Sugarcane), 7-day downscaled weather forecast data, crop photography assets, and APMC mandi market commodity prices. |

---

### UI Components (`src/components/`)

| File Path | Classification | Primary Purpose & Functionality |
| :--- | :--- | :--- |
| **`src/components/Header.tsx`** | Global Navigation Header | Top fixed header showing application branding, active Gram Panchayat / taluka location, back navigation button, language toggle trigger, notifications indicator badge, and farmer profile avatar. |
| **`src/components/BottomNav.tsx`** | Bottom Navigation Bar | Persistent mobile bottom tab bar providing one-tap navigation across primary app sections: Home, Weather, Advisory, Crops, and Alerts, complete with active alert counter pill and icon animations. |
| **`src/components/LanguageModal.tsx`** | Language Selector Modal | Dialog overlay enabling farmers to switch application language between Marathi (मराठी), English, and Hindi (हिन्दी) on any screen with instant reactivity. |
| **`src/components/CropScannerModal.tsx`** | AI Crop Diagnostic Modal | Interactive leaf disease diagnosis camera modal. Simulates viewfinder capture, AI visual analysis, lesion detection, and immediate agronomic recommendations for crop fungal/bacterial diseases. |
| **`src/components/MandiRatesModal.tsx`** | Mandi Market Rates Modal | Modal sheet providing live commodity market intelligence from regional APMCs (Kolhapur and Sangli), displaying minimum, modal, and maximum rates along with day-over-day price trends. |

---

### Screen Views (`src/screens/`)

| File Path | Classification | Primary Purpose & Functionality |
| :--- | :--- | :--- |
| **`src/screens/SplashScreen.tsx`** | Splash & Introduction | Opening landing view showcasing the official PARAM brand identity, core agro-meteorological value proposition, language selector, and onboarding call to action. |
| **`src/screens/LanguageScreen.tsx`** | Onboarding Step 1: Language | Dedicated language selection screen guiding the farmer to select their preferred regional dialect before setting up their farm profile. |
| **`src/screens/AddLocationScreen.tsx`** | Onboarding Step 2: Location | Location detection and selector capturing State, District, Taluka, Village, and Gram Panchayat with simulated GPS geo-tagging for hyper-local meteorological resolution. |
| **`src/screens/FarmerProfileSetupScreen.tsx`** | Onboarding Step 3: Farmer Profile | Onboarding form collecting farmer's name, 10-digit contact number, total landholding area with configurable measurement units (Acres, Hectares, Gunthas), and irrigation source. |
| **`src/screens/FarmerProfileViewScreen.tsx`** | Profile & Settings View | Profile management dashboard where farmers can view and edit their profile, update farm land details, change location, toggle language, or trigger cloud data synchronisation. |
| **`src/screens/AddCropScreen.tsx`** | Crop Enrollment Screen | Form allowing farmers to enroll a new crop plot or edit existing plots. Captures crop variety, sowing date, phenological growth stage, plot name, acreage, soil type, and irrigation source, with automatic calculation of days elapsed since sowing. |
| **`src/screens/HomeScreen.tsx`** | Primary Dashboard | Master dashboard aggregating daily weather conditions, critical farm advisory notifications, crop growth status, quick action shortcuts (AI Leaf Scanner, Live Mandi Rates), and audio advisories in Marathi/English. |
| **`src/screens/WeatherScreen.tsx`** | 7-Day Agro-Weather Forecast | Detailed 7-day meteorological forecast screen displaying maximum/minimum temperatures, precipitation likelihood, rainfall quantity (mm), relative humidity, wind speed/direction, and pesticide spraying suitability windows. |
| **`src/screens/MyCropsScreen.tsx`** | Crop Portfolio Manager | Overview of all farmer-registered crop plots with visual stage progress indicators, harvest countdowns, status badges, active weather alerts, and shortcut to enroll new crops. |
| **`src/screens/CropDetailRiceScreen.tsx`** | Rice Advisory & Lifecycle | Deep-dive agronomic management for Paddy/Rice (Indrayani variety). Features an interactive 5-stage lifecycle tracker (Transplanting, Tillering, Panicle Initiation, Flowering, Maturity), water depth maintenance rules, and nitrogen top-dressing schedules. |
| **`src/screens/CropDetailWheatScreen.tsx`** | Wheat Advisory & Lifecycle | Comprehensive management view for Wheat (Lokwan / HD 2189). Highlights critical Crown Root Initiation (CRI at Day 21) irrigation timing, fertilizer application, and aphid monitoring. |
| **`src/screens/CropSelectorScreen.tsx`** | Active Crop Selector | Modal view allowing farmers to rapidly switch the active focus crop for all advisory tabs and calculations. |
| **`src/screens/AdvisoryHubScreen.tsx`** | Agricultural Advisory Hub | Central decision support center categorizing advisories into Fertilizer Schedules, Irrigation Needs, Spraying Windows, and Pest & Disease Protection. |
| **`src/screens/FertilizerAdvisoryScreen.tsx`** | Fertilizer Management | Scientific fertilizer split-dose calculator (Urea, SSP, MOP) adjusted dynamically for upcoming rainfall forecasts to prevent nutrient runoff and leaching. |
| **`src/screens/IrrigationAdvisoryScreen.tsx`** | Precision Irrigation Advisory | Soil moisture-driven irrigation decision screen factoring in 36-hour rainfall forecasts and evapotranspiration rates to recommend either holding or applying irrigation. |
| **`src/screens/AlertDetailsScreen.tsx`** | Severe Weather & Pest Alerts | Dedicated alert view detailing high-risk threats (e.g. fungal blast risk from humidity >78%), providing chemical treatment recommendations, spray windows, and audio announcements. |
