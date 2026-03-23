import { useMemo, useState } from 'react';
import {
  IonButton,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonToast
} from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';
import {
  UnitCategoryKey,
  convertUnitValue,
  formatConversionResult,
  unitCategories
} from '../utils/unitConversions';

const UnitConverter = () => {
  const [categoryKey, setCategoryKey] = useState<UnitCategoryKey>('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const currentCategory = useMemo(
    () => unitCategories.find((category) => category.key === categoryKey) ?? unitCategories[0],
    [categoryKey]
  );

  const categoryUnits = useMemo(() => Object.entries(currentCategory.units), [currentCategory]);

  const handleCategoryChange = (nextCategory: UnitCategoryKey) => {
    const selected = unitCategories.find((category) => category.key === nextCategory);
    if (!selected) {
      return;
    }

    const units = Object.keys(selected.units);
    setCategoryKey(nextCategory);
    setFromUnit(units[0]);
    setToUnit(units[1] ?? units[0]);
    setResult('');
  };

  const onCalculate = () => {
    if (!value.trim()) {
      setToastMessage('Enter a value to convert');
      return;
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      setToastMessage('Please enter a valid number');
      return;
    }

    try {
      const converted = convertUnitValue(numericValue, categoryKey, fromUnit, toUnit);
      setResult(formatConversionResult(converted));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conversion failed';
      setToastMessage(message);
    }
  };

  return (
    <CalculatorLayout title="Unit Converter">
      <IonSegment
        className="segment-wrap"
        value={categoryKey}
        scrollable
        onIonChange={(event) => handleCategoryChange(event.detail.value as UnitCategoryKey)}
      >
        {unitCategories.map((category) => (
          <IonSegmentButton key={category.key} value={category.key}>
            <IonLabel>{category.label}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>

      <InputField
        label="Value"
        value={value}
        onChange={setValue}
        type="number"
        inputMode="decimal"
        allowNegative={categoryKey === 'temperature'}
      />

      <IonItem>
        <IonLabel>From</IonLabel>
        <IonSelect value={fromUnit} onIonChange={(event) => setFromUnit(event.detail.value)}>
          {categoryUnits.map(([key, unit]) => (
            <IonSelectOption key={key} value={key}>
              {unit.label}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>To</IonLabel>
        <IonSelect value={toUnit} onIonChange={(event) => setToUnit(event.detail.value)}>
          {categoryUnits.map(([key, unit]) => (
            <IonSelectOption key={key} value={key}>
              {unit.label}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {result ? (
        <ResultCard
          title="Conversion Result"
          rows={[
            { label: 'Input', value: `${value} ${currentCategory.units[fromUnit]?.label ?? fromUnit}` },
            { label: 'Output', value: `${result} ${currentCategory.units[toUnit]?.label ?? toUnit}` }
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

export default UnitConverter;
