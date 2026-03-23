import { PropsWithChildren } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

import styles from './CalculatorLayout.module.scss';

type CalculatorLayoutProps = PropsWithChildren<{
  title: string;
}>;

const CalculatorLayout = ({ title, children }: CalculatorLayoutProps) => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonButtons slot="start">
            <IonButton
              fill="clear"
              color="light"
              onClick={() => {
                navigate(-1);
              }}
              aria-label="Go back"
            >
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className={styles.title}>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={styles.content}>{children}</IonContent>
    </IonPage>
  );
};

export default CalculatorLayout;
