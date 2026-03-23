import { useMemo, useState } from 'react';
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

type PercentageMode = 'modeA' | 'modeB' | 'modeC';

const Percentage = () => {
  const [mode, setMode] = useState<PercentageMode>('modeA');
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  const [result, setResult] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const labels = useMemo(() => {
    if (mode === 'modeA') {
      return {
        x: 'Percentage (X)',
        y: 'Base value (Y)',
        resultLabel: 'X% of Y'
      };
    }

    if (mode === 'modeB') {
      return {
        x: 'Value X',
        y: 'Value Y',
        resultLabel: 'X is what % of Y'
      };
    }

    return {
      x: 'Original value (X)',
      y: 'New value (Y)',
      resultLabel: '% change from X to Y'
    };
  }, [mode]);

  const onCalculate = () => {
    if (!xValue.trim() || !yValue.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const x = Number(xValue);
    const y = Number(yValue);

    if (Number.isNaN(x) || Number.isNaN(y)) {
      setToastMessage('Please enter valid numbers');
      return;
    }

    let output = 0;
    if (mode === 'modeA') {
      output = (x / 100) * y;
      setResult(Number(output.toFixed(10)).toString());
      return;
    }

    if (mode === 'modeB') {
      if (y === 0) {
        setToastMessage('Cannot divide by zero');
        return;
      }

      output = (x / y) * 100;
      setResult(`${Number(output.toFixed(10)).toString()}%`);
      return;
    }

    if (x === 0) {
      setToastMessage('Original value cannot be zero for % change');
      return;
    }

    output = ((y - x) / x) * 100;
    setResult(`${Number(output.toFixed(10)).toString()}%`);
  };

  return (
    <CalculatorLayout title="Percentage Calculator">
      <IonSegment className="segment-wrap" value={mode} onIonChange={(event) => setMode(event.detail.value as PercentageMode)}>
        <IonSegmentButton value="modeA">
          <IonLabel>Mode A</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="modeB">
          <IonLabel>Mode B</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="modeC">
          <IonLabel>Mode C</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <InputField label={labels.x} value={xValue} onChange={setXValue} type="number" inputMode="decimal" />
      <InputField label={labels.y} value={yValue} onChange={setYValue} type="number" inputMode="decimal" />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {result ? (
        <ResultCard
          title="Percentage Result"
          rows={[
            { label: labels.resultLabel, value: result, color: 'primary' },
            { label: 'Inputs', value: `X=${xValue}, Y=${yValue}` }
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

export default Percentage;
