/**
 * API Configuration
 * Electron 표준 권장 방식으로 환경 변수 또는 기본값 사용
 */

// 개발 환경에서는 환경 변수 사용, 없으면 기본값
// Vite 환경 변수는 빌드 시점에 주입되므로, 런타임에서는 기본값 사용
// 환경 변수를 변경하려면 vite.config.ts에서 define 옵션 사용 또는 .env 파일 사용

const API_BASE_URL = 'http://localhost:3100';

export const API_ENDPOINTS = {
  // Cases
  CASES: {
    REGISTER: `${API_BASE_URL}/cases/register`,
    LIST: `${API_BASE_URL}/cases/list`,
    VIEW: (id: string) => `${API_BASE_URL}/cases/${id}`, // 경로 파라미터
  },
} as const;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30초
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

