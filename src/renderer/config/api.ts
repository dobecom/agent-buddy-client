/**
 * API Configuration
 * Electron 표준 권장 방식으로 환경 변수 또는 기본값 사용
 *
 * 환경 변수 사용 방법:
 * 1. 프로젝트 루트에 .env 파일 생성
 * 2. VITE_API_BASE_URL=http://localhost:3100 형식으로 추가
 * 3. .env 파일은 .gitignore에 포함되어 있으므로 .env.example을 참고하세요
 *
 * VITE_ 접두사가 붙은 환경 변수만 클라이언트 코드에서 접근 가능합니다.
 */

// 환경 변수에서 읽거나 기본값 사용
// Vite는 빌드 시점에 import.meta.env를 치환하므로 런타임에서는 이미 값이 주입됨
const API_BASE_URL =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ||
  'http://localhost:3100';

// Azure Storage 설정 (Electron 표준 권장 방식)
const AZURE_STORAGE_ACCOUNT_URL = 'https://agbdstorageaccount.blob.core.windows.net';

export const API_ENDPOINTS = {
  // Cases
  CASES: {
    REGISTER: `${API_BASE_URL}/cases/register`,
    LIST: `${API_BASE_URL}/cases/list`,
    VIEW: (id: string) => `${API_BASE_URL}/cases/${id}`, // 경로 파라미터
    ATTACHES_LIST: (caseId: string) => `${API_BASE_URL}/cases/${caseId}/attaches/list`, // 첨부파일 리스트 조회
    ATTACHES_REGISTER: `${API_BASE_URL}/cases/attaches/register`, // 첨부파일 DB 저장
  },
} as const;

export const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES: 10, // 최대 파일 개수
} as const;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000, // 30초
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

