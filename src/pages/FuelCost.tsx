import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const FuelCost = () => {
  const [distance, setDistance] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [pricePerLiter, setPricePerLiter] = useState('');
  const [litersNeeded, setLitersNeeded] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (!distance.trim() || !efficiency.trim() || !pricePerLiter.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const dist = Number(distance);
    const eff = Number(efficiency);
    const price = Number(pricePerLiter);

    if (Number.isNaN(dist) || Number.isNaN(eff) || Number.isNaN(price) || dist < 0 || eff <= 0 || price < 0) {
      setToastMessage('Please enter valid values (efficiency must be > 0)');
      return;
    }

    const liters = dist / eff;
    const cost = liters * price;

    setLitersNeeded(liters.toFixed(2));
    setTotalCost(cost.toFixed(2));
  };

  return (
    <CalculatorLayout title="Fuel Cost Calculator">
      <InputField label="Distance (km)" value={distance} onChange={setDistance} type="number" inputMode="decimal" />
      <InputField
        label="Fuel Efficiency (km/L)"
        value={efficiency}
        onChange={setEfficiency}
        type="number"
        inputMode="decimal"
      />
      <InputField
        label="Price Per Liter"
        value={pricePerLiter}
        onChange={setPricePerLiter}
        type="number"
        inputMode="decimal"
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {totalCost ? (
        <ResultCard
          title="Trip Fuel Cost"
          rows={[
            { label: 'Liters Needed', value: litersNeeded },
            { label: 'Total Cost', value: totalCost, color: 'primary' }
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

export default FuelCost;
