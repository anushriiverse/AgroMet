# PARAM — Precision Agro-Advisory & Real-time Agro-Meteorology

> **Branch**: `feature/param-agromet-advisory-app`  
> **Repository**: [anushriiverse/AgroMet](https://github.com/anushriiverse/AgroMet)  
> **Branch Purpose**: Implements the mobile frontend client application for the **AgroMet** precision agriculture ecosystem, connecting downscaled weather forecasts directly with hyper-local, stage-wise crop advisories for Indian farmers.

---

## Overview

**PARAM** (Precision Agro-Advisory & Real-time Agro-Meteorology) is a mobile-first progressive web application built to empower farmers with actionable intelligence derived from high-resolution meteorological models. By bridging 30-meter downscaled weather forecasts with crop phenology, PARAM translates raw atmospheric data into practical field decisions:

- **Hyper-Local 7-Day Forecasts**: Village and Gram Panchayat-level forecasts including precipitation probability, expected rainfall (mm), maximum/minimum temperature, relative humidity, wind velocity, and UV index.
- **Stage-Wise Crop Management**: Specialized lifecycle trackers for Rice (*Indrayani*), Wheat (*Lokwan / HD 2189*), Soybean (*JS-335*), and Sugarcane, monitoring growth day-by-day.
- **Smart Irrigation Scheduling**: Combines root zone soil moisture with 36-hour rainfall forecasts and Hargreaves-Samani evapotranspiration (ETo) models to advise when to irrigate and when to hold.
- **Rain-Adjusted Fertilizer Guidance**: Split-dose fertilizer recommendations (Urea, SSP, MOP) timed to prevent nutrient leaching and surface runoff during rain events.
- **AI Crop Doctor & Leaf Diagnostics**: Simulated computer vision scanner for instant leaf lesion and pest diagnosis with treatment dosage recommendations.
- **Live Mandi Rates**: Real-time commodity market rates from regional APMC markets (e.g. Kolhapur, Sangli) tracking minimum, modal, and maximum prices.
- **Multilingual & Spoken Audio Guidance**: Full support for Marathi (मराठी), English, and Hindi with Web Speech API audio announcements.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) with Material Design 3 agricultural tokens
- **Icons & Typography**: [Lucide React](https://lucide.dev/), Google Material Symbols, Plus Jakarta Sans, Noto Sans Devanagari
- **Audio Engine**: Web Speech Synthesis API (`window.speechSynthesis`)
- **AI / Model Integration**: `@google/genai` SDK

---

## Project Structure & File Purpose

For a complete breakdown of every file in this repository, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

### Quick File Directory

```
PARAM App/
├── index.html                           # Mobile-first HTML5 shell with web fonts
├── package.json                         # Dependencies (React 19, Vite, Tailwind v4, GenAI)
├── tsconfig.json                        # TypeScript strict compiler config
├── vite.config.ts                       # Vite bundler & plugin pipeline
├── .env.example                         # Environment secrets template
├── .gitignore                           # Git ignore rules
├── metadata.json                        # AI Studio applet capabilities manifest
├── PROJECT_STRUCTURE.md                 # Complete file-by-file purpose manifest
├── README.md                            # Project overview & documentation
│
├── public/
│   └── assets/aistudio/.gitignore       # Static assets placeholder
│
└── src/
    ├── App.tsx                          # Core app controller, state & navigation router
    ├── main.tsx                         # React 19 application entrypoint
    ├── index.css                        # Tailwind v4 theme, fonts, & custom design tokens
    ├── types.ts                         # Domain TypeScript models (Farmer, Crop, Weather)
    │
    ├── utils/
    │   └── audio.ts                     # Web Speech text-to-speech audio service
    │
    ├── data/
    │   └── mockData.ts                  # Agronomic data, 7-day weather, crops & mandi rates
    │
    ├── components/
    │   ├── Header.tsx                   # Top app header with location, language & profile
    │   ├── BottomNav.tsx                # Mobile bottom navigation bar with active badges
    │   ├── LanguageModal.tsx            # Modal for switching between Marathi, English, Hindi
    │   ├── CropScannerModal.tsx         # AI camera leaf disease scanner simulation
    │   └── MandiRatesModal.tsx          # Live APMC mandi commodity market prices modal
    │
    └── screens/
        ├── SplashScreen.tsx             # Welcome screen with brand identity
        ├── LanguageScreen.tsx           # Onboarding Step 1: Language selection
        ├── AddLocationScreen.tsx        # Onboarding Step 2: Location & GPS Gram Panchayat setup
        ├── FarmerProfileSetupScreen.tsx # Onboarding Step 3: Farmer landholding & irrigation
        ├── FarmerProfileViewScreen.tsx  # Farmer profile management & offline sync settings
        ├── AddCropScreen.tsx            # Crop enrollment form with sowing date calculation
        ├── HomeScreen.tsx               # Master farm dashboard with weather & quick actions
        ├── WeatherScreen.tsx            # 7-day downscaled agro-meteorological forecast view
        ├── MyCropsScreen.tsx            # Portfolio of enrolled crops and growth stages
        ├── CropDetailRiceScreen.tsx     # 5-stage advisory lifecycle for Rice (Indrayani)
        ├── CropDetailWheatScreen.tsx    # Stage-wise management for Wheat (Lokwan CRI stage)
        ├── CropSelectorScreen.tsx       # Fast-switch modal to change active monitored crop
        ├── AdvisoryHubScreen.tsx        # Unified hub for fertilizer, irrigation & pest guidance
        ├── FertilizerAdvisoryScreen.tsx # Split-dose fertilizer calculator & rain timing
        ├── IrrigationAdvisoryScreen.tsx # Evapotranspiration & moisture-based irrigation advisory
        └── AlertDetailsScreen.tsx       # Critical weather warnings & disease outbreak advisory
```

---

## Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` or `yarn` / `pnpm`

### Installation
```bash
# 1. Clone the repository and checkout this branch:
git clone https://github.com/anushriiverse/AgroMet.git
cd AgroMet
git checkout feature/param-agromet-advisory-app

# 2. Install dependencies:
npm install

# 3. (Optional) Set up environment variables:
cp .env.example .env.local
# Add your GEMINI_API_KEY if using live AI features

# 4. Start the development server:
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## License & Attribution

Part of the **AgroMet** precision agriculture initiative. Designed for high-resolution agro-meteorological advisories in Maharashtra, Karnataka, and the Western Ghats region.
