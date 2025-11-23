import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, useTheme, useMediaQuery, Dialog, DialogTitle, DialogActions, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTrades } from '../context/TradeContext';
import TradeForm from './TradeForm';

const TradeList = () => {
  const { trades, deleteTrade } = useTrades();
  const [editingTrade, setEditingTrade] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleEdit = (trade) => {
    setEditingTrade(trade);
  };

  const handleDeleteClick = (id) => {
    setTradeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteTrade(tradeToDelete);
    setDeleteDialogOpen(false);
    setTradeToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTradeToDelete(null);
  };

  const handleCloseForm = () => {
    setEditingTrade(null);
  };

  const calculateProfitOrLoss = (trade) => {
    if (!trade.sellPrice) {
      return 0;
    }
    return (trade.sellPrice - trade.buyPrice) * trade.quantity;
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ticker</TableCell>
              {!isMobile && <TableCell>Buy Price</TableCell>}
              {!isMobile && <TableCell>Sell Price</TableCell>}
              <TableCell>Quantity</TableCell>
              {!isMobile && <TableCell>Trade Date</TableCell>}
              {!isMobile && <TableCell>Profit/Loss</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades.map((trade) => {
              const profitOrLoss = calculateProfitOrLoss(trade);
              return (
                <TableRow key={trade.id}>
                  <TableCell>{trade.ticker}</TableCell>
                  {!isMobile && <TableCell>₹{trade.buyPrice.toFixed(2)}</TableCell>}
                  {!isMobile && <TableCell>{trade.sellPrice ? `₹${trade.sellPrice.toFixed(2)}` : 'N/A'}</TableCell>}
                  <TableCell>{trade.quantity}</TableCell>
                  {!isMobile && <TableCell>{trade.tradeDate}</TableCell>}
                  {!isMobile && (
                    <TableCell>
                      <Typography color={profitOrLoss >= 0 ? 'success.main' : 'error.main'}>
                        ₹{profitOrLoss.toFixed(2)}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton onClick={() => handleEdit(trade)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(trade.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {editingTrade && <TradeForm open={!!editingTrade} handleClose={handleCloseForm} trade={editingTrade} />}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Are you sure you want to delete this trade?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TradeList;
