import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface AddStatementModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (params: {
    symptom: string;
    needs: string;
    environments: Record<string, unknown>;
  }) => void;
}

export const AddStatementModal: React.FC<AddStatementModalProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [symptom, setSymptom] = useState('');
  const [needs, setNeeds] = useState('');
  const [envText, setEnvText] = useState('{\n  \n}');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSave = () => {
    try {
      const parsed = envText.trim() ? JSON.parse(envText) : {};
      setError(null);
      onSave({ symptom, needs, environments: parsed });
      setSymptom('');
      setNeeds('');
      setEnvText('{\n  \n}');
    } catch (e) {
      setError('Environments는 올바른 JSON 형식이어야 합니다.');
    }
  };

  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
      <Card className='w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-lg'>Add Case Statement</CardTitle>
              <p className='text-xs text-muted-foreground'>
                증상, 요구사항, 환경 정보를 상세히 입력해주세요.
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
        <CardContent className='flex-1 overflow-auto space-y-4 pt-0'>
          <div>
            <label className='block text-sm font-medium mb-1'>Symptom</label>
            <textarea
              className='w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-[100px] resize-vertical bg-background'
              placeholder='사용자가 겪고 있는 증상을 상세히 입력해주세요.'
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Needs</label>
            <textarea
              className='w-full border border-gray-300 rounded px-3 py-2 text-sm min-h-[80px] resize-vertical bg-background'
              placeholder='고객이 원하는 결과나 요구사항을 입력해주세요.'
              value={needs}
              onChange={(e) => setNeeds(e.target.value)}
            />
          </div>

          <div>
            <div className='flex items-center justify-between mb-1'>
              <label className='block text-sm font-medium'>
                Environments (json)
              </label>
              <span className='text-[11px] text-gray-400'>
                예: {"{ \"os\": \"Windows 11\", \"version\": \"1.0.0\" }"}
              </span>
            </div>
            <textarea
              className='w-full border border-gray-300 rounded px-3 py-2 text-xs font-mono min-h-[140px] resize-vertical bg-background'
              value={envText}
              onChange={(e) => setEnvText(e.target.value)}
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
            Save Statement
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};


