import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { useTrades } from '../context/TradeContext';

const TradeForm = ({ open, handleClose, trade }) => {
  const { addTrade, updateTrade } = useTrades();
  const [formData, setFormData] = useState({
    ticker: '',
    buyPrice: '',
    sellPrice: '',
    quantity: '',
    tradeDate: '',
    sellDate: '',
  });

  useEffect(() => {
    if (trade) {
      setFormData({
        ticker: trade.ticker,
        buyPrice: trade.buyPrice,
        sellPrice: trade.sellPrice || '',
        quantity: trade.quantity,
        tradeDate: trade.tradeDate,
        sellDate: trade.sellDate || '',
      });
    } else {
      setFormData({
        ticker: '',
        buyPrice: '',
        sellPrice: '',
        quantity: '',
        tradeDate: '',
        sellDate: '',
      });
    }
  }, [trade]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tradeData = {
      ...formData,
      buyPrice: parseFloat(formData.buyPrice),
      sellPrice: formData.sellPrice ? parseFloat(formData.sellPrice) : null,
      quantity: parseInt(formData.quantity, 10),
      sellDate: formData.sellDate || null,
    };

    if (trade) {
      updateTrade({ ...trade, ...tradeData });
    } else {
      addTrade(tradeData);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{trade ? 'Edit Trade' : 'Add Trade'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            name="ticker"
            label="Stock Symbol"
            type="text"
            fullWidth
            variant="standard"
            value={formData.ticker}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="buyPrice"
            label="Buy Price"
            type="number"
            fullWidth
            variant="standard"
            value={formData.buyPrice}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="sellPrice"
            label="Sell Price"
            type="number"
            fullWidth
            variant="standard"
            value={formData.sellPrice}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            name="tradeDate"
            label="Buy Date"
            type="date"
            fullWidth
            variant="standard"
            value={formData.tradeDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            margin="dense"
            name="sellDate"
            label="Sell Date"
            type="date"
            fullWidth
            variant="standard"
            value={formData.sellDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{trade ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeForm;
