/**
 * Azure Blob Storage Service
 * 도메인 독립적인 공통 파일 업로드 서비스
 * 향후 userAttaches 등 다른 도메인에서도 재사용 가능
 */

import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { AZURE_STORAGE_CONFIG } from '../config/blobStorage';
import { FILE_UPLOAD_CONFIG } from '../config/api';

/**
 * 업로드된 파일 정보
 */
export interface UploadedFileInfo {
  url: string; // Azure Blob Storage URL
  path: string; // Blob 경로 (container 제외)
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
}

/**
 * Azure Blob Storage에 파일 업로드
 * @param files - 업로드할 파일 리스트
 * @param options - 업로드 옵션
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

  // Azure Storage 클라이언트 초기화
  // SAS (Shared Access Signature) URL을 사용하여 BlobServiceClient 생성
  // Base URL + SAS 토큰 형식: https://{account}.blob.core.windows.net?{sas_token}
  const blobServiceClient = new BlobServiceClient(
    AZURE_STORAGE_CONFIG.BASE_URL_WITH_SAS,
  );

  // Container Client 가져오기
  const containerClient = blobServiceClient.getContainerClient(
    AZURE_STORAGE_CONFIG.CONTAINER_NAME,
  );

  // Container 생성은 시도하지 않음 (SAS 토큰으로는 생성 권한이 없을 수 있음)
  // Container는 미리 생성되어 있어야 함

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
    // Blob Storage의 전체 경로 (container 포함하지 않음)
    const blobPath = `${basePath}/${fileName}`;

    // Block Blob Client 생성
    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(blobPath);

    // 파일을 ArrayBuffer로 읽어서 업로드
    const arrayBuffer = await file.arrayBuffer();

    console.log('hit upload')
    // Blob 업로드
    await blockBlobClient.upload(arrayBuffer, arrayBuffer.byteLength, {
      blobHTTPHeaders: {
        blobContentType: file.type || 'application/octet-stream',
      },
    });
    console.log('upload success')

    // 업로드된 파일 정보 반환
    // path는 디렉토리 경로만 반환 (파일명 제외, 사용자 요구사항에 따라)
    // URL은 base URL만 반환 (사용자 요구사항에 따라)
    return {
      url: AZURE_STORAGE_CONFIG.BASE_URL,
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

