import { useState, useMemo, useCallback, useRef } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner@2.0.3';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Activity,
  Clock,
  FileText,
  Eye,
  Lock,
  UserPlus,
  UserMinus,
  X,
  Save,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  FileDown,
  Loader2,
  Building2,
  Target,
  TrendingUp
} from 'lucide-react';
import type { User } from '../types/app';
import { getUserPermissions, canUserPerform, getPermissionBasedStyles, canAccessProject, canEditProject } from '../utils/permissions';

interface ProjectManagementProps {
  onBack: () => void;
  user: User;
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onUserManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing') => void;
  onProjectCreate: () => void;
  onProjectEdit: (project: any) => void;
  onProjectView: (project: any) => void;
}

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  team?: string;
  joinedDate: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'planning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  memberCount: number;
  fileCount: number;
  progress: number;
  budget?: number;
  spent?: number;
  category: string;
  location?: string;
  client?: string;
  members: ProjectMember[];
  tags: string[];
  isArchived?: boolean;
}

// 페이지네이션 설정
const ITEMS_PER_PAGE = 20;
const PAGE_SIZE_OPTIONS = [20, 50, 100];

// 정렬 옵션
type SortField = 'name' | 'status' | 'priority' | 'progress' | 'createdAt' | 'memberCount' | 'budget';
type SortDirection = 'asc' | 'desc';

// 대용량 프로젝트 데이터 생성 함수
const generateProjects = (count: number): Project[] => {
  const statuses: Project['status'][] = ['active', 'paused', 'completed', 'planning'];
  const priorities: Project['priority'][] = ['low', 'medium', 'high', 'critical'];
  const categories = ['에너지', '건설', '인프라', 'IT', '제조', '환경', '교통', '의료'];
  const locations = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원'];
  const clients = ['A그룹', 'B회사', 'C건설', 'D에너지', 'E산업', 'F개발', 'G시스템', 'H테크'];
  
  const baseProjects: Project[] = [
    {
      id: '1',
      name: '신재생에너지 플랜트',
      description: '태양광 및 풍력 발전소 통합 설계 프로젝트',
      status: 'active',
      priority: 'high',
      createdAt: '2024-01-15',
      updatedAt: '2024-12-10',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      memberCount: 8,
      fileCount: 234,
      progress: 75,
      budget: 15000000000,
      spent: 11250000000,
      category: '에너지',
      location: '울산',
      client: 'A그룹',
      members: [
        { 
          id: '1', 
          name: 'admin', 
          email: 'admin@hcompany.com', 
          role: 'IT 부서 시스템 관리자', 
          department: '경영지원본부', 
          team: 'IT팀',
          joinedDate: '2024-01-15'
        },
        { 
          id: '2', 
          name: '김철수', 
          email: 'kim.cheolsu@hcompany.com', 
          role: '설계 엔지니어', 
          department: '플랜트본부', 
          team: '설계엔지니어링팀',
          joinedDate: '2024-01-20'
        }
      ],
      tags: ['태양광', '풍력', '신재생에너지']
    },
    {
      id: '2',
      name: '해상풍력 발전소 A',
      description: '서해안 해상풍력 발전소 건설 프로젝트',
      status: 'active',
      priority: 'critical',
      createdAt: '2024-03-20',
      updatedAt: '2024-12-08',
      startDate: '2024-03-20',
      endDate: '2025-06-30',
      memberCount: 12,
      fileCount: 456,
      progress: 45,
      budget: 25000000000,
      spent: 11250000000,
      category: '에너지',
      location: '인천',
      client: 'B회사',
      members: [
        { 
          id: '2', 
          name: '김철수', 
          email: 'kim.cheolsu@hcompany.com', 
          role: '설계 엔지니어', 
          department: '플랜트본부', 
          team: '설계엔지니어링팀',
          joinedDate: '2024-03-20'
        }
      ],
      tags: ['해상풍력', '대형프로젝트']
    }
  ];

  // 추가 프로젝트 생성
  const additionalProjects: Project[] = [];
  for (let i = 3; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const client = clients[Math.floor(Math.random() * clients.length)];
    
    const startDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const endDate = new Date(startDate.getTime() + (Math.random() * 365 * 24 * 60 * 60 * 1000 * 2)); // 최대 2년 후
    
    const memberCount = Math.floor(Math.random() * 20) + 1;
    const progress = status === 'completed' ? 100 : Math.floor(Math.random() * 90);
    const budget = Math.floor(Math.random() * 50000000000) + 1000000000; // 10억 ~ 500억
    const spent = Math.floor(budget * (progress / 100) * (0.8 + Math.random() * 0.4)); // 예산의 80-120%
    
    additionalProjects.push({
      id: i.toString(),
      name: `${category} 프로젝트 ${i}`,
      description: `${category} 분야의 대형 프로젝트 ${i}`,
      status,
      priority,
      createdAt: startDate.toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      memberCount,
      fileCount: Math.floor(Math.random() * 1000) + 50,
      progress,
      budget,
      spent,
      category,
      location,
      client,
      members: [
        {
          id: '1',
          name: 'admin',
          email: 'admin@hcompany.com',
          role: 'IT 부서 시스템 관리자',
          department: '경영지원본부',
          team: 'IT팀',
          joinedDate: startDate.toISOString().split('T')[0]
        }
      ],
      tags: [category, location]
    });
  }

  return [...baseProjects, ...additionalProjects];
};

