import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const TradeContext = createContext();

export const useTrades = () => {
  return useContext(TradeContext);
};

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const mapToBackend = (trade) => {
  return {
    id: trade.id,
    stockSymbol: trade.ticker,
    buyPrice: trade.buyPrice,
    buyDate: trade.tradeDate,
    quantity: trade.quantity,
    sellPrice: trade.sellPrice,
    sellDate: trade.sellDate,
  };
}

const mapToFrontend = (trade) => {
  return {
    id: trade.id,
    ticker: trade.stockSymbol,
    buyPrice: trade.buyPrice,
    tradeDate: trade.buyDate,
    quantity: trade.quantity,
    sellPrice: trade.sellPrice,
    sellDate: trade.sellDate,
  };
}

export const TradeProvider = ({ children }) => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/trades`);
      setTrades(response.data.map(mapToFrontend));
      setError(null);
    } catch (err) {
      setError('Failed to fetch trades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const addTrade = async (trade) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/trades`, mapToBackend(trade));
      setTrades([...trades, mapToFrontend(response.data)]);
    } catch (err) {
      setError('Failed to add trade.');
    }
  };

  const updateTrade = async (trade) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/trades/${trade.id}`, mapToBackend(trade));
      setTrades(trades.map(t => t.id === trade.id ? mapToFrontend(response.data) : t));
    } catch (err) {
      setError('Failed to update trade.');
    }
  };

  const deleteTrade = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/trades/${id}`);
      setTrades(trades.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete trade.');
    }
  };


  const value = {
    trades,
    loading,
    error,
    fetchTrades,
    addTrade,
    updateTrade,
    deleteTrade,
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};
