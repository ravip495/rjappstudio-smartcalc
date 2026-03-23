import { useCallback, useEffect, useState } from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

import Home from './pages/Home';
import Calculator from './pages/Calculator';
import UnitConverter from './pages/UnitConverter';
import Currency from './pages/Currency';
import Percentage from './pages/Percentage';
import Discount from './pages/Discount';
import Loan from './pages/Loan';
import DateCalc from './pages/DateCalc';
import Health from './pages/Health';
import FuelCost from './pages/FuelCost';
import FuelEfficiency from './pages/FuelEfficiency';
import GPA from './pages/GPA';
import Tip from './pages/Tip';
import Tax from './pages/Tax';
import UnitPrice from './pages/UnitPrice';
import WorldTime from './pages/WorldTime';
import Ovulation from './pages/Ovulation';
import Hex from './pages/Hex';
import Savings from './pages/Savings';

const DARK_MODE_KEY = 'darkModeEnabled';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadPreference = async () => {
      const saved = await Preferences.get({ key: DARK_MODE_KEY });
      if (saved.value) {
        setIsDarkMode(saved.value === 'true');
      }
    };

    void loadPreference();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleDarkModeToggle = useCallback(async (enabled: boolean) => {
    setIsDarkMode(enabled);
    await Preferences.set({ key: DARK_MODE_KEY, value: String(enabled) });
  }, []);

  return (
    <IonApp>
      <BrowserRouter>
        <IonRouterOutlet>
          <Routes>
            <Route
              path="/"
              element={<Home isDarkMode={isDarkMode} onToggleDarkMode={handleDarkModeToggle} />}
            />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/unit-converter" element={<UnitConverter />} />
            <Route path="/currency" element={<Currency />} />
            <Route path="/percentage" element={<Percentage />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/loan" element={<Loan />} />
            <Route path="/date" element={<DateCalc />} />
            <Route path="/health" element={<Health />} />
            <Route path="/fuel-cost" element={<FuelCost />} />
            <Route path="/fuel-efficiency" element={<FuelEfficiency />} />
            <Route path="/gpa" element={<GPA />} />
            <Route path="/tip" element={<Tip />} />
            <Route path="/tax" element={<Tax />} />
            <Route path="/unit-price" element={<UnitPrice />} />
            <Route path="/world-time" element={<WorldTime />} />
            <Route path="/ovulation" element={<Ovulation />} />
            <Route path="/hex" element={<Hex />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IonRouterOutlet>
      </BrowserRouter>
    </IonApp>
  );
};

export default App;
