import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';
import { 
  ArrowLeft, 
  Check, 
  X, 
  Link2, 
  Unlink,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  Save,
  ZoomIn,
  ZoomOut,
  Move,
  RotateCw,
  Maximize,
  Home,
  BookOpen
} from 'lucide-react';
import { useAutoHideScrollbar } from './useAutoHideScrollbar';
import type { LegendDrawing, RecognizedSymbol, RecognizedText, SymbolMatch } from '../types/app';

interface LegendMatchingViewProps {
  onBack: () => void;
  onSymbolsAdd: (matches: SymbolMatch[]) => void;
  onSymbolLibraryBack?: () => void;
}

export function LegendMatchingView({ onBack, onSymbolsAdd, onSymbolLibraryBack }: LegendMatchingViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLegend, setSelectedLegend] = useState<LegendDrawing | null>(null);
  const [matches, setMatches] = useState<SymbolMatch[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<RecognizedSymbol | null>(null);
  const [selectedText, setSelectedText] = useState<RecognizedText | null>(null);
  const [showSymbols, setShowSymbols] = useState(true);
  const [showTexts, setShowTexts] = useState(true);
  const [showMatched, setShowMatched] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // 개별 패널 자동 숨김 스크롤바 훅
  const leftPanelScrollbar = useAutoHideScrollbar(2000);
  const rightPanelScrollbar = useAutoHideScrollbar(2000);

  // 샘플 레전드 도면 데이터
  const sampleLegendDrawings: LegendDrawing[] = [
    {
      id: 'legend-001',
      name: 'P&ID Legend - Valves',
      imageUrl: '/legend-valves.png', // 실제로는 업로드된 이미지
      width: 800,
      height: 600,
      symbols: [
        {
          id: 'sym-001',
          x: 50, y: 50, width: 40, height: 30,
          shape: 'M50,50 L90,50 M70,40 L70,60 M60,45 L80,55 M60,55 L80,45',
          confidence: 0.95
        },
        {
          id: 'sym-002', 
          x: 50, y: 120, width: 40, height: 30,
          shape: 'M50,120 L90,120 M70,110 L70,130 M65,115 L75,115 M65,125 L75,125',
          confidence: 0.92
        },
        {
          id: 'sym-003',
          x: 50, y: 190, width: 40, height: 30,
          shape: 'M50,190 L90,190 M70,180 L70,200 circle(70,190,8)',
          confidence: 0.88
        }
      ],
      texts: [
        {
          id: 'txt-001',
          x: 100, y: 55, width: 80, height: 20,
          text: 'Gate Valve',
          confidence: 0.96
        },
        {
          id: 'txt-002',
          x: 100, y: 125, width: 80, height: 20,
          text: 'Globe Valve',
          confidence: 0.94
        },
        {
          id: 'txt-003',
          x: 100, y: 195, width: 80, height: 20,
          text: 'Ball Valve',
          confidence: 0.91
        }
      ]
    },
    {
      id: 'legend-002',
      name: 'P&ID Legend - Pumps & Compressors',
      imageUrl: '/legend-pumps.png',
      width: 800,
      height: 600,
      symbols: [
        {
          id: 'sym-004',
          x: 50, y: 50, width: 60, height: 40,
          shape: 'circle(80,70,25) M55,70 L105,70 M70,55 L90,85 M90,55 L70,85',
          confidence: 0.93
        },
        {
          id: 'sym-005',
          x: 50, y: 120, width: 60, height: 40,
          shape: 'circle(80,140,25) M55,140 L105,140 M75,125 L85,155',
          confidence: 0.91
        }
      ],
      texts: [
        {
          id: 'txt-004',
          x: 120, y: 65, width: 120, height: 20,
          text: 'Centrifugal Pump',
          confidence: 0.95
        },
        {
          id: 'txt-005',
          x: 120, y: 135, width: 120, height: 20,
          text: 'Reciprocating Pump',
          confidence: 0.93
        }
      ]
    }
  ];

  const [availableDrawings] = useState(sampleLegendDrawings);

  useEffect(() => {
    if (selectedLegend && canvasRef.current) {
      drawLegend();
    }
  }, [selectedLegend, showSymbols, showTexts, showMatched, zoom, pan]);

  // 캔버스 크기 조정
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const rect = container.getBoundingClientRect();
          setCanvasSize({
            width: Math.floor(rect.width),
            height: Math.floor(rect.height)
          });
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const drawLegend = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedLegend) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 업데이트
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 이미지 그리기 (실제로는 이미지 로드)
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 줌과 팬 적용
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // 심볼 그리기
    if (showSymbols) {
      selectedLegend.symbols.forEach(symbol => {
        const isMatched = matches.some(m => m.symbolId === symbol.id);
        const isSelected = selectedSymbol?.id === symbol.id;
        
        if (!showMatched && isMatched) return;

        ctx.strokeStyle = isSelected ? '#3b82f6' : isMatched ? '#10b981' : '#6b7280';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.1)' : isMatched ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)';
        
        // 심볼 영역 표시
        ctx.fillRect(symbol.x, symbol.y, symbol.width, symbol.height);
        ctx.strokeRect(symbol.x, symbol.y, symbol.width, symbol.height);
        
        // 신뢰도 표시
        ctx.fillStyle = '#374151';
        ctx.font = '10px Inter';
        ctx.fillText(`${Math.round(symbol.confidence * 100)}%`, symbol.x, symbol.y - 5);
      });
    }

    // 텍스트 그리기
    if (showTexts) {
      selectedLegend.texts.forEach(text => {
        const isMatched = matches.some(m => m.textId === text.id);
        const isSelected = selectedText?.id === text.id;
        
        if (!showMatched && isMatched) return;

        ctx.strokeStyle = isSelected ? '#f59e0b' : isMatched ? '#10b981' : '#6b7280';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.fillStyle = isSelected ? 'rgba(245, 158, 11, 0.1)' : isMatched ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)';
        
        // 텍스트 영역 표시
        ctx.fillRect(text.x, text.y, text.width, text.height);
        ctx.strokeRect(text.x, text.y, text.width, text.height);
        
        // 텍스트 내용 표시
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.fillText(text.text, text.x + 2, text.y + 14);
        
        // 신뢰도 표시
        ctx.font = '10px Inter';
        ctx.fillText(`${Math.round(text.confidence * 100)}%`, text.x, text.y - 5);
      });
    }

    // 매칭 연결선 그리기
    matches.forEach(match => {
      const symbol = selectedLegend.symbols.find(s => s.id === match.symbolId);
      const text = selectedLegend.texts.find(t => t.id === match.textId);
      
      if (symbol && text && showMatched) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        const symbolCenterX = symbol.x + symbol.width / 2;
        const symbolCenterY = symbol.y + symbol.height / 2;
        const textCenterX = text.x + text.width / 2;
        const textCenterY = text.y + text.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(symbolCenterX, symbolCenterY);
        ctx.lineTo(textCenterX, textCenterY);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    ctx.restore();
  };

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x * zoom) / zoom;
    const y = (event.clientY - rect.top - pan.y * zoom) / zoom;
    return { x, y };
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedLegend || isDragging) return;

    const { x, y } = getCanvasCoordinates(event);

    // 심볼 클릭 확인
    const clickedSymbol = selectedLegend.symbols.find(symbol => 
      x >= symbol.x && x <= symbol.x + symbol.width &&
      y >= symbol.y && y <= symbol.y + symbol.height
    );

    // 텍스트 클릭 확인
    const clickedText = selectedLegend.texts.find(text => 
      x >= text.x && x <= text.x + text.width &&
      y >= text.y && y <= text.y + text.height
    );

    if (clickedSymbol) {
      setSelectedSymbol(selectedSymbol?.id === clickedSymbol.id ? null : clickedSymbol);
      setSelectedText(null);
    } else if (clickedText) {
      setSelectedText(selectedText?.id === clickedText.id ? null : clickedText);
      setSelectedSymbol(null);
    } else {
      setSelectedSymbol(null);
      setSelectedText(null);
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 0) { // 좌클릭만
      setIsDragging(true);
      setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const newPan = {
        x: event.clientX - dragStart.x,
        y: event.clientY - dragStart.y
      };
      setPan(newPan);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
    
    // 마우스 포인터를 중심으로 줌
    const scale = newZoom / zoom;
    setPan(prev => ({
      x: mouseX - (mouseX - prev.x) * scale,
      y: mouseY - (mouseY - prev.y) * scale
    }));
    
    setZoom(newZoom);
  };

  const handleCreateMatch = () => {
    if (!selectedSymbol || !selectedText) return;

    const newMatch: SymbolMatch = {
      symbolId: selectedSymbol.id,
      textId: selectedText.id,
      symbolName: selectedText.text,
      category: 'valves', // 기본값, 나중에 선택 가능하도록
      subcategory: 'shutoff',
      description: `${selectedText.text} 심볼`,
      tags: [selectedText.text.toLowerCase().replace(/\s+/g, '-')]
    };

    setMatches(prev => [...prev, newMatch]);
    setSelectedSymbol(null);
    setSelectedText(null);
  };

  const handleRemoveMatch = (symbolId: string, textId: string) => {
    setMatches(prev => prev.filter(m => !(m.symbolId === symbolId && m.textId === textId)));
  };

  const handleSaveSymbols = () => {
    if (matches.length === 0) {
      alert('매칭된 심볼이 없습니다.');
      return;
    }

    onSymbolsAdd(matches);
    alert(`${matches.length}개의 심볼이 라이브러리에 추가되었습니다.`);
    onBack();
  };

  const resetMatching = () => {
    setMatches([]);
    setSelectedSymbol(null);
    setSelectedText(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(5, prev * 1.2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.1, prev / 1.2));
  };

  const handleFitToView = () => {
    if (!selectedLegend || !canvasRef.current) return;
    
    const padding = 50;
    const scaleX = (canvasSize.width - padding * 2) / selectedLegend.width;
    const scaleY = (canvasSize.height - padding * 2) / selectedLegend.height;
    const scale = Math.min(scaleX, scaleY, 1);
    
    setZoom(scale);
    setPan({
      x: (canvasSize.width - selectedLegend.width * scale) / 2,
      y: (canvasSize.height - selectedLegend.height * scale) / 2
    });
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm h-20 px-[21px] py-[10px]">
        <div className="flex items-center gap-4 flex-nowrap min-w-0">
          <Breadcrumb className="flex-shrink-0">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={onBack}
                  className="cursor-pointer flex items-center gap-1.5 breadcrumb-link hover:text-blue-600 whitespace-nowrap"
                >
                  <Home className="w-4 h-4 breadcrumb-icon breadcrumb-icon-inactive breadcrumb-icon-home" />
                  Meta-Drawing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={onSymbolLibraryBack}
                  className="flex items-center gap-1.5 breadcrumb-link hover:text-blue-600 cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  심볼 라이브러리
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5 text-slate-700 font-semibold whitespace-nowrap">
                  <Link2 className="w-4 h-4 text-blue-600" />
                  레전드 심볼 매칭
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-slate-600 text-sm ml-2 whitespace-nowrap flex-shrink-0">
            심볼과 텍스트를 매칭하여 새로운 심볼을 라이브러리에 추가하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={resetMatching}
            className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            초기화
          </Button>
          <Button 
            onClick={handleSaveSymbols} 
            disabled={matches.length === 0}
            className="bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            심볼 추가 ({matches.length}개)
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex gap-6 p-6 min-h-0">
        {/* 좌측: 레전드 선택 및 컨트롤 */}
        <div 
          ref={leftPanelScrollbar.elementRef}
          className={`w-64 flex flex-col gap-4 min-h-0 auto-hide-scrollbar overflow-y-auto pr-2 ${leftPanelScrollbar.scrollbarClass}`}
        >
          {/* 레전드 선택 */}
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-800">레전드 도면 선택</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Select value={selectedLegend?.id || ''} onValueChange={(value) => {
                const legend = availableDrawings.find(d => d.id === value);
                setSelectedLegend(legend || null);
                resetMatching();
              }}>
                <SelectTrigger className="bg-white/90 border-slate-200">
                  <SelectValue placeholder="레전드 도면을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-slate-200">
                  {availableDrawings.map(drawing => (
                    <SelectItem key={drawing.id} value={drawing.id}>
                      {drawing.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Download className="w-4 h-4 mr-2" />
                새 레전드 업로드
              </Button>
            </CardContent>
          </Card>

          {/* 뷰어 컨트롤 */}
          {selectedLegend && (
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-800">뷰어 컨트롤</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={showSymbols ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowSymbols(!showSymbols)}
                    className={showSymbols ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50'}
                  >
                    {showSymbols ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    심볼
                  </Button>
                  <Button
                    variant={showTexts ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowTexts(!showTexts)}
                    className={showTexts ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50'}
                  >
                    {showTexts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    텍스트
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={showMatched ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowMatched(!showMatched)}
                    className={showMatched ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50'}
                  >
                    매칭됨
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 선택된 요소 정보 */}
          {(selectedSymbol || selectedText) && (
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-800">선택된 요소</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedSymbol && (
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/80 backdrop-blur-sm">
                    <p className="text-xs text-slate-600 font-medium">심볼</p>
                    <p className="font-semibold text-slate-800">ID: {selectedSymbol.id}</p>
                    <p className="text-sm text-slate-600">신뢰도: {Math.round(selectedSymbol.confidence * 100)}%</p>
                  </div>
                )}
                
                {selectedText && (
                  <div className="p-3 border border-amber-200 rounded-lg bg-amber-50/80 backdrop-blur-sm">
                    <p className="text-xs text-slate-600 font-medium">텍스트</p>
                    <p className="font-semibold text-slate-800">{selectedText.text}</p>
                    <p className="text-sm text-slate-600">신뢰도: {Math.round(selectedText.confidence * 100)}%</p>
                  </div>
                )}
                
                {selectedSymbol && selectedText && (
                  <Button 
                    onClick={handleCreateMatch} 
                    className="w-full bg-slate-800 text-white hover:bg-slate-900"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    매칭 생성
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* 사용법 안내 */}
          <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-slate-800">사용법</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 space-y-2 leading-relaxed">
              <p>1. 레전드 도면을 선택하세요</p>
              <p>2. 파란색 영역(심볼)을 클릭하세요</p>
              <p>3. 노란색 영역(텍스트)을 클릭하세요</p>
              <p>4. "매칭 생성" 버튼을 눌러 연결하세요</p>
              <p>5. 모든 매칭 완료 후 "심볼 추가"를 눌러 저장하세요</p>
            </CardContent>
          </Card>
        </div>

        {/* 중앙: 캔버스 뷰어 */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
            {/* 캔버스 도구 모음 */}
            {selectedLegend && (
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                    {Math.round(zoom * 100)}%
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
                    {selectedLegend.width} × {selectedLegend.height}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleZoomOut}
                    className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleZoomIn}
                    className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleFitToView}
                    className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleResetView}
                    className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex-1 bg-slate-50/50 rounded-b-xl overflow-hidden">
              {selectedLegend ? (
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                  onWheel={handleCanvasWheel}
                  className={`w-full h-full bg-slate-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  style={{ maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Link2 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="font-semibold text-slate-700 mb-2">레전드 도면을 선택하세요</p>
                    <p className="text-sm mt-1">좌측에서 인식된 레전드 도면을 선택하면</p>
                    <p className="text-sm">심볼과 텍스트 영역이 표시됩니다</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 매칭 결과 */}
        <div 
          ref={rightPanelScrollbar.elementRef}
          className={`w-64 flex flex-col gap-4 min-h-0 auto-hide-scrollbar overflow-y-auto pr-2 ${rightPanelScrollbar.scrollbarClass}`}
        >
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-slate-800 flex items-center justify-between">
                  매칭 결과
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">{matches.length}개</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {matches.length === 0 ? (
                    <div className="text-center text-slate-500 py-8">
                      <p className="text-sm font-medium">아직 매칭된 심볼이 없습니다</p>
                      <p className="text-xs mt-1 text-slate-400">좌측 캔버스에서 심볼과 텍스트를 선택하여 매칭하세요</p>
                    </div>
                  ) : (
                    matches.map((match, index) => {
                      const symbol = selectedLegend?.symbols.find(s => s.id === match.symbolId);
                      const text = selectedLegend?.texts.find(t => t.id === match.textId);
                      
                      return (
                        <div key={`${match.symbolId}-${match.textId}`} className="p-3 border border-slate-200 rounded-lg space-y-2 bg-white/50 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-slate-800">{match.symbolName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMatch(match.symbolId, match.textId)}
                              className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-xs text-slate-600 space-y-1">
                            <p>심볼: {symbol?.confidence && Math.round(symbol.confidence * 100)}%</p>
                            <p>텍스트: {text?.confidence && Math.round(text.confidence * 100)}%</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {match.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 통계 정보 */}
            {selectedLegend && (
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-slate-800">통계</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">인식된 심볼:</span>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">{selectedLegend.symbols.length}개</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">인식된 텍스트:</span>
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">{selectedLegend.texts.length}개</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">매칭 완료:</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{matches.length}개</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">매칭 진행률:</span>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 font-semibold">
                      {selectedLegend.symbols.length > 0 
                        ? Math.round((matches.length / selectedLegend.symbols.length) * 100)
                        : 0}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}