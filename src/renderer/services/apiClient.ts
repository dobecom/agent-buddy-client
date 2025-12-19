/**
 * API Client - 공통 HTTP 요청 처리
 */

import { API_CONFIG } from '../config/api';

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export class ApiClientError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

/**
 * 공통 fetch 래퍼
 */
async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
console.log('options')
console.log(options);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
console.log('response');
console.log(response);
    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }

      throw new ApiClientError(
        `API Error: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiClientError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiClientError('Request timeout', 408);
      }
      // 네트워크 에러 (서버가 실행되지 않았거나 연결 실패)
      if (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('fetch')
      ) {
        throw new ApiClientError(
          '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.',
          0,
        );
      }
      throw new ApiClientError(error.message);
    }

    throw new ApiClientError('Unknown error occurred');
  }
}

/**
 * GET 요청
 */
export async function get<T>(url: string, options?: RequestInit): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST 요청
 */
export async function post<T>(
  url: string,
  body?: unknown,
  options?: RequestInit,
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT 요청
 */
export async function put<T>(
  url: string,
  body?: unknown,
  options?: RequestInit,
): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE 요청
 */
export async function del<T>(url: string, options?: RequestInit): Promise<T> {
  return request<T>(url, {
    ...options,
    method: 'DELETE',
  });
}

