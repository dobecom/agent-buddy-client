import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface AddResolutionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (params: { content: Record<string, unknown> }) => void;
}

export const AddResolutionModal: React.FC<AddResolutionModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [contentText, setContentText] = useState('{\n  \"steps\": []\n}');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = () => {
    try {
      const parsed = contentText.trim() ? JSON.parse(contentText) : {};
      setError(null);
      onSave({ content: parsed });
      setContentText('{\n  \"steps\": []\n}');
    } catch (e) {
      setError('Content는 올바른 JSON 형식이어야 합니다.');
    }
  };

  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <Card className='w-full max-w-2xl max-height-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>Add Resolution</CardTitle>
              <p className='text-xs text-muted-foreground'>
                해결 방안을 JSON 구조로 기록해 주세요.
              </p>
            </div>
            <button
              className='text-sm text-gray-400 hover:text-gray-600'
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className='flex-1 overflow-auto space-y-3 pt-0'>
          <div>
            <div className='flex items-center justify-between mb-1'>
              <label className='block text-sm font-medium'>
                Content (json)
              </label>
              <span className='text-[11px] text-gray-400'>
                예: {"{ \"steps\": [\"로그 분석\", \"패치 적용\"] }"}
              </span>
            </div>
            <textarea
              className='w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono min-h-[180px] resize-vertical bg-background'
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
            />
            {error && (
              <p className='mt-1 text-xs text-red-500'>
                {error}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex justify-end gap-2 border-t border-gray-200'>
          <button
            className='px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            onClick={handleSave}
          >
            Save Resolution
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};


