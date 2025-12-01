import { useState, useEffect } from 'react';
import { Header } from './Header';
import { EditingRibbon } from './EditingRibbon';
import { DrawingTree } from './meta-drawing/DrawingTree';
import { DrawingViewer } from './meta-drawing/DrawingViewer';
import { ObjectProperties } from './meta-drawing/ObjectProperties';
import { MetaChatBot } from './meta-drawing/MetaChatBot';
import { SymbolLibraryView } from './SymbolLibraryView';
import { ReportView } from './ReportView';
import { LegendMatchingView } from './LegendMatchingView';
import { RevisionComparison } from './RevisionComparison';
import { useAutoHideScrollbar } from './useAutoHideScrollbar';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { PanelLeftClose, PanelLeft, PanelRightClose, PanelRight } from 'lucide-react';
import type { LayerConfiguration } from './LayerControlPanel';
import type { SymbolMatch, ChatbotPersona } from '../types/app';

interface MetaDrawingProps {
  onBack: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
    phone?: string;
    department?: string;
    location?: string;
    joinDate?: string;
    bio?: string;
  };
  onProfileSettingsClick?: () => void;
  onSystemSettingsClick?: () => void;
  onAISettingsClick?: () => void;
  onProjectManagementClick?: () => void;
  onLogout?: () => void;
  onModuleSwitch?: (module: 'Meta-Drive' | 'Meta-Drawing') => void;
  selectedProjectId?: string;
  onProjectChange?: (projectId: string) => void;
  selectedDrawingPersona?: ChatbotPersona | null;
  onDrawingPersonaChange?: (persona: ChatbotPersona | null) => void;
  targetView?: string | null;
  onTargetViewClear?: () => void;
}

