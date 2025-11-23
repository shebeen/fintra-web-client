import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { useTrades } from '../context/TradeContext';
import DateFilter from './DateFilter';

const Summary = () => {
  const { trades } = useTrades();

  const soldTrades = trades.filter(trade => trade.sellPrice);
  const totalBuyValue = soldTrades.reduce((acc, trade) => acc + trade.buyPrice * trade.quantity, 0);
  const totalSellValue = soldTrades.reduce((acc, trade) => acc + trade.sellPrice * trade.quantity, 0);
  const profitOrLoss = totalSellValue - totalBuyValue;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Overall Profit/Loss
        </Typography>
        <DateFilter />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">Total Buy Value:</Typography>
            <Typography variant="h6">₹{totalBuyValue.toFixed(2)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">Total Sell Value:</Typography>
            <Typography variant="h6">₹{totalSellValue.toFixed(2)}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body1">Profit/Loss:</Typography>
            <Typography variant="h6" color={profitOrLoss >= 0 ? 'success.main' : 'error.main'}>
              ₹{profitOrLoss.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Summary;