export function ProjectManagement({ 
  onBack, 
  user, 
  onProfileSettingsClick, 
  onSystemSettingsClick, 
  onAISettingsClick, 
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  onProjectCreate,
  onProjectEdit,
  onProjectView
}: ProjectManagementProps) {
  // 기본 상태
  const [projects, setProjects] = useState<Project[]>(() => generateProjects(1500)); // 1500개 테스트 데이터
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  
  // 필터 상태
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  
  // 정렬 상태
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // 다이얼로그 상태
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    priority: 'medium' as const,
    category: '',
    location: '',
    client: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // 사용자 권한 체크
  const permissions = getUserPermissions(user);
  const isReadOnly = user.projectPermissions === 'readonly';

  // 고급 필터 옵션 생성
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(projects.map(p => p.category).filter(Boolean))).sort();
    const locations = Array.from(new Set(projects.map(p => p.location).filter(Boolean))).sort();
    
    return { categories, locations };
  }, [projects]);

  // 필터링 및 정렬된 프로젝트 목록
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(p => {
      const matchesSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || p.priority === filterPriority;
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      const matchesLocation = filterLocation === 'all' || p.location === filterLocation;
      
      // 사용자가 접근할 수 있는 프로젝트만 포함
      const hasAccess = canAccessProject(user, p.id);
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesLocation && !p.isArchived && hasAccess;
    });

    // 정렬 적용
    filtered.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      
      switch (sortField) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'priority':
          const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'memberCount':
          aValue = a.memberCount;
          bValue = b.memberCount;
          break;
        case 'budget':
          aValue = a.budget || 0;
          bValue = b.budget || 0;
          break;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        const comparison = (aValue as number) - (bValue as number);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
    });

    return filtered;
  }, [projects, searchQuery, filterStatus, filterPriority, filterCategory, filterLocation, sortField, sortDirection]);

  // 페이지네이션 계산
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);

  // 통계 계산
  const stats = useMemo(() => {
    const active = projects.filter(p => p.status === 'active' && !p.isArchived).length;
    const completed = projects.filter(p => p.status === 'completed' && !p.isArchived).length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
    const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / projects.length;
    
    return {
      total: projects.filter(p => !p.isArchived).length,
      active,
      completed,
      totalBudget,
      totalSpent,
      avgProgress: Math.round(avgProgress)
    };
  }, [projects]);

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 검색 디바운싱
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const handleSearchChange = useCallback((value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 300);
  }, []);

  // 필터 초기화
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterCategory('all');
    setFilterLocation('all');
    setCurrentPage(1);
  };

  // 프로젝트 생성
  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast.error('프로젝트 이름을 입력해주세요.');
      return;
    }

    const project: Project = {
      id: (projects.length + 1).toString(),
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      priority: newProject.priority,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      memberCount: 1,
      fileCount: 0,
      progress: 0,
      category: newProject.category || '기타',
      location: newProject.location,
      client: newProject.client,
      members: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department || '기타',
          team: user.team,
          joinedDate: new Date().toISOString().split('T')[0]
        }
      ],
      tags: []
    };

    setProjects([...projects, project]);
    setNewProject({ 
      name: '', 
      description: '', 
      status: 'planning', 
      priority: 'medium',
      category: '',
      location: '',
      client: ''
    });
    setIsCreating(false);
    toast.success('새 프로젝트가 생성되었습니다.');
  };

  // 프로젝트 삭제
  const handleDeleteProject = () => {
    if (!selectedProject) return;

    setProjects(projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, isArchived: true }
        : p
    ));
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
    toast.success('프로젝트가 아카이브되었습니다.');
  };

  // 일괄 아카이브
  const handleBulkArchive = () => {
    setProjects(projects.map(p => 
      selectedProjects.includes(p.id) 
        ? { ...p, isArchived: true }
        : p
    ));
    setSelectedProjects([]);
    toast.success(`${selectedProjects.length}개 프로젝트가 아카이브되었습니다.`);
  };

  // 데이터 내보내기
  const handleExportData = () => {
    const csvContent = [
      ['프로젝트명', '상태', '우선순위', '진행률', '카테고리', '위치', '고객사', '예산', '지출', '생성일'],
      ...filteredAndSortedProjects.map(p => [
        p.name,
        p.status,
        p.priority,
        `${p.progress}%`,
        p.category,
        p.location || '',
        p.client || '',
        p.budget?.toLocaleString() || '',
        p.spent?.toLocaleString() || '',
        p.createdAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `projects_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success(`${filteredAndSortedProjects.length}개 프로젝트 데이터를 내보냈습니다.`);
  };

  // 유틸리티 함수들
  const getStatusBadge = (status: Project['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      planning: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const labels = {
      active: '진행중',
      paused: '일시정지',
      completed: '완료',
      planning: '계획중'
    };
    
    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const getPriorityBadge = (priority: Project['priority']) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      low: '낮음',
      medium: '보통',
      high: '높음',
      critical: '긴급'
    };
    
    return <Badge className={styles[priority]}>{labels[priority]}</Badge>;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="w-4 h-4" /> : 
      <SortDesc className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => {
    return (amount / 100000000).toFixed(1) + '억원';
  };

  // 권한 기반 버튼 스타일
  const createButtonStyles = getPermissionBasedStyles(user, 'canCreateProjects');
  const editButtonStyles = getPermissionBasedStyles(user, 'canEditProjects');
  const deleteButtonStyles = getPermissionBasedStyles(user, 'canDeleteProjects');

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
        {/* Header */}
        <Header
          user={user}
          onProfileSettingsClick={onProfileSettingsClick}
          onSystemSettingsClick={onSystemSettingsClick}
          onAISettingsClick={onAISettingsClick}
          onProjectManagementClick={onProjectManagementClick}
          onUserManagementClick={onUserManagementClick}
          onLogout={onLogout}
          currentModule="Meta-Drive"
          onModuleSwitch={onModuleSwitch}
        />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl">프로젝트 관리</h1>
                <p className="text-muted-foreground">
                  {filteredAndSortedProjects.length.toLocaleString()}개의 프로젝트 관리 및 모니터링
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                onClick={handleExportData}
                className="gap-2"
              >
                <FileDown className="w-4 h-4" />
                내보내기
              </Button>
              
              <Button onClick={onBack} variant="outline">
                돌아가기
              </Button>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={onProjectCreate}
                      disabled={createButtonStyles.disabled}
                      className={`gap-2 ${createButtonStyles.className}`}
                    >
                      <Plus className="w-4 h-4" />
                      새 프로젝트
                    </Button>
                  </div>
                </TooltipTrigger>
                {createButtonStyles.tooltip && (
                  <TooltipContent>{createButtonStyles.tooltip}</TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-blue-600" />
                  전체 프로젝트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  진행중
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  전체의 {((stats.active / stats.total) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  완료
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.completed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  전체의 {((stats.completed / stats.total) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  평균 진행률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.avgProgress}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(stats.avgProgress)}`}
                    style={{ width: `${stats.avgProgress}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  총 예산
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalBudget)}</div>
                <p className="text-xs text-muted-foreground">
                  집행률 {((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* 첫 번째 행: 검색과 기본 필터 */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="프로젝트명, 설명, 카테고리, 고객사, 태그로 검색..."
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="상태" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 상태</SelectItem>
                      <SelectItem value="planning">계획중</SelectItem>
                      <SelectItem value="active">진행중</SelectItem>
                      <SelectItem value="paused">일시정지</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="우선순위" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 우선순위</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="critical">긴급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 두 번째 행: 상세 필터 */}
                <div className="flex items-center gap-4">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 카테고리</SelectItem>
                      {filterOptions.categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="위치" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 위치</SelectItem>
                      {filterOptions.locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map(size => (
                        <SelectItem key={size} value={size.toString()}>{size}개씩</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex-1" />
                  
                  <Badge variant="secondary">
                    {filteredAndSortedProjects.length.toLocaleString()}개 프로젝트
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    필터 초기화
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 일괄 작업 버튼 */}
          {!isReadOnly && selectedProjects.length > 0 && (
            <Card className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">
                      {selectedProjects.length}개 프로젝트 선택됨
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleBulkArchive}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      아카이브
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedProjects([])}
                    >
                      선택 해제
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 프로젝트 테이블 */}
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="overflow-hidden flex-1">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      {!isReadOnly && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedProjects.length === paginatedProjects.length && paginatedProjects.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedProjects(paginatedProjects.map(p => p.id));
                              } else {
                                setSelectedProjects([]);
                              }
                            }}
                          />
                        </TableHead>
                      )}
                      <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-2">
                          프로젝트명
                          {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                        <div className="flex items-center gap-2">
                          상태
                          {getSortIcon('status')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>
                        <div className="flex items-center gap-2">
                          우선순위
                          {getSortIcon('priority')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('progress')}>
                        <div className="flex items-center gap-2">
                          진행률
                          {getSortIcon('progress')}
                        </div>
                      </TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('memberCount')}>
                        <div className="flex items-center gap-2">
                          팀원
                          {getSortIcon('memberCount')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('budget')}>
                        <div className="flex items-center gap-2">
                          예산
                          {getSortIcon('budget')}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>
                        <div className="flex items-center gap-2">
                          생성일
                          {getSortIcon('createdAt')}
                        </div>
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={isReadOnly ? 9 : 10} className="text-center py-8">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            로딩 중...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : paginatedProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isReadOnly ? 9 : 10} className="text-center py-8">
                          <div className="text-muted-foreground">
                            검색 조건에 맞는 프로젝트가 없습니다.
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedProjects.map((project) => (
                        <TableRow 
                          key={project.id}
                          className="hover:bg-slate-50 cursor-pointer"
                          onClick={() => {
                            onProjectView(project);
                          }}
                        >
                          {!isReadOnly && (
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedProjects.includes(project.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedProjects([...selectedProjects, project.id]);
                                  } else {
                                    setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                                  }
                                }}
                              />
                            </TableCell>
                          )}
                          <TableCell>
                            <div>
                              <div className="font-medium">{project.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {project.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell>{getPriorityBadge(project.priority)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{project.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {project.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{project.memberCount}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {project.budget ? formatCurrency(project.budget) : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onProjectView(project);
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>프로젝트 상세 보기</TooltipContent>
                              </Tooltip>
                              
                              {canEditProject(user, project.id) && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onProjectEdit(project);
                                      }}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>프로젝트 편집</TooltipContent>
                                </Tooltip>
                              )}
                              
                              {canEditProject(user, project.id) && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProject(project);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>프로젝트 삭제</TooltipContent>
                                </Tooltip>
                              )}
                              
                              {!canEditProject(user, project.id) && canAccessProject(user, project.id) && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="h-8 w-8 flex items-center justify-center">
                                      <Lock className="w-3 h-3 text-muted-foreground" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>읽기 전용</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {((currentPage - 1) * itemsPerPage + 1).toLocaleString()}-{Math.min(currentPage * itemsPerPage, filteredAndSortedProjects.length).toLocaleString()} / {filteredAndSortedProjects.length.toLocaleString()}개 프로젝트
                    </div>
                    
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 삭제 확인 다이얼로그 */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>프로젝트 아카이브</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 "{selectedProject?.name}" 프로젝트를 아카이브하시겠습니까?
                아카이브된 프로젝트는 목록에서 숨겨지지만 데이터는 보존됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProject} className="bg-red-600 hover:bg-red-700">
                아카이브
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}