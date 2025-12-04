
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface Step {
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: Step[] = [
  {
    target: '', // No target for welcome modal
    title: 'Chào mừng bạn đến với PromptPalette Edu!',
    description: 'Ứng dụng hỗ trợ tạo prompt infographic giáo dục chuyên nghiệp. Hãy cùng dành 30 giây để tìm hiểu cách sử dụng nhé.',
    position: 'bottom'
  },
  {
    target: 'tour-subject',
    title: 'Bước 1: Chọn Môn Học',
    description: 'Bắt đầu bằng việc chọn môn học bạn quan tâm từ danh sách các môn học hỗ trợ.',
    position: 'right'
  },
  {
    target: 'tour-topic',
    title: 'Bước 2: Chọn Chủ Đề',
    description: 'Bạn có thể nhập chủ đề tùy chỉnh hoặc chọn nhanh từ danh sách gợi ý phía dưới.',
    position: 'right'
  },
  {
    target: 'tour-palette',
    title: 'Bước 3: Chọn Màu Sắc',
    description: 'Lựa chọn tông màu pastel phù hợp để infographic của bạn trông thật đẹp mắt và hài hòa.',
    position: 'right'
  },
  {
    target: 'tour-generate',
    title: 'Bước 4: Tạo Prompt AI',
    description: 'Cuối cùng, nhấn nút này để AI phân tích và tạo ra prompt chi tiết cho bạn. Sau đó bạn có thể sao chép và sử dụng!',
    position: 'top'
  }
];

const OnboardingTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeen) {
      // Small delay to ensure UI is ready
      const timer = setTimeout(() => {
        setIsVisible(true);
        setCurrentStep(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isVisible || currentStep < 0) return;

    const updatePosition = () => {
      const step = STEPS[currentStep];
      if (step.target) {
        const element = document.getElementById(step.target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTargetRect(element.getBoundingClientRect());
        }
      } else {
        setTargetRect(null); // Center modal
      }
    };

    // Update immediately
    updatePosition();

    // Update on resize/scroll
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isWelcome = !step.target;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Target Highlight (Spotlight) */}
      {targetRect && (
        <div 
          className="absolute transition-all duration-300 ease-in-out pointer-events-none rounded-lg"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
          }}
        />
      )}

      {/* Backdrop for Welcome Modal */}
      {isWelcome && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      )}

      {/* Tooltip Card */}
      <div 
        className={`absolute transition-all duration-300 ease-out flex flex-col max-w-sm w-full bg-white rounded-xl shadow-2xl p-6 ${isWelcome ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
        style={!isWelcome && targetRect ? getTooltipStyle(targetRect, step.position) : {}}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
          <button 
            onClick={handleComplete}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Đóng hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {step.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex gap-1">
            {STEPS.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-indigo-600' : 'w-1.5 bg-gray-200'}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {!isWelcome && (
              <button 
                onClick={handlePrev}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center gap-1 active:scale-95"
            >
              {isLastStep ? 'Bắt đầu ngay' : 'Tiếp tục'}
              {!isLastStep && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to position tooltip relative to target
function getTooltipStyle(rect: DOMRect, position: 'top' | 'bottom' | 'left' | 'right' = 'bottom'): React.CSSProperties {
  const gap = 12;
  const tooltipWidth = 320; // Approx width for calculation safety
  
  // Default to bottom if space permits, otherwise flip
  // This is a simplified positioning logic
  
  // Center horizontally relative to target
  let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
  let top = 0;

  // Keep within viewport
  if (left < 10) left = 10;
  if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;

  if (position === 'top') {
    top = rect.top - gap - 200; // estimating height
    // If runs off top, flip to bottom
    if (top < 10) {
      top = rect.bottom + gap;
    } else {
        // Since we don't know exact height, we stick to bottom-anchored calculation usually, 
        // but for 'top' we put it above.
        // Let's use `bottom` CSS property for top positioning to be safer if we could, 
        // but style expects top/left. 
        // Simple fallback: just put it below if we aren't using a library like popper.js
        // Actually, let's just place it intelligently below for most things, 
        // except the Generate button which is at the bottom of the screen.
    }
  } else {
     top = rect.bottom + gap;
  }
  
  // Special handling for the Generate button which is likely at the bottom
  if (window.innerHeight - rect.bottom < 250) {
     top = rect.top - gap - 180; // approximate height of tooltip card
  }

  // Mobile adjustment
  if (window.innerWidth < 640) {
      left = 16;
      // width = 'calc(100% - 32px)'; // handled by CSS max-w
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
    maxWidth: '384px', // max-w-sm
    position: 'absolute',
    zIndex: 110,
  };
}

export default OnboardingTour;
