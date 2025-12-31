/**
 * Case Service - Case 관련 API 호출
 */

import { get, post } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { DEFAULT_CONTAINER_NAME } from '../config/blobStorage';
import { Cases } from '../domains/Cases';
import { CaseAttaches } from '../domains/CaseAttaches';
import { CaseStatements } from '../domains/CaseStatements';
import { CaseResolutions } from '../domains/CaseResolutions';
import { SupportCase } from '../domains/SupportCase';
import {
  uploadFilesToBlobStorage,
  UploadedFileInfo,
} from './blobStorageService';

/**
 * API 응답 타입 정의
 */


// Case 생성용 (CasesEntity의 부분집합)
export interface CreateCasePayload {
  number: string;
  title: string;
  productFamily: string;
  productName: string;
  category: string;
  productVersion?: string | null;
  subCategory?: string | null;
}

// CaseStatements 생성용
export interface CreateCaseStatementPayload {
  symptom: string;
  needs: string;
  environments: Record<string, unknown>;
}

// registerCase 전체 request
export interface RegisterCaseRequest {
  cases: CreateCasePayload;
  caseStatements: CreateCaseStatementPayload;
}

interface CaseRegisterRequest {
  cases:{
  number: string;
  title: string;
  productFamily?: string;
  productName?: string;
  productVersion?: string;
  category?: string;
  subCategory?: string;
  }
}

interface CaseRegisterResponse {
  cases: {
    id: string;
  };
}

