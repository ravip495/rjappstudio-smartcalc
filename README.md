# SmartCalc PRO - All Calculators

Ionic React + TypeScript calculator suite with 18 calculators, Capacitor Android support, dark mode, favorites, scientific history storage, and clipboard copy support.

## Tech Stack

- Ionic React with TypeScript
- Capacitor v5 (Android target)
- React hooks (`useState`, `useCallback`, `useMemo`)
- React Router v6 via `@ionic/react`
- Ionic CSS variables + SCSS modules
- `@capacitor/preferences` for history/favorites/theme
- `@capacitor/clipboard` for result copy

## Included Calculators (18)

1. Scientific Calculator
2. Unit Converter
3. Currency Converter
4. Percentage Calculator
5. Discount Calculator
6. Loan / EMI Calculator
7. Date Calculator
8. Health (BMI/BMR)
9. Fuel Cost
10. Fuel Efficiency
11. GPA Calculator
12. Tip Calculator
13. Sales Tax
14. Unit Price Comparator
15. World Time Converter
16. Ovulation Calculator
17. Hex / Decimal / Binary Converter
18. Savings Calculator

## Install

```bash
npm install
```

## Run Web (Ionic/Vite)

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Add Android (Capacitor)

```bash
npx cap add android
```

## Sync Web Build to Android

```bash
npm run build
npx cap sync android
```

## Open in Android Studio

```bash
npx cap open android
```

## Android Release Build (from Android Studio)

1. Open project using `npx cap open android`
2. Set minimum SDK/API level to 24+
3. Build signed APK/AAB from Android Studio:
   - `Build > Generate Signed Bundle / APK`

## Capacitor App Identity

- **appId:** `com.example.clevcalc`
- **appName:** `SmartCalc PRO`
- **webDir:** `dist`

## Notes

- Scientific calculator uses a recursive descent parser (no `eval`).
- Scientific history keeps the latest 20 entries in Capacitor Preferences.
- Home screen favorites and dark mode preference are persisted using Capacitor Preferences.
- World time conversion uses `Intl.DateTimeFormat` with timezone support.
