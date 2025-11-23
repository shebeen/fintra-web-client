import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2';
import { TextField } from '@mui/material';
import { useTrades } from '../context/TradeContext';

const DateFilter = () => {
  const { setDateFilter } = useTrades();
  const [filterType, setFilterType] = useState('all');
  const [customDateRange, setCustomDateRange] = useState([null, null]);

  const handleFilterChange = (event) => {
    const newFilterType = event.target.value;
    setFilterType(newFilterType);

    if (newFilterType !== 'custom') {
      setDateFilter({ type: newFilterType, range: [null, null] });
    }
  };

  const handleDateRangeChange = (newRange) => {
    setCustomDateRange(newRange);
    setDateFilter({ type: 'custom', range: newRange });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Date Filter</InputLabel>
        <Select
          value={filterType}
          label="Date Filter"
          onChange={handleFilterChange}
        >
          <MenuItem value="all">All Time</MenuItem>
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="this_week">This Week</MenuItem>
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="this_year">This Year</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </Select>
      </FormControl>
      {filterType === 'custom' && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={customDateRange}
            onChange={handleDateRangeChange}
            renderInput={(startProps, endProps) => (
              <React.Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </React.Fragment>
            )}
          />
        </LocalizationProvider>
      )}
    </Box>
  );
};

export default DateFilter;
