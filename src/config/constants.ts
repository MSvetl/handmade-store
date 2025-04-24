export const API_ENDPOINTS = {
  TEST: '/api/test'
} as const;

export const APP_CONFIG = {
  TITLE: 'Handmade Store',
  DESCRIPTION: 'Магазин рукодельных товаров',
  DEFAULT_LOCALE: 'ru',
  API_TIMEOUT: 5000,
  THEME: {
    PRIMARY_COLOR: '#3B82F6', // blue-500
    ERROR_COLOR: '#EF4444',   // red-500
    SUCCESS_COLOR: '#10B981'  // emerald-500
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const; 