import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonToast
} from '@ionic/react';
import { Preferences } from '@capacitor/preferences';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import { evaluateExpression, formatMathResult } from '../utils/mathParser';

interface HistoryEntry {
  expression: string;
  result: string;
  timestamp: string;
}

const HISTORY_KEY = 'scientificHistory';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [liveResult, setLiveResult] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      const stored = await Preferences.get({ key: HISTORY_KEY });
      if (stored.value) {
        try {
          const parsed = JSON.parse(stored.value) as HistoryEntry[];
          setHistory(parsed);
        } catch {
          setHistory([]);
        }
      }
    };

    void loadHistory();
  }, []);

  useEffect(() => {
    if (!expression.trim()) {
      setLiveResult('');
      return;
    }

    try {
      const value = evaluateExpression(expression);
      setLiveResult(formatMathResult(value));
    } catch {
      setLiveResult('Invalid expression');
    }
  }, [expression]);

  const saveHistory = useCallback(async (entry: HistoryEntry) => {
    setHistory((current) => {
      const next = [entry, ...current].slice(0, 20);
      void Preferences.set({ key: HISTORY_KEY, value: JSON.stringify(next) });
      return next;
    });
  }, []);

  const onCalculate = useCallback(async () => {
    if (!expression.trim()) {
      setToastMessage('Please enter an expression');
      return;
    }

    try {
      const value = evaluateExpression(expression);
      const formatted = formatMathResult(value);
      setResult(formatted);

      await saveHistory({
        expression,
        result: formatted,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid expression';
      setToastMessage(message);
    }
  }, [expression, saveHistory]);

  const historyItems = useMemo(
    () =>
      history.map((entry) => ({
        ...entry,
        label: `${entry.expression} = ${entry.result}`,
        date: new Date(entry.timestamp).toLocaleString()
      })),
    [history]
  );

  return (
    <CalculatorLayout title="Scientific Calculator">
      <InputField
        label="Expression"
        value={expression}
        onChange={setExpression}
        type="text"
        inputMode="text"
        placeholder="e.g. sqrt(25) + pow(2,3)"
        allowNegative
      />
      <IonText color={liveResult === 'Invalid expression' ? 'danger' : 'medium'}>
        <p className="helper-text">Live result: {liveResult || 'Type to preview result'}</p>
      </IonText>

      <IonButton expand="block" color="primary" className="primary-action" onClick={() => void onCalculate()}>
        Calculate
      </IonButton>

      {result ? (
        <ResultCard
          title="Calculation Result"
          rows={[
            { label: 'Expression', value: expression, monospace: true },
            { label: 'Value', value: result, color: 'primary' }
          ]}
          copyValue={`${expression} = ${result}`}
        />
      ) : null}

      <IonText>
        <h3 className="section-heading">History (Last 20)</h3>
      </IonText>
      <IonList>
        {historyItems.length === 0 ? (
          <IonItem lines="none">
            <IonLabel color="medium">No history yet</IonLabel>
          </IonItem>
        ) : (
          historyItems.map((entry) => (
            <IonItem
              key={`${entry.timestamp}-${entry.expression}`}
              button
              onClick={() => {
                setExpression(entry.expression);
                setResult(entry.result);
              }}
            >
              <IonLabel>
                <h3>{entry.label}</h3>
                <p>{entry.date}</p>
              </IonLabel>
            </IonItem>
          ))
        )}
      </IonList>

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

export default Calculator;
