import { AgrometProvider } from './context/AgrometContext';
import React, { useState, useEffect } from 'react';
import { AppLanguage, AppScreen, FarmerProfile, CropItem } from './types';
import { DEFAULT_FARMER_PROFILE, INITIAL_CROPS } from './data/mockData';
import { LanguageModal } from './components/LanguageModal';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { LanguageScreen } from './screens/LanguageScreen';
import { AddLocationScreen } from './screens/AddLocationScreen';
import { FarmerProfileSetupScreen } from './screens/FarmerProfileSetupScreen';
import { AddCropScreen } from './screens/AddCropScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WeatherScreen } from './screens/WeatherScreen';
import { MyCropsScreen } from './screens/MyCropsScreen';
import { CropDetailRiceScreen } from './screens/CropDetailRiceScreen';
import { CropDetailWheatScreen } from './screens/CropDetailWheatScreen';
import { AdvisoryHubScreen } from './screens/AdvisoryHubScreen';
import { FertilizerAdvisoryScreen } from './screens/FertilizerAdvisoryScreen';
import { IrrigationAdvisoryScreen } from './screens/IrrigationAdvisoryScreen';
import { CropSelectorScreen } from './screens/CropSelectorScreen';
import { AlertDetailsScreen } from './screens/AlertDetailsScreen';
import { FarmerProfileViewScreen } from './screens/FarmerProfileViewScreen';

