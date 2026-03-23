export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
}

export const CURRENCY_LAST_UPDATED = '2026-03-20T00:00:00Z';

export const currencyRates: CurrencyRate[] = [
  { code: 'USD', name: 'US Dollar', rate: 1 },
  { code: 'EUR', name: 'Euro', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', rate: 0.78 },
  { code: 'JPY', name: 'Japanese Yen', rate: 149.8 },
  { code: 'AUD', name: 'Australian Dollar', rate: 1.51 },
  { code: 'CAD', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'CHF', name: 'Swiss Franc', rate: 0.89 },
  { code: 'CNY', name: 'Chinese Yuan', rate: 7.18 },
  { code: 'INR', name: 'Indian Rupee', rate: 83.1 },
  { code: 'SGD', name: 'Singapore Dollar', rate: 1.34 },
  { code: 'HKD', name: 'Hong Kong Dollar', rate: 7.81 },
  { code: 'NZD', name: 'New Zealand Dollar', rate: 1.65 },
  { code: 'SEK', name: 'Swedish Krona', rate: 10.4 },
  { code: 'NOK', name: 'Norwegian Krone', rate: 10.7 },
  { code: 'DKK', name: 'Danish Krone', rate: 6.86 },
  { code: 'AED', name: 'UAE Dirham', rate: 3.67 },
  { code: 'SAR', name: 'Saudi Riyal', rate: 3.75 },
  { code: 'ZAR', name: 'South African Rand', rate: 18.2 },
  { code: 'BRL', name: 'Brazilian Real', rate: 5.03 },
  { code: 'MXN', name: 'Mexican Peso', rate: 17.1 }
];
