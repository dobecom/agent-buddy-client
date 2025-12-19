/**
 * Case Service - Case 관련 API 호출
 */

import { get, post } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Cases } from '../domains/Cases';
import { CaseAttaches } from '../domains/CaseAttaches';
import { CaseStatements } from '../domains/CaseStatements';
import { CaseResolutions } from '../domains/CaseResolutions';
import { SupportCase } from '../domains/SupportCase';

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
  data: CaseListItem | CaseDetailItem
): Cases {
  const entity = new Cases();
  entity.id = data.id;
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

