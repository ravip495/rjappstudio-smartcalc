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

type Gender = 'male' | 'female';

const Health = () => {
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [bmi, setBmi] = useState('');
  const [bmr, setBmr] = useState('');
  const [category, setCategory] = useState<{ text: string; color: 'success' | 'warning' | 'danger' | 'primary' } | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState('');

  const helperText = useMemo(
    () =>
      'BMI categories: <18.5 Underweight, 18.5-24.9 Normal, 25-29.9 Overweight, >=30 Obese',
    []
  );

  const onCalculate = () => {
    if (!weightKg.trim() || !heightCm.trim() || !age.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const weight = Number(weightKg);
    const height = Number(heightCm);
    const userAge = Number(age);

    if (
      Number.isNaN(weight) ||
      Number.isNaN(height) ||
      Number.isNaN(userAge) ||
      weight <= 0 ||
      height <= 0 ||
      userAge <= 0
    ) {
      setToastMessage('Please enter valid positive values');
      return;
    }

    const heightM = height / 100;
    const bmiValue = weight / (heightM * heightM);

    let bmiCategory: { text: string; color: 'success' | 'warning' | 'danger' | 'primary' };
    if (bmiValue < 18.5) {
      bmiCategory = { text: 'Underweight', color: 'warning' };
    } else if (bmiValue < 25) {
      bmiCategory = { text: 'Normal', color: 'success' };
    } else if (bmiValue < 30) {
      bmiCategory = { text: 'Overweight', color: 'warning' };
    } else {
      bmiCategory = { text: 'Obese', color: 'danger' };
    }

    const bmrValue =
      gender === 'male'
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * userAge
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * userAge;

    setBmi(bmiValue.toFixed(2));
    setBmr(bmrValue.toFixed(2));
    setCategory(bmiCategory);
  };

  return (
    <CalculatorLayout title="Health Calculator (BMI/BMR)">
      <InputField label="Weight (kg)" value={weightKg} onChange={setWeightKg} type="number" inputMode="decimal" />
      <InputField label="Height (cm)" value={heightCm} onChange={setHeightCm} type="number" inputMode="decimal" />
      <InputField label="Age" value={age} onChange={setAge} type="number" inputMode="decimal" />

      <IonSegment className="segment-wrap" value={gender} onIonChange={(event) => setGender(event.detail.value as Gender)}>
        <IonSegmentButton value="male">
          <IonLabel>Male</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="female">
          <IonLabel>Female</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <p className="helper-text">{helperText}</p>

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {bmi && bmr && category ? (
        <ResultCard
          title="Health Result"
          rows={[
            { label: 'BMI', value: bmi, color: 'primary' },
            { label: 'BMI Category', value: category.text, color: category.color },
            { label: 'BMR (kcal/day)', value: bmr }
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

export default Health;
