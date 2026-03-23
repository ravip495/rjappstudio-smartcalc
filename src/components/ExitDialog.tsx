import { IonButton, IonIcon, IonModal } from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';

import styles from './ExitDialog.module.scss';

interface ExitDialogProps {
  isOpen: boolean;
  onDismiss: () => void;
  onRate: () => void;
  onContinue: () => void;
  onExit: () => void;
}

const ExitDialog = ({ isOpen, onDismiss, onRate, onContinue, onExit }: ExitDialogProps) => {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      backdropDismiss
      className="premium-exit-modal"
      showBackdrop
    >
      <div className={styles.shell}>
        <div className={styles.card} role="dialog" aria-modal="true" aria-label="Exit SmartCalc PRO">
          <div className={styles.iconBubble}>
            <IonIcon icon={logOutOutline} className={styles.icon} aria-hidden="true" />
          </div>

          <h2 className={styles.title}>Exit SmartCalc PRO?</h2>
          <p className={styles.subtitle}>Enjoying the app? A quick rating helps us improve.</p>

          <div className={styles.actions}>
            <IonButton
              expand="block"
              className={styles.primaryButton}
              onClick={() => {
                onRate();
                onDismiss();
              }}
            >
              ⭐ Rate App
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              className={styles.secondaryButton}
              onClick={() => {
                onContinue();
              }}
            >
              Continue Using App
            </IonButton>

            <IonButton
              expand="block"
              fill="clear"
              className={styles.tertiaryButton}
              onClick={() => {
                onDismiss();
                onExit();
              }}
            >
              Exit
            </IonButton>
          </div>
        </div>
      </div>
    </IonModal>
  );
};

export default ExitDialog;
