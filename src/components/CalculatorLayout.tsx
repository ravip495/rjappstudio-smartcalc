import { PropsWithChildren, useCallback, useEffect } from 'react';
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
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

import styles from './CalculatorLayout.module.scss';

type CalculatorLayoutProps = PropsWithChildren<{
  title: string;
}>;

const CalculatorLayout = ({ title, children }: CalculatorLayoutProps) => {
  const navigate = useNavigate();
  const goHome = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let removeListener: (() => Promise<void>) | undefined;

    void CapacitorApp.addListener('backButton', () => {
      goHome();
    }).then((listener) => {
      removeListener = () => listener.remove();
    });

    return () => {
      if (removeListener) {
        void removeListener();
      }
    };
  }, [goHome]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonButtons slot="start">
            <IonButton
              fill="clear"
              color="light"
              onClick={() => {
                goHome();
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
