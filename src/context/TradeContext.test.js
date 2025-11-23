import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { TradeProvider, useTrades } from './TradeContext';
import axios from 'axios';
import { format, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

jest.mock('axios');

const TestComponent = () => {
  const { setDateFilter, trades } = useTrades();
  return (
    <div>
      <button onClick={() => setDateFilter({ type: 'today', range: [null, null] })}>Filter Today</button>
      <button onClick={() => setDateFilter({ type: 'this_week', range: [null, null] })}>Filter This Week</button>
      <button onClick={() => setDateFilter({ type: 'custom', range: [new Date('2023-01-01'), new Date('2023-01-31')] })}>Filter Custom</button>
      <ul>
        {trades.map(t => <li key={t.id}>{t.ticker}</li>)}
      </ul>
    </div>
  );
};

describe('TradeContext Backend Filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: [] });
  });

  test('fetches trades with date filter params when filter changes', async () => {
    render(
      <TradeProvider>
        <TestComponent />
      </TradeProvider>
    );

    // Initial fetch (all time)
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/\/trades$/)); // Should be just /trades or /trades? with no dates or explicit all

    // Filter Today
    const todayBtn = screen.getByText('Filter Today');
    act(() => {
      todayBtn.click();
    });

    const now = new Date();
    const expectedStart = format(now, 'yyyy-MM-dd');
    // For Today, start is today, end is today (based on implementation)

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));

    const callArgs = axios.get.mock.calls[1][0];
    expect(callArgs).toContain('from_date=' + expectedStart);
    // to_date might be optional or set to today.
  });

  test('fetches trades with custom range', async () => {
     render(
      <TradeProvider>
        <TestComponent />
      </TradeProvider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    const customBtn = screen.getByText('Filter Custom');
    act(() => {
      customBtn.click();
    });

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    const callArgs = axios.get.mock.calls[1][0];
    expect(callArgs).toContain('from_date=2023-01-01');
    expect(callArgs).toContain('to_date=2023-01-31');
  });
});
