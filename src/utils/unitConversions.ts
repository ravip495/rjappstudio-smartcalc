export type UnitCategoryKey =
  | 'length'
  | 'weight'
  | 'temperature'
  | 'speed'
  | 'volume'
  | 'area'
  | 'time'
  | 'pressure'
  | 'data';

interface UnitDefinition {
  label: string;
  factor: number;
}

export interface UnitCategory {
  key: UnitCategoryKey;
  label: string;
  units: Record<string, UnitDefinition>;
}

export const unitCategories: UnitCategory[] = [
  {
    key: 'length',
    label: 'Length',
    units: {
      m: { label: 'Meter (m)', factor: 1 },
      km: { label: 'Kilometer (km)', factor: 0.001 },
      cm: { label: 'Centimeter (cm)', factor: 100 },
      mm: { label: 'Millimeter (mm)', factor: 1000 },
      mile: { label: 'Mile (mi)', factor: 1 / 1609.34 },
      ft: { label: 'Foot (ft)', factor: 3.28084 },
      inch: { label: 'Inch (in)', factor: 39.3701 },
      yard: { label: 'Yard (yd)', factor: 1.09361 }
    }
  },
  {
    key: 'weight',
    label: 'Weight',
    units: {
      kg: { label: 'Kilogram (kg)', factor: 1 },
      g: { label: 'Gram (g)', factor: 1000 },
      mg: { label: 'Milligram (mg)', factor: 1e6 },
      lb: { label: 'Pound (lb)', factor: 2.20462 },
      oz: { label: 'Ounce (oz)', factor: 35.274 },
      ton: { label: 'Metric Ton (t)', factor: 0.001 }
    }
  },
  {
    key: 'temperature',
    label: 'Temperature',
    units: {
      C: { label: 'Celsius (°C)', factor: 1 },
      F: { label: 'Fahrenheit (°F)', factor: 1 },
      K: { label: 'Kelvin (K)', factor: 1 }
    }
  },
  {
    key: 'speed',
    label: 'Speed',
    units: {
      ms: { label: 'Meters/sec (m/s)', factor: 1 },
      kmh: { label: 'Km/hour (km/h)', factor: 3.6 },
      mph: { label: 'Miles/hour (mph)', factor: 2.23694 },
      knot: { label: 'Knot', factor: 1.94384 }
    }
  },
  {
    key: 'volume',
    label: 'Volume',
    units: {
      L: { label: 'Liter (L)', factor: 1 },
      mL: { label: 'Milliliter (mL)', factor: 1000 },
      m3: { label: 'Cubic meter (m³)', factor: 0.001 },
      gallon: { label: 'Gallon (US)', factor: 0.264172 },
      cup: { label: 'Cup (US)', factor: 4.22675 },
      floz: { label: 'Fluid ounce', factor: 33.814 }
    }
  },
  {
    key: 'area',
    label: 'Area',
    units: {
      m2: { label: 'Square meter (m²)', factor: 1 },
      km2: { label: 'Square kilometer (km²)', factor: 1e-6 },
      cm2: { label: 'Square centimeter (cm²)', factor: 10000 },
      ft2: { label: 'Square foot (ft²)', factor: 10.7639 },
      in2: { label: 'Square inch (in²)', factor: 1550 },
      acre: { label: 'Acre', factor: 0.000247 },
      ha: { label: 'Hectare', factor: 0.0001 }
    }
  },
  {
    key: 'time',
    label: 'Time',
    units: {
      s: { label: 'Second (s)', factor: 1 },
      min: { label: 'Minute (min)', factor: 1 / 60 },
      h: { label: 'Hour (h)', factor: 1 / 3600 },
      day: { label: 'Day', factor: 1 / 86400 },
      week: { label: 'Week', factor: 1 / 604800 },
      ms: { label: 'Millisecond (ms)', factor: 1000 }
    }
  },
  {
    key: 'pressure',
    label: 'Pressure',
    units: {
      Pa: { label: 'Pascal (Pa)', factor: 1 },
      kPa: { label: 'Kilopascal (kPa)', factor: 0.001 },
      bar: { label: 'Bar', factor: 0.00001 },
      psi: { label: 'PSI', factor: 0.000145038 },
      atm: { label: 'Atmosphere (atm)', factor: 0.00000986923 }
    }
  },
  {
    key: 'data',
    label: 'Data',
    units: {
      B: { label: 'Byte (B)', factor: 1 },
      KB: { label: 'Kilobyte (KB)', factor: 1 / 1024 },
      MB: { label: 'Megabyte (MB)', factor: 1 / 1048576 },
      GB: { label: 'Gigabyte (GB)', factor: 1 / 1073741824 },
      TB: { label: 'Terabyte (TB)', factor: 1 / 1099511627776 }
    }
  }
];

const toCelsius = (value: number, from: string): number => {
  if (from === 'C') return value;
  if (from === 'F') return ((value - 32) * 5) / 9;
  return value - 273.15;
};

const fromCelsius = (valueC: number, to: string): number => {
  if (to === 'C') return valueC;
  if (to === 'F') return (valueC * 9) / 5 + 32;
  return valueC + 273.15;
};

export const convertUnitValue = (
  value: number,
  categoryKey: UnitCategoryKey,
  fromUnit: string,
  toUnit: string
): number => {
  if (categoryKey === 'temperature') {
    const celsius = toCelsius(value, fromUnit);
    return fromCelsius(celsius, toUnit);
  }

  const category = unitCategories.find((item) => item.key === categoryKey);
  if (!category) {
    throw new Error('Category not found');
  }

  const fromFactor = category.units[fromUnit]?.factor;
  const toFactor = category.units[toUnit]?.factor;

  if (!fromFactor || !toFactor) {
    throw new Error('Unit not found');
  }

  const baseValue = value / fromFactor;
  return baseValue * toFactor;
};

export const formatConversionResult = (value: number): string => {
  return Number(value.toFixed(10)).toString();
};
