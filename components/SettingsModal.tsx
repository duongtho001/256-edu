
import React, { useState, useEffect } from 'react';
import { X, Key, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKeys, setApiKeys] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    if (isOpen) {
      const storedKeys = localStorage.getItem('gemini_api_keys');
      if (storedKeys) {
        try {
          const keys = JSON.parse(storedKeys);
          setApiKeys(keys.join('\n'));
        } catch (e) {
          console.error("Error parsing keys", e);
        }
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    const keys = apiKeys
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    localStorage.setItem('gemini_api_keys', JSON.stringify(keys));
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
    
    if (keys.length === 0) {
      localStorage.removeItem('gemini_api_keys');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <Key className="h-6 w-6 text-indigo-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Cấu hình API Key
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-3">
                    Nhập danh sách Google Gemini API Key của bạn. Mỗi dòng một key. 
                    Hệ thống sẽ tự động chuyển sang key tiếp theo nếu key hiện tại hết hạn mức (Quota).
                  </p>
                  
                  <div className="relative">
                    <textarea
                      rows={6}
                      className="w-full rounded-md border border-gray-300 p-3 text-sm font-mono focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50"
                      placeholder="AIzaSy...&#10;AIzaSy...&#10;AIzaSy..."
                      value={apiKeys}
                      onChange={(e) => setApiKeys(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100">
                    <AlertCircle className="w-4 h-4" />
                    Key được lưu trên trình duyệt của bạn (LocalStorage).
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-all ${
                status === 'saved' ? 'bg-green-600 hover:bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
              onClick={handleSave}
            >
              {status === 'saved' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Đã lưu
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu cấu hình
                </>
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
