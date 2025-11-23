import { render, screen } from '@testing-library/react';
import App from './App';
import { TradeProvider } from './context/TradeContext';

test('renders the summary title', () => {
  render(
    <TradeProvider>
      <App />
    </TradeProvider>
  );
  const titleElement = screen.getByText(/Overall Profit\/Loss/i);
  expect(titleElement).toBeInTheDocument();
});
