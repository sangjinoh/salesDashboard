import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Save
} from 'lucide-react';
import type { LegendDrawing, RecognizedSymbol, RecognizedText, SymbolMatch } from '../types/app';

interface LegendMatchingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSymbolsAdd: (matches: SymbolMatch[]) => void;
}

export function LegendMatchingDialog({ isOpen, onClose, onSymbolsAdd }: LegendMatchingDialogProps) {
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
    }
  ];

  const [availableDrawings] = useState(sampleLegendDrawings);

  useEffect(() => {
    if (selectedLegend && canvasRef.current) {
      drawLegend();
    }
  }, [selectedLegend, showSymbols, showTexts, showMatched, zoom, pan]);

  const drawLegend = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedLegend) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedLegend || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - pan.x * zoom) / zoom;
    const y = (event.clientY - rect.top - pan.y * zoom) / zoom;

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
    onClose();
  };

  const resetMatching = () => {
    setMatches([]);
    setSelectedSymbol(null);
    setSelectedText(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] h-[900px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            레전드 심볼 매칭
          </DialogTitle>
          <DialogDescription>
            인식된 레전드 도면에서 심볼과 텍스트를 매칭하여 새로운 심볼을 라이브러리에 추가하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* 좌측: 레전드 선택 및 컨트롤 */}
          <div className="w-80 flex flex-col gap-4">
            {/* 레전드 선택 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">레전드 도면 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={selectedLegend?.id || ''} onValueChange={(value) => {
                  const legend = availableDrawings.find(d => d.id === value);
                  setSelectedLegend(legend || null);
                  resetMatching();
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="레전드 도면을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrawings.map(drawing => (
                      <SelectItem key={drawing.id} value={drawing.id}>
                        {drawing.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  새 레전드 업로드
                </Button>
              </CardContent>
            </Card>

            {/* 뷰어 컨트롤 */}
            {selectedLegend && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">뷰어 컨트롤</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant={showSymbols ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowSymbols(!showSymbols)}
                    >
                      {showSymbols ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      심볼
                    </Button>
                    <Button
                      variant={showTexts ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowTexts(!showTexts)}
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
                    >
                      매칭됨
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetMatching}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>줌: {Math.round(zoom * 100)}%</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>-</Button>
                      <Button variant="outline" size="sm" onClick={() => setZoom(1)}>100%</Button>
                      <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom + 0.1))}>+</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 선택된 요소 정보 */}
            {(selectedSymbol || selectedText) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">선택된 요소</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedSymbol && (
                    <div className="p-2 border rounded bg-blue-50">
                      <p className="text-xs text-muted-foreground">심볼</p>
                      <p className="font-medium">ID: {selectedSymbol.id}</p>
                      <p className="text-sm">신뢰도: {Math.round(selectedSymbol.confidence * 100)}%</p>
                    </div>
                  )}
                  
                  {selectedText && (
                    <div className="p-2 border rounded bg-amber-50">
                      <p className="text-xs text-muted-foreground">텍스트</p>
                      <p className="font-medium">{selectedText.text}</p>
                      <p className="text-sm">신뢰도: {Math.round(selectedText.confidence * 100)}%</p>
                    </div>
                  )}
                  
                  {selectedSymbol && selectedText && (
                    <Button onClick={handleCreateMatch} className="w-full">
                      <Link2 className="w-4 h-4 mr-2" />
                      매칭 생성
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* 중앙: 캔버스 뷰어 */}
          <div className="flex-1 flex flex-col border rounded-lg">
            {selectedLegend ? (
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={handleCanvasClick}
                className="w-full h-full cursor-crosshair bg-gray-50"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                레전드 도면을 선택하세요
              </div>
            )}
          </div>

          {/* 우측: 매칭 결과 */}
          <div className="w-80 flex flex-col gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  매칭 결과
                  <Badge variant="outline">{matches.length}개</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {matches.map((match, index) => {
                      const symbol = selectedLegend?.symbols.find(s => s.id === match.symbolId);
                      const text = selectedLegend?.texts.find(t => t.id === match.textId);
                      
                      return (
                        <div key={`${match.symbolId}-${match.textId}`} className="p-3 border rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{match.symbolName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMatch(match.symbolId, match.textId)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            <p>심볼: {symbol?.confidence && Math.round(symbol.confidence * 100)}%</p>
                            <p>텍스트: {text?.confidence && Math.round(text.confidence * 100)}%</p>
                          </div>
                          
                          <div className="flex gap-1">
                            {match.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* 하단 액션 버튼 */}
            <div className="space-y-2">
              <Button onClick={handleSaveSymbols} className="w-full" disabled={matches.length === 0}>
                <Save className="w-4 h-4 mr-2" />
                심볼 라이브러리에 추가 ({matches.length}개)
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full">
                취소
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}