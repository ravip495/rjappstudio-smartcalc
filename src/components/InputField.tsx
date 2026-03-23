import { InputChangeEventDetail, IonInput, IonItem, IonLabel } from '@ionic/react';
import styles from './InputField.module.scss';

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local';
  min?: number;
  max?: number;
  step?: number | string;
  inputMode?: 'decimal' | 'numeric' | 'text';
  allowNegative?: boolean;
  disabled?: boolean;
}

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'number',
  min,
  max,
  step,
  inputMode = 'decimal',
  allowNegative = false,
  disabled = false
}: InputFieldProps) => {
  const computedMin = allowNegative ? min : min ?? 0;
  const resolvedMin = type === 'number' && computedMin !== undefined ? String(computedMin) : undefined;
  const resolvedMax = type === 'number' && max !== undefined ? String(max) : undefined;
  const resolvedStep = type === 'number' && step !== undefined ? String(step) : undefined;

  return (
    <IonItem className={styles.item} lines="none">
      <IonLabel position="stacked" className={styles.label}>
        {label}
      </IonLabel>
      <IonInput
        className={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        min={resolvedMin}
        max={resolvedMax}
        step={resolvedStep}
        inputmode={type === 'number' ? inputMode : undefined}
        onIonInput={(event: CustomEvent<InputChangeEventDetail>) =>
          onChange(event.detail.value ?? '')
        }
        disabled={disabled}
      />
    </IonItem>
  );
};

export default InputField;
