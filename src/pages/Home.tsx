import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/react';
import {
  basketOutline,
  calendarOutline,
  calculatorOutline,
  carSportOutline,
  cashOutline,
  codeSlashOutline,
  globeOutline,
  pricetagOutline,
  receiptOutline,
  restaurantOutline,
  schoolOutline,
  speedometerOutline,
  star,
  starOutline,
  statsChartOutline,
  swapVerticalOutline,
  walletOutline,
  cardOutline
} from 'ionicons/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

import styles from './Home.module.scss';
import ExitDialog from '../components/ExitDialog';

interface HomeProps {
  isDarkMode: boolean;
  onToggleDarkMode: (enabled: boolean) => Promise<void>;
}

interface CalculatorTile {
  id: string;
  route: string;
  name: string;
  description: string;
  icon: string;
}

const FAVORITES_KEY = 'favoriteCalculators';

const tiles: CalculatorTile[] = [
  {
    id: 'calculator',
    route: '/calculator',
    name: 'Scientific Calculator',
    description: 'Advanced expression parser with history',
    icon: calculatorOutline
  },
  {
    id: 'unit-converter',
    route: '/unit-converter',
    name: 'Unit Converter',
    description: 'Length, weight, temperature and more',
    icon: swapVerticalOutline
  },
  {
    id: 'currency',
    route: '/currency',
    name: 'Currency Converter',
    description: '20 major currencies versus USD',
    icon: cashOutline
  },
  {
    id: 'percentage',
    route: '/percentage',
    name: 'Percentage',
    description: 'Percent of, ratio, and change modes',
    icon: statsChartOutline
  },
  {
    id: 'discount',
    route: '/discount',
    name: 'Discount Calculator',
    description: 'Savings and final price instantly',
    icon: pricetagOutline
  },
  {
    id: 'loan',
    route: '/loan',
    name: 'Loan EMI',
    description: 'Monthly EMI, total payment, interest',
    icon: cardOutline
  },
  {
    id: 'date',
    route: '/date',
    name: 'Date Calculator',
    description: 'Date difference and add/subtract days',
    icon: calendarOutline
  },
  {
    id: 'fuel-cost',
    route: '/fuel-cost',
    name: 'Fuel Cost',
    description: 'Trip liters needed and total expense',
    icon: carSportOutline
  },
  {
    id: 'fuel-efficiency',
    route: '/fuel-efficiency',
    name: 'Fuel Efficiency',
    description: 'km/L, MPG, and L/100km metrics',
    icon: speedometerOutline
  },
  {
    id: 'gpa',
    route: '/gpa',
    name: 'GPA Calculator',
    description: 'Dynamic courses with credit weighting',
    icon: schoolOutline
  },
  {
    id: 'tip',
    route: '/tip',
    name: 'Tip Calculator',
    description: 'Tip, split bill, and per person totals',
    icon: restaurantOutline
  },
  {
    id: 'tax',
    route: '/tax',
    name: 'Sales Tax',
    description: 'Tax, total, and reverse pre-tax mode',
    icon: receiptOutline
  },
  {
    id: 'unit-price',
    route: '/unit-price',
    name: 'Unit Price',
    description: 'Compare products and best value row',
    icon: basketOutline
  },
  {
    id: 'world-time',
    route: '/world-time',
    name: 'World Time',
    description: 'City timezone conversion with day shift',
    icon: globeOutline
  },
  {
    id: 'hex',
    route: '/hex',
    name: 'Hex Converter',
    description: 'Decimal, hex, binary, octal sync',
    icon: codeSlashOutline
  },
  {
    id: 'savings',
    route: '/savings',
    name: 'Savings Calculator',
    description: 'Future value with monthly contributions',
    icon: walletOutline
  }
];

