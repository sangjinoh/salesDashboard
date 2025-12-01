import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Upload, Bot, Sparkles, Target, Brain, Zap, X, Layers3, Clock, ChevronRight, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onUploadClick: () => void;
  onAISettingsClick: () => void;
  selectedFolderId: string;
  onSemanticSearch: (query: string, folderId?: string) => void;
  onClearSearchScope: () => void;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  viewMode, 
  onViewModeChange,
  onUploadClick,
  onAISettingsClick,
  selectedFolderId,
  onSemanticSearch,
  onClearSearchScope
}: SearchBarProps) {
  const [filters, setFilters] = useState({
    fileTypes: [] as string[],
    dateRange: '',
    discipline: [] as string[],
  });

  const [isSemanticMode, setIsSemanticMode] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fileTypes = ['PDF', 'DWG', 'DOCX', 'XLSX', 'PNG', 'JPG'];
  const disciplines = ['Process', 'Mechanical', 'Electrical', 'Civil', 'Instrumentation'];

  // 설계 엔지니어를 위한 검색 예시
  const searchExamples = [
    '압력 용기 도면',
    'P&ID 공정도',
    '배관 계획도',
    '전기 단선도',
    '구조도면',
    '안전 매뉴얼',
    '장비 사양서',
    '계산서',
    '시험성적서',
    '승인도서'
  ];

  const activeFiltersCount = Object.values(filters).flat().length;

  // 간단한 키보드 단축키 처리 (설계 엔지니어 친화적)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F로 검색창 포커스 (일반적인 브라우저 단축키와 유사)
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          setShowSuggestions(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFolderDisplayName = (folderId: string) => {
    const [projectId, ...folderParts] = folderId.split('-');
    const projectNames = {
      '1': '신재생에너지 플랜트',
      '2': '해상풍력 발전소 A',
      '3': '수소생산시설 B',
      '4': '태양광 단지 C',
    };
    
    if (folderParts.length === 0) {
      return projectNames[projectId as keyof typeof projectNames] || `프로젝트 ${projectId}`;
    }
    
    const folderNames = {
      'general': 'Project General',
      'correspondence': 'Correspondence', 
      'engineering': 'Engineering',
      'procurement': 'Procurement',
      'construction': 'Construction',
      'partner': 'Partner',
      'workflow': 'Workflow',
      // 하위 폴더들
      'mechanical': 'Mechanical',
      'electrical': 'Electrical',
      'civil': 'Civil',
      'process': 'Process',
      'instrumentation': 'Instrumentation',
      'piping': 'Piping',
      'structural': 'Structural',
      'safety': 'Safety',
      'environmental': 'Environmental',
      'quality': 'Quality'
    };
    
    const projectName = projectNames[projectId as keyof typeof projectNames] || `프로젝트 ${projectId}`;
    const folderPath = folderParts.map(part => 
      folderNames[part as keyof typeof folderNames] || 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' > ');
    
    return `${projectName} > ${folderPath}`;
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
      setSearchHistory(prev => [searchQuery.trim(), ...prev.slice(0, 9)]); // 최대 10개 저장
    }

    if (isSemanticMode && searchQuery.trim()) {
      onSemanticSearch(searchQuery.trim(), selectedFolderId);
    } else {
      onSearchChange(searchQuery);
    }
    setShowSuggestions(false);
  }, [searchQuery, isSemanticMode, selectedFolderId, onSemanticSearch, onSearchChange, searchHistory]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
  };

  const getPlaceholderText = () => {
    if (isSemanticMode) return "문서 내용이나 관련 키워드로 검색 (예: '압력 용기 설계도')";
    return "파일명으로 검색...";
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b bg-card">
      {/* 검색창 */}
      <div className="flex-1 space-y-2">
        <div className="relative group">
          {/* 검색창 */}
          <div className={`relative flex items-center border-2 rounded-lg transition-all duration-200 ${
            isFocused 
              ? isSemanticMode 
                ? 'border-blue-400 shadow-md' 
                : 'border-ring shadow-md' 
              : isSemanticMode 
                ? 'border-blue-200 hover:border-blue-300'
                : 'border-border hover:border-ring'
          } ${isSemanticMode ? 'bg-blue-50/30' : 'bg-background'}`}>
            
            {/* 좌측 아이콘 및 모드 표시 */}
            <div className="flex items-center gap-2 pl-3">
              {isSemanticMode ? (
                <Brain className="w-4 h-4 text-blue-500" />
              ) : (
                <Search className="w-4 h-4 text-muted-foreground" />
              )}
              <div className={`text-xs px-3 py-1 rounded transition-colors min-w-fit whitespace-nowrap ${
                isSemanticMode 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isSemanticMode ? 'AI 검색' : '일반 검색'}
              </div>
              <div className="w-px h-4 bg-border" />
            </div>

            {/* 입력 필드 */}
            <Input
              id="search-input"
              placeholder={getPlaceholderText()}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setIsFocused(false);
                  setShowSuggestions(false);
                }, 200);
              }}
              className="border-0 bg-transparent pl-0 pr-32 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {/* 우측 컨트롤 */}
            <div className="absolute right-2 flex items-center gap-1">
              {/* 도움말 및 단축키 힌트 */}
              {!isFocused && !searchQuery && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        <span>Ctrl+F</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <div>Ctrl+F: 검색창 포커스</div>
                        <div>Enter: 검색 실행</div>
                        <div>ESC: 검색 제안 닫기</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* 똑똑한 검색 토글 버튼 */}
              <Button
                size="sm"
                variant={isSemanticMode ? "default" : "ghost"}
                onClick={() => setIsSemanticMode(!isSemanticMode)}
                className={`h-6 px-2 gap-1 min-w-fit whitespace-nowrap ${isSemanticMode ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
              >
                <Brain className="w-3 h-3" />
                <span className="text-xs">AI 검색</span>
              </Button>

              {/* 검색 실행 버튼 */}
              {searchQuery.trim() && (
                <Button size="sm" onClick={handleSearch} className="h-6 px-2 gap-1">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs">검색</span>
                </Button>
              )}
            </div>
          </div>

          {/* 검색 제안 드롭다운 */}
          {showSuggestions && (searchHistory.length > 0 || searchExamples.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {/* 최근 검색 */}
              {searchHistory.length > 0 && (
                <div className="p-3 border-b">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="w-3 h-3" />
                    <span>최근 검색</span>
                  </div>
                  {searchHistory.slice(0, 5).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full text-left px-2 py-1 text-sm hover:bg-accent rounded flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3 text-muted-foreground" />
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {/* 검색 예시 */}
              <div className="p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <HelpCircle className="w-3 h-3" />
                  <span>검색 예시</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {searchExamples.slice(0, 8).map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(example)}
                      className="text-left px-2 py-1 text-sm hover:bg-accent rounded text-muted-foreground"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* AI 검색 범위 표시 */}
        {isSemanticMode && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="w-3 h-3" />
            <span>검색 범위:</span>
            <div className="flex items-center gap-1">
              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                selectedFolderId && selectedFolderId.includes('-') 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {selectedFolderId && selectedFolderId.includes('-') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onClearSearchScope}
                    className="h-3 w-3 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                    title="전체 프로젝트에서 검색"
                  >
                    <X className="w-2 h-2" />
                  </Button>
                )}
                <span>
                  {selectedFolderId && selectedFolderId.includes('-') 
                    ? getFolderDisplayName(selectedFolderId) 
                    : '전체 프로젝트'
                  }
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 필터 버튼 */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            필터
            {activeFiltersCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <Label>파일 형식</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {fileTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.fileTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({
                            ...prev,
                            fileTypes: [...prev.fileTypes, type]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            fileTypes: prev.fileTypes.filter(t => t !== type)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>등록일</Label>
              <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">오늘</SelectItem>
                  <SelectItem value="week">최근 일주일</SelectItem>
                  <SelectItem value="month">최근 한달</SelectItem>
                  <SelectItem value="quarter">최근 3개월</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>관련 Discipline</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {disciplines.map((discipline) => (
                  <div key={discipline} className="flex items-center space-x-2">
                    <Checkbox
                      id={discipline}
                      checked={filters.discipline.includes(discipline)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({
                            ...prev,
                            discipline: [...prev.discipline, discipline]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            discipline: prev.discipline.filter(d => d !== discipline)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={discipline} className="text-sm">{discipline}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* 뷰 모드 토글 */}
      <div className="flex border rounded-md">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('grid')}
          className="rounded-r-none"
        >
          <Grid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('list')}
          className="rounded-l-none"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>



      {/* 업로드 버튼 */}
      <Button onClick={onUploadClick} className="bg-primary text-primary-foreground">
        <Upload className="w-4 h-4 mr-2" />
        파일 업로드
      </Button>

    </div>
  );
}