export default function App() {
  // Application State with LocalStorage fallbacks
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('param_lang');
    return (saved as AppLanguage) || 'mr';
  });

  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    const saved = localStorage.getItem('param_screen');
    // Default to splash screen on app start
    return (saved as AppScreen) || 'splash';
  });

  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem('param_farmer');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_FARMER_PROFILE;
  });

  const [crops, setCrops] = useState<CropItem[]>(() => {
    try {
      const saved = localStorage.getItem('param_crops');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CROPS;
  });

  const [activeAdvisoryCropId, setActiveAdvisoryCropId] = useState<string>('rice-1');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [navigationHistory, setNavigationHistory] = useState<AppScreen[]>([]);

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('param_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('param_screen', currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    localStorage.setItem('param_farmer', JSON.stringify(farmerProfile));
  }, [farmerProfile]);

  useEffect(() => {
    localStorage.setItem('param_crops', JSON.stringify(crops));
  }, [crops]);

  // Navigate helper with history stack
  const navigateTo = (screen: AppScreen) => {
    setNavigationHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      setCurrentScreen(previous);
    } else {
      setCurrentScreen('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateProfile = (updated: Partial<FarmerProfile>) => {
    setFarmerProfile((prev) => ({ ...prev, ...updated }));
  };

  const addOrUpdateCrop = (crop: CropItem) => {
    setCrops((prev) => {
      const existingIdx = prev.findIndex((c) => c.id === crop.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = crop;
        return copy;
      }
      return [crop, ...prev];
    });
    setActiveAdvisoryCropId(crop.id);
  };

  const activeCrop =
    crops.find((c) => c.id === activeAdvisoryCropId) || crops[0] || INITIAL_CROPS[0];

  return (
    <AgrometProvider>
      <div className="w-full min-h-screen bg-surface flex justify-center">
      {/* Mobile Frame Container: responsive, max-w-md to mirror exact Stitch mobile app preview */}
      <div className="w-full max-w-md min-h-screen bg-surface flex flex-col relative shadow-2xl overflow-hidden border-x border-outline-variant/10">
        {/* Render Screen according to currentScreen */}
        {currentScreen === 'splash' && (
          <SplashScreen
            onStart={() => navigateTo('language')}
            language={language}
            onToggleLanguage={() => setIsLanguageModalOpen(true)}
          />
        )}

        {currentScreen === 'language' && (
          <LanguageScreen
            currentLanguage={language}
            onSelectLanguage={(lang) => setLanguage(lang)}
            onContinue={() => navigateTo('add_location')}
            onBack={() => navigateTo('splash')}
          />
        )}

        {currentScreen === 'add_location' && (
          <AddLocationScreen
            farmerProfile={farmerProfile}
            onUpdateProfile={updateProfile}
            onContinue={() => navigateTo('farmer_profile_setup')}
            onBack={() => navigateTo('language')}
            language={language}
          />
        )}

        {currentScreen === 'farmer_profile_setup' && (
          <FarmerProfileSetupScreen
            farmerProfile={farmerProfile}
            onUpdateProfile={updateProfile}
            onContinue={() => navigateTo('add_crop')}
            onBack={() => navigateTo('add_location')}
            onChangeLocation={() => navigateTo('add_location')}
            language={language}
          />
        )}

        {currentScreen === 'add_crop' && (
          <AddCropScreen
            crops={crops}
            onAddOrUpdateCrop={addOrUpdateCrop}
            onContinueToHome={() => navigateTo('home')}
            onBack={navigateBack}
            language={language}
            isInitialOnboarding={navigationHistory.includes('farmer_profile_setup')}
          />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            farmerProfile={farmerProfile}
            language={language}
            onNavigate={(screen) => navigateTo(screen)}
            onToggleLanguage={() => setIsLanguageModalOpen(true)}
          />
        )}

        {currentScreen === 'weather' && (
          <WeatherScreen
            language={language}
            onNavigate={(screen) => navigateTo(screen)}
            onToggleLanguage={() => setIsLanguageModalOpen(true)}
            onOpenProfile={() => navigateTo('farmer_profile')}
          />
        )}

        {currentScreen === 'crops' && (
          <MyCropsScreen
            crops={crops}
            onOpenCropDetail={(cropId) => {
              if (cropId.includes('wheat')) {
                navigateTo('crop_detail_wheat');
              } else {
                navigateTo('crop_detail_rice');
              }
            }}
            onOpenAddCrop={() => navigateTo('add_crop')}
            onNavigate={(screen) => navigateTo(screen)}
            language={language}
            onToggleLanguage={() => setIsLanguageModalOpen(true)}
            onOpenProfile={() => navigateTo('farmer_profile')}
          />
        )}

        {currentScreen === 'crop_detail_rice' && (
          <CropDetailRiceScreen
            onBack={navigateBack}
            onNavigate={(screen) => navigateTo(screen)}
            language={language}
          />
        )}

        {currentScreen === 'crop_detail_wheat' && (
          <CropDetailWheatScreen
            onBack={navigateBack}
            onNavigate={(screen) => navigateTo(screen)}
            language={language}
          />
        )}

        {currentScreen === 'advisory' && (
          <AdvisoryHubScreen
            activeCrop={activeCrop}
            onOpenCropSelector={() => navigateTo('crop_selector')}
            onNavigate={(screen) => navigateTo(screen)}
            language={language}
            onToggleLanguage={() => setIsLanguageModalOpen(true)}
            onOpenProfile={() => navigateTo('farmer_profile')}
          />
        )}

        {currentScreen === 'advisory_fertilizer' && (
          <FertilizerAdvisoryScreen
            onBack={navigateBack}
            language={language}
          />
        )}

        {currentScreen === 'advisory_irrigation' && (
          <IrrigationAdvisoryScreen
            onBack={navigateBack}
            language={language}
          />
        )}

        {currentScreen === 'crop_selector' && (
          <CropSelectorScreen
            crops={crops}
            activeCropId={activeAdvisoryCropId}
            onSelectCrop={(id) => setActiveAdvisoryCropId(id)}
            onAddNewCrop={() => navigateTo('add_crop')}
            onClose={() => navigateTo('advisory')}
            language={language}
          />
        )}

        {currentScreen === 'alerts' && (
          <AlertDetailsScreen
            onBack={navigateBack}
            onNavigate={(screen) => navigateTo(screen)}
            language={language}
          />
        )}

        {currentScreen === 'farmer_profile' && (
          <FarmerProfileViewScreen
            farmerProfile={farmerProfile}
            onUpdateProfile={updateProfile}
            onBack={() => navigateTo('home')}
            language={language}
            onToggleLanguage={() => setIsLanguageModalOpen(true)}
            onChangeLocation={() => navigateTo('add_location')}
          />
        )}

        {/* Global Language Selection Modal */}
        <LanguageModal
          isOpen={isLanguageModalOpen}
          currentLanguage={language}
          onClose={() => setIsLanguageModalOpen(false)}
          onSelectLanguage={(lang) => {
            setLanguage(lang);
            setIsLanguageModalOpen(false);
          }}
        />
      </div>
    </div>
    </AgrometProvider>
  );
}
