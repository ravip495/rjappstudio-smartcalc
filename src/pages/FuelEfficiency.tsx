import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const FuelEfficiency = () => {
  const [distance, setDistance] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');
  const [kmPerLiter, setKmPerLiter] = useState('');
  const [mpg, setMpg] = useState('');
  const [litersPer100Km, setLitersPer100Km] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (!distance.trim() || !fuelUsed.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const dist = Number(distance);
    const fuel = Number(fuelUsed);

    if (Number.isNaN(dist) || Number.isNaN(fuel) || dist < 0 || fuel <= 0) {
      setToastMessage('Please enter valid values (fuel used must be > 0)');
      return;
    }

    const kmL = dist / fuel;
    const calculatedMpg = kmL * 2.35215;
    const lPer100 = 100 / kmL;

    setKmPerLiter(kmL.toFixed(3));
    setMpg(calculatedMpg.toFixed(3));
    setLitersPer100Km(lPer100.toFixed(3));
  };

  return (
    <CalculatorLayout title="Fuel Efficiency Calculator">
      <InputField label="Distance (km)" value={distance} onChange={setDistance} type="number" inputMode="decimal" />
      <InputField label="Fuel Used (L)" value={fuelUsed} onChange={setFuelUsed} type="number" inputMode="decimal" />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {kmPerLiter ? (
        <ResultCard
          title="Efficiency Result"
          rows={[
            { label: 'km/L', value: kmPerLiter, color: 'primary' },
            { label: 'MPG', value: mpg },
            { label: 'L/100km', value: litersPer100Km }
          ]}
        />
      ) : null}

      <IonToast
        isOpen={Boolean(toastMessage)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="danger"
        onDidDismiss={() => setToastMessage('')}
      />
    </CalculatorLayout>
  );
};

export default FuelEfficiency;
