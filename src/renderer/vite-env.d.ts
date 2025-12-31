/// <reference types="vite/client" />

/**
 * Vite 환경 변수 타입 정의
 * .env 파일에 정의된 환경 변수의 타입을 여기에 정의합니다.
 */
interface ImportMetaEnv {
  // API 설정
  readonly VITE_API_BASE_URL?: string;
  
  // Azure Storage 설정
  readonly VITE_AZURE_STORAGE_ACCOUNT_NAME?: string;
  readonly VITE_AZURE_STORAGE_CONTAINER_NAME?: string;
  
  // 파일 다운로드 설정
  readonly VITE_DEFAULT_DOWNLOAD_PATH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

