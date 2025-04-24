import '@testing-library/jest-dom';

// Полифил для Response
global.Response = class Response {
  constructor(body, init) {
    this._body = body;
    this._init = init;
  }

  json() {
    return Promise.resolve(JSON.parse(this._body));
  }
};

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    };
  },
}));

// Mock window.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Подавление предупреждений от Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
})); 