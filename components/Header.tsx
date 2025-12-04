
import React, { useState } from 'react';
import { Palette, GraduationCap, Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-md shadow-indigo-200">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-none flex items-center gap-2">
                  PromptPalette <span className="text-indigo-600">Edu</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">Nano Banana Pro Generator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                title="Cấu hình API Key"
              >
                <Settings className="w-5 h-5" />
              </button>

              <a 
                href="https://zalo.me/0934415387" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 border border-transparent hover:border-indigo-100"
                title="Liên hệ Zalo Đường Thọ: 0934415387"
              >
                <div className="bg-blue-100 p-1 rounded-full">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                </div>
                <span>Học AI (Zalo Đường Thọ)</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;
