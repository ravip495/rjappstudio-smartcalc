import { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonToast
} from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';

import styles from './ResultCard.module.scss';

interface ResultRow {
  label: string;
  value: string;
  color?: 'success' | 'warning' | 'danger' | 'primary' | 'default';
  monospace?: boolean;
}

interface ResultCardProps {
  title?: string;
  rows: ResultRow[];
  copyValue?: string;
}

const ResultCard = ({ title = 'Result', rows, copyValue }: ResultCardProps) => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');

  const resolvedCopyValue =
    copyValue ?? rows.map((row) => `${row.label}: ${row.value}`).join(' | ');

  const handleCopy = async () => {
    try {
      await Clipboard.write({ string: resolvedCopyValue });
      setToastColor('success');
      setToastMessage('Result copied to clipboard');
    } catch {
      setToastColor('danger');
      setToastMessage('Unable to copy result');
    }
  };

  return (
    <>
      <IonCard className={styles.card}>
        <IonCardContent>
          <div className={styles.headerRow}>
            <IonText className={styles.title}>{title}</IonText>
            <IonButton
              fill="clear"
              size="small"
              color="primary"
              onClick={handleCopy}
              className={styles.copyButton}
            >
              <IonIcon icon={copyOutline} slot="start" />
              Copy
            </IonButton>
          </div>

          {rows.map((row) => {
            const colorClass =
              row.color === 'success'
                ? styles.success
                : row.color === 'warning'
                  ? styles.warning
                  : row.color === 'danger'
                    ? styles.danger
                    : row.color === 'primary'
                      ? styles.primary
                      : '';

            return (
              <div className={styles.resultRow} key={`${row.label}-${row.value}`}>
                <span className={styles.label}>{row.label}</span>
                <span
                  className={`${styles.value} ${colorClass} ${row.monospace ? styles.monospace : ''}`}
                >
                  {row.value}
                </span>
              </div>
            );
          })}
        </IonCardContent>
      </IonCard>

      <IonToast
        isOpen={Boolean(toastMessage)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color={toastColor}
        onDidDismiss={() => setToastMessage('')}
      />
    </>
  );
};

export default ResultCard;
