import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const Loan = () => {
  const [principal, setPrincipal] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [emi, setEmi] = useState('');
  const [totalPayment, setTotalPayment] = useState('');
  const [totalInterest, setTotalInterest] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (!principal.trim() || !annualRate.trim() || !termMonths.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const p = Number(principal);
    const r = Number(annualRate);
    const n = Number(termMonths);

    if (Number.isNaN(p) || Number.isNaN(r) || Number.isNaN(n) || p < 0 || r < 0 || n <= 0) {
      setToastMessage('Enter valid values (term must be greater than zero)');
      return;
    }

    const monthlyRate = (r / 100) / 12;
    let monthlyEmi = 0;

    if (monthlyRate === 0) {
      monthlyEmi = p / n;
    } else {
      const factor = Math.pow(1 + monthlyRate, n);
      monthlyEmi = (p * monthlyRate * factor) / (factor - 1);
    }

    const payment = monthlyEmi * n;
    const interest = payment - p;

    setEmi(monthlyEmi.toFixed(2));
    setTotalPayment(payment.toFixed(2));
    setTotalInterest(interest.toFixed(2));
  };

  return (
    <CalculatorLayout title="Loan / EMI Calculator">
      <InputField label="Principal (P)" value={principal} onChange={setPrincipal} type="number" inputMode="decimal" />
      <InputField
        label="Annual Interest Rate (%)"
        value={annualRate}
        onChange={setAnnualRate}
        type="number"
        inputMode="decimal"
      />
      <InputField
        label="Term (months)"
        value={termMonths}
        onChange={setTermMonths}
        type="number"
        inputMode="decimal"
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {emi ? (
        <ResultCard
          title="EMI Result"
          rows={[
            { label: 'Monthly EMI', value: emi, color: 'primary' },
            { label: 'Total Payment', value: totalPayment },
            { label: 'Total Interest', value: totalInterest }
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

export default Loan;
