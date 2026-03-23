import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { addDays, formatDateShort, parseLocalDate } from '../utils/dateHelpers';

const Ovulation = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [resultRows, setResultRows] = useState<Array<{ label: string; value: string }>>([]);
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (!lastPeriodDate || !cycleLength.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const cycle = parseInt(cycleLength, 10);
    if (Number.isNaN(cycle) || cycle <= 0) {
      setToastMessage('Cycle length must be a valid positive number');
      return;
    }

    const lastPeriod = parseLocalDate(lastPeriodDate);
    const ovulationDate = addDays(lastPeriod, cycle - 14);
    const fertileStart = addDays(ovulationDate, -5);
    const fertileEnd = addDays(ovulationDate, 1);
    const nextPeriod = addDays(lastPeriod, cycle);

    setResultRows([
      { label: 'Ovulation Day', value: formatDateShort(ovulationDate) },
      { label: 'Fertile Window Start', value: formatDateShort(fertileStart) },
      { label: 'Fertile Window End', value: formatDateShort(fertileEnd) },
      { label: 'Next Period', value: formatDateShort(nextPeriod) }
    ]);
  };

  return (
    <CalculatorLayout title="Ovulation Calculator">
      <InputField label="Last Period Date" value={lastPeriodDate} onChange={setLastPeriodDate} type="date" />
      <InputField
        label="Cycle Length (days)"
        value={cycleLength}
        onChange={setCycleLength}
        type="number"
        inputMode="decimal"
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {resultRows.length > 0 ? <ResultCard title="Fertility Result" rows={resultRows} /> : null}

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

export default Ovulation;
