/**
 * Azure Blob Storage Configuration
 * SAS URL은 백엔드 서버에서 동적으로 받아옵니다.
 * 클라이언트에는 민감한 키를 저장하지 않습니다.
 *
 * 환경 변수 사용 방법:
 * 1. 프로젝트 루트에 .env 파일 생성
 * 2. VITE_AZURE_STORAGE_ACCOUNT_NAME=your_account 형식으로 추가
 * 3. .env 파일은 .gitignore에 포함되어 있으므로 .env.example을 참고하세요
 *
 * VITE_ 접두사가 붙은 환경 변수만 클라이언트 코드에서 접근 가능합니다.
 */

// Azure Storage Account 이름 (환경 변수에서 읽거나 기본값 사용)
const AZURE_STORAGE_ACCOUNT_NAME =
  (import.meta.env?.VITE_AZURE_STORAGE_ACCOUNT_NAME as string | undefined) ||
  'agbdstorageaccount';

// Azure Storage Account Base URL (공통 부분)
// 실제 Storage Account 이름과 경로는 백엔드에서 받은 SAS URL에서 파싱합니다.
export const AZURE_STORAGE_BASE_URL = `https://${AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`;

// 기본 Container 이름 (백엔드 요청 시 사용)
// 환경 변수에서 읽거나 기본값 사용
export const DEFAULT_CONTAINER_NAME =
  (import.meta.env?.VITE_AZURE_STORAGE_CONTAINER_NAME as string | undefined) ||
  'case-attaches';

// 파일 다운로드 기본 경로 (Electron 다이얼로그에서 사용)
// 환경 변수에서 읽거나 기본값 사용
export const DEFAULT_DOWNLOAD_PATH =
  (import.meta.env?.VITE_DEFAULT_DOWNLOAD_PATH as string | undefined) ||
  'Downloads';

