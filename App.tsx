
import React from 'react';
import Header from './components/Header';
import PromptGenerator from './components/PromptGenerator';
import OnboardingTour from './components/OnboardingTour';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight mb-4">
              Tạo Prompt Infographic <br className="hidden sm:block" />
              <span className="text-indigo-600">Giáo Dục Chuyên Nghiệp</span>
            </h2>
            <p className="text-lg text-gray-600">
              Công cụ hỗ trợ giáo viên và học sinh tạo nội dung trực quan nhanh chóng với cấu trúc chuẩn Nano Banana Pro.
            </p>
          </div>

          <PromptGenerator />
          
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} PromptPalette Edu. Designed based on educational materials.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">Hướng dẫn</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Góp ý</a>
          </div>
        </div>
      </footer>

      <OnboardingTour />
    </div>
  );
}

export default App;
