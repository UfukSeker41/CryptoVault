import React, { createContext, useState, useEffect } from 'react';
import { getCurrency, saveCurrency } from '../utils/localStorage';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(getCurrency());

  useEffect(() => {
    saveCurrency(currency);
  }, [currency]);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency.toLowerCase());
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
