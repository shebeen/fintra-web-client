import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// We need to mock AuthContext to simulate a logged-in user if we want to see the Dashboard
// OR we can test that it redirects to Login.

test('renders login page when not authenticated', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  // Should redirect to /login, so we should see "Login" text or "Sign In" button
  const loginTitle = screen.getByRole('heading', { name: /Login/i });
  expect(loginTitle).toBeInTheDocument();
});
