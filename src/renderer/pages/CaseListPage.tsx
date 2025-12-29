import React, { useEffect, useState } from 'react';
import { CaseStatements } from '../domains/CaseStatements';
import { CaseResolutions } from '../domains/CaseResolutions';
import { CaseStatus, SupportCase } from '../domains/SupportCase';
import { CaseListView } from '../components/case/CaseListView';
import { CaseCreateView } from '../components/case/CaseCreateView';
import { CaseDetailView } from '../components/case/CaseDetailView';
import { AddStatementModal } from '../components/case/AddStatementModal';
import { AddResolutionModal } from '../components/case/AddResolutionModal';
import {
  registerCase,
  getCaseList,
  getCaseView,
  RegisterCaseRequest,
} from '../services/caseService';
import { ApiClientError } from '../services/apiClient';

type ViewMode = 'list' | 'create' | 'detail';

const CaseListPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<SupportCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'ALL'>('ALL');
  const [statementModalOpen, setStatementModalOpen] = useState(false);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // 초기 로딩 상태
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCustomerStatement, setNewCustomerStatement] = useState('');

  // 케이스 리스트 로드
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getCaseList(1); // 첫 페이지
        console.log(result);
        setCases(result.cases);
      } catch (err) {
        // 에러가 발생해도 페이지는 정상적으로 렌더링되도록 처리
        const message =
          err instanceof ApiClientError
            ? err.message
            : '케이스 리스트를 불러오는데 실패했습니다.';
        setError(message);
        console.error('Failed to load cases:', err);
        // 에러 발생 시 빈 배열로 설정하여 페이지가 정상적으로 렌더링되도록 함
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddCaseClick = () => {
    setNewCaseNumber('');
    setNewCustomerStatement('');
    setViewMode('create');
  };

  const handleSaveCase = async () => {
    // 간단한 유효성 검사
    if (!/^\d{1,20}$/.test(newCaseNumber)) {
      alert('Case Number는 숫자만 가능하며 1~20자리여야 합니다.');
      return;
    }

    if (newCustomerStatement.length < 10) {
      alert('Customer Statement를 더 자세히 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      
const request: RegisterCaseRequest = {
  cases: {
    number: newCaseNumber,
    title: newCustomerStatement.slice(0, 40) + '...',
    productFamily: 'Unknown',
    productName: 'Unknown',
    category: 'Uncategorized',
  },
  caseStatements: {
    symptom: newCustomerStatement,
    needs: '',
    environments: {},
  },
};

    
      const caseId = await registerCase(request);

      console.log('Case created with ID:', caseId);
      // 생성 성공 후 리스트를 다시 불러옴
      const result = await getCaseList(1);
      setCases(result.cases);
      setViewMode('list');
      setNewCaseNumber('');
      setNewCustomerStatement('');
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : '케이스 생성에 실패했습니다.';
      setError(message);
      console.error('Failed to create case:', err);
      // 에러 발생 시에도 입력 필드를 수정할 수 있도록 loading 상태 해제
      // alert는 사용자가 확인할 때까지 기다리므로, 여기서는 console.error만 사용
    } finally {
      setLoading(false);
    }
  };

  const handleCaseClick = async (item: SupportCase) => {
    setLoading(true);
    setError(null);
    try {
      // 상세 정보 조회 (statements, resolutions 포함)
      // id가 이미 포함되어 있으므로 직접 사용
      const detail = await getCaseView(item.base.id);
      setSelectedCase(detail);
      setViewMode('detail');
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : '케이스 상세 정보를 불러오는데 실패했습니다.';
      setError(message);
      alert(message);
      console.error('Failed to load case detail:', err);
    } finally {
      setLoading(false);
    }
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
      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm rounded mb-2'>
          {error}
        </div>
      )}
      {loading && (
        <div className='absolute inset-0 bg-black/10 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg px-4 py-2 shadow-lg'>
            <div className='text-sm'>로딩 중...</div>
          </div>
        </div>
      )}
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
            loading={loading}
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
