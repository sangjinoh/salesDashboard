import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Play, Pause, Undo, Redo, Plus, Edit3, Trash2, Layers, Eye, EyeOff } from 'lucide-react';
import { LayerControlPanel, type LayerConfiguration } from '../LayerControlPanel';
import drawingImage from 'figma:asset/02b3c107c65bd06c55d4a537f9aa120a0d3ec3cb.png';

interface DrawingObject {
  id: string;
  type: 'symbol' | 'text' | 'line' | 'equipment';
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  confidence: number;
  properties: Record<string, any>;
  isHighlighted?: boolean;
  isSelected?: boolean;
}

interface DrawingViewerProps {
  selectedDrawingId?: string;
  selectedObjectId?: string;
  onObjectSelect: (objectId: string | null) => void;
  onObjectsHighlight: (objectIds: string[]) => void;
  className?: string;
  onLayerChange?: (config: LayerConfiguration) => void;
}

// 편집 모드 타입 정의
type EditMode = 'select' | 'add' | 'edit' | 'delete' | null;

export function DrawingViewer({ 
  selectedDrawingId, 
  selectedObjectId, 
  onObjectSelect, 
  onObjectsHighlight,
  className = '',
  onLayerChange
}: DrawingViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [layerConfig, setLayerConfig] = useState<LayerConfiguration>({
    symbols: { visible: true, valve: true, fitting: true, ci: true, equipment: true, etc: true },
    texts: { visible: true, lineNo: true, tagNo: true, ciNo: true, etc: true },
    lines: { visible: true }
  });

  const viewerRef = useRef<HTMLDivElement>(null);

  // Mock drawing objects - P&ID 도면에 맞게 위치 조정
  const [drawingObjects, setDrawingObjects] = useState<DrawingObject[]>([
    {
      id: 'obj-1',
      type: 'equipment',
      name: 'Butane Storage Tank V-4625',
      x: 150,
      y: 200,
      width: 100,
      height: 80,
      confidence: 0.95,
      properties: { tag: 'V-4625', type: 'Storage Tank', material: 'CS' }
    },
    {
      id: 'obj-2', 
      type: 'equipment',
      name: 'Butane/Propane Loading Pump P-4737',
      x: 650,
      y: 180,
      width: 60,
      height: 60,
      confidence: 0.88,
      properties: { tag: 'P-4737', type: 'Centrifugal', flow: '100 m³/h' }
    },
    {
      id: 'obj-3',
      type: 'text',
      name: 'Process Line Tag',
      x: 400,
      y: 250,
      confidence: 0.92,
      properties: { text: 'Butane Process Line', fontSize: 12 }
    },
    {
      id: 'obj-4',
      type: 'line',
      name: 'Main Process Line',
      x: 250,
      y: 240,
      width: 350,
      height: 4,
      confidence: 0.85,
      properties: { lineType: 'process', diameter: '8"' }
    }
  ]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 400));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 25));
  const handleZoomReset = () => setZoomLevel(100);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // 분석 진행 시뮬레이션
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleObjectClick = (objectId: string) => {
    onObjectSelect(objectId === selectedObjectId ? null : objectId);
  };

  const getObjectStyle = (obj: DrawingObject) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${obj.x}px`,
      top: `${obj.y}px`,
      width: obj.width ? `${obj.width}px` : 'auto',
      height: obj.height ? `${obj.height}px` : 'auto',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    };

    if (obj.isSelected || selectedObjectId === obj.id) {
      return {
        ...baseStyle,
        border: '2px solid #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '4px'
      };
    }

    if (obj.isHighlighted) {
      return {
        ...baseStyle,
        border: '2px solid #10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderRadius: '4px'
      };
    }

    return {
      ...baseStyle,
      border: '1px solid transparent',
      borderRadius: '4px'
    };
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge variant="default" className="text-xs">높음</Badge>;
    if (confidence >= 0.7) return <Badge variant="secondary" className="text-xs">보통</Badge>;
    return <Badge variant="destructive" className="text-xs">낮음</Badge>;
  };

  const handleLayerChange = (newConfig: LayerConfiguration) => {
    setLayerConfig(newConfig);
    onLayerChange?.(newConfig);
    console.log('Layer configuration changed:', newConfig);
  };

  const getVisibleLayersCount = () => {
    let count = 0;
    if (layerConfig.symbols.visible) count++;
    if (layerConfig.texts.visible) count++;
    if (layerConfig.lines.visible) count++;
    return count;
  };

  const handleQuickToggleAll = () => {
    const allVisible = layerConfig.symbols.visible && layerConfig.texts.visible && layerConfig.lines.visible;
    
    const newConfig: LayerConfiguration = {
      symbols: {
        visible: !allVisible,
        valve: !allVisible,
        fitting: !allVisible,
        ci: !allVisible,
        equipment: !allVisible,
        etc: !allVisible
      },
      texts: {
        visible: !allVisible,
        lineNo: !allVisible,
        tagNo: !allVisible,
        ciNo: !allVisible,
        etc: !allVisible
      },
      lines: {
        visible: !allVisible
      }
    };
    
    handleLayerChange(newConfig);
  };

  // 편집 모드 변경 핸들러
  const handleEditModeChange = (mode: EditMode) => {
    setEditMode(prevMode => prevMode === mode ? null : mode);
  };

  // 편집 모드에 따른 커서 스타일 반환
  const getCursorStyle = (): string => {
    switch (editMode) {
      case 'add':
        return 'cursor-add';
      case 'edit':
        return 'cursor-edit';
      case 'delete':
        return 'cursor-delete';
      case 'select':
      default:
        return 'cursor-select';
    }
  };

  return (
    <div className={`flex flex-col bg-gray-50 ${className}`}>
      {/* 뷰 컨트롤 바 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-4 py-3 shadow-sm h-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* 편집 도구 그룹 */}
            <div className="flex items-center gap-1 bg-slate-50/80 rounded-lg px-3 py-1 border border-slate-200 shadow-sm">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 text-slate-600 hover:text-slate-800">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 text-slate-600 hover:text-slate-800">
                <Redo className="w-4 h-4" />
              </Button>
              <div className="w-px h-5 bg-slate-300 mx-2" />
              <Button 
                variant={editMode === 'add' ? 'default' : 'ghost'} 
                size="sm" 
                className={`h-8 text-sm transition-all duration-200 px-3 ${
                  editMode === 'add' 
                    ? 'bg-slate-800 text-white hover:bg-slate-900 edit-mode-active shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
                onClick={() => handleEditModeChange('add')}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                추가
              </Button>
              <Button 
                variant={editMode === 'edit' ? 'default' : 'ghost'} 
                size="sm" 
                className={`h-8 text-sm transition-all duration-200 px-3 ${
                  editMode === 'edit' 
                    ? 'bg-slate-800 text-white hover:bg-slate-900 edit-mode-active shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
                onClick={() => handleEditModeChange('edit')}
              >
                <Edit3 className="w-4 h-4 mr-1.5" />
                편집
              </Button>
              <Button 
                variant={editMode === 'delete' ? 'default' : 'ghost'} 
                size="sm" 
                className={`h-8 text-sm transition-all duration-200 px-3 ${
                  editMode === 'delete' 
                    ? 'bg-slate-800 text-white hover:bg-slate-900 edit-mode-active shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
                onClick={() => handleEditModeChange('delete')}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                삭제
              </Button>
            </div>

            {/* 뷰/레이어 관리 그룹 */}
            <div className="flex items-center gap-1 bg-slate-50/80 rounded-lg px-3 py-1 border border-slate-200 shadow-sm">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowLayerControl(true)}
                className="h-8 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-3"
              >
                <Layers className="w-4 h-4 mr-1.5" />
                레이어 관리
                <Badge variant="secondary" className="ml-2 text-xs bg-slate-200 text-slate-700">
                  {getVisibleLayersCount()}/3
                </Badge>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleQuickToggleAll}
                className="h-8 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-800 px-3"
              >
                {getVisibleLayersCount() === 3 ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1.5" />
                    모두 숨김
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1.5" />
                    모두 표시
                  </>
                )}
              </Button>
            </div>

            {/* AI 분석 그룹 */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="h-8 text-sm bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-3"
              >
                {isAnalyzing ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
                {isAnalyzing ? 'AI 분석 중...' : 'AI 재분석'}
              </Button>
              {isAnalyzing && (
                <div className="flex items-center gap-2">
                  <Progress value={analysisProgress} className="w-32 h-2" />
                  <span className="text-sm text-slate-600 font-medium">{analysisProgress}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-sm bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-3"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              새로고침
            </Button>
          </div>
        </div>
      </div>

      {/* 도면 뷰어 영역 */}
      <div className={`flex-1 relative overflow-auto bg-white m-2 rounded-lg border border-border shadow-sm ${getCursorStyle()}`}>
        <div
          ref={viewerRef}
          className="relative bg-white min-w-full min-h-full flex items-center justify-center"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center center'
          }}
        >
          {/* 배경 그리드 - 전체 컨테이너에 맞춤 */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #666 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* P&ID 도면 이미지 - 배경 그리드 영역과 동일한 크기 */}
          <div className={`relative ${getCursorStyle()}`} style={{ width: 'auto', height: 'auto' }}>
            <img 
              src={drawingImage} 
              alt="P&ID Drawing - Butane Storage and Loading System"
              className="block max-w-none"
              style={{
                width: 'auto',
                height: 'calc(100vh - 200px)', // 뷰어 영역에 맞춤
                maxHeight: '800px',
                objectFit: 'contain'
              }}
            />
            
            {/* 인식된 객체들 오버레이 */}
            {drawingObjects.map(obj => (
              <div
                key={obj.id}
                style={getObjectStyle(obj)}
                onClick={() => handleObjectClick(obj.id)}
                className={`group hover:bg-blue-50 ${getCursorStyle()}`}
              >
                {/* 객체 시각화 */}
                {obj.type === 'equipment' && (
                  <div className="w-full h-full bg-blue-500 opacity-70 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{obj.name.split(' ')[0]}</span>
                  </div>
                )}
                {obj.type === 'text' && (
                  <div className="text-xs font-medium text-gray-700 bg-yellow-100 px-1 rounded">
                    {obj.properties.text}
                  </div>
                )}
                {obj.type === 'line' && (
                  <div className="w-full h-full bg-green-500 opacity-70 rounded" />
                )}

                {/* 신뢰도 표시 */}
                {(obj.isSelected || selectedObjectId === obj.id) && (
                  <div className="absolute -top-6 left-0 z-10">
                    {getConfidenceBadge(obj.confidence)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 우측 하단 줌 컨트롤 */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200/60 p-1 shadow-lg">
          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="px-2 py-1 text-sm font-medium text-gray-700 min-w-[60px] text-center">
            {zoomLevel}%
          </div>
          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1" />
          <Button variant="ghost" size="sm" onClick={handleZoomReset} className="h-8 w-8 p-0" title="확대/축소 초기화">
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>

        {/* 상태 오버레이 */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
              <h4 className="font-semibold mb-2">AI 분석 진행 중</h4>
              <p className="text-sm text-muted-foreground mb-4">
                심볼, 텍스트, 라인을 자동 인식하고 있습니다...
              </p>
              <Progress value={analysisProgress} className="mb-2" />
              <p className="text-xs text-center text-muted-foreground">
                {analysisProgress}% 완료
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 하단 상태바 */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 px-4 py-2 flex items-center justify-between text-sm shadow-sm">
        <div className="flex items-center gap-4 text-slate-600">
          <span className="font-medium">도면: {selectedDrawingId || 'P&ID-Butane-Storage-Loading'}</span>
          <span className="text-slate-400">|</span>
          <span>객체: {drawingObjects.length}개</span>
          <span className="text-slate-400">|</span>
          <span>선택됨: {selectedObjectId ? '1개' : '0개'}</span>
          {editMode && (
            <>
              <span className="text-slate-400">|</span>
              <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
                편집 모드: {
                  editMode === 'add' ? '추가' :
                  editMode === 'edit' ? '편집' :
                  editMode === 'delete' ? '삭제' : '선택'
                }
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-600">줌: {zoomLevel}%</span>
        </div>
      </div>

      {/* Layer Control Dialog */}
      {showLayerControl && (
        <LayerControlPanel 
          onClose={() => setShowLayerControl(false)}
          onLayerChange={handleLayerChange}
        />
      )}
    </div>
  );
}