import React, { useState, useEffect, useMemo } from 'react';
import { SUBJECT_DATA, COLOR_PALETTES } from '../constants';
import { Copy, RefreshCw, Check, Sparkles, BookOpen, PenTool, Palette, Wand2, Loader2, RotateCcw, Search, CheckCircle2, X, History, Box, Square, Layers, Save } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import HistorySidebar, { HistoryItem } from './HistorySidebar';

// Helper for smart search: Normalizes Vietnamese text by removing tones and accents
const removeVietnameseTones = (str: string): string => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Combining Diacritical Marks
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return str.toLowerCase().trim();
};

// Common abbreviations and keywords for smart suggestions
const SEARCH_KEYWORDS: Record<string, string[]> = {
  'pt': ['phương trình'],
  'hpt': ['hệ phương trình'],
  'bpt': ['bất phương trình'],
  'hbh': ['hình bình hành'],
  'ht': ['hình thang', 'hình tròn', 'hệ thống', 'hiện tại'],
  'dd': ['dòng điện', 'dao động'],
  'hh': ['hình học', 'hóa học'],
  'adn': ['adn', 'gen', 'di truyền'],
  'vl': ['vật lý'],
  'cntt': ['tin học', 'máy tính'],
  'sgk': ['sách giáo khoa'],
  'bt': ['bài tập'],
  'nc': ['nâng cao'],
};

