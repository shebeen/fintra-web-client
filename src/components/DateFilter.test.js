import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import DateFilter from './DateFilter';
import { useTrades } from '../context/TradeContext';

// Mock the useTrades hook
jest.mock('../context/TradeContext', () => ({
  useTrades: jest.fn(),
}));

describe('DateFilter Component', () => {
  const mockSetDateFilter = jest.fn();

  beforeEach(() => {
    useTrades.mockReturnValue({
      setDateFilter: mockSetDateFilter,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders DateFilter component', () => {
    render(<DateFilter />);
    // Material UI Select renders a label and a legend with the same text.
    const labels = screen.getAllByText(/Date Filter/i);
    expect(labels.length).toBeGreaterThan(0);
    expect(labels[0]).toBeInTheDocument();
  });

  test('changes filter type', () => {
    render(<DateFilter />);

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.mouseDown(selectTrigger);

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const customOption = within(listbox).getByText('Custom');
    fireEvent.click(customOption);

    expect(mockSetDateFilter).not.toHaveBeenCalled();
  });

  test('renders date picker when Custom is selected', () => {
     render(<DateFilter />);
     const selectTrigger = screen.getByRole('combobox');
     fireEvent.mouseDown(selectTrigger);

     const listbox = screen.getByRole('listbox');
     const customOption = within(listbox).getByText('Custom');
     fireEvent.click(customOption);

     // With react-datepicker and custom input with placeholder
     expect(screen.getByPlaceholderText('Start Date - End Date')).toBeInTheDocument();
  });
});
