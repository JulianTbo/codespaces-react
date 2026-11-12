import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders the ETF leaderboard with clearly labeled sample data', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /ETF leaderboard/i })).toBeDefined();
  expect(screen.getByText(/Illustrative sample data/i)).toBeDefined();
  expect(screen.getByRole('table')).toBeDefined();
});

test('sorts the leaderboard and updates the S&P 500 comparison by period', () => {
  render(<App />);
  const table = screen.getByRole('table');

  fireEvent.click(screen.getByRole('button', { name: '1D' }));
  const firstDailyRow = within(table).getAllByRole('row')[1];
  expect(within(firstDailyRow).getByText('SMH')).toBeDefined();
  expect(screen.getByText('+0.42%')).toBeDefined();

  fireEvent.click(screen.getByRole('button', { name: '5Y' }));
  expect(screen.getByText('+82.64%')).toBeDefined();
});

test('filters ETFs by whether they beat the S&P 500', () => {
  render(<App />);
  const table = screen.getByRole('table');
  fireEvent.click(screen.getByRole('button', { name: 'Trailing S&P' }));

  expect(within(table).queryByText('SMH')).toBeNull();
  expect(within(table).getByText('BND')).toBeDefined();
  expect(screen.getByText(/5 funds/)).toBeDefined();
});
