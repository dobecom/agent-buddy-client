import React, { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { SupportCase } from '../../domains/SupportCase';
import { CaseAttaches } from '../../domains/CaseAttaches';
import {
  getCaseAttachesList,
  uploadCaseFiles,
} from '../../services/caseService';
import { ApiClientError } from '../../services/apiClient';
import { FILE_UPLOAD_CONFIG } from '../../config/api';

interface CaseDetailViewProps {
  selectedCase: SupportCase;
  onBack: () => void;
  onCloseCase: () => void;
  onOpenAddStatement: () => void;
  onOpenAddResolution: () => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  selectedCase,
  onBack,
  onCloseCase,
  onOpenAddStatement,
  onOpenAddResolution,
}) => {
  const [attachments, setAttachments] = useState<CaseAttaches[]>([]);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 첨부파일 리스트 조회 함수
  const loadAttachments = React.useCallback(async () => {
    setLoadingAttachments(true);
    try {
      const attaches = await getCaseAttachesList(selectedCase.base.id);
      setAttachments(attaches);
    } catch (err) {
      console.error('Failed to load attachments:', err);
      setAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  }, [selectedCase.base.id]);

  // 초기 로드 및 caseId 변경 시 조회
  useEffect(() => {
    loadAttachments();
  }, [loadAttachments]);

  // 파일 선택 핸들러
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 파일 업로드 핸들러
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 파일 개수 검증
    if (files.length > FILE_UPLOAD_CONFIG.MAX_FILES) {
      alert(
        `최대 ${FILE_UPLOAD_CONFIG.MAX_FILES}개까지 업로드 가능합니다.`,
      );
      return;
    }

    // 파일 크기 검증
    const oversizedFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > FILE_UPLOAD_CONFIG.MAX_FILE_SIZE) {
        oversizedFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      alert(
        `다음 파일들의 크기가 너무 큽니다 (최대 ${FILE_UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB):\n${oversizedFiles.map((f) => f.name).join('\n')}`,
      );
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // 파일 업로드 및 DB 저장
      await uploadCaseFiles(selectedCase.base.id, Array.from(files));

      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // 업로드 완료 후 Attaches 섹션만 새로고침
      await loadAttachments();
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : '파일 업로드에 실패했습니다.';
      setUploadError(message);
      alert(message);
      console.error('Failed to upload files:', err);
    } finally {
      setUploading(false);
    }
  };

  // 날짜 포맷팅 함수: 2025/12/19 11:12:12 AM 형식
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${year}/${month}/${day} ${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  };

  // createdAt 기준 내림차순 정렬
  const sortedStatements = (selectedCase?.statements ?? [])
  .slice()
  .sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

