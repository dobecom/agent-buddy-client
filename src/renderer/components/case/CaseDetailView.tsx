import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { SupportCase } from '../../domains/SupportCase';

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
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-semibold'>Attachments</CardTitle>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='border border-gray-200 rounded max-h-32 overflow-auto text-sm'>
            {selectedCase.attachments.length === 0 && (
              <div className='px-3 py-2 text-gray-400'>No attachments.</div>
            )}
            {selectedCase.attachments.map((att) => (
              <div
                key={att.id}
                className='px-3 py-2 border-b border-gray-100 last:border-b-0'
              >
                <a
                  href={att.url}
                  className='text-blue-600 hover:underline break-all'
                >
                  {att.name}
                </a>
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
            {selectedCase.statements.length === 0 && (
              <div className='text-gray-400'>No case statements.</div>
            )}
            {selectedCase.statements.map((st) => (
              <div
                key={st.id}
                className='border border-gray-100 rounded-md p-2 bg-gray-50'
              >
                <div className='font-medium text-gray-700 mb-1'>Symptom</div>
                <div className='mb-2 whitespace-pre-wrap text-gray-800'>
                  {st.symptom}
                </div>
                <div className='font-medium text-gray-700 mb-1'>Needs</div>
                <div className='mb-2 whitespace-pre-wrap text-gray-800'>
                  {st.needs || '-'}
                </div>
                <div className='font-medium text-gray-700 mb-1'>
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
            {selectedCase.resolutions.length === 0 && (
              <div className='text-gray-400'>No resolutions.</div>
            )}
            {selectedCase.resolutions.map((rs) => (
              <div
                key={rs.id}
                className='border border-gray-100 rounded-md p-2 bg-gray-50'
              >
                <div className='font-medium text-gray-700 mb-1'>
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


