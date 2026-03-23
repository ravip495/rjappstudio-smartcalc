import { useMemo, useState } from 'react';
import { IonButton, IonItem, IonLabel, IonSelect, IonSelectOption, IonToast } from '@ionic/react';

import CalculatorLayout from '../components/CalculatorLayout';
import InputField from '../components/InputField';
import ResultCard from '../components/ResultCard';

interface CityTimezone {
  city: string;
  timeZone: string;
}

const cityTimezones: CityTimezone[] = [
  { city: 'New York', timeZone: 'America/New_York' },
  { city: 'Los Angeles', timeZone: 'America/Los_Angeles' },
  { city: 'Chicago', timeZone: 'America/Chicago' },
  { city: 'Toronto', timeZone: 'America/Toronto' },
  { city: 'Mexico City', timeZone: 'America/Mexico_City' },
  { city: 'London', timeZone: 'Europe/London' },
  { city: 'Paris', timeZone: 'Europe/Paris' },
  { city: 'Berlin', timeZone: 'Europe/Berlin' },
  { city: 'Madrid', timeZone: 'Europe/Madrid' },
  { city: 'Rome', timeZone: 'Europe/Rome' },
  { city: 'Moscow', timeZone: 'Europe/Moscow' },
  { city: 'Dubai', timeZone: 'Asia/Dubai' },
  { city: 'Riyadh', timeZone: 'Asia/Riyadh' },
  { city: 'Mumbai', timeZone: 'Asia/Kolkata' },
  { city: 'Karachi', timeZone: 'Asia/Karachi' },
  { city: 'Dhaka', timeZone: 'Asia/Dhaka' },
  { city: 'Bangkok', timeZone: 'Asia/Bangkok' },
  { city: 'Singapore', timeZone: 'Asia/Singapore' },
  { city: 'Hong Kong', timeZone: 'Asia/Hong_Kong' },
  { city: 'Beijing', timeZone: 'Asia/Shanghai' },
  { city: 'Seoul', timeZone: 'Asia/Seoul' },
  { city: 'Tokyo', timeZone: 'Asia/Tokyo' },
  { city: 'Sydney', timeZone: 'Australia/Sydney' },
  { city: 'Melbourne', timeZone: 'Australia/Melbourne' },
  { city: 'Auckland', timeZone: 'Pacific/Auckland' },
  { city: 'Johannesburg', timeZone: 'Africa/Johannesburg' },
  { city: 'Nairobi', timeZone: 'Africa/Nairobi' },
  { city: 'Sao Paulo', timeZone: 'America/Sao_Paulo' },
  { city: 'Buenos Aires', timeZone: 'America/Argentina/Buenos_Aires' },
  { city: 'Honolulu', timeZone: 'Pacific/Honolulu' }
];

const getTimeZoneOffsetMinutes = (timeZone: string, date: Date): number => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0');

  const asUTC = Date.UTC(
    getPart('year'),
    getPart('month') - 1,
    getPart('day'),
    getPart('hour'),
    getPart('minute'),
    getPart('second')
  );

  return (asUTC - date.getTime()) / 60000;
};

const localTimeInZoneToUtc = (value: string, timeZone: string): Date | null => {
  const [datePart, timePart] = value.split('T');
  if (!datePart || !timePart) {
    return null;
  }

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  if ([year, month, day, hour, minute].some((part) => Number.isNaN(part))) {
    return null;
  }

  const baseUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let timestamp = baseUtc;

  for (let index = 0; index < 2; index += 1) {
    const offset = getTimeZoneOffsetMinutes(timeZone, new Date(timestamp));
    timestamp = baseUtc - offset * 60000;
  }

  return new Date(timestamp);
};

const getZoneDateKey = (date: Date, timeZone: string): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return formatter.format(date);
};

const parseDateKey = (value: string): number => {
  const [year, month, day] = value.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / (24 * 60 * 60 * 1000));
};

const formatZoneDateTime = (date: Date, timeZone: string): string =>
  new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);

const WorldTime = () => {
  const [sourceCity, setSourceCity] = useState(cityTimezones[0].city);
  const [targetCity, setTargetCity] = useState(cityTimezones[1].city);
  const [sourceDateTime, setSourceDateTime] = useState('');
  const [resultRows, setResultRows] = useState<Array<{ label: string; value: string }>>([]);
  const [toastMessage, setToastMessage] = useState('');

  const cityMap = useMemo(
    () =>
      cityTimezones.reduce<Record<string, string>>((acc, current) => {
        acc[current.city] = current.timeZone;
        return acc;
      }, {}),
    []
  );

  const onCalculate = () => {
    if (!sourceDateTime) {
      setToastMessage('Please select source date and time');
      return;
    }

    const fromZone = cityMap[sourceCity];
    const toZone = cityMap[targetCity];

    if (!fromZone || !toZone) {
      setToastMessage('Please choose valid cities');
      return;
    }

    const utcDate = localTimeInZoneToUtc(sourceDateTime, fromZone);
    if (!utcDate) {
      setToastMessage('Invalid date/time');
      return;
    }

    const sourceFormatted = formatZoneDateTime(utcDate, fromZone);
    const targetFormatted = formatZoneDateTime(utcDate, toZone);

    const sourceDay = parseDateKey(getZoneDateKey(utcDate, fromZone));
    const targetDay = parseDateKey(getZoneDateKey(utcDate, toZone));
    const delta = targetDay - sourceDay;

    const dayIndicator = delta > 0 ? `+${delta} day` : delta < 0 ? `${delta} day` : 'Same day';

    setResultRows([
      { label: `${sourceCity} Time`, value: sourceFormatted },
      { label: `${targetCity} Time`, value: targetFormatted },
      { label: 'Date Change', value: dayIndicator }
    ]);
  };

  return (
    <CalculatorLayout title="World Time Converter">
      <IonItem>
        <IonLabel>Source City</IonLabel>
        <IonSelect value={sourceCity} onIonChange={(event) => setSourceCity(event.detail.value)}>
          {cityTimezones.map((city) => (
            <IonSelectOption key={city.city} value={city.city}>
              {city.city}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonLabel>Target City</IonLabel>
        <IonSelect value={targetCity} onIonChange={(event) => setTargetCity(event.detail.value)}>
          {cityTimezones.map((city) => (
            <IonSelectOption key={city.city} value={city.city}>
              {city.city}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <InputField
        label="Source Date & Time"
        value={sourceDateTime}
        onChange={setSourceDateTime}
        type="datetime-local"
      />

      <IonButton expand="block" color="primary" className="primary-action" onClick={onCalculate}>
        Calculate
      </IonButton>

      {resultRows.length > 0 ? <ResultCard title="World Time Result" rows={resultRows} /> : null}

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

export default WorldTime;