interface CaseListItem {
  id: string;
  number: string;
  productFamily: string;
  productName: string;
  productVersion: string | null;
  category: string | null;
  subCategory: string | null;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CaseListResponse {
  casesList: CaseListItem[];
  casesCnt: number;
}

interface CaseDetailItem {
  id: string;
  number: string;
  productFamily: string;
  productName: string;
  productVersion: string | null;
  category: string | null;
  subCategory: string | null;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CaseStatementItem {
  symptom: string;
  needs: string;
  environments: Record<string, unknown>; // 이미 JSON 객체
  createdAt: string;
  updatedAt: string;
}

interface CaseResolutionItem {
  content: Record<string, unknown>; // 이미 JSON 객체
  createdAt: string;
  updatedAt: string;
}

interface CaseViewResponse {
  cases: CaseDetailItem;
  caseStatementsList: CaseStatementItem[];
  caseResolutionsList: CaseResolutionItem[];
}

/**
 * API 응답을 Domain Entity로 변환하는 헬퍼 함수들
 */
function mapToCasesEntity(
  data: CaseListItem | CaseDetailItem,
): Cases {
  const entity = new Cases();
  // id 필드가 있는 경우 사용, 없으면 number를 기반으로 임시 id 생성
  entity.id = data.id || `temp-${data.number}`;
  entity.number = data.number;
  entity.title = data.title;
  entity.productFamily = data.productFamily;
  entity.productName = data.productName;
  entity.productVersion = data.productVersion;
  entity.category = data.category;
  entity.subCategory = data.subCategory;
  entity.status = data.status;
  entity.createdAt = data.createdAt;
  entity.createdBy = null; // API 응답에 없음
  entity.updatedAt = data.updatedAt;
  entity.updatedBy = null; // API 응답에 없음
  return entity;
}

function mapToCaseStatementsEntity(
  data: CaseStatementItem,
  caseId: string,
  index: number,
): CaseStatements {
  const entity = new CaseStatements();
  // API 응답에 id가 없으므로 임시 id 생성
  entity.id = `st-${caseId}-${index}-${Date.now()}`;
  entity.caseId = caseId;
  entity.symptom = data.symptom;
  entity.needs = data.needs;
  // environments는 이미 JSON 객체이므로 stringify
  entity.environments = JSON.stringify(data.environments || {});
  entity.createdAt = data.createdAt;
  entity.createdBy = null; // API 응답에 없음
  entity.updatedAt = data.updatedAt;
  entity.updatedBy = null; // API 응답에 없음
  return entity;
}

function mapToCaseResolutionsEntity(
  data: CaseResolutionItem,
  caseId: string,
  index: number,
): CaseResolutions {
  const entity = new CaseResolutions();
  // API 응답에 id가 없으므로 임시 id 생성
  entity.id = `rs-${caseId}-${index}-${Date.now()}`;
  entity.caseId = caseId;
  // content는 이미 JSON 객체이므로 stringify
  entity.content = JSON.stringify(data.content || {});
  entity.createdAt = data.createdAt;
  entity.createdBy = null; // API 응답에 없음
  entity.updatedAt = data.updatedAt;
  entity.updatedBy = null; // API 응답에 없음
  return entity;
}

/**
 * 케이스 생성
 * @returns 생성된 케이스의 ID
 */
export async function registerCase(
  requestData: RegisterCaseRequest,
): Promise<string> {
  const response = await post<CaseRegisterResponse>(
    API_ENDPOINTS.CASES.REGISTER,
    requestData,
  );
  return response.cases.id;
}

/**
 * 케이스 리스트 조회
 * @param page - 페이지 번호 (기본값: 1)
 * @returns 케이스 리스트와 총 개수
 */
export async function getCaseList(
  page: number = 1,
): Promise<{ cases: SupportCase[]; totalCount: number }> {
  const response = await get<CaseListResponse>(
    `${API_ENDPOINTS.CASES.LIST}?page=${page}`,
  );

  // 리스트 조회는 기본 정보만 반환하므로, attachments, statements, resolutions는 빈 배열
  const cases: SupportCase[] = response.casesList.map((item) => ({
    base: mapToCasesEntity(item),
    attachments: [] as CaseAttaches[],
    statements: [] as CaseStatements[],
    resolutions: [] as CaseResolutions[],
  }));

  return {
    cases,
    totalCount: response.casesCnt,
  };
}

/**
 * 케이스 상세정보 조회 (statements, resolutions 포함)
 * @param caseId - 케이스 ID
 * @note 백엔드 엔드포인트: GET http://localhost:3100/cases/{caseId}
 */
export async function getCaseView(caseId: string): Promise<SupportCase> {
  const response = await get<CaseViewResponse>(
    API_ENDPOINTS.CASES.VIEW(caseId),
  );

  const base = mapToCasesEntity(response.cases);
  const statements = (response.caseStatementsList ?? []).map((st, index) =>
    mapToCaseStatementsEntity(st, caseId, index),
  );
  
  const resolutions = (response.caseResolutionsList ?? []).map((rs, index) =>
    mapToCaseResolutionsEntity(rs, caseId, index),
  );
  return {
    base,
    attachments: [], // API 응답에 attachments가 없음
    statements,
    resolutions,
  };
}

/**
 * Azure Storage SAS URL 요청/응답 타입
 */
interface StorageSASRequest {
  operation: 'upload' | 'download';
  container: string;
}

interface StorageSASResponse {
  sasUrl: string;
  expiresOn: string;
  method: string;
  headers: {
    'x-ms-blob-type': string;
    'Content-Type': string;
  };
}

/**
 * Azure Storage SAS URL 요청
 * @param operation - 'upload' 또는 'download'
 * @param container - Container 이름 (기본값: 'case-attaches')
 * @param accessToken - 인증 토큰 (Bearer token)
 * @returns SAS URL 및 관련 정보
 */
export async function getStorageSASUrl(
  operation: 'upload' | 'download',
  container: string = DEFAULT_CONTAINER_NAME,
  accessToken?: string,
): Promise<StorageSASResponse> {
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await post<StorageSASResponse>(
    API_ENDPOINTS.AUTH.STORAGE_SAS,
    {
      operation,
      container,
    } as StorageSASRequest,
    { headers },
  );

  return response;
}

/**
 * 첨부파일 리스트 조회 응답 타입
 */
interface CaseAttachItem {
  id: string;
  type: string; // WEBAPPS / BROWSER
  url: string;
  path: string;
  name: string;
  original: string;
  status: string; // VERIFY / WAIT / DELETE
}

interface CaseAttachesListResponse {
  caseAttachesList: CaseAttachItem[];
  caseAttachesCnt: number;
}

/**
 * 파일 업로드 응답 타입
 */
interface FileUploadResponse {
  id: string;
  url: string;
  name: string;
}

/**
 * 첨부파일을 Domain Entity로 변환
 */
function mapToCaseAttachesEntity(data: CaseAttachItem): CaseAttaches {
  const entity = new CaseAttaches();
  entity.id = data.id;
  // URL은 백엔드에서 받은 전체 URL을 그대로 사용
  // 백엔드에서 이미 완전한 다운로드 URL을 제공하므로 그대로 사용
  entity.url = data.url.trim();
  entity.path = data.path;
  entity.name = data.name;
  entity.original = data.original;
  entity.memo = null; // API 응답에 없음
  entity.status = data.status;
  entity.createdAt = new Date().toISOString(); // API 응답에 없으므로 현재 시간
  entity.createdBy = null;
  entity.updatedAt = new Date().toISOString();
  entity.updatedBy = null;
  entity.caseId = 0; // API 응답에 없음
  entity.type = data.type === 'WEBAPPS' ? 1 : 0; // 타입 변환
  return entity;
}

/**
 * 첨부파일 리스트 조회
 */
export async function getCaseAttachesList(
  caseId: string,
): Promise<CaseAttaches[]> {
  const response = await get<CaseAttachesListResponse>(
    API_ENDPOINTS.CASES.ATTACHES_LIST(caseId),
  );

  return response.caseAttachesList.map(mapToCaseAttachesEntity);
}

/**
 * 첨부파일 등록 요청 타입
 */
interface CaseAttachRegisterItem {
  caseId: string;
  url: string;
  path: string;
  name: string;
  original: string;
  memo?: string | null;
}

interface CaseAttachRegisterRequest {
  caseAttachesList: CaseAttachRegisterItem[];
}

interface CaseAttachRegisterResponse {
  caseAttachesList: Array<{ id: string }>;
}

/**
 * 파일 업로드 및 DB 저장
 * @param caseId - 케이스 ID
 * @param files - 업로드할 파일 리스트
 * @param memo - 메모 (선택사항)
 * @param accessToken - 인증 토큰 (선택사항)
 * @returns 업로드된 파일 정보 리스트 (DB 저장 후 id 포함)
 */
export async function uploadCaseFiles(
  caseId: string,
  files: File[],
  memo?: string | null,
  accessToken?: string,
): Promise<CaseAttaches[]> {
  // 1. 백엔드에서 SAS URL 요청
  const sasInfo = await getStorageSASUrl('upload', DEFAULT_CONTAINER_NAME, accessToken);

  // 2. Azure Blob Storage에 파일 업로드 (백엔드에서 받은 SAS URL 사용)
  const uploadedFiles: UploadedFileInfo[] = await uploadFilesToBlobStorage(
    files,
    {
      pathPrefix: caseId,
      // 날짜 기반 서브 경로는 blobStorageService에서 자동 생성
      sasInfo: {
        sasUrl: sasInfo.sasUrl,
        method: sasInfo.method,
        headers: sasInfo.headers,
      },
    },
  );

  // 2. 백엔드 서버에 DB 저장 요청
  const registerRequest: CaseAttachRegisterRequest = {
    caseAttachesList: uploadedFiles.map((file) => ({
      caseId,
      url: file.url,
      path: file.path,
      name: file.name,
      original: file.original,
      memo: memo || null,
    })),
  };

  const registerResponse = await post<CaseAttachRegisterResponse>(
    API_ENDPOINTS.CASES.ATTACHES_REGISTER,
    registerRequest,
  );

  // 3. 응답을 CaseAttaches로 변환
  return uploadedFiles.map((file, index) => {
    const entity = new CaseAttaches();
    entity.id = registerResponse.caseAttachesList[index]?.id || '';
    entity.url = file.url;
    entity.path = file.path;
    entity.name = file.name;
    entity.original = file.original;
    entity.memo = memo || null;
    entity.status = 'WAIT'; // 검증 대기 상태
    entity.createdAt = new Date().toISOString();
    entity.createdBy = null;
    entity.updatedAt = new Date().toISOString();
    entity.updatedBy = null;
    entity.caseId = 0; // API 응답에 없음
    entity.type = 0; // 기본값
    return entity;
  });
}