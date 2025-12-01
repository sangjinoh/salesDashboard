import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Brain, Sparkles, Plus, Lock } from 'lucide-react';
import { canAccessProject, getUserAccessibleProjects } from '../utils/permissions';
import type { User } from '../types/app';

interface Project {
  id: string;
  name: string;
  color: string;
  status: 'active' | 'completed' | 'on-hold';
}

const mockProjects: Project[] = [
  { id: '1', name: '신재생에너지 플랜트', color: 'bg-blue-500', status: 'active' },
  { id: '2', name: '해상풍력 발전소 A', color: 'bg-green-500', status: 'active' },
  { id: '3', name: '수소생산시설 B', color: 'bg-orange-500', status: 'active' },
  { id: '4', name: '태양광 단지 C', color: 'bg-purple-500', status: 'completed' },
];

interface ProjectSelectorProps {
  onProjectChange: (projectId: string) => void;
  selectedProjectId: string;
  onMetaDrawingClick?: () => void;
  onNewProjectClick?: () => void;
  user: User; // 사용자 정보 추가
}

export function ProjectSelector({ 
  onProjectChange, 
  selectedProjectId, 
  onMetaDrawingClick, 
  onNewProjectClick,
  user
}: ProjectSelectorProps) {
  // 사용자가 접근 가능한 프로젝트만 필터링
  const accessibleProjects = getUserAccessibleProjects(user, mockProjects);
  const selectedProject = mockProjects.find(p => p.id === selectedProjectId);
  const canAccessSelectedProject = selectedProject ? canAccessProject(user, selectedProject.id) : false;

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${selectedProject?.color || 'bg-gray-400'}`} />
          <span className="text-sm text-muted-foreground">현재 프로젝트:</span>
        </div>
        
        <Select 
          value={canAccessSelectedProject ? selectedProjectId : ''} 
          onValueChange={onProjectChange}
          disabled={accessibleProjects.length === 0}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder={
              accessibleProjects.length === 0 
                ? "접근 가능한 프로젝트가 없습니다" 
                : "프로젝트를 선택하세요"
            } />
          </SelectTrigger>
          <SelectContent>
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
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${project.color}`} />
                    <span>{project.name}</span>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? '진행중' : project.status === 'completed' ? '완료' : '보류'}
                    </Badge>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onMetaDrawingClick}
                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white border-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden"
              >
                {/* 배경 글로우 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
                
                {/* 아이콘과 텍스트 */}
                <div className="relative flex items-center gap-2 z-10">
                  <Brain className="w-4 h-4 group-hover:animate-pulse" />
                  <span className="font-medium">Meta-Drawing</span>
                  <Sparkles className="w-3 h-3 group-hover:animate-bounce" />
                </div>
                
                {/* 호버 시 펄스 효과 */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-pulse rounded-lg" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p>AI 기반 도면 인식 및 분석</p>
                <p className="text-xs text-muted-foreground mt-1">Meta-Drawing 플랫폼으로 이동</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* 신규 프로젝트 등록 버튼 - 가장 우측에 배치 */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewProjectClick}
              className="flex items-center gap-2 h-9"
            >
              <Plus className="w-4 h-4" />
              <span>신규 프로젝트 등록</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            새로운 프로젝트를 생성합니다
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}