export function MetaDrawing({ 
  onBack, 
  user,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onLogout,
  onModuleSwitch,
  selectedProjectId = '1',
  onProjectChange,
  selectedDrawingPersona,
  onDrawingPersonaChange,
  targetView,
  onTargetViewClear
}: MetaDrawingProps) {
  const [selectedDrawingId, setSelectedDrawingId] = useState<string>('dwg-101');
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<string | null>(null);

  // targetView가 설정되어 있으면 currentView를 업데이트하고 초기화
  useEffect(() => {
    if (targetView) {
      setCurrentView(targetView);
      if (onTargetViewClear) {
        onTargetViewClear();
      }
    }
  }, [targetView, onTargetViewClear]);
  const [symbolLibrary, setSymbolLibrary] = useState<SymbolMatch[]>([]);

  // 각 패널에 대한 자동 숨김 스크롤바 hook
  const leftPanelScrollbar = useAutoHideScrollbar(2000);
  const rightPropertiesScrollbar = useAutoHideScrollbar(2000);



  const handleDrawingSelect = (drawingId: string) => {
    setSelectedDrawingId(drawingId);
    setSelectedObjectId(null); // 도면 변경 시 선택된 객체 초기화
  };

  const handleObjectSelect = (objectId: string | null) => {
    setSelectedObjectId(objectId);
  };

  const handleObjectsHighlight = (objectIds: string[]) => {
    console.log('하이라이트할 객체들:', objectIds);
    // 실제 구현에서는 뷰어에서 해당 객체들을 하이라이트
  };

  const handleItemsFilter = (filterCriteria: any) => {
    console.log('필터 조건:', filterCriteria);
    // 실제 구현에서는 필터 조건에 맞는 객체들을 필터링
  };

  const handlePropertyChange = (objectId: string, propertyKey: string, value: string | number) => {
    console.log('속성 변경:', { objectId, propertyKey, value });
    // 실제 구현에서는 객체 속성을 업데이트
  };

  const handleObjectVerify = (objectId: string) => {
    console.log('객체 검증:', objectId);
    // 실제 구현에서는 객체를 검증 완료로 표시
  };

  const handleLayerChange = (config: LayerConfiguration) => {
    console.log('레이어 설정 변경:', config);
    // 실제 구현에서는 도면 뷰어에 레이어 설정을 적용
  };

  const handleViewChange = (view: string | null) => {
    setCurrentView(view);
  };

  const handleBackToDrawing = () => {
    setCurrentView(null);
  };

  const handleSymbolsAdd = (matches: SymbolMatch[]) => {
    setSymbolLibrary(prev => [...prev, ...matches]);
    setCurrentView('symbolLibrary'); // 심볼 추가 후 심볼 라이브러리로 돌아가기
  };

  const getLeftPanelWidth = () => {
    if (isLeftPanelCollapsed) return 'w-0';
    return 'w-80';
  };

  const getRightPanelWidth = () => {
    if (isRightPanelCollapsed) return 'w-0';
    return 'w-96';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
      {/* Header 컴포넌트 사용 */}
      <Header 
        user={user}
        currentModule="Meta-Drawing"
        onModuleSwitch={onModuleSwitch}
        onProfileSettingsClick={onProfileSettingsClick}
        onSystemSettingsClick={onSystemSettingsClick}
        onAISettingsClick={onAISettingsClick}
        onProjectManagementClick={onProjectManagementClick}
        onLogout={onLogout}
      />

      {/* 편�� 리본 */}
      <EditingRibbon 
        selectedProjectId={selectedProjectId}
        onProjectChange={onProjectChange}
        onViewChange={handleViewChange}
        currentView={currentView}
        user={user}
        onModuleSwitch={onModuleSwitch}
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 현재 뷰가 있다면 전체 화면으로 표시 */}
        {currentView && (
          <div className="flex-1">
            {currentView === 'symbolLibrary' && (
              <SymbolLibraryView 
                onBack={handleBackToDrawing} 
                onViewChange={setCurrentView}
              />
            )}
            {currentView === 'legendMatching' && (
              <LegendMatchingView 
                onBack={() => setCurrentView('symbolLibrary')}
                onSymbolsAdd={handleSymbolsAdd}
                onSymbolLibraryBack={() => setCurrentView('symbolLibrary')}
              />
            )}
            {(currentView === 'lineList' || currentView === 'itemList' || currentView === 'valveList' || currentView === 'noteReport') && (
              <ReportView reportType={currentView} onBack={handleBackToDrawing} />
            )}
            {currentView === 'revisionCompare' && (
              <RevisionComparison 
                onBack={handleBackToDrawing} 
                user={user}
                selectedProjectId={selectedProjectId}
              />
            )}
          </div>
        )}

        {/* 기본 도면 뷰어 레이아웃 */}
        {!currentView && (
          <>
            {/* 좌측 도면 트리 패널 */}
        <div 
          ref={leftPanelScrollbar.elementRef}
          className={`relative transition-all duration-300 auto-hide-scrollbar overflow-y-auto ${leftPanelScrollbar.scrollbarClass} ${getLeftPanelWidth()} ${isLeftPanelCollapsed ? 'overflow-hidden' : ''}`}
        >
          {/* 좌측 패널 토글 버튼 */}
          {!isLeftPanelCollapsed && (
            <div className="absolute top-2 right-2 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLeftPanelCollapsed(true)}
                      className="h-8 w-8 p-0 bg-white/90 border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:shadow-md transition-all duration-300 hover-lift rounded-lg"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    도면 트리 패널 접기
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {!isLeftPanelCollapsed && (
            <DrawingTree
              selectedDrawingId={selectedDrawingId}
              onDrawingSelect={handleDrawingSelect}
              className="h-full"
            />
          )}
        </div>

        {/* 좌측 패널이 접혔을 때의 토글 버튼 */}
        {isLeftPanelCollapsed && (
          <div className="flex-shrink-0 w-12 relative">
            <div className="absolute top-2 left-2 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLeftPanelCollapsed(false)}
                      className="h-8 w-8 p-0 bg-white/90 border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:shadow-md transition-all duration-300 hover-lift rounded-lg"
                    >
                      <PanelLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    도면 트리 패널 펼치기
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* 중앙 도면 뷰어 */}
        <div className="flex-1">
          <DrawingViewer
            selectedDrawingId={selectedDrawingId}
            selectedObjectId={selectedObjectId}
            onObjectSelect={handleObjectSelect}
            onObjectsHighlight={handleObjectsHighlight}
            onLayerChange={handleLayerChange}
            className="h-full"
          />
        </div>

        {/* 우측 패널이 접혔을 때의 토글 버튼 */}
        {isRightPanelCollapsed && (
          <div className="flex-shrink-0 w-12 relative">
            <div className="absolute top-2 right-2 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRightPanelCollapsed(false)}
                      className="h-8 w-8 p-0 bg-white/90 border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:shadow-md transition-all duration-300 hover-lift rounded-lg"
                    >
                      <PanelRight className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    속성 및 챗봇 패널 펼치기
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* 우측 패널 (객체 속성 + 챗봇) */}
        <div 
          className={`relative transition-all duration-300 ${getRightPanelWidth()} ${isRightPanelCollapsed ? 'overflow-hidden' : ''}`}
        >
          {/* 우측 패널 토글 버튼 */}
          {!isRightPanelCollapsed && (
            <div className="absolute top-2 left-2 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsRightPanelCollapsed(true)}
                      className="h-8 w-8 p-0 bg-white/90 border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-800 hover:shadow-md transition-all duration-300 hover-lift rounded-lg"
                    >
                      <PanelRightClose className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    속성 및 챗봇 패널 접기
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {!isRightPanelCollapsed && (
            <ResizablePanelGroup direction="vertical" className="h-full">
              {/* 상단: 객체 속성 */}
              <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
                <div 
                  ref={rightPropertiesScrollbar.elementRef}
                  className={`h-full auto-hide-scrollbar overflow-y-auto ${rightPropertiesScrollbar.scrollbarClass}`}
                >
                  <ObjectProperties
                    selectedObjectId={selectedObjectId}
                    onPropertyChange={handlePropertyChange}
                    onObjectVerify={handleObjectVerify}
                    className="h-full"
                  />
                </div>
              </ResizablePanel>
              
              {/* 리사이저 핸들 */}
              <ResizableHandle withHandle />
              
              {/* 하단: Meta-ChatBot */}
              <ResizablePanel defaultSize={50} minSize={25} maxSize={75}>
                <MetaChatBot
                  selectedObjectId={selectedObjectId}
                  selectedDrawingId={selectedDrawingId}
                  onObjectsHighlight={handleObjectsHighlight}
                  onItemsFilter={handleItemsFilter}
                  selectedPersona={selectedDrawingPersona}
                  onPersonaChange={onDrawingPersonaChange}
                  user={user}
                  className="h-full border-t border-border"
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}