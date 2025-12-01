import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';

import { Search, Plus, BookOpen, Download, Grid3X3, List, Star, ArrowLeft, Link2, Home } from 'lucide-react';
import type { SymbolMatch } from '../types/app';

interface SymbolItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  tags: string[];
  isFavorite?: boolean;
  isRecent?: boolean;
}

interface SymbolLibraryViewProps {
  onBack: () => void;
  onViewChange?: (view: string) => void;
}

export function SymbolLibraryView({ onBack, onViewChange }: SymbolLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [symbolLibrary, setSymbolLibrary] = useState<SymbolItem[]>([
    {
      id: 'pump-001',
      name: 'Centrifugal Pump',
      category: 'pumps',
      subcategory: 'centrifugal',
      description: '원심펌프 심볼',
      tags: ['pump', 'centrifugal', 'rotating'],
      isFavorite: true,
      isRecent: true
    },
    {
      id: 'valve-001',
      name: 'Gate Valve',
      category: 'valves',
      subcategory: 'shutoff',
      description: '게이트 밸브 심볼',
      tags: ['valve', 'gate', 'shutoff'],
      isFavorite: false,
      isRecent: true
    },
    {
      id: 'vessel-001',
      name: 'Horizontal Vessel',
      category: 'vessels',
      subcategory: 'pressure',
      description: '수평 압력용기 심볼',
      tags: ['vessel', 'horizontal', 'pressure'],
      isFavorite: true,
      isRecent: false
    },
    {
      id: 'he-001',
      name: 'Shell & Tube HX',
      category: 'heat-exchangers',
      subcategory: 'shell-tube',
      description: '쉘앤튜브 열교환기 심볼',
      tags: ['heat exchanger', 'shell', 'tube'],
      isFavorite: false,
      isRecent: true
    },
    {
      id: 'tank-001',
      name: 'Storage Tank',
      category: 'tanks',
      subcategory: 'atmospheric',
      description: '저장탱크 심볼',
      tags: ['tank', 'storage', 'atmospheric'],
      isFavorite: true,
      isRecent: false
    },
    {
      id: 'compressor-001',
      name: 'Centrifugal Compressor',
      category: 'compressors',
      subcategory: 'centrifugal',
      description: '원심압축기 심볼',
      tags: ['compressor', 'centrifugal', 'rotating'],
      isFavorite: false,
      isRecent: false
    }
  ]);



  const categories = [
    { id: 'all', name: '전체', count: symbolLibrary.length },
    { id: 'pumps', name: '펌프', count: symbolLibrary.filter(s => s.category === 'pumps').length },
    { id: 'valves', name: '밸브', count: symbolLibrary.filter(s => s.category === 'valves').length },
    { id: 'vessels', name: '압력용기', count: symbolLibrary.filter(s => s.category === 'vessels').length },
    { id: 'heat-exchangers', name: '열교환기', count: symbolLibrary.filter(s => s.category === 'heat-exchangers').length },
    { id: 'tanks', name: '탱크', count: symbolLibrary.filter(s => s.category === 'tanks').length },
    { id: 'compressors', name: '압축기', count: symbolLibrary.filter(s => s.category === 'compressors').length },
  ];

  const filteredSymbols = symbolLibrary.filter(symbol => {
    const matchesSearch = searchQuery === '' || 
      symbol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symbol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symbol.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || symbol.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const favoriteSymbols = symbolLibrary.filter(s => s.isFavorite);
  const recentSymbols = symbolLibrary.filter(s => s.isRecent);

  const handleSymbolAdd = (symbol: SymbolItem) => {
    console.log('Adding symbol to drawing:', symbol);
    alert(`"${symbol.name}" 심볼이 도면에 추가되었습니다.`);
  };

  const toggleFavorite = (symbolId: string) => {
    console.log('Toggle favorite:', symbolId);
    // 실제 구현에서는 상태 업데이트
  };

  const handleDownloadSymbol = (symbol: SymbolItem) => {
    console.log('Download symbol:', symbol);
    alert(`"${symbol.name}" 심볼을 다운로드합니다.`);
  };

  const handleSymbolsAdd = (matches: SymbolMatch[]) => {
    const newSymbols: SymbolItem[] = matches.map((match, index) => ({
      id: `symbol-${Date.now()}-${index}`,
      name: match.symbolName,
      category: match.category,
      subcategory: match.subcategory,
      description: match.description || `${match.symbolName} 심볼`,
      tags: match.tags,
      isFavorite: false,
      isRecent: true
    }));

    setSymbolLibrary(prev => [...prev, ...newSymbols]);
    console.log('New symbols added:', newSymbols);
  };

  const renderSymbolGrid = (symbols: SymbolItem[]) => (
    <div className="grid grid-cols-3 gap-4">
      {symbols.map(symbol => (
        <div key={symbol.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-modern-lg hover:border-slate-300 transition-all duration-300 cursor-pointer group hover-lift">
          {/* 심볼 미리보기 영역 */}
          <div className="h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg mb-3 flex items-center justify-center relative border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-xs">
                {symbol.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
              </span>
            </div>
            
            {/* 액션 버튼들 */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
              <Button
                variant="secondary"
                size="sm"
                className="h-6 w-6 p-0 bg-white/95 hover:bg-white shadow-sm border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(symbol.id);
                }}
              >
                <Star className={`w-3 h-3 ${symbol.isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-slate-500'}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="h-6 w-6 p-0 bg-white/95 hover:bg-white shadow-sm border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadSymbol(symbol);
                }}
              >
                <Download className="w-3 h-3 text-slate-600" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm text-slate-800 mb-1">{symbol.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{symbol.description}</p>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {symbol.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">
                  {tag}
                </Badge>
              ))}
            </div>

            <Button 
              size="sm" 
              variant="outline"
              className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
              onClick={() => handleSymbolAdd(symbol)}
            >
              <Plus className="w-3 h-3 mr-1" />
              추가
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSymbolList = (symbols: SymbolItem[]) => (
    <div className="space-y-3">
      {symbols.map(symbol => (
        <div key={symbol.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-modern-lg hover:border-slate-300 transition-all duration-300 cursor-pointer group hover-lift flex items-center gap-4">
          {/* 심볼 미리보기 */}
          <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 rounded-md flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {symbol.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            </div>
          </div>

          {/* 심볼 정보 */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-slate-800 mb-1">{symbol.name}</h4>
            <p className="text-xs text-slate-500 mb-2 leading-relaxed">{symbol.description}</p>
            <div className="flex flex-wrap gap-1">
              {symbol.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-slate-50 hover:bg-slate-100 border-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(symbol.id);
              }}
            >
              <Star className={`w-4 h-4 ${symbol.isFavorite ? 'fill-yellow-400 text-yellow-500' : 'text-slate-500'}`} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-slate-50 hover:bg-slate-100 border-slate-200"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadSymbol(symbol);
              }}
            >
              <Download className="w-4 h-4 text-slate-600" />
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900"
              onClick={() => handleSymbolAdd(symbol)}
            >
              <Plus className="w-4 h-4 mr-1" />
              추가
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm h-[50px]">
        <div className="flex items-center gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={onBack}
                  className="cursor-pointer flex items-center gap-1.5 breadcrumb-link hover:text-slate-700"
                >
                  <Home className="w-4 h-4 breadcrumb-icon breadcrumb-icon-inactive breadcrumb-icon-home" />
                  Meta-Drawing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                  심볼 라이브러리
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-slate-600 text-sm ml-2">
            설계에 필요한 다양한 심볼을 검색하고 도면에 추가할 수 있습니다.
          </p>
        </div>
        <Button 
          variant="outline"
          className="bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
          onClick={() => onViewChange?.('legendMatching')}
        >
          <Link2 className="w-4 h-4 mr-2" />
          레전드에서 심볼 추가
        </Button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex gap-6 p-6 min-h-0">
        {/* 좌측 카테고리 */}
        <div className="w-64 flex flex-col">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-4 text-base">카테고리</h3>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className={`w-full justify-start rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id 
                        ? 'bg-slate-800 text-white shadow-md hover:bg-slate-900' 
                        : 'hover:bg-slate-50 hover:text-slate-900 text-slate-700'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="flex-1 text-left font-medium">{category.name}</span>
                    <Badge 
                      variant={selectedCategory === category.id ? 'secondary' : 'outline'} 
                      className={`text-xs ${
                        selectedCategory === category.id 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* 우측 심볼 목록 */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-200 h-full flex flex-col">
            {/* 검색 및 도구 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="심볼 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-white/80 border-slate-200 focus:border-slate-400 focus:ring-slate-200"
                  />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200">
                  {filteredSymbols.length}개 심볼
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  className={viewMode === 'grid' ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'hover:bg-slate-50 hover:text-slate-900 border-slate-200'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  className={viewMode === 'list' ? 'bg-slate-800 hover:bg-slate-900 text-white' : 'hover:bg-slate-50 hover:text-slate-900 border-slate-200'}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 탭 및 심볼 목록 */}
            <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/80 border border-slate-200">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm font-medium"
                >
                  전체
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites" 
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm font-medium"
                >
                  즐겨찾기
                </TabsTrigger>
                <TabsTrigger 
                  value="recent" 
                  className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm font-medium"
                >
                  최근 사용
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0">
                <TabsContent value="all" className="h-full m-0">
                  <ScrollArea className="h-full">
                    <div className="pr-4">
                      {viewMode === 'grid' 
                        ? renderSymbolGrid(filteredSymbols)
                        : renderSymbolList(filteredSymbols)
                      }
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="favorites" className="h-full m-0">
                  <ScrollArea className="h-full">
                    <div className="pr-4">
                      {viewMode === 'grid' 
                        ? renderSymbolGrid(favoriteSymbols)
                        : renderSymbolList(favoriteSymbols)
                      }
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="recent" className="h-full m-0">
                  <ScrollArea className="h-full">
                    <div className="pr-4">
                      {viewMode === 'grid' 
                        ? renderSymbolGrid(recentSymbols)
                        : renderSymbolList(recentSymbols)
                      }
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>


    </div>
  );
}