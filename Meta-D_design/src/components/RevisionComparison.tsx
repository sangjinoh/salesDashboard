import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import { getUserAccessibleProjects, canAccessProject } from '../utils/permissions';
import { MOCK_PROJECTS } from '../constants/app';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  GitCompare, 
  Settings,
  BookOpen,
  FileSpreadsheet,
  ChevronDown,
  List,
  ClipboardList,
  Wrench,
  FileText,
  FileImage,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Header } from './Header';

import { RevisionDetailView } from './RevisionDetailView';
import { MOCK_DRAWING_DATA, REVISION_OPTIONS } from '../constants/revisionData';
import { 
  calculateRevisionStats, 
  getFilteredDrawings, 
  getStatusIcon, 
  getStatusBadgeVariant,
  getAIStatusIcon,
  getStatusLabel,
  getAIStatusLabel,
  getAIStatusColor
} from '../utils/revision';
import type { RevisionComparisonProps } from '../types/revision';

export function RevisionComparison({ 
  onBack, 
  user, 
  selectedProjectId,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  onProjectChange,
  onViewSwitch
}: RevisionComparisonProps) {
  const [baseRevision, setBaseRevision] = useState<string>('Rev.01');
  const [compareRevision, setCompareRevision] = useState<string>('Rev.02');
  const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string | null>('revisionCompare');
  const [isChangesPanelCollapsed, setIsChangesPanelCollapsed] = useState<boolean>(false);

  // 프로젝트 관련 로직
  const accessibleProjects = getUserAccessibleProjects(user, MOCK_PROJECTS);
  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
  const canAccessSelectedProject = selectedProject ? canAccessProject(user, selectedProject) : false;

  const handleProjectSelect = (projectId: string) => {
    if (onProjectChange) {
      onProjectChange(projectId);
    }
  };

  const handleViewClick = (view: string | null) => {
    if (view === 'revisionCompare') {
      // 이미 리비전 비교 화면에 있으므로 상태만 업데이트
      setCurrentView(view);
    } else {
      // 다른 뷰로 이동: Meta-Drawing 모듈로 전환하면서 타겟 뷰 설정
      if (onViewSwitch) {
        onViewSwitch(view);
      }
      onModuleSwitch('Meta-Drawing');
    }
  };

  const stats = calculateRevisionStats(MOCK_DRAWING_DATA);

  const renderDrawingCard = (drawing: any, index: number) => {
    const StatusIcon = getStatusIcon(drawing.status);
    const AIIcon = drawing.revisions[compareRevision] ? getAIStatusIcon(drawing.revisions[compareRevision].aiRecognitionStatus) : null;
    
    return (
      <Card
        key={index}
        className={`cursor-pointer transition-all hover:shadow-md ${
          selectedDrawing === drawing.fileName 
            ? 'ring-2 ring-slate-400 bg-slate-50' 
            : 'hover:bg-slate-50'
        }`}
        onClick={() => setSelectedDrawing(drawing.fileName)}
      >
        <CardContent className="p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <StatusIcon className="w-4 h-4 text-slate-600" />
              <span className="text-xs font-medium text-slate-900 truncate">
                {drawing.fileName.replace('.pdf', '')}
              </span>
            </div>
            <Badge 
              variant={getStatusBadgeVariant(drawing.status)}
              className="text-xs flex-shrink-0"
            >
              {getStatusLabel(drawing.status)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>{baseRevision} → {compareRevision}</span>
            <div className="flex items-center gap-1">
              {drawing.revisions[compareRevision] && AIIcon && (
                <AIIcon className={`w-3 h-3 ${getAIStatusColor(drawing.revisions[compareRevision].aiRecognitionStatus)}`} />
              )}
              <span className="text-xs">
                {drawing.revisions[compareRevision] ? 
                  getAIStatusLabel(drawing.revisions[compareRevision].aiRecognitionStatus) : 
                  'N/A'
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTabContent = (status?: string) => (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {getFilteredDrawings(MOCK_DRAWING_DATA, status).map(renderDrawingCard)}
      </div>
    </ScrollArea>
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Header 컴포넌트 사용 */}
      <Header 
        user={user}
        currentModule="Meta-Drawing"
        onModuleSwitch={onModuleSwitch}
        onProfileSettingsClick={onProfileSettingsClick}
        onSystemSettingsClick={onSystemSettingsClick}
        onAISettingsClick={onAISettingsClick}
        onProjectManagementClick={onProjectManagementClick}
        onUserManagementClick={onUserManagementClick}
        onLogout={onLogout}
      />

      {/* EditingRibbon 스타일 서브 헤더 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3 shadow-sm h-16">
        <div className="flex items-center gap-3">
          {/* Project Selector - 가장 좌측 */}
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full shadow-sm ${selectedProject?.color || 'bg-slate-400'}`} />
            <span className="text-sm text-slate-600 whitespace-nowrap font-medium">프로젝트:</span>
            <Select 
              value={canAccessSelectedProject ? selectedProjectId : ''} 
              onValueChange={handleProjectSelect}
              disabled={accessibleProjects.length === 0}
            >
              <SelectTrigger className="w-72 min-w-64 bg-white/90 border-slate-200 shadow-sm">
                <SelectValue placeholder={
                  accessibleProjects.length === 0 
                    ? "접근 가능한 프로젝트가 없습니다"
                    : "프로젝트를 선택하세요"
                }>
                  {selectedProject && canAccessSelectedProject && (
                    <div className="flex items-center gap-2 w-full">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedProject.color}`} />
                      <span className="text-sm truncate text-left font-medium text-slate-800">{selectedProject.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-80">
                {accessibleProjects.length === 0 ? (
                  <SelectItem value="no-access" disabled>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">접근 권한이 없습니다</span>
                    </div>
                  </SelectItem>
                ) : (
                  accessibleProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${project.color}`} />
                          <span className="text-sm truncate">{project.name}</span>
                        </div>
                        <Badge 
                          variant={project.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs flex-shrink-0 ml-2"
                        >
                          {project.status === 'active' ? '진행중' : project.status === 'completed' ? '완료' : '보류'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Separator orientation="vertical" className="h-6 bg-slate-300" />

          {/* View Navigation Group - 항상 표시 */}
          <div className="flex items-center gap-2">
            {/* 도면 조회 */}
            <Button 
              variant={currentView === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewClick(null)}
              className={`transition-all duration-200 ${
                currentView === null 
                  ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' 
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FileImage className="w-4 h-4 mr-1.5" />
              도면 조회
            </Button>
            
            <Button 
              variant={currentView === 'revisionCompare' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewClick('revisionCompare')}
              className={`transition-all duration-200 ${
                currentView === 'revisionCompare' 
                  ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' 
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <GitCompare className="w-4 h-4 mr-1.5" />
              리비전 비교
            </Button>
            
            <Button 
              variant={currentView === 'symbolLibrary' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewClick('symbolLibrary')}
              className={`transition-all duration-200 ${
                currentView === 'symbolLibrary' 
                  ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' 
                  : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              심볼 라이브러리
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={['lineList', 'itemList', 'valveList', 'noteReport'].includes(currentView || '') ? 'default' : 'outline'} 
                  size="sm"
                  className={`transition-all duration-200 ${
                    ['lineList', 'itemList', 'valveList', 'noteReport'].includes(currentView || '')
                      ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md'
                      : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                  리포트
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg">
                  <DropdownMenuLabel className="text-xs text-slate-600 font-semibold">리포트 보기</DropdownMenuLabel>
                  <DropdownMenuItem 
                    onClick={() => handleViewClick('lineList')}
                    className="hover:bg-slate-50 text-slate-700"
                  >
                    <List className="w-4 h-4 mr-2" />
                    Line List
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleViewClick('itemList')}
                    className="hover:bg-slate-50 text-slate-700"
                  >
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Item List  
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleViewClick('valveList')}
                    className="hover:bg-slate-50 text-slate-700"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    Valve List
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleViewClick('noteReport')}
                    className="hover:bg-slate-50 text-slate-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Note Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>

          <Separator orientation="vertical" className="h-6 bg-slate-300" />

          {/* 리비전 선택 그룹 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap font-medium">기준:</span>
              <Select value={baseRevision} onValueChange={setBaseRevision}>
                <SelectTrigger className="w-24 bg-white/90 border-slate-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REVISION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 whitespace-nowrap font-medium">비교:</span>
              <Select value={compareRevision} onValueChange={setCompareRevision}>
                <SelectTrigger className="w-24 bg-white/90 border-slate-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REVISION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-gradient-subtle">
        {/* Left Panel - 변경사항 목록 */}
        <div className={`${isChangesPanelCollapsed ? 'w-12' : 'w-96'} bg-white/50 backdrop-blur-sm border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out`}>
          {/* 패널 헤더 및 접힘/펼침 버튼 */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            {!isChangesPanelCollapsed && (
              <h3 className="text-sm font-semibold text-slate-900">변경사항 목록</h3>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsChangesPanelCollapsed(!isChangesPanelCollapsed)}
              className="ml-auto p-1 h-6 w-6 hover:bg-slate-100 transition-colors"
              title={isChangesPanelCollapsed ? "패널 펼치기" : "패널 접기"}
            >
              {isChangesPanelCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              )}
            </Button>
          </div>

          {/* 패널 내용 - 접힘 상태일 때는 숨김 */}
          {!isChangesPanelCollapsed && (
            <>
              {/* 통계 요약 */}
              <div className="p-4 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-900 mb-3">변경사항 요약</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-semibold text-green-600">{stats.added}</div>
                    <div className="text-xs text-green-700">추가됨</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-semibold text-red-600">{stats.removed}</div>
                    <div className="text-xs text-red-700">제거됨</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-semibold text-orange-600">{stats.modified}</div>
                    <div className="text-xs text-orange-700">수정됨</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-semibold text-gray-600">{stats.unchanged}</div>
                    <div className="text-xs text-gray-700">변경없음</div>
                  </div>
                </div>
              </div>

              {/* 필터 탭 */}
              <Tabs defaultValue="all" className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-5 mx-4 mt-2">
                  <TabsTrigger value="all" className="text-xs">전체</TabsTrigger>
                  <TabsTrigger value="added" className="text-xs">추가</TabsTrigger>
                  <TabsTrigger value="removed" className="text-xs">제거</TabsTrigger>
                  <TabsTrigger value="modified" className="text-xs">수정</TabsTrigger>
                  <TabsTrigger value="unchanged" className="text-xs">동일</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="flex-1 m-0">
                  {renderTabContent()}
                </TabsContent>

                {['added', 'removed', 'modified', 'unchanged'].map(status => (
                  <TabsContent key={status} value={status} className="flex-1 m-0">
                    {renderTabContent(status)}
                  </TabsContent>
                ))}
              </Tabs>
            </>
          )}
        </div>

        {/* Right Panel - 상세 비교 뷰 */}
        <div className="flex-1 bg-white/30 backdrop-blur-sm">
          {selectedDrawing ? (
            <RevisionDetailView 
              drawing={MOCK_DRAWING_DATA.find(d => d.fileName === selectedDrawing)!}
              baseRevision={baseRevision}
              compareRevision={compareRevision}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-500">
                <GitCompare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium mb-2">도면을 선택하세요</p>
                <p className="text-sm">좌측에서 비교할 도면을 선택하면 상세 정보를 확인할 수 있습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}