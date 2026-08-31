export type Locale = 'es' | 'en';

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  locale: Locale;
  createdAt: string;
}