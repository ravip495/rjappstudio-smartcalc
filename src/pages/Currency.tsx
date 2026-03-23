import { useMemo, useState } from 'react';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonToast
} from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { CURRENCY_LAST_UPDATED, currencyRates } from '../utils/currencyRates';

const Currency = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [result, setResult] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const currencyMap = useMemo(
    () =>
      currencyRates.reduce<Record<string, number>>((acc, current) => {
        acc[current.code] = current.rate;
        return acc;
      }, {}),
    []
  );

  const onCalculate = () => {
    if (!amount.trim()) {
      setToastMessage('Enter an amount to convert');
      return;
    }

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount < 0) {
      setToastMessage('Please enter a valid non-negative amount');
      return;
    }

    const fromRate = currencyMap[fromCurrency];
    const toRate = currencyMap[toCurrency];

    if (!fromRate || !toRate) {
      setToastMessage('Invalid currency selection');
      return;
    }

    const converted = numericAmount * (toRate / fromRate);
    setResult(converted.toFixed(4));
  };

  return (
    <CalculatorLayout title="Currency Converter">
      <InputField label="Amount" value={amount} onChange={setAmount} type="number" inputMode="decimal" />

      <IonItem>
        <IonLabel>From</IonLabel>
        <IonSelect value={fromCurrency} onIonChange={(event) => setFromCurrency(event.detail.value)}>
          {currencyRates.map((currency) => (
            <IonSelectOption key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>To</IonLabel>
        <IonSelect value={toCurrency} onIonChange={(event) => setToCurrency(event.detail.value)}>
          {currencyRates.map((currency) => (
            <IonSelectOption key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonNote color="medium">Rates are static. Last updated: {new Date(CURRENCY_LAST_UPDATED).toLocaleString()}</IonNote>

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {result ? (
        <ResultCard
          title="Currency Result"
          rows={[
            { label: 'From', value: `${amount} ${fromCurrency}` },
            { label: 'To', value: `${result} ${toCurrency}` }
          ]}
          copyValue={`${amount} ${fromCurrency} = ${result} ${toCurrency}`}
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

export default Currency;
