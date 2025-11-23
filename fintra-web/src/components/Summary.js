import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { useTrades } from '../context/TradeContext';

const Summary = () => {
  const { trades } = useTrades();

  const totalBuyValue = trades.reduce((acc, trade) => acc + trade.buyPrice * trade.quantity, 0);
  const totalSellValue = trades.reduce((acc, trade) => acc + trade.sellPrice * trade.quantity, 0);
  const profitOrLoss = totalSellValue - totalBuyValue;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Overall Profit/Loss
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">Total Buy Value:</Typography>
            <Typography variant="h6">${totalBuyValue.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">Total Sell Value:</Typography>
            <Typography variant="h6">${totalSellValue.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body1">Profit/Loss:</Typography>
            <Typography variant="h6" color={profitOrLoss >= 0 ? 'success.main' : 'error.main'}>
              ${profitOrLoss.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Summary;