const Home = ({ isDarkMode, onToggleDarkMode }: HomeProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await Preferences.get({ key: FAVORITES_KEY });
      if (stored.value) {
        try {
          const parsed = JSON.parse(stored.value) as string[];
          setFavorites(parsed);
        } catch {
          setFavorites([]);
        }
      }
    };

    void loadFavorites();
  }, []);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const filteredTiles = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    const list = tiles.filter((tile) => {
      if (!lowerSearch) {
        return true;
      }

      return (
        tile.name.toLowerCase().includes(lowerSearch) ||
        tile.description.toLowerCase().includes(lowerSearch)
      );
    });

    return list.sort((a, b) => {
      const aFav = favoriteSet.has(a.id) ? 1 : 0;
      const bFav = favoriteSet.has(b.id) ? 1 : 0;
      return bFav - aFav;
    });
  }, [favoriteSet, search]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      setFavorites((current) => {
        const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
        void Preferences.set({ key: FAVORITES_KEY, value: JSON.stringify(next) });
        return next;
      });
    },
    []
  );

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let removeListener: (() => Promise<void>) | undefined;

    void CapacitorApp.addListener('backButton', () => {
      if (location.pathname !== '/') {
        return;
      }

      setShowExitDialog((current) => !current);
    }).then((listener) => {
      removeListener = () => listener.remove();
    });

    return () => {
      if (removeListener) {
        void removeListener();
      }
    };
  }, [location.pathname]);

  const handleRateOnPlayStore = () => {
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.example.clevcalc';
    window.open(playStoreUrl, '_blank', 'noopener,noreferrer');
  };

  const handleExitApp = async () => {
    if (Capacitor.isNativePlatform()) {
      await CapacitorApp.exitApp();
      return;
    }

    window.close();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className={styles.toolbar}>
          <IonTitle className={styles.title}>
            <div className={styles.brand}>
              <div className={styles.logoShell}>
                <img src="/smartcalc_pro_icon.png" alt="SmartCalc PRO" className={styles.logoImage} />
              </div>
              <div className={styles.brandText}>
                <span className={styles.brandMain}>SmartCalc PRO</span>
                <span className={styles.brandSub}>All Calculators</span>
              </div>
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className={styles.content}>
        <IonSearchbar
          value={search}
          placeholder="Search calculators"
          onIonInput={(event) => setSearch(event.detail.value ?? '')}
          className={styles.searchbar}
        />

        <IonCard className={styles.settingsCard}>
          <IonItem lines="none" className={styles.settingsItem}>
            <IonLabel>
              <h2 className={styles.settingsHeading}>Settings</h2>
              <p className={styles.settingsCaption}>Dark mode</p>
            </IonLabel>
            <IonToggle
              checked={isDarkMode}
              onIonChange={(event) => {
                void onToggleDarkMode(event.detail.checked);
              }}
            />
          </IonItem>
        </IonCard>

        <IonGrid className={styles.grid}>
          <IonRow>
            {filteredTiles.map((tile) => {
              const favorite = favoriteSet.has(tile.id);

              return (
                <IonCol size="6" key={tile.id}>
                  <IonCard
                    button
                    className={styles.tileCard}
                    onClick={() => {
                      navigate(tile.route);
                    }}
                  >
                    <IonCardContent className={styles.tileContent}>
                      <IonButton
                        fill="clear"
                        size="small"
                        className={styles.favoriteBtn}
                        onClick={(event) => {
                          event.stopPropagation();
                          void toggleFavorite(tile.id);
                        }}
                      >
                        <IonIcon icon={favorite ? star : starOutline} color={favorite ? 'warning' : 'medium'} />
                      </IonButton>

                      <IonIcon icon={tile.icon} className={styles.tileIcon} />
                      <h3 className={styles.tileName}>{tile.name}</h3>
                      <p className={styles.tileDescription}>{tile.description}</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>

        <ExitDialog
          isOpen={showExitDialog}
          onDismiss={() => setShowExitDialog(false)}
          onContinue={() => setShowExitDialog(false)}
          onRate={handleRateOnPlayStore}
          onExit={() => {
            void handleExitApp();
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
