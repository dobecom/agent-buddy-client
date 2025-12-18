import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface CaseCreateViewProps {
  caseNumber: string;
  customerStatement: string;
  onChangeCaseNumber: (v: string) => void;
  onChangeCustomerStatement: (v: string) => void;
  onSave: () => void;
  onBack: () => void;
}

export const CaseCreateView: React.FC<CaseCreateViewProps> = ({
  caseNumber,
  customerStatement,
  onChangeCaseNumber,
  onChangeCustomerStatement,
  onSave,
  onBack,
}) => {
  return (
    <Card className='h-full max-w-3xl flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <CardTitle className='text-xl font-semibold'>Add New Case</CardTitle>
        <button
          className='text-sm text-gray-500 hover:text-gray-700'
          onClick={onBack}
        >
          Back to List
        </button>
      </CardHeader>
      <CardContent className='flex-1 overflow-auto pt-0 space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Case Number</label>
          <input
            type='text'
            inputMode='numeric'
            maxLength={20}
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm bg-background'
            placeholder='숫자만 입력 (예: 202512180000001)'
            value={caseNumber}
            onChange={(e) => onChangeCaseNumber(e.target.value)}
          />
          <p className='mt-1 text-xs text-gray-500'>
            약 15자리 숫자를 권장합니다.
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>
            Customer Statement
          </label>
          <textarea
            className='w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-[220px] resize-vertical bg-background'
            placeholder='고객 문의 내용을 500~2000자 정도로 상세히 입력해주세요.'
            value={customerStatement}
            onChange={(e) => onChangeCustomerStatement(e.target.value)}
          />
          <p className='mt-1 text-xs text-gray-500'>
            현재 길이: {customerStatement.length}자
          </p>
        </div>
      </CardContent>
      <CardFooter className='border-t border-gray-200 flex justify-end'>
        <button
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm shadow-sm'
          onClick={onSave}
        >
          Save
        </button>
      </CardFooter>
    </Card>
  );
};


