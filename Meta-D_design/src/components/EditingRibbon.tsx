import React, { useState } from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from './ui/dropdown-menu';
import { 
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
  GitCompare
} from 'lucide-react';
import { getUserAccessibleProjects, canAccessProject } from '../utils/permissions';
import { MOCK_PROJECTS } from '../constants/app';
import type { User } from '../types/app';





interface EditingRibbonProps {
  selectedProjectId?: string;
  onProjectChange?: (projectId: string) => void;
  onViewChange?: (view: string | null) => void;
  currentView?: string | null; // 현재 뷰 상태 추가
  user?: User; // 사용자 정보 추가
  onModuleSwitch?: (module: string) => void; // 모듈 전환 함수 추가
}

export function EditingRibbon({ 
  selectedProjectId = '1',
  onProjectChange,
  onViewChange,
  currentView = null,
  user,
  onModuleSwitch
}: EditingRibbonProps) {

  const handleViewClick = (view: string | null) => {
    if (view === 'revisionCompare') {
      // 리비전 비교는 독립된 SPA 모듈로 전환
      onModuleSwitch?.('Revision-Comparison');
    } else {
      onViewChange?.(view);
    }
  };

  // 사용자가 접근 가능한 프로젝트만 필터링
  const accessibleProjects = user ? getUserAccessibleProjects(user, MOCK_PROJECTS) : MOCK_PROJECTS;
  
  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedProjectId);
  const canAccessSelectedProject = user ? canAccessProject(user, selectedProjectId) : true;

  const handleProjectSelect = (projectId: string) => {
    if (user && !canAccessProject(user, projectId)) return;
    onProjectChange?.(projectId);
    console.log('Project changed:', projectId);
  };



  return (
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
  );
}