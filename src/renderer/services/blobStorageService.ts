/**
 * Azure Blob Storage Service
 * 도메인 독립적인 공통 파일 업로드 서비스
 * 향후 userAttaches 등 다른 도메인에서도 재사용 가능
 * 
 * 백엔드에서 받은 SAS URL을 사용하여 직접 업로드합니다.
 */

import { AZURE_STORAGE_BASE_URL } from '../config/blobStorage';
import { FILE_UPLOAD_CONFIG } from '../config/api';

/**
 * 업로드된 파일 정보
 */
export interface UploadedFileInfo {
  url: string; // Azure Blob Storage Base URL
  path: string; // Blob 경로 (container 제외, 디렉토리 경로만)
  name: string; // 저장된 파일명
  original: string; // 원본 파일명
}

/**
 * 파일 업로드 옵션
 */
export interface UploadFileOptions {
  /**
   * 도메인별 경로 prefix (예: caseId, userId 등)
   */
  pathPrefix: string;
  /**
   * 추가 경로 (예: 날짜 등)
   */
  subPath?: string;
  /**
   * 파일명 생성 함수 (기본: 타임스탬프 + 원본 파일명)
   */
  fileNameGenerator?: (originalName: string, index: number) => string;
  /**
   * 백엔드에서 받은 SAS URL 정보
   */
  sasInfo: {
    sasUrl: string; // 전체 SAS URL (예: https://account.blob.core.windows.net/container/path?token)
    method: string; // HTTP 메서드 (예: 'PUT')
    headers: {
      'x-ms-blob-type': string;
      'Content-Type': string;
    };
  };
}

/**
 * Azure Blob Storage에 파일 업로드 (백엔드에서 받은 SAS URL 사용)
 * @param files - 업로드할 파일 리스트
 * @param options - 업로드 옵션 (SAS 정보 포함)
 * @returns 업로드된 파일 정보 리스트
 */
export async function uploadFilesToBlobStorage(
  files: File[],
  options: UploadFileOptions,
): Promise<UploadedFileInfo[]> {
  // 파일 크기 검증
  for (const file of files) {
    if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
      throw new Error(
        `파일 "${file.name}"의 크기가 너무 큽니다. 최대 ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB까지 업로드 가능합니다.`,
      );
    }
  }

  // SAS URL 파싱
  // 백엔드에서 받은 SAS URL 형식: https://account.blob.core.windows.net/container/path?token
  // 또는: https://account.blob.core.windows.net?token (경로 없이 토큰만)
  const sasUrlObj = new URL(options.sasInfo.sasUrl);
  const baseUrl = `${sasUrlObj.protocol}//${sasUrlObj.hostname}`; // 공통 부분: https://account.blob.core.windows.net
  const sasToken = sasUrlObj.search; // ?token 부분
  
  // 경로 부분 파싱 (container와 기존 경로)
  // 예: /case-attaches/4806d001-d75d-4d8e-96d2-f3d6f8e45f1c/20251229
  const pathParts = sasUrlObj.pathname.split('/').filter(Boolean); // ['case-attaches', 'path1', 'path2']
  const containerName = pathParts[0] || 'case-attaches'; // 첫 번째가 container
  
  // 날짜 기반 서브 경로 생성 (YYYYMMDD 형식)
  const dateStr = options.subPath || getDateString();
  const basePath = `${options.pathPrefix}/${dateStr}`;

  // 파일명 생성 함수
  // 기본 형식: YYYYMMDDHHmmss_원본파일명 (예: 20251229155432_test.txt)
  const generateFileName =
    options.fileNameGenerator ||
    ((originalName: string, index: number) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
      return `${timestamp}_${originalName}`;
    });

  // 각 파일을 개별적으로 업로드
  const uploadPromises = files.map(async (file, index) => {
    const fileName = generateFileName(file.name, index);
    // Blob Storage의 전체 경로 (container 포함)
    const blobPath = `${basePath}/${fileName}`;
    
    // 각 파일에 대한 SAS URL 구성
    // 공통 base URL + container + 파일 경로 + SAS 토큰
    const fileSASUrl = `${baseUrl}/${containerName}/${blobPath}${sasToken}`;

    // 파일을 ArrayBuffer로 읽어서 업로드
    const arrayBuffer = await file.arrayBuffer();

    // 백엔드에서 받은 헤더와 함께 PUT 요청으로 업로드
    const response = await fetch(fileSASUrl, {
      method: options.sasInfo.method || 'PUT',
      headers: {
        ...options.sasInfo.headers,
        'Content-Type': file.type || options.sasInfo.headers['Content-Type'] || 'application/octet-stream',
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `파일 업로드 실패 (${response.status}): ${errorText || response.statusText}`,
      );
    }

    // 업로드된 파일 정보 반환
    // url은 base URL만 반환 (공통 부분)
    // path는 디렉토리 경로만 반환 (caseId/YYYYMMDD)
    return {
      url: AZURE_STORAGE_BASE_URL,
      path: basePath, // 디렉토리 경로만 (caseId/YYYYMMDD)
      name: fileName, // 파일명 (YYYYMMDDHHmmss_원본파일명)
      original: file.name, // 원본 파일명
    } as UploadedFileInfo;
  });

  // 모든 파일 업로드 완료 대기
  return Promise.all(uploadPromises);
}

/**
 * 날짜 문자열 생성 (YYYYMMDD)
 */
function getDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

