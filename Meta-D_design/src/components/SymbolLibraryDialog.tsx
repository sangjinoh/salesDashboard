import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Plus, BookOpen, Download, Grid3X3, List, Star } from 'lucide-react';

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

interface SymbolLibraryDialogProps {
  onClose: () => void;
}

export function SymbolLibraryDialog({ onClose }: SymbolLibraryDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const symbolLibrary: SymbolItem[] = [
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
  ];

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
    onClose();
  };

  const toggleFavorite = (symbolId: string) => {
    console.log('Toggle favorite:', symbolId);
    // 실제 구현에서는 상태 업데이트
  };

  const handleDownloadSymbol = (symbol: SymbolItem) => {
    console.log('Download symbol:', symbol);
    alert(`"${symbol.name}" 심볼을 다운로드합니다.`);
  };

  const renderSymbolGrid = (symbols: SymbolItem[]) => (
    <div className="grid grid-cols-3 gap-4">
      {symbols.map(symbol => (
        <div key={symbol.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group">
          {/* 심볼 미리보기 영역 */}
          <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center relative">
            <div className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {symbol.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
              </span>
            </div>
            
            {/* 액션 버튼들 */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(symbol.id);
                }}
              >
                <Star className={`w-3 h-3 ${symbol.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadSymbol(symbol);
                }}
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">{symbol.name}</h4>
            <p className="text-xs text-muted-foreground">{symbol.description}</p>
            
            <div className="flex flex-wrap gap-1">
              {symbol.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <Button 
              size="sm" 
              className="w-full"
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
    <div className="space-y-2">
      {symbols.map(symbol => (
        <div key={symbol.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group flex items-center gap-3">
          {/* 심볼 미리보기 */}
          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium">
              {symbol.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
          </div>

          {/* 심볼 정보 */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{symbol.name}</h4>
            <p className="text-xs text-muted-foreground">{symbol.description}</p>
            <div className="flex gap-1 mt-1">
              {symbol.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(symbol.id);
              }}
            >
              <Star className={`w-4 h-4 ${symbol.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadSymbol(symbol);
              }}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button 
              size="sm"
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] h-[800px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            심볼 라이브러리
          </DialogTitle>
          <DialogDescription>
            설계에 필요한 다양한 심볼을 검색하고 도면에 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-1 min-h-0">
          {/* 좌측 카테고리 */}
          <div className="w-48 flex flex-col">
            <h3 className="font-medium text-sm mb-2">카테고리</h3>
            <ScrollArea className="flex-1">
              <div className="space-y-1">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="flex-1 text-left">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* 우측 심볼 목록 */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* 검색 및 도구 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="심볼 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Badge variant="outline">
                  {filteredSymbols.length}개 심볼
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 탭 및 심볼 목록 */}
            <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="favorites">즐겨찾기</TabsTrigger>
                <TabsTrigger value="recent">최근 사용</TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 mt-4">
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
      </DialogContent>
    </Dialog>
  );
}