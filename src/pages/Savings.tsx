import { useState } from 'react';
import { IonButton, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

const Savings = () => {
  const [principal, setPrincipal] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [resultRows, setResultRows] = useState<Array<{ label: string; value: string; color?: 'primary' }>>([]);
  const [toastMessage, setToastMessage] = useState('');

  const onCalculate = () => {
    if (!principal.trim() || !monthlyContribution.trim() || !annualRate.trim() || !years.trim()) {
      setToastMessage('Please fill all input fields');
      return;
    }

    const p = Number(principal);
    const m = Number(monthlyContribution);
    const r = Number(annualRate);
    const y = Number(years);

    if (Number.isNaN(p) || Number.isNaN(m) || Number.isNaN(r) || Number.isNaN(y) || p < 0 || m < 0 || r < 0 || y <= 0) {
      setToastMessage('Please enter valid values (years must be greater than 0)');
      return;
    }

    const n = y * 12;
    const mr = (r / 100) / 12;

    const fvPrincipal = p * Math.pow(1 + mr, n);
    const fvMonthly = mr === 0 ? m * n : (m * (Math.pow(1 + mr, n) - 1)) / mr;

    const finalBalance = fvPrincipal + fvMonthly;
    const totalContributions = p + m * n;
    const interestEarned = finalBalance - totalContributions;

    setResultRows([
      { label: 'Final Balance', value: finalBalance.toFixed(2), color: 'primary' },
      { label: 'Total Contributions', value: totalContributions.toFixed(2) },
      { label: 'Interest Earned', value: interestEarned.toFixed(2) }
    ]);
  };

  return (
    <CalculatorLayout title="Savings Calculator">
      <InputField label="Initial Deposit (P)" value={principal} onChange={setPrincipal} type="number" inputMode="decimal" />
      <InputField
        label="Monthly Contribution (M)"
        value={monthlyContribution}
        onChange={setMonthlyContribution}
        type="number"
        inputMode="decimal"
      />
      <InputField
        label="Annual Interest Rate (%)"
        value={annualRate}
        onChange={setAnnualRate}
        type="number"
        inputMode="decimal"
      />
      <InputField label="Years (Y)" value={years} onChange={setYears} type="number" inputMode="decimal" />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {resultRows.length > 0 ? <ResultCard title="Savings Result" rows={resultRows} /> : null}

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

export default Savings;
