import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { startOfWeek, startOfMonth, startOfYear, format } from 'date-fns';

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

  const getDateRange = (filter) => {
    const now = new Date();
    let startDate;
    let endDate = now;

    switch (filter.type) {
      case 'today':
        startDate = new Date(); // Today
        break;
      case 'this_week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'this_month':
        startDate = startOfMonth(now);
        break;
      case 'this_year':
        startDate = startOfYear(now);
        break;
      case 'custom':
        if (filter.range[0] && filter.range[1]) {
          startDate = filter.range[0];
          endDate = filter.range[1];
        } else {
            return { startDate: null, endDate: null }; // Incomplete range
        }
        break;
      case 'all':
      default:
        return { startDate: null, endDate: null };
    }
    return { startDate, endDate };
  };

  const fetchTrades = async (startDate, endDate) => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/trades`;
      const params = [];
      if (startDate) {
        params.push(`from_date=${format(startDate, 'yyyy-MM-dd')}`);
      }
      if (endDate) {
        params.push(`to_date=${format(endDate, 'yyyy-MM-dd')}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await axios.get(url);
      setTrades(response.data.map(mapToFrontend));
      setError(null);
    } catch (err) {
      setError('Failed to fetch trades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { startDate, endDate } = getDateRange(dateFilter);
    fetchTrades(startDate, endDate);
  }, [dateFilter]);

  const addTrade = async (trade) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/trades`, mapToBackend(trade));
      // With backend filtering, we should decide whether to append or refetch.
      // Assuming optimist append is fine, but maybe inconsistent with filter.
      // But keeping existing behavior for mutation:
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
    trades, // Use direct trades state
    loading,
    error,
    fetchTrades, // This will now accept params, but UI components mostly rely on setDateFilter
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
