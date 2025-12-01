import { useState } from 'react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChevronRight, ChevronDown, File, FolderOpen, Folder, Eye, EyeOff, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface DrawingNode {
  id: string;
  name: string;
  type: 'unit' | 'drawing';
  status: 'analyzing' | 'completed' | 'error' | 'pending';
  children?: DrawingNode[];
  visible?: boolean;
  progress?: number;
  revision?: string;
}

interface DrawingTreeProps {
  selectedDrawingId?: string;
  onDrawingSelect: (drawingId: string) => void;
  className?: string;
}

export function DrawingTree({ selectedDrawingId, onDrawingSelect, className = '' }: DrawingTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['unit-1', 'unit-2']));
  const [hiddenDrawings, setHiddenDrawings] = useState<Set<string>>(new Set());
  const [selectedRevision, setSelectedRevision] = useState<string>('Rev.03');

  // 리비전별 도면 데이터
  const drawingDataByRevision = {
    'Rev.01': [
      {
        id: 'unit-1',
        name: 'Process Unit A',
        type: 'unit',
        status: 'completed',
        children: [
          { id: 'dwg-101-r01', name: 'P&ID-101-General', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.01' },
          { id: 'dwg-102-r01', name: 'P&ID-102-Heat Exchanger', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.01' },
          { id: 'dwg-103-r01', name: 'P&ID-103-Reactor', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.01' },
        ]
      },
      {
        id: 'unit-2', 
        name: 'Utility Unit B',
        type: 'unit',
        status: 'completed',
        children: [
          { id: 'dwg-201-r01', name: 'P&ID-201-Steam System', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.01' },
          { id: 'dwg-202-r01', name: 'P&ID-202-Cooling Water', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.01' },
        ]
      }
    ],
    'Rev.02': [
      {
        id: 'unit-1',
        name: 'Process Unit A',
        type: 'unit',
        status: 'completed',
        children: [
          { id: 'dwg-101-r02', name: 'P&ID-101-General', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
          { id: 'dwg-102-r02', name: 'P&ID-102-Heat Exchanger', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
          { id: 'dwg-103-r02', name: 'P&ID-103-Reactor', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
          { id: 'dwg-104-r02', name: 'Layout-101-Equipment', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
        ]
      },
      {
        id: 'unit-2', 
        name: 'Utility Unit B',
        type: 'unit',
        status: 'completed',
        children: [
          { id: 'dwg-201-r02', name: 'P&ID-201-Steam System', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
          { id: 'dwg-202-r02', name: 'P&ID-202-Cooling Water', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
          { id: 'dwg-203-r02', name: 'Electrical-201-Power', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
        ]
      },
      {
        id: 'unit-3',
        name: 'Storage Unit C', 
        type: 'unit',
        status: 'completed',
        children: [
          { id: 'dwg-301-r02', name: 'P&ID-301-Tank Farm', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.02' },
        ]
      }
    ],
    'Rev.03': [
      {
        id: 'unit-1',
        name: 'Process Unit A',
        type: 'unit',
        status: 'completed',
        children: [
          { id: 'dwg-101-r03', name: 'P&ID-101-General', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.03' },
          { id: 'dwg-102-r03', name: 'P&ID-102-Heat Exchanger', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.03' },
          { id: 'dwg-103-r03', name: 'P&ID-103-Reactor', type: 'drawing', status: 'analyzing', visible: true, progress: 75, revision: 'Rev.03' },
          { id: 'dwg-104-r03', name: 'Layout-101-Equipment', type: 'drawing', status: 'error', visible: true, revision: 'Rev.03' },
          { id: 'dwg-105-r03', name: 'P&ID-105-Control Systems', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.03' },
        ]
      },
      {
        id: 'unit-2', 
        name: 'Utility Unit B',
        type: 'unit',
        status: 'analyzing',
        children: [
          { id: 'dwg-201-r03', name: 'P&ID-201-Steam System', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.03' },
          { id: 'dwg-202-r03', name: 'P&ID-202-Cooling Water', type: 'drawing', status: 'pending', visible: true, revision: 'Rev.03' },
          { id: 'dwg-203-r03', name: 'Electrical-201-Power', type: 'drawing', status: 'analyzing', visible: true, progress: 45, revision: 'Rev.03' },
          { id: 'dwg-204-r03', name: 'P&ID-204-Emergency Systems', type: 'drawing', status: 'completed', visible: true, revision: 'Rev.03' },
        ]
      },
      {
        id: 'unit-3',
        name: 'Storage Unit C', 
        type: 'unit',
        status: 'pending',
        children: [
          { id: 'dwg-301-r03', name: 'P&ID-301-Tank Farm', type: 'drawing', status: 'pending', visible: true, revision: 'Rev.03' },
          { id: 'dwg-302-r03', name: 'Layout-301-Tank Layout', type: 'drawing', status: 'pending', visible: true, revision: 'Rev.03' },
          { id: 'dwg-303-r03', name: 'P&ID-303-Loading System', type: 'drawing', status: 'analyzing', visible: true, progress: 30, revision: 'Rev.03' },
        ]
      }
    ]
  };

  // 현재 선택된 리비전의 도면 데이터
  const mockDrawingTree: DrawingNode[] = drawingDataByRevision[selectedRevision as keyof typeof drawingDataByRevision] || [];

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleVisibility = (drawingId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHidden = new Set(hiddenDrawings);
    if (newHidden.has(drawingId)) {
      newHidden.delete(drawingId);
    } else {
      newHidden.add(drawingId);
    }
    setHiddenDrawings(newHidden);
  };

  const getStatusIcon = (status: string, progress?: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'analyzing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      completed: { variant: 'default' as const, label: '완료' },
      analyzing: { variant: 'secondary' as const, label: '분석중' },
      error: { variant: 'destructive' as const, label: '오류' },
      pending: { variant: 'outline' as const, label: '대기' }
    };
    const config = configs[status as keyof typeof configs];
    return config ? <Badge variant={config.variant} className="text-xs">{config.label}</Badge> : null;
  };

  const renderDrawingNode = (node: DrawingNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedDrawingId === node.id;
    const isHidden = hiddenDrawings.has(node.id);
    const paddingLeft = `${level * 16 + 12}px`;

    if (node.type === 'unit') {
      return (
        <div key={node.id}>
          <div
            className={`flex items-center gap-2 p-2 hover:bg-accent cursor-pointer group transition-colors ${
              isSelected ? 'bg-accent' : ''
            }`}
            style={{ paddingLeft }}
            onClick={() => toggleExpanded(node.id)}
          >
            {node.children && node.children.length > 0 && (
              isExpanded ? 
                <ChevronDown className="w-4 h-4 text-muted-foreground" /> :
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            {isExpanded ? <FolderOpen className="w-4 h-4 text-blue-600" /> : <Folder className="w-4 h-4 text-blue-600" />}
            <span className="font-medium text-sm flex-1">{node.name}</span>
            {getStatusBadge(node.status)}
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderDrawingNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.id}
        className={`flex items-center gap-2 p-2 hover:bg-accent cursor-pointer group transition-colors ${
          isSelected ? 'bg-blue-50 border-r-2 border-blue-600' : ''
        } ${isHidden ? 'opacity-50' : ''}`}
        style={{ paddingLeft }}
        onClick={() => onDrawingSelect(node.id)}
      >
        <File className="w-4 h-4 text-gray-600" />
        <span className="text-sm flex-1 truncate">{node.name}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {getStatusIcon(node.status, node.progress)}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => toggleVisibility(node.id, e)}
          >
            {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>
        {node.status === 'analyzing' && node.progress && (
          <div className="w-8 text-xs text-blue-600">{node.progress}%</div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white border-r border-border flex flex-col h-full ${className}`}>
      {/* 헤더 - 고정 */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-gray-900">도면 트리</h3>
          <Select value={selectedRevision} onValueChange={setSelectedRevision}>
            <SelectTrigger className="w-[78px] h-8 text-xs mr-[24px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Rev.01">Rev.01</SelectItem>
              <SelectItem value="Rev.02">Rev.02</SelectItem>
              <SelectItem value="Rev.03">Rev.03</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          유닛별 도면 목록 및 AI 인식 상태
        </p>
      </div>

      {/* 스크롤 영역 - 남은 공간 차지 */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-2">
            {mockDrawingTree.map(node => renderDrawingNode(node))}
          </div>
        </ScrollArea>
      </div>

      {/* 하단 통계 - 항상 최하단 고정 */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">
            {selectedRevision} 통계
          </span>
          <Badge variant="outline" className="text-xs">
            총 {mockDrawingTree.reduce((acc, unit) => acc + (unit.children?.length || 0), 0)}개
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>완료: {mockDrawingTree.reduce((acc, unit) => 
              acc + (unit.children?.filter(child => child.status === 'completed').length || 0), 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>분석중: {mockDrawingTree.reduce((acc, unit) => 
              acc + (unit.children?.filter(child => child.status === 'analyzing').length || 0), 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>오류: {mockDrawingTree.reduce((acc, unit) => 
              acc + (unit.children?.filter(child => child.status === 'error').length || 0), 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>대기: {mockDrawingTree.reduce((acc, unit) => 
              acc + (unit.children?.filter(child => child.status === 'pending').length || 0), 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}