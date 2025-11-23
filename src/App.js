import React, { useState } from 'react';
import { Container, Button, Box, Typography } from '@mui/material';
import Header from './components/Header';
import Summary from './components/Summary';
import TradeList from './components/TradeList';
import TradeForm from './components/TradeForm';
import DateFilter from './components/DateFilter';
import { useTrades } from './context/TradeContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { loading, error } = useTrades();

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div>
        <Header />
        <Container>
          <Summary />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DateFilter />
            <Button variant="contained" onClick={handleOpenForm}>
              Add Trade
            </Button>
          </Box>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <TradeList />
          <TradeForm open={isFormOpen} handleClose={handleCloseForm} />
        </Container>
      </div>
    </LocalizationProvider>
  );
}

export default App;