const sortedResolutions = (selectedCase?.resolutions ?? [])
  .slice()
  .sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className='flex flex-col h-full gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <button
            className='px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100'
            onClick={onBack}
          >
            Back
          </button>
          <h2 className='text-xl font-semibold'>
            Case Detail - {selectedCase.base.number}
          </h2>
        </div>
        <button
          className='px-3 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm'
          onClick={onCloseCase}
        >
          Close Case
        </button>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-semibold'>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-0'>
          <div>
            <div className='font-medium text-gray-600'>Case Number</div>
            <div>{selectedCase.base.number}</div>
          </div>
          <div>
            <div className='font-medium text-gray-600'>Title</div>
            <div>{selectedCase.base.title}</div>
          </div>
          <div>
            <div className='font-medium text-gray-600'>Product Name</div>
            <div>{selectedCase.base.productName}</div>
          </div>
          <div>
            <div className='font-medium text-gray-600'>Category</div>
            <div>{selectedCase.base.category}</div>
          </div>
          <div>
            <div className='font-medium text-gray-600'>Status</div>
            <div>{selectedCase.base.status}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-3'>
          <CardTitle className='text-sm font-semibold'>Attachments</CardTitle>
          <button
            className='px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleFileSelect}
            disabled={uploading}
          >
            +
          </button>
        </CardHeader>
        <CardContent className='pt-0'>
          <input
            ref={fileInputRef}
            type='file'
            multiple
            className='hidden'
            onChange={handleFileUpload}
            accept='*/*'
          />
          {uploadError && (
            <div className='mb-2 text-xs text-red-600'>{uploadError}</div>
          )}
          {uploading && (
            <div className='mb-2 text-xs text-gray-500'>업로드 중...</div>
          )}
          {loadingAttachments && (
            <div className='mb-2 text-xs text-gray-500'>첨부파일 로딩 중...</div>
          )}
          <div
            className={`border border-gray-200 rounded text-sm ${
              attachments.length > 5 ? 'max-h-40 overflow-auto' : ''
            }`}
          >
            {!loadingAttachments && attachments.length === 0 && (
              <div className='px-3 py-2 text-gray-400'>No attachments.</div>
            )}
            {attachments.map((att) => (
              <div
                key={att.id}
                className='px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50'
              >
                <a
                  href={att.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline break-all'
                  download
                >
                  {att.name}
                </a>
                {att.original !== att.name && (
                  <div className='text-xs text-gray-500 mt-1'>
                    원본: {att.original}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0'>
        <Card className='flex flex-col min-h-0'>
          <CardHeader className='flex flex-row items-center justify-between pb-3'>
            <CardTitle className='text-sm font-semibold'>
              Case Statements
            </CardTitle>
            <button
              className='px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100'
              onClick={onOpenAddStatement}
            >
              +
            </button>
          </CardHeader>
          <CardContent className='flex-1 min-h-0 overflow-auto space-y-2 pt-0 text-sm'>
            {sortedStatements.length === 0 && (
              <div className='text-gray-400'>No case statements.</div>
            )}
            {sortedStatements.map((st) => (
              <div
                key={st.id}
                className='border border-gray-100 rounded-md p-2 bg-gray-50 relative'
              >
                <div className='absolute top-2 right-2 text-xs text-gray-500'>
                  {formatDateTime(st.createdAt)}
                </div>
                <div className='font-bold text-gray-700 mb-1'>Symptom</div>
                <div className='mb-2 whitespace-pre-wrap text-gray-800'>
                  {st.symptom}
                </div>
                <div className='font-bold text-gray-700 mb-1'>Needs</div>
                <div className='mb-2 whitespace-pre-wrap text-gray-800'>
                  {st.needs || '-'}
                </div>
                <div className='font-bold text-gray-700 mb-1'>
                  Environments (json)
                </div>
                <pre className='text-xs bg-white border border-gray-200 rounded p-2 overflow-auto max-h-32'>
                  {JSON.stringify(
                    st.environments ? JSON.parse(st.environments) : {},
                    null,
                    2,
                  )}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className='flex flex-col min-h-0'>
          <CardHeader className='flex flex-row items-center justify-between pb-3'>
            <CardTitle className='text-sm font-semibold'>
              Case Resolutions
            </CardTitle>
            <button
              className='px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100'
              onClick={onOpenAddResolution}
            >
              +
            </button>
          </CardHeader>
          <CardContent className='flex-1 min-h-0 overflow-auto space-y-2 pt-0 text-sm'>
            {sortedResolutions.length === 0 && (
              <div className='text-gray-400'>No resolutions.</div>
            )}
            {sortedResolutions.map((rs) => (
              <div
                key={rs.id}
                className='border border-gray-100 rounded-md p-2 bg-gray-50 relative'
              >
                <div className='absolute top-2 right-2 text-xs text-gray-500'>
                  {formatDateTime(rs.createdAt)}
                </div>
                <div className='font-bold text-gray-700 mb-1'>
                  Content (json)
                </div>
                <pre className='text-xs bg-white border border-gray-200 rounded p-2 overflow-auto max-h-32'>
                  {JSON.stringify(
                    rs.content ? JSON.parse(rs.content) : {},
                    null,
                    2,
                  )}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


