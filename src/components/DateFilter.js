import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useTrades } from '../context/TradeContext';

const DateFilter = () => {
  const { setDateFilter } = useTrades();
  const [filterType, setFilterType] = useState('all');
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const [startDate, endDate] = customDateRange;

  const handleFilterChange = (event) => {
    const newFilterType = event.target.value;
    setFilterType(newFilterType);

    if (newFilterType !== 'custom') {
      setDateFilter({ type: newFilterType, range: [null, null] });
    }
  };

  const handleDateRangeChange = (update) => {
    setCustomDateRange(update);
    // react-datepicker's onChange passes the range as [start, end] when selectsRange is true
    // Only update context if both start and end dates are selected, or if cleared (both null)
    if ((update[0] && update[1]) || (!update[0] && !update[1])) {
       setDateFilter({ type: 'custom', range: update });
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
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
        <Box sx={{ '.react-datepicker-wrapper': { width: 'auto' } }}>
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
              isClearable={true}
              placeholderText="Start Date - End Date"
              className="custom-datepicker"
              customInput={
                <Box
                    sx={{
                        padding: '16.5px 14px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        borderRadius: '4px',
                        '&:hover': {
                            borderColor: 'rgba(0, 0, 0, 0.87)'
                        },
                        cursor: 'text',
                        width: '250px'
                    }}
                    component="input"
                />
              }
            />
        </Box>
      )}
    </Box>
  );
};

export default DateFilter;
