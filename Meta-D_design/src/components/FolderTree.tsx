import { useState } from 'react';
import { ChevronDown, ChevronRight, Folder, FolderOpen, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { canAccessProject } from '../utils/permissions';
import type { User } from '../types/app';

interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
  fileCount: number;
  isProject?: boolean;
}

interface Project {
  id: string;
  name: string;
  fileCount: number;
}

const projects: Project[] = [
  { id: '1', name: '신재생에너지 플랜트', fileCount: 1267 },
  { id: '2', name: '해상풍력 발전소 A', fileCount: 892 },
  { id: '3', name: '수소생산시설 B', fileCount: 634 },
  { id: '4', name: '태양광 단지 C', fileCount: 445 },
];

const projectSubfolders: FolderNode[] = [
  {
    id: 'general',
    name: 'Project General',
    fileCount: 125,
    children: [
      { id: 'general-specs', name: 'Specifications', fileCount: 45 },
      { id: 'general-contracts', name: 'Contracts', fileCount: 23 },
      { id: 'general-reports', name: 'Reports', fileCount: 57 },
    ]
  },
  {
    id: 'correspondence',
    name: 'Correspondence',
    fileCount: 89,
    children: [
      { id: 'corr-internal', name: 'Internal', fileCount: 34 },
      { id: 'corr-external', name: 'External', fileCount: 55 },
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    fileCount: 245,
    children: [
      { 
        id: 'eng-process', 
        name: 'Process', 
        fileCount: 78,
        children: [
          {
            id: 'eng-process-pid',
            name: 'P&ID',
            fileCount: 45,
            children: [
              { id: 'eng-process-pid-rev01', name: 'Rev.01', fileCount: 12 },
              { id: 'eng-process-pid-rev02', name: 'Rev.02', fileCount: 15 },
              { id: 'eng-process-pid-rev03', name: 'Rev.03', fileCount: 18 }
            ]
          },
          { id: 'eng-process-pfd', name: 'PFD', fileCount: 20 },
          { id: 'eng-process-hmi', name: 'HMI', fileCount: 13 }
        ]
      },
      { id: 'eng-mechanical', name: 'Mechanical', fileCount: 89 },
      { id: 'eng-electrical', name: 'Electrical', fileCount: 56 },
      { id: 'eng-civil', name: 'Civil', fileCount: 22 },
    ]
  },
  {
    id: 'procurement',
    name: 'Procurement',
    fileCount: 156,
    children: [
      { id: 'proc-rfq', name: 'RFQ', fileCount: 45 },
      { id: 'proc-proposals', name: 'Proposals', fileCount: 67 },
      { id: 'proc-awards', name: 'Awards', fileCount: 44 },
    ]
  },
  {
    id: 'construction',
    name: 'Construction',
    fileCount: 198,
    children: [
      { id: 'const-plans', name: 'Plans', fileCount: 78 },
      { id: 'const-progress', name: 'Progress Reports', fileCount: 56 },
      { id: 'const-photos', name: 'Photos', fileCount: 64 },
    ]
  },
  {
    id: 'partner',
    name: 'Partner',
    fileCount: 87,
    children: [
      { id: 'partner-vendor', name: 'Vendor Documents', fileCount: 43 },
      { id: 'partner-subcon', name: 'Subcontractor', fileCount: 44 },
    ]
  },
  {
    id: 'workflow',
    name: 'Workflow',
    fileCount: 67,
    children: [
      { id: 'workflow-approval', name: 'Approval Process', fileCount: 23 },
      { id: 'workflow-review', name: 'Review Cycles', fileCount: 44 },
    ]
  },
];

interface FolderTreeProps {
  onFolderSelect: (folderId: string) => void;
  selectedFolderId: string;
  user: User; // 사용자 정보로 변경
  hasSelectedFile: boolean; // 파일이 선택되었는지 여부
}

export function FolderTree({ onFolderSelect, selectedFolderId, user, hasSelectedFile }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '1-general', '1-engineering', '1-eng-process', '1-eng-process-pid']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // 사용자가 접근 가능한 프로젝트만 필터링
  const accessibleProjects = projects.filter(project => canAccessProject(user, project.id));

  const renderFolderNode = (projectId: string, folder: FolderNode, level: number = 1): JSX.Element => {
    const fullFolderId = `${projectId}-${folder.id}`;
    const isExpanded = expandedFolders.has(fullFolderId);
    const isSelected = selectedFolderId === fullFolderId;
    const hasChildren = folder.children && folder.children.length > 0;

    return (
      <div key={fullFolderId}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={`w-full justify-start gap-2 px-2 py-1 h-auto`}
          onClick={() => {
            onFolderSelect(fullFolderId);
            if (hasChildren) {
              toggleFolder(fullFolderId);
            }
          }}
        >
          <div style={{ marginLeft: `${level * 16}px` }} className="flex items-center gap-2">
            {hasChildren ? (
              isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="w-4" />
            )}
            {isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
            <span>{folder.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">({folder.fileCount})</span>
          </div>
        </Button>
        
        {hasChildren && isExpanded && folder.children?.map(child => 
          renderFolderNode(projectId, child, level + 1)
        )}
      </div>
    );
  };

  const renderProjectSubfolders = (projectId: string, level: number = 1) => {
    return projectSubfolders.map(folder => renderFolderNode(projectId, folder, level));
  };

  const renderProject = (project: Project) => {
    const isExpanded = expandedFolders.has(project.id);
    const isSelected = selectedFolderId === project.id;
    const hasAccess = canAccessProject(user, project.id);
    
    // 접근 권한이 없으면 렌더링하지 않음
    if (!hasAccess) return null;

    return (
      <div key={project.id}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className="w-full justify-start gap-2 px-2 py-1 h-auto"
          onClick={() => {
            onFolderSelect(project.id);
            toggleFolder(project.id);
          }}
        >
          <div className="flex items-center gap-2 w-full">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
            <span className="truncate flex-1">{project.name}</span>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                {user.projectAccess && user.projectAccess[project.id] ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        {user.projectAccess[project.id].level === 'admin' || user.projectAccess[project.id].level === 'readwrite' ? (
                          <Badge variant="outline" className="px-1 py-0 text-xs bg-green-50 text-green-700 border-green-200">MY</Badge>
                        ) : (
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{user.projectAccess[project.id].level === 'admin' || user.projectAccess[project.id].level === 'readwrite' ? '편집 가능' : '읽기 전용'}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>읽기 전용</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
              <span className="text-xs text-muted-foreground">({project.fileCount})</span>
            </div>
          </div>
        </Button>
        
        {isExpanded && renderProjectSubfolders(project.id)}
      </div>
    );
  };

  return (
    <div className="h-full border-r bg-card flex flex-col">
      <div className="p-4 pb-0 flex-shrink-0">
        <div className="mb-4">
          <h3>프로젝트 폴더</h3>
        </div>
      </div>
      <div className="flex-1 px-4 pb-4">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {accessibleProjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">접근 가능한 프로젝트가 없습니다</p>
              </div>
            ) : (
              accessibleProjects.map(project => renderProject(project))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}