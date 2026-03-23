import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const Discount = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [savings, setSavings] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (!originalPrice.trim() || !discountPercent.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const price = Number(originalPrice);
    const disc = Number(discountPercent);

    if (Number.isNaN(price) || Number.isNaN(disc) || price < 0 || disc < 0) {
      setToastMessage('Please enter valid non-negative numbers');
      return;
    }

    const saved = price * (disc / 100);
    const final = price - saved;

    setSavings(saved.toFixed(2));
    setFinalPrice(final.toFixed(2));
  };

  return (
    <CalculatorLayout title="Discount Calculator">
      <InputField
        label="Original Price"
        value={originalPrice}
        onChange={setOriginalPrice}
        type="number"
        inputMode="decimal"
      />
      <InputField
        label="Discount Percent"
        value={discountPercent}
        onChange={setDiscountPercent}
        type="number"
        inputMode="decimal"
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {finalPrice ? (
        <ResultCard
          title="Discount Result"
          rows={[
            { label: 'Savings', value: savings },
            { label: 'Final Price', value: finalPrice, color: 'primary' },
            { label: 'Percentage Saved', value: `${discountPercent}%` }
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

export default Discount;
