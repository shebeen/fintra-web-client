import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import { startOfWeek, startOfMonth, startOfYear, isWithinInterval, parseISO } from 'date-fns';

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
  const [dateFilter, setDateFilter] = useState({ type: 'all', range: [null, null] });

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

  const filteredTrades = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (dateFilter.type) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'this_week':
        startDate = startOfWeek(now);
        break;
      case 'this_month':
        startDate = startOfMonth(now);
        break;
      case 'this_year':
        startDate = startOfYear(now);
        break;
      case 'custom':
        if (dateFilter.range[0] && dateFilter.range[1]) {
          return trades.filter(trade => isWithinInterval(parseISO(trade.tradeDate), { start: dateFilter.range[0], end: dateFilter.range[1] }));
        }
        return trades;
      default:
        return trades;
    }

    return trades.filter(trade => isWithinInterval(parseISO(trade.tradeDate), { start: startDate, end: now }));
  }, [trades, dateFilter]);


  const value = {
    trades: filteredTrades,
    loading,
    error,
    fetchTrades,
    addTrade,
    updateTrade,
    deleteTrade,
    setDateFilter,
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};
