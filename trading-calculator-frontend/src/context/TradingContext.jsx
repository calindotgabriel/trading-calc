
import { createContext, useContext, useState } from 'react';

const TradingContext = createContext(null);

export const TradingProvider = ({ children }) => {
  const [tradingState, setTradingState] = useState({
    entryPrice: '',
    stopLossPrice: '',
    riskAmount: 50,
    calculations: null
  });

  const calculatePosition = (entryPrice, stopLossPrice, riskAmount = 50) => {
    const riskPercentage = ((entryPrice - stopLossPrice) / entryPrice) * 100;
    const priceDifference = entryPrice - stopLossPrice;
    const positionSizeCoins = riskAmount / priceDifference;
    const positionSizeDollars = positionSizeCoins * entryPrice;
    
    const leverageX20 = {
      coins: positionSizeCoins / 20,
      dollars: positionSizeDollars / 20,
      margin: positionSizeDollars / 20,
      totalPosition: positionSizeDollars
    };
    
    const leverageX50 = {
      coins: positionSizeCoins / 50,
      dollars: positionSizeDollars / 50,
      margin: positionSizeDollars / 50,
      totalPosition: positionSizeDollars
    };
    
    return {
      entryPrice,
      stopLossPrice,
      riskPercentage,
      positionSizeCoins,
      positionSizeDollars,
      riskAmount,
      leverageX20,
      leverageX50
    };
  };

  const updateCalculations = () => {
    if (tradingState.entryPrice && tradingState.stopLossPrice) {
      const result = calculatePosition(
        parseFloat(tradingState.entryPrice),
        parseFloat(tradingState.stopLossPrice),
        tradingState.riskAmount
      );
      setTradingState(prev => ({ ...prev, calculations: result }));
    }
  };

  return (
    <TradingContext.Provider value={{ tradingState, setTradingState, updateCalculations }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};
