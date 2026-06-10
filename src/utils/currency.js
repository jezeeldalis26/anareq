import { CURRENCY_OPTIONS, LANGUAGE_LOCALES } from '../constants/currencies';
import { safeNum } from './safeMath';

export const getCurrencyOption = (code) => CURRENCY_OPTIONS.find((item) => item.code === code) || CURRENCY_OPTIONS[0];
export const formatCurrency = (value, currencyCode = 'USD', language = 'es', maximumFractionDigits = 0) => {
  const option = getCurrencyOption(currencyCode);
  const locale = LANGUAGE_LOCALES[language] || LANGUAGE_LOCALES.es;
  return `${option.symbol}${safeNum(value).toLocaleString(locale, { maximumFractionDigits })}`;
};
export const replaceCurrencySymbol = (value, currencyCode = 'USD') => String(value ?? '').replace(/\$/g, getCurrencyOption(currencyCode).symbol);

export const money = (value, currencyCode = 'USD', language = 'es', digits = 0) => formatCurrency(value, currencyCode, language, digits);
