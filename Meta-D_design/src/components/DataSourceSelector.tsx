import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { 
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  Search,
  Building2,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { FolderNode } from '../types/app';

interface DataSourceSelectorProps {
  folderStructure: FolderNode[];
  selectedFolders: string[];
  onSelectionChange: (selectedFolders: string[]) => void;
}

export function DataSourceSelector({
  folderStructure,
  selectedFolders,
  onSelectionChange
}: DataSourceSelectorProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['proj1', 'proj2']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // 노드 확장/축소
  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // 폴더 선택/해제
  const toggleFolder = (folderId: string) => {
    const newSelected = selectedFolders.includes(folderId)
      ? selectedFolders.filter(id => id !== folderId)
      : [...selectedFolders, folderId];
    
    onSelectionChange(newSelected);
  };

  // 프로젝트 전체 선택/해제
  const toggleProject = (projectId: string) => {
    const projectFolders = getAllFolderIds(
      folderStructure.find(p => p.id === projectId)?.children || []
    );
    
    const allSelected = projectFolders.every(id => selectedFolders.includes(id));
    
    if (allSelected) {
      // 모든 프로젝트 폴더 해제
      onSelectionChange(selectedFolders.filter(id => !projectFolders.includes(id)));
    } else {
      // 모든 프로젝트 폴더 선택
      const newSelected = [...new Set([...selectedFolders, ...projectFolders])];
      onSelectionChange(newSelected);
    }
  };

  // 모든 하위 폴더 ID 가져오기
  const getAllFolderIds = (nodes: FolderNode[]): string[] => {
    const ids: string[] = [];
    nodes.forEach(node => {
      if (node.type === 'folder') {
        ids.push(node.id);
        if (node.children) {
          ids.push(...getAllFolderIds(node.children));
        }
      }
    });
    return ids;
  };

  // 검색 필터링
  const filterNodes = (nodes: FolderNode[]): FolderNode[] => {
    if (!searchQuery && !showSelectedOnly) return nodes;

    return nodes.map(node => {
      const matchesSearch = !searchQuery || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSelection = !showSelectedOnly || 
        (node.type === 'folder' && selectedFolders.includes(node.id)) ||
        (node.children && node.children.some(child => 
          child.type === 'folder' && selectedFolders.includes(child.id)
        ));

      const filteredChildren = node.children ? filterNodes(node.children) : undefined;
      const hasMatchingChildren = filteredChildren && filteredChildren.length > 0;

      if ((matchesSearch && matchesSelection) || hasMatchingChildren) {
        return {
          ...node,
          children: filteredChildren
        };
      }

      return null;
    }).filter(Boolean) as FolderNode[];
  };

  // 프로젝트의 선택 상태 확인
  const getProjectSelectionState = (projectId: string) => {
    const projectFolders = getAllFolderIds(
      folderStructure.find(p => p.id === projectId)?.children || []
    );
    
    const selectedCount = projectFolders.filter(id => selectedFolders.includes(id)).length;
    
    if (selectedCount === 0) return 'none';
    if (selectedCount === projectFolders.length) return 'all';
    return 'partial';
  };

  // 폴더 트리 렌더링
  const renderFolderTree = (nodes: FolderNode[], level = 0) => {
    return nodes.map(node => {
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedFolders.includes(node.id);
      const hasChildren = node.children && node.children.length > 0;

      if (node.type === 'project') {
        const selectionState = getProjectSelectionState(node.id);
        
        return (
          <div key={node.id} className="mb-4">
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-slate-600" />
                      <CardTitle className="text-base">{node.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      프로젝트
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleProject(node.id)}
                      className={
                        selectionState === 'all' ? 'bg-green-50 border-green-300 text-green-700' :
                        selectionState === 'partial' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                        ''
                      }
                    >
                      {selectionState === 'all' ? '전체 해제' :
                       selectionState === 'partial' ? '전체 선택' : '전체 선택'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(node.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <Collapsible open={isExpanded}>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {hasChildren && renderFolderTree(node.children!, level + 1)}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        );
      }

      return (
        <div key={node.id} className={`ml-${level * 4}`}>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleFolder(node.id)}
              disabled={node.type !== 'folder'}
            />
            
            <div className="flex items-center gap-2 flex-1">
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(node.id)}
                  className="p-0 h-auto"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              ) : (
                <div className="w-4" />
              )}
              
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-600" />
              ) : (
                <Folder className="w-4 h-4 text-slate-600" />
              )}
              
              <span className={`${isSelected ? 'font-medium text-blue-600' : ''}`}>
                {node.name}
              </span>
              
              {node.fileCount && (
                <Badge variant="outline" className="text-xs ml-auto">
                  <FileText className="w-3 h-3 mr-1" />
                  {node.fileCount}
                </Badge>
              )}
            </div>

            {isSelected && (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            )}
          </div>

          {hasChildren && isExpanded && (
            <div className="ml-6 border-l border-slate-200 pl-4 mt-2">
              {renderFolderTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredStructure = filterNodes(folderStructure);

  return (
    <div className="space-y-4">
      {/* 검색 및 필터 */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="폴더 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-selected"
            checked={showSelectedOnly}
            onCheckedChange={(checked) => setShowSelectedOnly(checked as boolean)}
          />
          <label htmlFor="show-selected" className="text-sm">
            선택된 것만 보기
          </label>
        </div>
      </div>

      {/* 선택 통계 */}
      {selectedFolders.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-600">
            {selectedFolders.length}개 폴더가 선택되었습니다
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange([])}
            className="text-blue-600 hover:text-blue-700 ml-auto"
          >
            전체 해제
          </Button>
        </div>
      )}

      {/* 도움말 */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
        <Info className="w-4 h-4 text-amber-600 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-medium mb-1">데이터 소스 선택 가이드</p>
          <ul className="space-y-1 text-xs">
            <li>• AI가 답변할 때 참고할 폴더를 선택하세요</li>
            <li>• 관련성이 높은 폴더를 선택할수록 더 정확한 답변을 얻을 수 있습니다</li>
            <li>• 너무 많은 폴더를 선택하면 응답 속도가 느려질 수 있습니다</li>
          </ul>
        </div>
      </div>

      {/* 폴더 트리 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">프로젝트 폴더 구조</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {filteredStructure.length > 0 ? (
              <div className="space-y-2">
                {renderFolderTree(filteredStructure)}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="w-8 h-8 mx-auto mb-2" />
                <p>검색 결과가 없습니다</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}