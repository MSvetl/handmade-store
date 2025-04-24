import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../page'

// Мокаем fetch для тестирования API запросов
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      status: 'success',
      message: 'Сервер работает нормально',
      timestamp: new Date().toISOString()
    })
  })
) as jest.Mock;

describe('Home', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders main heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: /тестовая страница/i })).toBeInTheDocument();
  });

  it('renders test button', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /проверить соединение с сервером/i });
    expect(button).toBeInTheDocument();
  });

  it('shows loading state when clicking test button', async () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /проверить соединение с сервером/i });
    
    fireEvent.click(button);
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/загрузка/i)).not.toBeInTheDocument();
    });
  });

  it('displays success message after API call', async () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /проверить соединение с сервером/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/сервер работает нормально/i)).toBeInTheDocument();
    });
  });

  it('handles API error correctly', async () => {
    // Мокаем ошибку API
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    render(<Home />)
    const button = screen.getByRole('button', { name: /проверить соединение с сервером/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/ошибка/i)).toBeInTheDocument();
    });
  });
}) 