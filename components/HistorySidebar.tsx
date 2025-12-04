import React from 'react';
import { X, Clock, Trash2, RotateCcw, FileJson, FileText } from 'lucide-react';

export interface HistoryItem {
  id: string;
  topic: string;
  subjectName: string;
  paletteName: string;
  content: string;
  timestamp: number;
  isAiResult: boolean;
  designMode?: '2D' | '3D';
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onRestore,
  setHistory 
}) => {
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('promptHistory', JSON.stringify(newHistory));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-l border-gray-100 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg">Lịch sử tạo</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-3">
              <Clock className="w-12 h-12 opacity-20" />
              <p>Chưa có lịch sử.</p>
              <p className="text-xs max-w-[200px]">Các prompt bạn tạo hoặc sao chép sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onRestore(item)}
                  className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                      item.isAiResult 
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {item.isAiResult ? 'AI Generated' : 'Meta-Prompt'}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1" title={item.topic}>
                    {item.topic}
                  </h3>
                  
                  <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mb-3">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {item.subjectName}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                      {item.paletteName}
                    </span>
                    {item.designMode && (
                      <span className="flex items-center gap-1 font-semibold text-gray-600">
                        • {item.designMode}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-1">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formatDate(item.timestamp)}
                    </span>
                    <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <RotateCcw className="w-3 h-3" />
                      Khôi phục
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
                  setHistory([]);
                  localStorage.removeItem('promptHistory');
                }
              }}
              className="w-full py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HistorySidebar;