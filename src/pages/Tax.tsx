import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const Tax = () => {
  const [price, setPrice] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [totalWithTax, setTotalWithTax] = useState('');
  const [resultRows, setResultRows] = useState<Array<{ label: string; value: string; color?: 'primary' }>>([]);
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (!price.trim() || !taxRate.trim()) {
      setToastMessage('Please fill price and tax rate');
      return;
    }

    const basePrice = Number(price);
    const rate = Number(taxRate);

    if (Number.isNaN(basePrice) || Number.isNaN(rate) || basePrice < 0 || rate < 0) {
      setToastMessage('Please enter valid non-negative values');
      return;
    }

    const taxAmount = (basePrice * rate) / 100;
    const totalPrice = basePrice + taxAmount;

    const totalInput = totalWithTax.trim() ? Number(totalWithTax) : totalPrice;
    if (Number.isNaN(totalInput) || totalInput < 0) {
      setToastMessage('Total with tax must be a valid non-negative number');
      return;
    }

    const reversePreTax = totalInput / (1 + rate / 100);

    setResultRows([
      { label: 'Tax Amount', value: taxAmount.toFixed(2) },
      { label: 'Total Price', value: totalPrice.toFixed(2), color: 'primary' },
      { label: 'Pre-tax from Total', value: reversePreTax.toFixed(2) }
    ]);
  };

  return (
    <CalculatorLayout title="Sales Tax Calculator">
      <InputField label="Price" value={price} onChange={setPrice} type="number" inputMode="decimal" />
      <InputField label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} type="number" inputMode="decimal" />
      <InputField
        label="Total with Tax (for reverse calc)"
        value={totalWithTax}
        onChange={setTotalWithTax}
        type="number"
        inputMode="decimal"
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {resultRows.length > 0 ? <ResultCard title="Tax Result" rows={resultRows} /> : null}

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

export default Tax;
