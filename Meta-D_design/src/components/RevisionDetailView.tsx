import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Toggle } from './ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Eye, Download, FileText, ZoomIn, Maximize2, SplitSquareHorizontal, Layers, GitCompare, Info, ChevronUp, ChevronDown, Clock, FileCheck, AlertTriangle, ZoomOut, RotateCcw, Plus, Minus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { getAIStatusIcon, getAIStatusLabel, getAIStatusColor } from '../utils/revision';
import type { RevisionDetailViewProps } from '../types/revision';

type ComparisonMode = 'overlay' | 'diff-highlight';

export function RevisionDetailView({ 
  drawing, 
  baseRevision, 
  compareRevision 
}: RevisionDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('diff-highlight');
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [isComparisonInfoCollapsed, setIsComparisonInfoCollapsed] = useState<boolean>(false);
  const [showHighlights, setShowHighlights] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const baseData = drawing.revisions[baseRevision];
  const compareData = drawing.revisions[compareRevision];

  // 모의 변경사항 데이터 (실제로는 이미지 분석 결과에서 가져올 것)
  const mockChanges = [
    { 
      id: 1, 
      type: 'added', 
      x: 25, y: 30, 
      width: 8, 
      height: 6, 
      description: '새로운 밸브 V-101 추가',
      component: 'V-101',
      category: '밸브',
      location: 'Zone A-2',
      beforeValue: '-',
      afterValue: 'Gate Valve DN50',
      timestamp: '2024-01-18 09:15:23'
    },
    { 
      id: 2, 
      type: 'modified', 
      x: 55, y: 20, 
      width: 12, 
      height: 8, 
      description: '파이프 라인 경로 변경',
      component: 'L-001',
      category: '배관',
      location: 'Zone B-1',
      beforeValue: '4" CS',
      afterValue: '6" CS',
      timestamp: '2024-01-18 09:22:45'
    },
    { 
      id: 3, 
      type: 'removed', 
      x: 75, y: 45, 
      width: 6, 
      height: 4, 
      description: '인스트루먼트 PI-201 제거',
      component: 'PI-201',
      category: '계기',
      location: 'Zone C-3',
      beforeValue: 'Pressure Indicator 0-10bar',
      afterValue: '-',
      timestamp: '2024-01-18 10:05:12'
    },
    { 
      id: 4, 
      type: 'modified', 
      x: 40, y: 65, 
      width: 15, 
      height: 10, 
      description: '펌프 P-101 사양 변경',
      component: 'P-101',
      category: '펌프',
      location: 'Zone A-1',
      beforeValue: '15kW Centrifugal',
      afterValue: '22kW Centrifugal',
      timestamp: '2024-01-18 11:30:18'
    },
    { 
      id: 5, 
      type: 'added', 
      x: 15, y: 75, 
      width: 10, 
      height: 6, 
      description: '안전밸브 PSV-301 추가',
      component: 'PSV-301',
      category: '안전밸브',
      location: 'Zone D-2',
      beforeValue: '-',
      afterValue: 'Safety Valve 8bar',
      timestamp: '2024-01-18 14:45:30'
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'added': return 'rgb(34, 197, 94)'; // green-500
      case 'removed': return 'rgb(239, 68, 68)'; // red-500
      case 'modified': return 'rgb(249, 115, 22)'; // orange-500
      default: return 'rgb(156, 163, 175)'; // gray-400
    }
  };

  const getChangeLabel = (type: string) => {
    switch (type) {
      case 'added': return '추가됨';
      case 'removed': return '제거됨';
      case 'modified': return '수정됨';
      default: return '변경없음';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return FileCheck;
      case 'removed': return AlertTriangle;
      case 'modified': return Clock;
      default: return FileText;
    }
  };

  // 줌 제어 함수들
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 500));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  // 일반 도면 뷰 렌더링
  const renderDrawingView = (data: any, revision: string, showHighlights: boolean = false) => (
    <div className="p-3 h-full min-h-[450px] flex items-center justify-center bg-slate-50/30 relative">
      {/* 배경 그리드 패턴 */}
      <div 
        className="absolute inset-3 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {data?.thumbnailUrl ? (
        <div className="w-full h-full bg-white rounded border shadow-sm overflow-hidden relative group max-w-full max-h-full">
          <img 
            src={data.thumbnailUrl} 
            alt={`${drawing.fileName} ${revision}`}
            className="w-full h-full object-contain cursor-pointer p-2"
            onClick={() => setSelectedImage({ 
              url: data.thumbnailUrl!, 
              title: `${drawing.fileName} - ${revision}` 
            })}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
          
          {/* 변경사항 하이라이트 오버레이 */}
          {showHighlights && (
            <div className="absolute inset-2 pointer-events-none">
              {mockChanges.map((change) => (
                <TooltipProvider key={change.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`absolute pointer-events-auto cursor-help border-2 rounded revision-highlight diff-highlight change-${change.type}`}
                        style={{
                          left: `${change.x}%`,
                          top: `${change.y}%`,
                          width: `${change.width}%`,
                          height: `${change.height}%`,
                          borderColor: getChangeColor(change.type),
                          backgroundColor: `${getChangeColor(change.type)}20`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getChangeColor(change.type) }}
                          />
                          <span className="font-medium">{getChangeLabel(change.type)}</span>
                        </div>
                        <p className="text-sm">{change.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white shadow-lg"
              onClick={() => setSelectedImage({ 
                url: data.thumbnailUrl!, 
                title: `${drawing.fileName} - ${revision}` 
              })}
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              확대보기
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-400 bg-white rounded border shadow-sm p-8 w-full relative z-10">
          <FileText className="w-16 h-16 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">도면 미리보기 없음</p>
          <p className="text-xs text-slate-500 mt-1">PDF 렌더링 중...</p>
        </div>
      )}
    </div>
  );

  // 오버레이 비교 뷰 렌더링
  const renderOverlayView = () => (
    <div className="p-3 h-full min-h-[450px] flex items-center justify-center bg-slate-50/30 relative">
      {/* 배경 그리드 패턴 */}
      <div 
        className="absolute inset-3 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {baseData?.thumbnailUrl && compareData?.thumbnailUrl ? (
        <div className="w-full h-full bg-white rounded border shadow-sm overflow-hidden relative group max-w-full max-h-full">
          {/* ���준 이미지 */}
          <img 
            src={baseData.thumbnailUrl} 
            alt={`${drawing.fileName} ${baseRevision}`}
            className="absolute inset-0 w-full h-full object-contain p-2"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
          
          {/* 비교 이미지 (오버레이) */}
          <img 
            src={compareData.thumbnailUrl} 
            alt={`${drawing.fileName} ${compareRevision}`}
            className="absolute inset-0 w-full h-full object-contain p-2"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              opacity: overlayOpacity / 100,
              mixBlendMode: 'difference'
            }}
          />
          
          {/* 범례 */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>{baseRevision}</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>{compareRevision}</span>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white shadow-lg"
              onClick={() => setSelectedImage({ 
                url: compareData.thumbnailUrl!, 
                title: `${drawing.fileName} - 오버레이 비교` 
              })}
            >
              <Maximize2 className="w-4 h-4 mr-1" />
              확대보기
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-400 bg-white rounded border shadow-sm p-8 w-full relative z-10">
          <FileText className="w-16 h-16 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">도면 미리보기 없음</p>
          <p className="text-xs text-slate-500 mt-1">오버레이 비교를 위해서는 두 이미지가 모두 필요합니다</p>
        </div>
      )}
    </div>
  );

  // 차이점 하이라이트 뷰 렌더링 (나란히 보기)
  const renderDiffHighlightView = () => (
    <div className="flex flex-col h-full bg-slate-50/30 relative">
      {/* 배경 그리드 패턴 */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#000 1px, transparent 1px),
            linear-gradient(90deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* 도면 비교 영역 */}
      <div className="flex gap-4 p-3 flex-1 min-h-0">
        {/* Rev.01 도면 */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white rounded border shadow-sm overflow-hidden relative group flex flex-col h-full">
            {/* 헤더 */}
            <div className="p-2 border-b border-slate-200 bg-slate-50/80 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-semibold text-slate-900">{baseRevision} (기준)</span>
              </div>
            </div>
            
            {/* 도면 내용 */}
            <div className="flex-1 min-h-0 overflow-auto auto-hide-scrollbar p-2">
              {baseData?.thumbnailUrl ? (
                <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                  <div 
                    className="transition-transform duration-200 ease-out" 
                    style={{ 
                      transform: `scale(${zoomLevel / 100})`, 
                      transformOrigin: 'center',
                    }}
                  >
                    <img 
                      src={baseData.thumbnailUrl} 
                      alt={`${drawing.fileName} ${baseRevision}`}
                      className="cursor-pointer shadow-sm rounded"
                      onClick={() => setSelectedImage({ 
                        url: baseData.thumbnailUrl!, 
                        title: `${drawing.fileName} - ${baseRevision}` 
                      })}
                      style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: zoomLevel <= 100 ? '100%' : 'none',
                        maxHeight: zoomLevel <= 100 ? '100%' : 'none',
                        minWidth: '200px',
                        minHeight: '150px'
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white shadow-lg"
                        onClick={() => setSelectedImage({ 
                          url: baseData.thumbnailUrl!, 
                          title: `${drawing.fileName} - ${baseRevision}` 
                        })}
                      >
                        <Maximize2 className="w-4 h-4 mr-1" />
                        확대보기
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                  <div className="text-center text-slate-400 bg-white rounded border shadow-sm p-8">
                    <FileText className="w-16 h-16 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">도면 미리보기 없음</p>
                    <p className="text-xs text-slate-500 mt-1">PDF 렌더링 중...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rev.02 도면 (변경사항 하이라이트 포함) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="bg-white rounded border shadow-sm overflow-hidden relative group flex flex-col h-full">
            {/* 헤더 */}
            <div className="p-2 border-b border-slate-200 bg-slate-50/80 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-slate-900">{compareRevision} (비교)</span>
                </div>
                {/* 범례 */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded"></div>
                    <span>추가</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded"></div>
                    <span>수정</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded"></div>
                    <span>제거</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 도면 내용 */}
            <div className="flex-1 min-h-0 overflow-auto auto-hide-scrollbar p-2">
              {compareData?.thumbnailUrl ? (
                <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                  <div 
                    className="relative transition-transform duration-200 ease-out" 
                    style={{ 
                      transform: `scale(${zoomLevel / 100})`, 
                      transformOrigin: 'center'
                    }}
                  >
                    <img 
                      src={compareData.thumbnailUrl} 
                      alt={`${drawing.fileName} ${compareRevision}`}
                      className="cursor-pointer shadow-sm rounded"
                      style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: zoomLevel <= 100 ? '100%' : 'none',
                        maxHeight: zoomLevel <= 100 ? '100%' : 'none',
                        minWidth: '200px',
                        minHeight: '150px'
                      }}
                    />
                    
                    {/* 변경사항 하이라이트 오버레이 */}
                    {showHighlights && (
                      <div className="absolute inset-0 pointer-events-none">
                        {mockChanges.map((change) => (
                          <TooltipProvider key={change.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute pointer-events-auto cursor-help diff-highlight"
                                  style={{
                                    left: `${change.x}%`,
                                    top: `${change.y}%`,
                                    width: `${change.width}%`,
                                    height: `${change.height}%`,
                                  }}
                                >
                                  {/* 변경사항 박스 */}
                                  <div
                                    className={`w-full h-full border-3 rounded revision-highlight change-${change.type}`}
                                    style={{
                                      borderColor: getChangeColor(change.type),
                                      backgroundColor: `${getChangeColor(change.type)}25`,
                                    }}
                                  />
                                  
                                  {/* 변경사항 라벨 */}
                                  <div 
                                    className="absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium shadow-sm text-white whitespace-nowrap"
                                    style={{ backgroundColor: getChangeColor(change.type) }}
                                  >
                                    {getChangeLabel(change.type)}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="p-2 max-w-xs">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div 
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: getChangeColor(change.type) }}
                                    />
                                    <span className="font-medium">{getChangeLabel(change.type)}</span>
                                  </div>
                                  <p className="text-sm">{change.description}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white shadow-lg"
                        onClick={() => setSelectedImage({ 
                          url: compareData.thumbnailUrl!, 
                          title: `${drawing.fileName} - ${compareRevision} (차이점 하이라이트)` 
                        })}
                      >
                        <Maximize2 className="w-4 h-4 mr-1" />
                        확대보기
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                  <div className="text-center text-slate-400 bg-white rounded border shadow-sm p-8">
                    <FileText className="w-16 h-16 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">도면 미리보기 없음</p>
                    <p className="text-xs text-slate-500 mt-1">PDF 렌더링 중...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIStatus = (status: string) => {
    const IconComponent = getAIStatusIcon(status);
    return (
      <div className="flex items-center gap-1">
        AI 인식: 
        {IconComponent && <IconComponent className={`w-3 h-3 ${getAIStatusColor(status)}`} />}
        <span className="ml-1">{getAIStatusLabel(status)}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">{drawing.fileName.replace('.pdf', '')}</h2>
            <p className="text-sm text-slate-600">{baseRevision} ↔ {compareRevision} 비교</p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {/* 비교 모드 선택 */}
              <div className="flex items-center gap-1 mr-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant={comparisonMode === 'overlay' ? 'default' : 'outline'}
                      onClick={() => setComparisonMode('overlay')}
                    >
                      <Layers className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>오버레이 비교</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      variant={comparisonMode === 'diff-highlight' ? 'default' : 'outline'}
                      onClick={() => setComparisonMode('diff-highlight')}
                    >
                      <GitCompare className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>차이점 하이라이트</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* 차이점 하이라이트 전용 컨트롤 */}
              {comparisonMode === 'diff-highlight' && (
                <div className="flex items-center gap-1 mr-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Toggle 
                        pressed={showHighlights}
                        onPressedChange={setShowHighlights}
                        size="sm"
                        className="mr-2"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        변경사항 표시
                      </Toggle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>변경사항 시각화 켜기/끄기</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* 줌 컨트롤 */}
                  <div className="flex items-center gap-1 border border-slate-200 rounded-md p-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 25}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>축소</p>
                      </TooltipContent>
                    </Tooltip>

                    <span className="text-xs text-slate-600 min-w-[3rem] text-center">
                      {zoomLevel}%
                    </span>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 500}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>확대</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={handleZoomReset}
                          className="h-6 w-6 p-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>원본 크기 (100%)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}


            </TooltipProvider>

            <Button size="sm" variant="outline">
              <ZoomIn className="w-4 h-4 mr-1" />
              미리보기
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-1" />
              다운로드
            </Button>
          </div>
        </div>
      </div>

      {/* 비교 정보 */}
      <div className="border-b border-slate-200 bg-white/50">
        {/* 패널 헤더 및 접힘/펼침 버튼 */}
        <div className="p-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">비교 정보</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsComparisonInfoCollapsed(!isComparisonInfoCollapsed)}
            className="ml-auto p-1 h-6 w-6 hover:bg-slate-100 transition-colors"
            title={isComparisonInfoCollapsed ? "정보 패널 펼치기" : "정보 패널 접기"}
          >
            {isComparisonInfoCollapsed ? (
              <ChevronDown className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronUp className="w-4 h-4 text-slate-600" />
            )}
          </Button>
        </div>

        {/* 패널 내용 - 접힘 상태일 때는 숨김 */}
        {!isComparisonInfoCollapsed && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-6">
              {/* 기준 리비전 */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Badge variant="outline">{baseRevision}</Badge>
                  기준 리비전
                </h4>
                {baseData ? (
                  <div className="space-y-1 text-xs text-slate-600">
                    <div>수정일: {baseData.lastModified}</div>
                    <div>파일크기: {baseData.fileSize}</div>
                    <div>체크섬: {baseData.checksum}</div>
                    <div className="flex items-center gap-1">
                      {renderAIStatus(baseData.aiRecognitionStatus)}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-600">이 리비전에는 파일이 없습니다</div>
                )}
              </div>

              {/* 비교 리비전 */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Badge variant="outline">{compareRevision}</Badge>
                  비교 리비전
                </h4>
                {compareData ? (
                  <div className="space-y-1 text-xs text-slate-600">
                    <div>수정일: {compareData.lastModified}</div>
                    <div>파일크기: {compareData.fileSize}</div>
                    <div>체크섬: {compareData.checksum}</div>
                    <div className="flex items-center gap-1">
                      {renderAIStatus(compareData.aiRecognitionStatus)}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-600">이 리비전에는 파일이 없습니다</div>
                )}
              </div>
            </div>

            {/* 변경사항 요약 */}
            {baseData && compareData && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* 기본 정보 */}
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-900 mb-2">변경사항 요약</h5>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>• 파일 크기: {baseData.fileSize} → {compareData.fileSize}</div>
                    <div>• 체크섬 변경: {baseData.checksum !== compareData.checksum ? '예' : '아니오'}</div>
                    <div>• 수정 시간 차이: {new Date(compareData.lastModified).getTime() - new Date(baseData.lastModified).getTime() > 0 ? '최신' : '이전'}</div>
                  </div>
                </div>

                {/* 변경 통계 */}
                <div className="p-3 bg-slate-50 rounded-lg">
                  <h5 className="text-sm font-medium text-slate-900 mb-2">변경 통계</h5>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="w-full h-2 bg-green-200 rounded mb-1"></div>
                      <div className="font-medium text-green-700">{mockChanges.filter(c => c.type === 'added').length}</div>
                      <div className="text-slate-600">추가</div>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-2 bg-orange-200 rounded mb-1"></div>
                      <div className="font-medium text-orange-700">{mockChanges.filter(c => c.type === 'modified').length}</div>
                      <div className="text-slate-600">수정</div>
                    </div>
                    <div className="text-center">
                      <div className="w-full h-2 bg-red-200 rounded mb-1"></div>
                      <div className="font-medium text-red-700">{mockChanges.filter(c => c.type === 'removed').length}</div>
                      <div className="text-slate-600">제거</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 미리보기 영역 */}
      <div className="flex-1 p-4 min-h-0">
        <div className="h-full min-h-[500px]">
          {/* 메인 비교 뷰 */}
          <div className="h-full">
            {comparisonMode === 'overlay' && (
              <div className="bg-white/90 rounded-lg border border-slate-200 overflow-hidden shadow-sm h-full">
                <div className="p-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900">오버레이 비교</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">투명도:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-xs text-slate-600 w-8">{overlayOpacity}%</span>
                  </div>
                </div>
                {renderOverlayView()}
              </div>
            )}

            {comparisonMode === 'diff-highlight' && (
              <div className="bg-white/90 rounded-lg border border-slate-200 overflow-hidden shadow-sm h-full">
                <div className="p-3 border-b border-slate-200 bg-slate-50/80">
                  <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <GitCompare className="w-4 h-4" />
                    차이점 하이라이트
                  </h4>
                </div>
                {renderDiffHighlightView()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 변경사항 상세 테이블 */}
      <div className="border-t border-slate-200 bg-white/50 p-4">
        <div className="bg-white/90 rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-200 bg-slate-50/80">
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              변경사항 상세 목록
            </h4>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">상태</TableHead>
                  <TableHead className="w-32">컴포넌트</TableHead>
                  <TableHead className="w-24">카테고리</TableHead>
                  <TableHead className="w-24">위치</TableHead>
                  <TableHead className="min-w-48">변경 전</TableHead>
                  <TableHead className="min-w-48">변경 후</TableHead>
                  <TableHead className="w-32">변경 시간</TableHead>
                  <TableHead className="min-w-64">설명</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockChanges.map((change) => {
                  const ChangeIcon = getChangeIcon(change.type);
                  return (
                    <TableRow key={change.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <div 
                            className="flex items-center justify-center w-8 h-8 rounded-full"
                            style={{ backgroundColor: `${getChangeColor(change.type)}20` }}
                          >
                            <ChangeIcon 
                              className="w-4 h-4" 
                              style={{ color: getChangeColor(change.type) }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900">{change.component}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {change.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600">{change.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-600 max-w-48">
                          {change.beforeValue}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-900 max-w-48 font-medium">
                          {change.afterValue}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Clock className="w-3 h-3" />
                          <span>{change.timestamp.split(' ')[1]}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          {change.timestamp.split(' ')[0]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-700">{change.description}</div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* 이미지 확대보기 다이얼로그 */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ZoomIn className="w-5 h-5" />
              {selectedImage?.title}
            </DialogTitle>
            <DialogDescription>
              도면 이미지를 확대하여 상세 내용을 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-lg bg-slate-50 relative p-4">
            {/* 배경 그리드 패턴 */}
            <div 
              className="absolute inset-4 opacity-5"
              style={{
                backgroundImage: `
                  linear-gradient(#000 1px, transparent 1px),
                  linear-gradient(90deg, #000 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            
            {selectedImage && (
              <img 
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-contain relative z-10"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}