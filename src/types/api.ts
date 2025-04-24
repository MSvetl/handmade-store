export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  timestamp: string;
}

export interface ErrorResponse extends ApiResponse {
  status: 'error';
  code: number;
}

export interface SuccessResponse extends ApiResponse {
  status: 'success';
  data?: unknown;
} 