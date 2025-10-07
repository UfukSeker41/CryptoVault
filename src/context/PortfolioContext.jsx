import React, { createContext, useState, useEffect } from 'react';
import { getPortfolio, savePortfolio } from '../utils/localStorage';

export const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(getPortfolio());

  useEffect(() => {
    savePortfolio(portfolio);
  }, [portfolio]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now()
    };
    setPortfolio([...portfolio, newTransaction]);
  };

  const removeTransaction = (transactionId) => {
    setPortfolio(portfolio.filter(t => t.id !== transactionId));
  };

  const updateTransaction = (transactionId, updatedData) => {
    setPortfolio(portfolio.map(t => 
      t.id === transactionId ? { ...t, ...updatedData } : t
    ));
  };

  const clearPortfolio = () => {
    setPortfolio([]);
  };

  return (
    <PortfolioContext.Provider value={{ 
      portfolio, 
      addTransaction, 
      removeTransaction, 
      updateTransaction,
      clearPortfolio 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};
