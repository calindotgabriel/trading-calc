import { useTradingContext } from '../context/TradingContext';

export const InputForm = () => {
  const { tradingState, setTradingState, updateCalculations } = useTradingContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCalculations();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTradingState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="input-group">
        <label htmlFor="entryPrice">Entry Price ($)</label>
        <input
          type="number"
          id="entryPrice"
          name="entryPrice"
          value={tradingState.entryPrice}
          onChange={handleChange}
          step="any"
          required
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="stopLossPrice">Stop Loss Price ($)</label>
        <input
          type="number"
          id="stopLossPrice"
          name="stopLossPrice"
          value={tradingState.stopLossPrice}
          onChange={handleChange}
          step="any"
          required
        />
      </div>
      
      <div className="input-group">
        <label htmlFor="riskAmount">Risk Amount ($)</label>
        <input
          type="number"
          id="riskAmount"
          name="riskAmount"
          value={tradingState.riskAmount}
          onChange={handleChange}
          step="any"
          required
        />
      </div>

      <button type="submit">Calculate</button>
    </form>
  );
};
