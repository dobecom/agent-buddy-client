import React, { useEffect, useState } from 'react';
import { Cases } from '../domains/Cases';
import { CaseAttaches } from '../domains/CaseAttaches';
import { CaseStatements } from '../domains/CaseStatements';
import { CaseResolutions } from '../domains/CaseResolutions';
import { CaseStatus, SupportCase } from '../domains/SupportCase';
import { CaseListView } from '../components/case/CaseListView';
import { CaseCreateView } from '../components/case/CaseCreateView';
import { CaseDetailView } from '../components/case/CaseDetailView';
import { AddStatementModal } from '../components/case/AddStatementModal';
import { AddResolutionModal } from '../components/case/AddResolutionModal';

type ViewMode = 'list' | 'create' | 'detail';

// TODO: Replace mock data and loaders with real database integration (e.g., via Electron IPC)
const mockCases: SupportCase[] = [
  (() => {
    const base = new Cases();
    base.id = '1';
    base.number = '202512180000001';
    base.title = 'Login 실패 오류';
    base.productFamily = '';
    base.productName = 'Agent Buddy Client';
    base.productVersion = null;
    base.category = 'Authentication';
    base.subCategory = null;
    base.status = 'OPEN';
    base.createdAt = new Date().toISOString();
    base.updatedAt = new Date().toISOString();
    base.createdBy = null;
    base.updatedBy = null;

    const attach = new CaseAttaches();
    attach.id = 'att-1';
    attach.url = '#';
    attach.path = '';
    attach.name = 'error-log.txt';
    attach.original = 'error-log.txt';
    attach.memo = null;
    attach.status = 'WAIT';
    attach.createdAt = new Date().toISOString();
    attach.updatedAt = new Date().toISOString();
    attach.createdBy = null;
    attach.updatedBy = null;
    attach.caseId = 1;
    attach.type = 0;

    const st = new CaseStatements();
    st.id = 'st-1';
    st.caseId = base.id;
    st.symptom = '사용자가 로그인 시도 시 500 에러 발생';
    st.needs = '원인 분석 및 빠른 해결';
    st.environments = JSON.stringify({
      os: 'Windows 11',
      version: '1.0.0',
    });
    st.createdAt = new Date().toISOString();
    st.updatedAt = new Date().toISOString();
    st.createdBy = null;
    st.updatedBy = null;

    const rs = new CaseResolutions();
    rs.id = 'rs-1';
    rs.caseId = base.id;
    rs.content = JSON.stringify({
      steps: ['로그 분석', 'DB 연결 상태 점검'],
    });
    rs.createdAt = new Date().toISOString();
    rs.updatedAt = new Date().toISOString();
    rs.createdBy = null;
    rs.updatedBy = null;

    return {
      base,
      attachments: [attach],
      statements: [st],
      resolutions: [rs],
    } as SupportCase;
  })(),
];

const loadCasesFromDb = async (): Promise<SupportCase[]> => {
  // TODO: 실제 DB 또는 Electron IPC 호출로 교체
  return Promise.resolve(mockCases);
};

const CaseListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);

  // Create form state
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCustomerStatement, setNewCustomerStatement] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await loadCasesFromDb();
      setCases(data);
    };
    load();
  }, []);

  const handleAddCaseClick = () => {
    setNewCaseNumber('');
    setNewCustomerStatement('');
    setViewMode('create');
  };

  const handleSaveCase = () => {
    // 간단한 유효성 검사
    if (!/^\d{1,20}$/.test(newCaseNumber)) {
      alert('Case Number는 숫자만 가능하며 1~20자리여야 합니다.');
      return;
    }

    if (newCustomerStatement.length < 10) {
      alert('Customer Statement를 더 자세히 입력해주세요.');
      return;
    }

    // TODO: 실제 DB 저장 로직으로 교체
    const base = new Cases();
    base.id = String(Date.now());
    base.number = newCaseNumber;
    base.title = newCustomerStatement.slice(0, 40) + '...';
    base.productFamily = '';
    base.productName = 'Unknown';
    base.productVersion = null;
    base.category = 'Uncategorized';
    base.subCategory = null;
    base.status = 'OPEN';
    base.createdAt = new Date().toISOString();
    base.updatedAt = new Date().toISOString();
    base.createdBy = null;
    base.updatedBy = null;

    const st = new CaseStatements();
    st.id = 'cs-' + Date.now();
    st.caseId = base.id;
    st.symptom = newCustomerStatement;
    st.needs = '';
    st.environments = JSON.stringify({});
    st.createdAt = new Date().toISOString();
    st.updatedAt = new Date().toISOString();
    st.createdBy = null;
    st.updatedBy = null;

    const created: SupportCase = {
      base,
      attachments: [],
      statements: [st],
      resolutions: [],
    };

    setCases((prev) => [created, ...prev]);
    setViewMode('list');
  };

  const handleCaseClick = (item: SupportCase) => {
    setSelectedCase(item);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedCase(null);
    setViewMode('list');
  };

  const handleCloseCase = () => {
    if (!selectedCase) return;
    // TODO: 실제 DB 업데이트 로직으로 교체
    setCases((prev) =>
      prev.map((c) =>
        c.base.id === selectedCase.base.id
          ? {
              ...c,
              base: {
                ...c.base,
                status: 'CLOSE',
              },
            }
          : c,
      ),
    );
    setSelectedCase((prev) =>
      prev ? { ...prev, base: { ...prev.base, status: 'CLOSE' } } : prev,
    );
    console.log('Case closed:', selectedCase.base.id);
  };

  const handleAddStatement = () => {
    if (!selectedCase) return;
    setStatementModalOpen(true);
  };

  const handleAddResolution = () => {
    if (!selectedCase) return;
    setResolutionModalOpen(true);
  };

  const handleSaveStatement = (payload: {
    symptom: string;
    needs: string;
    environments: Record<string, unknown>;
  }) => {
    if (!selectedCase) return;
    const newStatement = new CaseStatements();
    newStatement.id = 'st-' + Date.now();
    newStatement.caseId = selectedCase.base.id;
    newStatement.symptom = payload.symptom;
    newStatement.needs = payload.needs;
    newStatement.environments = JSON.stringify(payload.environments);
    newStatement.createdAt = new Date().toISOString();
    newStatement.updatedAt = new Date().toISOString();
    newStatement.createdBy = null;
    newStatement.updatedBy = null;

    const updated: SupportCase = {
      ...selectedCase,
      statements: [...selectedCase.statements, newStatement],
    };
    setSelectedCase(updated);
    setCases((prev) =>
      prev.map((c) => (c.base.id === updated.base.id ? updated : c)),
    );
    setStatementModalOpen(false);
  };

  const handleSaveResolution = (payload: { content: Record<string, unknown> }) => {
    if (!selectedCase) return;

    const newResolution = new CaseResolutions();
    newResolution.id = 'rs-' + Date.now();
    newResolution.caseId = selectedCase.base.id;
    newResolution.content = JSON.stringify(payload.content);
    newResolution.createdAt = new Date().toISOString();
    newResolution.updatedAt = new Date().toISOString();
    newResolution.createdBy = null;
    newResolution.updatedBy = null;

    const updated: SupportCase = {
      ...selectedCase,
      resolutions: [...selectedCase.resolutions, newResolution],
    };
    setSelectedCase(updated);
    setCases((prev) =>
      prev.map((c) => (c.base.id === updated.base.id ? updated : c)),
    );
    setResolutionModalOpen(false);
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1 min-h-0'>
        {viewMode === 'list' && (
          <CaseListView
            cases={cases}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onAddCase={handleAddCaseClick}
            onCaseClick={handleCaseClick}
          />
        )}
        {viewMode === 'create' && (
          <CaseCreateView
            caseNumber={newCaseNumber}
            customerStatement={newCustomerStatement}
            onChangeCaseNumber={setNewCaseNumber}
            onChangeCustomerStatement={setNewCustomerStatement}
            onSave={handleSaveCase}
            onBack={handleBackToList}
          />
        )}
        {viewMode === 'detail' && selectedCase && (
          <CaseDetailView
            selectedCase={selectedCase}
            onBack={handleBackToList}
            onCloseCase={handleCloseCase}
            onOpenAddStatement={handleAddStatement}
            onOpenAddResolution={handleAddResolution}
          />
        )}
      </div>

      <AddStatementModal
        open={statementModalOpen}
        onClose={() => setStatementModalOpen(false)}
        onSave={handleSaveStatement}
      />
      <AddResolutionModal
        open={resolutionModalOpen}
        onClose={() => setResolutionModalOpen(false)}
        onSave={handleSaveResolution}
      />
    </div>
  );
};

export default CaseListPage;