const PromptGenerator: React.FC = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(SUBJECT_DATA[0].id);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isCustomTopic, setIsCustomTopic] = useState<boolean>(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>(COLOR_PALETTES[0].id);
  const [designMode, setDesignMode] = useState<'2D' | '3D'>('2D');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [topicSearch, setTopicSearch] = useState<string>('');
  
  // History States
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // AI Generation States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');

  // Get current subject data
  const currentSubject = SUBJECT_DATA.find(s => s.id === selectedSubjectId) || SUBJECT_DATA[0];

  // Get current palette
  const currentPalette = COLOR_PALETTES.find(p => p.id === selectedPaletteId) || COLOR_PALETTES[0];

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Filter topics based on search (Smart Search Implementation)
  const filteredTopics = useMemo(() => {
    const search = topicSearch.trim();
    if (!search) return currentSubject.topics;
    
    const normalizedSearch = removeVietnameseTones(search);
    const searchWords = normalizedSearch.split(/\s+/);
    const keywords = SEARCH_KEYWORDS[normalizedSearch] || [];

    return currentSubject.topics.filter(topic => {
       const normalizedTopic = removeVietnameseTones(topic);
       
       // 1. Direct normalized match (e.g. "toan" -> "Toán")
       if (normalizedTopic.includes(normalizedSearch)) return true;
       
       // 2. Keyword/Abbreviation match (e.g. "pt" -> "Phương trình")
       if (keywords.some(k => normalizedTopic.includes(removeVietnameseTones(k)))) return true;
       
       // 3. Flexible word match (e.g. "ham so" -> "Hàm số", "bac 2" -> "bậc hai")
       // All words in search query must exist in the topic
       if (searchWords.length > 0) {
          return searchWords.every(word => normalizedTopic.includes(word));
       }
       
       return false;
    });
  }, [currentSubject, topicSearch]);

  // Reset search when subject changes
  useEffect(() => {
    setTopicSearch('');
  }, [selectedSubjectId]);

  // Auto-generate meta-prompt when dependencies change
  useEffect(() => {
    const topicToUse = isCustomTopic ? customTopic : selectedTopic;
    
    if (!topicToUse) {
      setGeneratedPrompt('');
      setAiResponse('');
      return;
    }

    const subjectName = currentSubject.name;
    const topicName = topicToUse.trim();
    
    // Determine the start phrase based on mode
    const startPhrase = designMode === '3D' 
      ? 'tạo ảnh 3d infographic với ' 
      : 'tạo ảnh infographic 2d phẳng với ';

    const styleDescription = designMode === '3D'
      ? `3D nổi khối, bóng đổ mềm mại, có chiều sâu, style đất sét hoặc render 3D hiện đại`
      : `2D phẳng (flat design), minimal, vector art`;

    // Meta-prompt string
    const fullPrompt = `Đóng vai trò là chuyên gia thiết kế nội dung giáo dục và kỹ sư prompt AI theo phương pháp Nano Banana Pro.

Nhiệm vụ: Phân tích sâu chủ đề "${topicName}" (Môn ${subjectName}) và tạo ra một prompt tạo ảnh dạng JSON chi tiết.

YÊU CẦU ĐỊNH DẠNG (BẮT BUỘC):
Kết quả trả về phải là một văn bản thuần túy (plain text), KHÔNG dùng markdown code block (như \`\`\`json), bắt đầu chính xác bằng cụm từ "${startPhrase}" và nối tiếp ngay sau đó là một đối tượng JSON hợp lệ.

Cấu trúc JSON mẫu:
{
  "title": "TIÊU ĐỀ HẤP DẪN (IN HOA)",
  "subtitle": "(Mô tả phụ đề ngắn gọn, hấp dẫn)",
  "layout": "6 khung nội dung, bố cục ${styleDescription}, nền màu ${currentPalette.name}, phong cách ${currentPalette.description}",
  "sections": [
    // Mảng gồm 6 phần tử tương ứng với 6 mục nội dung chi tiết bên dưới
    {
      "title": "Tiêu đề mục (Ví dụ: 1. Khái Niệm)",
      "color": "Màu pastel cụ thể (ví dụ: Xanh bạc hà, Hồng phấn... thuộc tông ${currentPalette.name})",
      "icon": "Mô tả icon ${designMode === '3D' ? '3D' : 'vector'} minh họa dễ hiểu, trực quan",
      "content": [
        "Dòng nội dung 1",
        "Dòng nội dung 2 (Nếu là công thức Toán/Lý/Hóa hãy dùng định dạng LaTeX đơn giản như $y=ax+b$)",
        "Dòng nội dung 3"
      ]
    }
  ],
  "footer": "Thiết kế hỗ trợ học tập - Kiến thức chuẩn SGK"
}

Yêu cầu nội dung chi tiết cho 6 sections trong mảng "sections" (đảm bảo tính giáo dục, dễ hiểu, thực tế):
1. Khái niệm/Định nghĩa/Công thức "Vàng".
2. Giải thích bản chất/Ý nghĩa/"Giải mã".
3. Quy trình/Các bước thực hiện/Sơ đồ.
4. Ví dụ minh họa thực tế/Gắn với đời sống.
5. Ứng dụng/Tầm quan trọng/Tại sao cần học?
6. Note nhỏ/Mẹo ghi nhớ/Lời khuyên.

Lưu ý:
- Toàn bộ nội dung là Tiếng Việt.
- Nội dung cô đọng, súc tích, phù hợp để trình bày trên infographic.`;
    
    setGeneratedPrompt(fullPrompt);
    setAiResponse(''); // Reset AI response when inputs change
    setIsCopied(false);
    setIsSaved(false);
  }, [selectedSubjectId, selectedTopic, customTopic, isCustomTopic, currentSubject, currentPalette, selectedPaletteId, designMode]);

  const addToHistory = (content: string, isAiResult: boolean) => {
    const topicToUse = isCustomTopic ? customTopic : selectedTopic;
    if (!topicToUse) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      topic: topicToUse,
      subjectName: currentSubject.name,
      paletteName: currentPalette.name,
      designMode: designMode,
      content: content,
      timestamp: Date.now(),
      isAiResult: isAiResult
    };

    setHistory(prev => {
      // Avoid duplicates at the top
      if (prev.length > 0 && prev[0].content === content) return prev;
      const newHistory = [newItem, ...prev].slice(50); // Keep last 50 items
      localStorage.setItem('promptHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleGenerateAI = async () => {
    if (!generatedPrompt) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: generatedPrompt,
      });
      
      if (response.text) {
        const resultText = response.text;
        setAiResponse(resultText);
        addToHistory(resultText, true);
      }
    } catch (error) {
      console.error("Error generating prompt with AI:", error);
      alert("Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setAiResponse('');
    setIsCopied(false);
    setIsSaved(false);
  };

  const handleCopy = async () => {
    const textToCopy = aiResponse || generatedPrompt;
    if (!textToCopy) return;
    
    // If copying the Meta-Prompt (not AI result), save it to history
    if (!aiResponse) {
      addToHistory(textToCopy, false);
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSave = () => {
    const textToSave = aiResponse || generatedPrompt;
    if (!textToSave) return;
    
    addToHistory(textToSave, !!aiResponse);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    // Attempt to find subject ID from name (simple approximation)
    const subject = SUBJECT_DATA.find(s => s.name === item.subjectName);
    if (subject) {
      setSelectedSubjectId(subject.id);
      
      // Check if topic exists in subject
      if (subject.topics.includes(item.topic)) {
        setIsCustomTopic(false);
        setSelectedTopic(item.topic);
        setCustomTopic('');
      } else {
        setIsCustomTopic(true);
        setCustomTopic(item.topic);
        setSelectedTopic('');
      }
    }

    // Find palette
    const palette = COLOR_PALETTES.find(p => p.name === item.paletteName);
    if (palette) setSelectedPaletteId(palette.id);

    // Restore Design Mode
    if (item.designMode) {
      setDesignMode(item.designMode);
    }

    // Set content
    if (item.isAiResult) {
      setAiResponse(item.content);
    } else {
      setAiResponse('');
    }
    
    setIsHistoryOpen(false);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubjectId(e.target.value);
    setSelectedTopic('');
    setCustomTopic('');
    setIsCustomTopic(false);
  };

  const handleTopicSelection = (topic: string) => {
    setIsCustomTopic(false);
    setSelectedTopic(topic);
    setCustomTopic('');
  };

  const handleCustomTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(e.target.value);
    setIsCustomTopic(true);
    setSelectedTopic('');
  };

  const clearTopicSearch = () => {
    setTopicSearch('');
  };

  const displayText = aiResponse || generatedPrompt;
  const isAiMode = !!aiResponse;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        history={history}
        onRestore={handleRestoreHistory}
        setHistory={setHistory}
      />

      {/* Left Column: Controls */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 pb-3 border-b border-gray-100">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Cấu hình nội dung
          </h2>
          
          <div className="space-y-6">
            {/* Subject Select */}
            <div id="tour-subject">
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                Chọn Môn Học
              </label>
              <div className="relative">
                <select
                  id="subject"
                  value={selectedSubjectId}
                  onChange={handleSubjectChange}
                  className="appearance-none block w-full pl-4 pr-10 py-3 text-sm font-medium border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl border bg-gray-50 hover:bg-white cursor-pointer transition-all"
                >
                  {SUBJECT_DATA.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Topic Selection Container */}
            <div id="tour-topic" className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col">
               {/* Search Header - Sticky */}
               <div className="p-3 border-b border-gray-200 bg-white sticky top-0 z-10">
                 <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                   Tìm kiếm hoặc nhập chủ đề
                 </label>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Tìm từ khóa (vd: pt, hpt, adn...)`}
                      value={topicSearch}
                      onChange={(e) => setTopicSearch(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                    />
                    {topicSearch && (
                      <button 
                        onClick={clearTopicSearch}
                        className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                 </div>
               </div>
               
               {/* Topic List */}
               <div className="max-h-[240px] overflow-y-auto custom-scrollbar p-2 bg-gray-50/50">
                  {filteredTopics.length > 0 ? (
                    <div className="space-y-1">
                      {filteredTopics.map((topic, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTopicSelection(topic)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                            !isCustomTopic && selectedTopic === topic
                              ? 'bg-white border-indigo-200 text-indigo-700 shadow-sm border font-medium ring-1 ring-indigo-50'
                              : 'text-gray-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm border border-transparent'
                          }`}
                        >
                          <span className="truncate">{topic}</span>
                          {(!isCustomTopic && selectedTopic === topic) && (
                            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 text-gray-400 text-sm flex flex-col items-center">
                       <Search className="w-8 h-8 mb-2 opacity-20" />
                       <p>Không tìm thấy chủ đề phù hợp.</p>
                       <p className="text-xs text-gray-400 mt-1">Hãy thử nhập chủ đề của riêng bạn bên dưới.</p>
                    </div>
                  )}
               </div>

               {/* Custom Input Footer */}
               <div className="p-3 border-t border-gray-200 bg-white">
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PenTool className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                        isCustomTopic ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium' : 'bg-gray-50'
                      }`}
                      placeholder="Hoặc nhập chủ đề khác..."
                      value={customTopic}
                      onChange={handleCustomTopicChange}
                    />
                 </div>
               </div>
            </div>

            {/* Design Mode Selection */}
            <div id="tour-mode">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                Chế độ thiết kế
              </label>
              <div className="flex bg-gray-100/80 p-1.5 rounded-xl gap-1">
                <button
                  onClick={() => setDesignMode('2D')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    designMode === '2D' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                  }`}
                >
                  <Square className="w-4 h-4" />
                  2D Phẳng
                </button>
                <button
                  onClick={() => setDesignMode('3D')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    designMode === '3D' 
                      ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  3D Nổi khối
                </button>
              </div>
            </div>

            {/* Color Palette Selection */}
            <div id="tour-palette">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                Phong cách & Màu sắc
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLOR_PALETTES.map((palette) => {
                  const isActive = selectedPaletteId === palette.id;
                  return (
                    <button
                      key={palette.id}
                      onClick={() => setSelectedPaletteId(palette.id)}
                      className={`relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 group ${
                        isActive
                          ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full mb-2">
                        <span className={`text-sm font-medium ${isActive ? 'text-indigo-900' : 'text-gray-700'}`}>
                          {palette.name}
                        </span>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div className="flex -space-x-1.5 overflow-hidden py-1 pl-1">
                        {palette.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-100 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Support Box */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 shadow-sm flex items-start gap-3">
           <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600 mt-0.5">
              <Sparkles className="w-5 h-5" />
           </div>
           <div>
             <h3 className="text-sm font-bold text-indigo-900 mb-1">
               Cần hỗ trợ?
             </h3>
             <p className="text-xs text-indigo-700/80 mb-2 leading-relaxed">
               Liên hệ trực tiếp để được giải đáp thắc mắc về cách sử dụng.
             </p>
             <a 
               href="https://zalo.me/0934415387"
               target="_blank"
               rel="noreferrer"
               className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
             >
               Chat Zalo: 0934415387 &rarr;
             </a>
           </div>
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="lg:col-span-7 h-full">
        <div className={`bg-white rounded-2xl shadow-lg border overflow-hidden flex flex-col h-full min-h-[600px] transition-all sticky top-24 ${isAiMode ? 'border-indigo-200 shadow-indigo-100/50' : 'border-gray-100'}`}>
          <div className={`px-6 py-4 border-b flex justify-between items-center ${isAiMode ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-50/50 border-gray-100'}`}>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isAiMode ? 'text-indigo-600' : 'text-gray-400'}`} />
              {isAiMode ? 'Kết quả AI' : 'Bản nháp Meta-Prompt'}
            </h2>
            <div className="flex items-center gap-2">
               {displayText && (
                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isAiMode ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {isAiMode ? <Check className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                    {isAiMode ? 'Sẵn sàng sử dụng' : 'Chờ xử lý'}
                 </span>
               )}
               <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors ml-2"
                  title="Lịch sử"
               >
                 <History className="w-5 h-5" />
               </button>
            </div>
          </div>
          
          <div className="p-6 flex-grow flex flex-col relative">
            {displayText ? (
              <>
                <div className="relative flex-grow group">
                   <div className={`absolute inset-0 pointer-events-none rounded-xl border-2 transition-opacity duration-500 ${isAiMode ? 'border-indigo-500/20' : 'border-transparent'}`} />
                   <textarea
                    readOnly
                    className={`w-full h-full min-h-[400px] p-5 rounded-xl text-gray-700 font-mono text-sm leading-relaxed focus:outline-none resize-none transition-colors custom-scrollbar ${
                      isAiMode 
                        ? 'bg-indigo-50/10 text-indigo-950' 
                        : 'bg-gray-50 text-gray-600'
                    }`}
                    value={displayText}
                  />
                  {/* Floating Copy Button */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                     <button
                        onClick={handleCopy}
                        className="bg-white border border-gray-200 p-2 rounded-lg shadow-sm hover:shadow-md text-gray-500 hover:text-indigo-600 transition-all"
                        title="Sao chép"
                     >
                       <Copy className="w-4 h-4" />
                     </button>
                  </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between" id="tour-generate">
                   {isAiMode ? (
                     // State: AI Result Ready
                     <>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={handleReset}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Làm mới
                          </button>
                          <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 px-4 py-2 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                            title="Lưu vào lịch sử"
                          >
                             {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                             {isSaved ? 'Đã lưu' : 'Lưu'}
                          </button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                          <p className="text-xs text-gray-400 italic hidden lg:block">
                            *Dùng JSON này cho Midjourney/DALL-E
                          </p>
                          <button
                            onClick={handleCopy}
                            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-lg w-full sm:w-auto ${
                              isCopied 
                                ? 'bg-green-500 hover:bg-green-600 ring-4 ring-green-100 shadow-green-200' 
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-indigo-200'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-5 h-5" />
                                Đã chép!
                              </>
                            ) : (
                              <>
                                <Copy className="w-5 h-5" />
                                Sao chép kết quả
                              </>
                            )}
                          </button>
                        </div>
                     </>
                   ) : (
                     // State: Ready to Generate
                     <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-gray-500 flex items-center gap-2 px-2">
                          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                          <span>Nhấn nút để AI hoàn thiện nội dung</span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            onClick={handleSave}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition-all transform hover:-translate-y-0.5 active:scale-95"
                            title="Lưu bản nháp này"
                          >
                             {isSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                             <span className="sm:hidden md:inline">Lưu nháp</span>
                          </button>
                          <button
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white transition-all transform shadow-lg min-w-[200px] ${
                              isGenerating
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
                            }`}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-5 h-5" />
                                Tạo Prompt AI
                              </>
                            )}
                          </button>
                        </div>
                     </div>
                   )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-8 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                <div className="bg-white p-4 rounded-full mb-4 shadow-sm ring-1 ring-gray-100">
                  <BookOpen className="w-8 h-8 text-indigo-100" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Chưa có nội dung</h3>
                <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
                  Vui lòng chọn môn học và chủ đề để bắt đầu.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;