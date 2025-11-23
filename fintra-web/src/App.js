import React, { useState } from 'react';
import { Container, Button, Box, Typography } from '@mui/material';
import Header from './components/Header';
import Summary from './components/Summary';
import TradeList from './components/TradeList';
import TradeForm from './components/TradeForm';
import { useTrades } from './context/TradeContext';

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
    <div>
      <Header />
      <Container>
        <Summary />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
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
  );
}

export default App;
