import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const formatHex = (value: number): string =>
  value < 0
    ? `-0x${Math.abs(value).toString(16).toUpperCase()}`
    : `0x${value.toString(16).toUpperCase()}`;

const normalizeHexInput = (value: string): string => value.trim().toLowerCase().replace(/^(-?)0x/, '$1');

const Hex = () => {
  const [decimal, setDecimal] = useState('');
  const [hex, setHex] = useState('');
  const [binary, setBinary] = useState('');
  const [octal, setOctal] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const resetValues = () => {
    setDecimal('');
    setHex('');
    setBinary('');
    setOctal('');
  };

  const syncFromNumber = (value: number) => {
    setDecimal(value.toString(10));
    setHex(formatHex(value));
    setBinary(value.toString(2));
    setOctal(value.toString(8));
  };

  const tryConvert = (value: string, base: number, parser?: (raw: string) => string) => {
    const normalized = parser ? parser(value) : value.trim();
    if (!normalized) {
      resetValues();
      return;
    }

    const parsed = parseInt(normalized, base);
    if (Number.isNaN(parsed)) {
      setToastMessage('Invalid number format');
      return;
    }

    syncFromNumber(parsed);
  };

  const onNormalize = () => {
    if (!decimal.trim()) {
      setToastMessage('Enter at least one value');
      return;
    }

    const parsed = parseInt(decimal, 10);
    if (Number.isNaN(parsed)) {
      setToastMessage('Invalid decimal value');
      return;
    }

    syncFromNumber(parsed);
  };

  return (
    <CalculatorLayout title="Hex / Decimal / Binary">
      <InputField
        label="Decimal"
        value={decimal}
        onChange={(value) => {
          setDecimal(value);
          tryConvert(value, 10);
        }}
        type="text"
        inputMode="text"
        allowNegative
      />

      <InputField
        label="Hex"
        value={hex}
        onChange={(value) => {
          setHex(value);
          tryConvert(value, 16, normalizeHexInput);
        }}
        type="text"
        inputMode="text"
        allowNegative
      />

      <InputField
        label="Binary"
        value={binary}
        onChange={(value) => {
          setBinary(value);
          tryConvert(value, 2);
        }}
        type="text"
        inputMode="text"
        allowNegative
      />

      <InputField
        label="Octal"
        value={octal}
        onChange={(value) => {
          setOctal(value);
          tryConvert(value, 8);
        }}
        type="text"
        inputMode="text"
        allowNegative
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onNormalize}>
        Calculate
      </IonButton>

      {decimal ? (
        <ResultCard
          title="Number Systems"
          rows={[
            { label: 'Decimal', value: decimal, monospace: true },
            { label: 'Hex', value: hex, monospace: true, color: 'primary' },
            { label: 'Binary', value: binary, monospace: true },
            { label: 'Octal', value: octal, monospace: true }
          ]}
          copyValue={`dec=${decimal}, hex=${hex}, bin=${binary}, oct=${octal}`}
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

export default Hex;
