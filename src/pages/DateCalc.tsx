import { useState } from 'react';
import {
  IonButton,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToast
} from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { addDays, calculateDateDifference, formatDateLong, parseLocalDate } from '../utils/dateHelpers';

type DateMode = 'diff' | 'addSub';
type OperationMode = 'add' | 'subtract';

const DateCalc = () => {
  const [mode, setMode] = useState<DateMode>('diff');
  const [operation, setOperation] = useState<OperationMode>('add');
  const [dateA, setDateA] = useState('');
  const [dateB, setDateB] = useState('');
  const [baseDate, setBaseDate] = useState('');
  const [offsetDays, setOffsetDays] = useState('');
  const [resultRows, setResultRows] = useState<Array<{ label: string; value: string }>>([]);
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (mode === 'diff') {
      if (!dateA || !dateB) {
        setToastMessage('Select both dates to calculate difference');
        return;
      }

      const first = parseLocalDate(dateA);
      const second = parseLocalDate(dateB);
      const breakdown = calculateDateDifference(first, second);

      setResultRows([
        { label: 'Days', value: breakdown.days.toString() },
        { label: 'Weeks', value: breakdown.weeks.toFixed(2) },
        { label: 'Months', value: breakdown.months.toFixed(2) },
        { label: 'Years', value: breakdown.years.toFixed(2) }
      ]);
      return;
    }

    if (!baseDate || !offsetDays.trim()) {
      setToastMessage('Select a date and number of days');
      return;
    }

    const days = Number(offsetDays);
    if (Number.isNaN(days) || days < 0) {
      setToastMessage('Enter a valid non-negative number of days');
      return;
    }

    const date = parseLocalDate(baseDate);
    const adjusted = addDays(date, operation === 'add' ? days : -days);

    setResultRows([
      { label: 'Result Date', value: adjusted.toLocaleDateString() },
      { label: 'Day of Week', value: adjusted.toLocaleDateString(undefined, { weekday: 'long' }) },
      { label: 'Detailed', value: formatDateLong(adjusted) }
    ]);
  };

  return (
    <CalculatorLayout title="Date Calculator">
      <IonSegment className="segment-wrap" value={mode} onIonChange={(event) => setMode(event.detail.value as DateMode)}>
        <IonSegmentButton value="diff">
          <IonLabel>Difference</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="addSub">
          <IonLabel>Add/Subtract</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {mode === 'diff' ? (
        <>
          <InputField label="Date A" value={dateA} onChange={setDateA} type="date" />
          <InputField label="Date B" value={dateB} onChange={setDateB} type="date" />
        </>
      ) : (
        <>
          <IonSegment
            className="segment-wrap"
            value={operation}
            onIonChange={(event) => setOperation(event.detail.value as OperationMode)}
          >
            <IonSegmentButton value="add">
              <IonLabel>Add</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="subtract">
              <IonLabel>Subtract</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <InputField label="Base Date" value={baseDate} onChange={setBaseDate} type="date" />
          <InputField
            label="Days (N)"
            value={offsetDays}
            onChange={setOffsetDays}
            type="number"
            inputMode="decimal"
          />
        </>
      )}

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {resultRows.length > 0 ? <ResultCard title="Date Result" rows={resultRows} /> : null}

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

export default DateCalc;
