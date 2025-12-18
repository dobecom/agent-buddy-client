import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CaseStatus, SupportCase } from '../../domains/SupportCase';

interface CaseListViewProps {
  cases: SupportCase[];
  statusFilter: CaseStatus | 'ALL';
  onStatusFilterChange: (status: CaseStatus | 'ALL') => void;
  onAddCase: () => void;
  onCaseClick: (c: SupportCase) => void;
}

export const CaseListView: React.FC<CaseListViewProps> = ({
  cases,
  statusFilter,
  onStatusFilterChange,
  onAddCase,
  onCaseClick,
}) => {
  const filteredCases =
    statusFilter === 'ALL'
      ? cases
      : cases.filter((c) => c.base.status === statusFilter);

  return (
    <Card className='h-full flex flex-col'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <div>
          <CardTitle className='text-xl font-semibold'>Case List</CardTitle>
        </div>
        <button
          className='px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm'
          onClick={onAddCase}
        >
          Add Case
        </button>
      </CardHeader>
      <CardContent className='flex-1 flex flex-col pt-0'>
        <div className='flex flex-wrap items-center gap-2 mb-4'>
          <span className='text-sm text-gray-600'>Status 필터:</span>
          <select
            className='border border-gray-300 rounded px-2 py-1 text-sm bg-background'
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as CaseStatus | 'ALL')
            }
          >
            <option value='ALL'>ALL</option>
            <option value='OPEN'>OPEN</option>
            <option value='PROCESSING'>PROCESSING</option>
            <option value='PROCESSED'>PROCESSED</option>
            <option value='CLOSE'>CLOSE</option>
          </select>
        </div>

        <div className='flex-1 overflow-auto rounded border border-gray-200'>
          <table className='min-w-full text-sm'>
            <thead className='bg-gray-50 sticky top-0 z-10'>
              <tr>
                <th className='px-3 py-2 text-left font-medium text-gray-700'>
                  Case Number
                </th>
                <th className='px-3 py-2 text-left font-medium text-gray-700'>
                  Title
                </th>
                <th className='px-3 py-2 text-left font-medium text-gray-700'>
                  Product Name
                </th>
                <th className='px-3 py-2 text-left font-medium text-gray-700'>
                  Category
                </th>
                <th className='px-3 py-2 text-left font-medium text-gray-700'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item) => (
                <tr
                  key={item.base.id}
                  className='hover:bg-gray-100 cursor-pointer transition-colors'
                  onClick={() => onCaseClick(item)}
                >
                  <td className='px-3 py-2 whitespace-nowrap'>
                    {item.base.number}
                  </td>
                  <td className='px-3 py-2'>{item.base.title}</td>
                  <td className='px-3 py-2'>{item.base.productName}</td>
                  <td className='px-3 py-2'>{item.base.category}</td>
                  <td className='px-3 py-2'>{item.base.status}</td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-3 py-6 text-center text-gray-400 text-sm'
                  >
                    등록된 케이스가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

