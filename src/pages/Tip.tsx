import { useMemo, useState } from 'react';
import { IonButton, IonLabel, IonRange, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const Tip = () => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [splitCount, setSplitCount] = useState('1');
  const [showResult, setShowResult] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const computed = useMemo(() => {
    const bill = Number(billAmount);
    const split = Number(splitCount);

    if (Number.isNaN(bill) || Number.isNaN(split) || bill < 0 || split <= 0) {
      return null;
    }

    const tipAmount = (bill * tipPercent) / 100;
    const total = bill + tipAmount;
    const perPerson = total / split;
    const tipPerPerson = tipAmount / split;

    return {
      tipAmount,
      total,
      perPerson,
      tipPerPerson
    };
  }, [billAmount, splitCount, tipPercent]);

  const onCalculate = () => {
    if (!billAmount.trim() || !splitCount.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    if (!computed) {
      setToastMessage('Please enter valid values (split count must be > 0)');
      return;
    }

    setShowResult(true);
  };

  return (
    <CalculatorLayout title="Tip Calculator">
      <InputField label="Bill Amount" value={billAmount} onChange={setBillAmount} type="number" inputMode="decimal" />

      <IonLabel>Tip Percent: {tipPercent}%</IonLabel>
      <IonRange
        min={0}
        max={30}
        step={1}
        value={tipPercent}
        snaps
        pin
        color="primary"
        onIonChange={(event) => setTipPercent(Number(event.detail.value))}
      />

      <InputField
        label="Split Count"
        value={splitCount}
        onChange={setSplitCount}
        type="number"
        inputMode="decimal"
        min={1}
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {showResult && computed ? (
        <ResultCard
          title="Tip Result"
          rows={[
            { label: 'Tip Amount', value: computed.tipAmount.toFixed(2) },
            { label: 'Total Bill', value: computed.total.toFixed(2), color: 'primary' },
            { label: 'Per Person', value: computed.perPerson.toFixed(2) },
            { label: 'Tip Per Person', value: computed.tipPerPerson.toFixed(2) }
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

export default Tip;
