/**
 * Azure Blob Storage Configuration
 * Electron 표준 권장 방식으로 환경 변수 또는 기본값 사용
 *
 * 환경 변수 사용 방법:
 * 1. 프로젝트 루트에 .env 파일 생성
 * 2. VITE_AZURE_STORAGE_ACCOUNT_NAME=your_account 형식으로 추가
 * 3. .env 파일은 .gitignore에 포함되어 있으므로 .env.example을 참고하세요
 *
 * VITE_ 접두사가 붙은 환경 변수만 클라이언트 코드에서 접근 가능합니다.
 */

// 환경 변수에서 읽거나 기본값 사용
// Vite는 빌드 시점에 import.meta.env를 치환하므로 런타임에서는 이미 값이 주입됨
const AZURE_STORAGE_ACCOUNT_NAME =
  (import.meta.env?.VITE_AZURE_STORAGE_ACCOUNT_NAME as string | undefined) ||
  'agbdstorageaccount';
const AZURE_STORAGE_CONTAINER_NAME =
  (import.meta.env?.VITE_AZURE_STORAGE_CONTAINER_NAME as string | undefined) ||
  'case-attaches';

// SAS (Shared Access Signature) 토큰 또는 URL
// 방법 1: SAS URL 전체 (권장)
const AZURE_STORAGE_SAS_URL =
  (import.meta.env?.VITE_AZURE_STORAGE_SAS_URL as string | undefined) || '';

// 방법 2: SAS 토큰만 (선택사항)
const AZURE_STORAGE_SAS_TOKEN =
  (import.meta.env?.VITE_AZURE_STORAGE_SAS_TOKEN as string | undefined) || '';

export const AZURE_STORAGE_CONFIG = {
  // Storage Account 이름
  ACCOUNT_NAME: AZURE_STORAGE_ACCOUNT_NAME,
  // Container 이름
  CONTAINER_NAME: AZURE_STORAGE_CONTAINER_NAME,
  // SAS URL (전체 URL)
  SAS_URL: AZURE_STORAGE_SAS_URL,
  // SAS 토큰 (토큰만)
  SAS_TOKEN: AZURE_STORAGE_SAS_TOKEN,
  // Base URL
  get BASE_URL(): string {
    return `https://${this.ACCOUNT_NAME}.blob.core.windows.net`;
  },
  // Base URL with SAS (BlobServiceClient 초기화용)
  get BASE_URL_WITH_SAS(): string {
    if (this.SAS_URL) {
      // SAS URL에서 container 부분 제거하고 base URL만 추출
      // 예: https://account.blob.core.windows.net/container?token -> https://account.blob.core.windows.net?token
      const url = new URL(this.SAS_URL);
      const sasToken = url.search; // ?sp=rcwl&st=...
      return `${this.BASE_URL}${sasToken}`;
    }
    if (this.SAS_TOKEN) {
      // SAS 토큰만 제공된 경우 URL 구성
      return `${this.BASE_URL}?${this.SAS_TOKEN}`;
    }
    throw new Error(
      'Azure Storage SAS 토큰 또는 URL이 설정되지 않았습니다. VITE_AZURE_STORAGE_SAS_URL 또는 VITE_AZURE_STORAGE_SAS_TOKEN 환경 변수를 설정해주세요.',
    );
  },
} as const;

