import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { toast } from 'sonner@2.0.3';

import { 
  Search, 
  Users, 
  UserCheck, 
  UserX, 
  Trash2, 
  Edit, 
  Shield, 
  User as UserIcon,
  Plus,
  Upload,
  UserPlus,
  Download,
  Building2,
  AlertTriangle,
  Info,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  RefreshCw,
  FileDown,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import type { User } from '../types/app';

interface UserManagementProps {
  onBack: () => void;
  user: User;
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing') => void;
}

// 라이선스 할당 제한
const LICENSE_LIMITS = {
  pro: 50, // Pro 라이선스는 최대 50명까지 할당 가능
  basic: 9999 // Basic 라이선스는 제한 없음
};

// 페이지네이션 설정
const ITEMS_PER_PAGE = 25;
const PAGE_SIZE_OPTIONS = [25, 50, 100, 200];

// 정렬 옵션
type SortField = 'name' | 'email' | 'department' | 'team' | 'joinDate' | 'licenseType';
type SortDirection = 'asc' | 'desc';

// 대용량 더미 데이터 생성 함수
const generateUsers = (count: number): User[] => {
  const departments = ['경영지원본부', '플랜트본부', '구매본부', '주택본부', '품질본부', '건설본부', '안전본부', 'IT본부'];
  const teams = ['설계엔지니어링팀', '플랜트구매팀', '건설설계팀', '품질관리팀', 'IT팀', '안전관리팀', '프로젝트관리팀', '연구개발팀'];
  const positions = ['인턴', '사원', '대리', '과장', '차장', '부장', '상무', '전무'];
  const teamTypes = ['engineering', 'procurement', 'construction', 'qa', 'management', 'safety'] as const;
  const chatbotRoles = ['user', 'team_admin', 'system_admin'] as const;
  
  const baseUsers: User[] = [
    {
      id: '1',
      name: 'admin',
      email: 'admin@hcompany.com',
      role: 'IT 부서 시스템 관리자',
      position: '대리',
      chatbotRole: 'system_admin',
      licenseType: 'pro',
      department: '경영지원본부',
      team: 'IT팀',
      joinDate: '2020-01-01',
      bio: 'Meta-Drive 시스템 전체 관리자',
      phone: '02-1234-5678',
      registeredPersonas: ['1', '3']
    },
    {
      id: '2',
      name: '김철수',
      email: 'kim.cheolsu@hcompany.com',
      role: '설계 엔지니어',
      position: '팀장',
      chatbotRole: 'team_admin',
      teamType: 'engineering',
      licenseType: 'pro',
      department: '플랜트본부',
      team: '설계엔지니어링팀',
      joinDate: '2021-03-15',
      bio: '플랜트 설계 전문 엔지니어',
      phone: '02-1234-5679',
      registeredPersonas: ['1', '2']
    },
    {
      id: '3',
      name: '박구매',
      email: 'park.procurement@hcompany.com',
      role: '구매 담당자',
      position: '대리',
      chatbotRole: 'user',
      teamType: 'procurement',
      licenseType: 'basic',
      department: '구매본부',
      team: '플랜트구매팀',
      joinDate: '2022-07-01',
      bio: '자재 및 장비 구매 업무 담당',
      phone: '02-1234-5680',
      registeredPersonas: ['3']
    }
  ];

  // 추가 사용자 생성
  const additionalUsers: User[] = [];
  for (let i = 4; i <= count; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const team = teams[Math.floor(Math.random() * teams.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const teamType = teamTypes[Math.floor(Math.random() * teamTypes.length)];
    const chatbotRole = Math.random() > 0.8 ? 'team_admin' : 'user';
    const licenseType = i <= 35 ? 'pro' : 'basic'; // 처음 35명은 Pro 라이선스
    
    additionalUsers.push({
      id: i.toString(),
      name: `사용자${i}`,
      email: `user${i}@hcompany.com`,
      role: `${team} 담당자`,
      position,
      chatbotRole,
      teamType,
      licenseType,
      department,
      team,
      joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      bio: `${department} ${team} 업무 담당`,
      phone: `02-1234-${5680 + i}`,
      registeredPersonas: Math.random() > 0.5 ? ['1'] : []
    });
  }

  return [...baseUsers, ...additionalUsers];
};

export function UserManagement({ 
  onBack, 
  user, 
  onProfileSettingsClick, 
  onSystemSettingsClick, 
  onAISettingsClick, 
  onProjectManagementClick,
  onLogout,
  onModuleSwitch
}: UserManagementProps) {
  // 기본 상태
  const [users, setUsers] = useState<User[]>(() => generateUsers(1250)); // 1250명 테스트 데이터
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // 필터 상태
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterLicense, setFilterLicense] = useState<string>('all');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // 정렬 상태
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // 다이얼로그 상태
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  
  // 신규 사용자 추가 상태
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    position: '',
    department: '',
    team: '',
    phone: '',
    bio: '',
    chatbotRole: 'user' as const,
    licenseType: 'basic' as const
  });

  // 고급 필터 옵션 생성
  const filterOptions = useMemo(() => {
    const departments = Array.from(new Set(users.map(u => u.department).filter(Boolean))).sort();
    const teams = Array.from(new Set(users.map(u => u.team).filter(Boolean))).sort();
    const positions = Array.from(new Set(users.map(u => u.position).filter(Boolean))).sort();
    const roles = Array.from(new Set(users.map(u => u.role).filter(Boolean))).sort();
    
    return { departments, teams, positions, roles };
  }, [users]);

  // 라이선스 사용량 계산
  const licenseUsage = useMemo(() => ({
    pro: users.filter(u => u.licenseType === 'pro').length,
    basic: users.filter(u => u.licenseType === 'basic').length,
  }), [users]);

  // 필터링 및 정렬된 사용자 목록
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(u => {
      const matchesSearch = searchQuery === '' || 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.team?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDepartment = filterDepartment === 'all' || u.department === filterDepartment;
      const matchesLicense = filterLicense === 'all' || u.licenseType === filterLicense;
      const matchesTeam = filterTeam === 'all' || u.team === filterTeam;
      const matchesPosition = filterPosition === 'all' || u.position === filterPosition;
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      
      return matchesSearch && matchesDepartment && matchesLicense && matchesTeam && matchesPosition && matchesRole;
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
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'department':
          aValue = a.department || '';
          bValue = b.department || '';
          break;
        case 'team':
          aValue = a.team || '';
          bValue = b.team || '';
          break;
        case 'joinDate':
          aValue = new Date(a.joinDate || '').getTime();
          bValue = new Date(b.joinDate || '').getTime();
          break;
        case 'licenseType':
          aValue = a.licenseType === 'pro' ? 1 : 0;
          bValue = b.licenseType === 'pro' ? 1 : 0;
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
  }, [users, searchQuery, filterDepartment, filterLicense, filterTeam, filterPosition, filterRole, sortField, sortDirection]);

  // 페이지네이션 계산
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 선택 핸들러
  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
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
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
    }, 300);
  }, []);

  // 필터 초기화
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterDepartment('all');
    setFilterLicense('all');
    setFilterTeam('all');
    setFilterPosition('all');
    setFilterRole('all');
    setCurrentPage(1);
  };

  // 사용자 편집
  const handleEditUser = (userData: User) => {
    setSelectedUser(userData);
    setEditForm(userData);
    setIsEditDialogOpen(true);
  };

  // 라이선스 변경
  const handleLicenseChange = (newLicenseType: 'basic' | 'pro') => {
    if (!selectedUser || !editForm) return;

    if (newLicenseType === 'pro' && selectedUser.licenseType !== 'pro') {
      if (licenseUsage.pro >= LICENSE_LIMITS.pro) {
        toast.error(`Pro 라이선스는 최대 ${LICENSE_LIMITS.pro}명까지만 할당 가능합니다.`);
        return;
      }
    }

    setEditForm({ ...editForm, licenseType: newLicenseType });
  };

  // 사용자 저장
  const handleSaveUser = () => {
    if (!selectedUser || !editForm) return;
    
    setUsers(users.map(u => 
      u.id === selectedUser.id 
        ? { ...u, ...editForm }
        : u
    ));
    
    setIsEditDialogOpen(false);
    setSelectedUser(null);
    setEditForm({});
    toast.success(`${selectedUser.name} 사용자 정보가 업데이트되었습니다.`);
  };

  // 일괄 작업
  const handleBulkLicenseChange = (licenseType: 'basic' | 'pro') => {
    const usersToUpdate = selectedUsers.filter(id => id !== '1'); // admin은 변경 불가
    
    if (licenseType === 'pro') {
      const currentProUsers = users.filter(u => u.licenseType === 'pro' && !usersToUpdate.includes(u.id)).length;
      const availableSlots = LICENSE_LIMITS.pro - currentProUsers;
      
      if (usersToUpdate.length > availableSlots) {
        toast.error(`Pro 라이선스는 최대 ${LICENSE_LIMITS.pro}명까지만 할당 가능합니다.`);
        return;
      }
    }

    setUsers(users.map(u => 
      usersToUpdate.includes(u.id) 
        ? { ...u, licenseType }
        : u
    ));
    setSelectedUsers([]);
    toast.success(`${usersToUpdate.length}명의 라이선스가 변경되었습니다.`);
  };

  // 사용자 삭제
  const handleDeleteUsers = () => {
    const usersToDelete = selectedUsers.filter(id => id !== '1'); // admin은 삭제 불가
    setUsers(users.filter(u => !usersToDelete.includes(u.id)));
    setSelectedUsers([]);
    setIsDeleteDialogOpen(false);
    toast.success(`${usersToDelete.length}명의 사용자가 삭제되었습니다.`);
  };

  // 사용자 추가
  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error('이름과 이메일은 필수 입력 항목입니다.');
      return;
    }

    if (users.some(u => u.email === newUser.email)) {
      toast.error('이미 존재하는 이메일 주소입니다.');
      return;
    }

    if (newUser.licenseType === 'pro' && licenseUsage.pro >= LICENSE_LIMITS.pro) {
      toast.error(`Pro 라이선스는 최대 ${LICENSE_LIMITS.pro}명까지만 할당 가능합니다.`);
      return;
    }

    const userToAdd: User = {
      ...newUser,
      id: (users.length + 1).toString(),
      joinDate: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, userToAdd]);
    setNewUser({
      name: '',
      email: '',
      role: '',
      position: '',
      department: '',
      team: '',
      phone: '',
      bio: '',
      chatbotRole: 'user',
      licenseType: 'basic'
    });
    setIsAddUserDialogOpen(false);
    toast.success(`${userToAdd.name} 사용자가 추가되었습니다.`);
  };

  // 데이터 내보내기
  const handleExportData = () => {
    const csvContent = [
      ['이름', '이메일', '부서', '팀', '직급', '역할', '라이선스', '가입일'],
      ...filteredAndSortedUsers.map(u => [
        u.name,
        u.email,
        u.department || '',
        u.team || '',
        u.position || '',
        u.role || '',
        u.licenseType,
        u.joinDate || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success(`${filteredAndSortedUsers.length}명의 사용자 데이터를 내보냈습니다.`);
  };

  const getLicenseBadge = (licenseType: 'basic' | 'pro') => {
    return licenseType === 'pro' ? (
      <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
        Pro
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
        Basic
      </Badge>
    );
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="w-4 h-4" /> : 
      <SortDesc className="w-4 h-4" />;
  };

  const isAdmin = user.chatbotRole === 'system_admin';

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
      {/* Header */}
      <Header
        user={user}
        onProfileSettingsClick={onProfileSettingsClick}
        onSystemSettingsClick={onSystemSettingsClick}
        onAISettingsClick={onAISettingsClick}
        onProjectManagementClick={onProjectManagementClick}
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
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl">사용자 관리</h1>
              <p className="text-muted-foreground">
                {filteredAndSortedUsers.length.toLocaleString()}명의 사용자와 라이선스를 관리합니다
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
            
            <Button 
              onClick={() => setIsAddUserDialogOpen(true)} 
              className="gap-2"
              disabled={!isAdmin}
            >
              <UserPlus className="w-4 h-4" />
              사용자 추가
            </Button>
            
            <Button onClick={onBack} variant="outline">
              돌아가기
            </Button>
          </div>
        </div>

        {/* 라이선스 현황 카드 - 축소됨 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pro 라이선스</p>
                    <p className="text-xs text-muted-foreground">Meta-Drive + Meta-Drawing + Meta-ChatBot</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">{licenseUsage.pro}</span>
                    <span className="text-sm text-muted-foreground">/ {LICENSE_LIMITS.pro}</span>
                    {licenseUsage.pro >= LICENSE_LIMITS.pro && (
                      <AlertTriangle className="w-4 h-4 text-red-500 ml-1" />
                    )}
                  </div>
                  <div className="w-20 bg-slate-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        licenseUsage.pro >= LICENSE_LIMITS.pro ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min((licenseUsage.pro / LICENSE_LIMITS.pro) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Users className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Basic 라이선스</p>
                    <p className="text-xs text-muted-foreground">Meta-Drive 기본 기능만</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">{licenseUsage.basic.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ 무제한</span>
                    <Info className="w-4 h-4 text-slate-400 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Filter className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">필터링된 결과</p>
                    <p className="text-xs text-muted-foreground">현재 보기 설정 기준</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold">{filteredAndSortedUsers.length.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ {users.length.toLocaleString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="text-xs h-6 px-2 mt-1"
                  >
                    초기화
                  </Button>
                </div>
              </div>
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
                    placeholder="이름, 이메일, 부서, 팀, 역할로 검색..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="부서 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 부서</SelectItem>
                    {filterOptions.departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterLicense} onValueChange={setFilterLicense}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="라이선스" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 라이선스</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 두 번째 행: 상세 필터 */}
              <div className="flex items-center gap-4">
                <Select value={filterTeam} onValueChange={setFilterTeam}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="팀 필터" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 팀</SelectItem>
                    {filterOptions.teams.map(team => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={filterPosition} onValueChange={setFilterPosition}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="직급" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 직급</SelectItem>
                    {filterOptions.positions.map(pos => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
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
                  {filteredAndSortedUsers.length.toLocaleString()}명
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 일괄 작업 버튼 */}
        {isAdmin && selectedUsers.length > 0 && (
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    {selectedUsers.length}명 선택됨
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkLicenseChange('pro')}
                    disabled={
                      licenseUsage.pro + selectedUsers.filter(id => 
                        id !== '1' && users.find(u => u.id === id)?.licenseType !== 'pro'
                      ).length > LICENSE_LIMITS.pro
                    }
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Pro 할당
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkLicenseChange('basic')}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Basic 할당
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={selectedUsers.includes('1')}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedUsers([])}
                  >
                    선택 해제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 사용자 테이블 */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            {/* 테이블 헤더 - 고정 */}
            <div className="border-b bg-slate-50 sticky top-0 z-10">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    {isAdmin && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                    )}
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-2">
                        이름
                        {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('email')}>
                      <div className="flex items-center gap-2">
                        이메일
                        {getSortIcon('email')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('department')}>
                      <div className="flex items-center gap-2">
                        부서
                        {getSortIcon('department')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('team')}>
                      <div className="flex items-center gap-2">
                        팀
                        {getSortIcon('team')}
                      </div>
                    </TableHead>
                    <TableHead>직급</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('licenseType')}>
                      <div className="flex items-center gap-2">
                        라이선스
                        {getSortIcon('licenseType')}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('joinDate')}>
                      <div className="flex items-center gap-2">
                        가입일
                        {getSortIcon('joinDate')}
                      </div>
                    </TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* 테이블 본문 - 스크롤 가능 */}
            <ScrollArea className="flex-1" style={{ height: 'calc(100vh - 500px)' }}>
              <Table>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          로딩 중...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 9 : 8} className="text-center py-8">
                        <div className="text-muted-foreground">
                          검색 조건에 맞는 사용자가 없습니다.
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((userData) => (
                      <TableRow 
                        key={userData.id}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleEditUser(userData)}
                      >
                        {isAdmin && (
                          <TableCell className="w-12" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedUsers.includes(userData.id)}
                              onCheckedChange={(checked) => handleSelectUser(userData.id, checked as boolean)}
                            />
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {userData.name.slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{userData.name}</div>
                              <div className="text-sm text-muted-foreground">{userData.role}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{userData.email}</TableCell>
                        <TableCell className="text-sm">{userData.department}</TableCell>
                        <TableCell>
                          {userData.team && (
                            <Badge variant="outline" className="text-xs">
                              {userData.team}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{userData.position}</TableCell>
                        <TableCell>{getLicenseBadge(userData.licenseType)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {userData.joinDate && new Date(userData.joinDate).toLocaleDateString('ko-KR')}
                        </TableCell>
                        <TableCell className="w-12">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(userData);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* 페이지네이션 - 항상 표시 */}
            <div className="border-t p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedUsers.length > 0 ? (
                    <>
                      {((currentPage - 1) * itemsPerPage + 1).toLocaleString()}-{Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length).toLocaleString()} / {filteredAndSortedUsers.length.toLocaleString()}명
                    </>
                  ) : (
                    '0명'
                  )}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex items-center gap-4">
                    {/* 페이지 이동 단축키 */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        title="첫 페이지로"
                      >
                        처음
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 10))}
                        disabled={currentPage <= 10}
                        title="10페이지 이전으로"
                      >
                        -10
                      </Button>
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

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 10))}
                        disabled={currentPage + 10 > totalPages}
                        title="10페이지 다음으로"
                      >
                        +10
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        title="마지막 페이지로"
                      >
                        마지막
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 사용자 편집 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>사용자 정보 {isAdmin ? '수정' : '조회'}</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} 사용자의 정보를 {isAdmin ? '수정' : '확인'}합니다.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium">기본 정보</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!isAdmin || selectedUser?.id === '1'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      disabled={!isAdmin || selectedUser?.id === '1'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">직급</Label>
                    <Input
                      id="position"
                      value={editForm.position || ''}
                      onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                      disabled={!isAdmin || selectedUser?.id === '1'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">휴대폰 번호</Label>
                    <Input
                      id="phone"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      disabled={!isAdmin}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 소속 정보 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium">소속 정보</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">부서</Label>
                    <Input
                      id="department"
                      value={editForm.department || ''}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      disabled={!isAdmin || selectedUser?.id === '1'}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="team">팀</Label>
                    <Input
                      id="team"
                      value={editForm.team || ''}
                      onChange={(e) => setEditForm({ ...editForm, team: e.target.value })}
                      disabled={!isAdmin || selectedUser?.id === '1'}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 라이선스 정보 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium">라이선스 정보</h4>
                </div>
                
                {isAdmin && selectedUser?.id !== '1' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>라이선스 유형</Label>
                      <Select
                        value={editForm.licenseType || 'basic'}
                        onValueChange={(value: 'basic' | 'pro') => handleLicenseChange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (Meta-Drive만)</SelectItem>
                          <SelectItem 
                            value="pro"
                            disabled={
                              editForm.licenseType !== 'pro' && 
                              licenseUsage.pro >= LICENSE_LIMITS.pro
                            }
                          >
                            Pro (Meta-Drive + Meta-Drawing)
                            {editForm.licenseType !== 'pro' && licenseUsage.pro >= LICENSE_LIMITS.pro && ' - 할당량 초과'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">
                      현재 라이선스: <strong>{editForm.licenseType === 'pro' ? 'Pro' : 'Basic'}</strong>
                      {selectedUser?.id === '1' && (
                        <span className="block text-xs text-muted-foreground mt-1">
                          관리자 계정의 라이선스는 변경할 수 없습니다.
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* 기타 정보 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">소개</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    disabled={!isAdmin}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              취소
            </Button>
            {isAdmin && (
              <Button onClick={handleSaveUser}>
                저장
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 추가 다이얼로그 */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 사용자 추가</DialogTitle>
            <DialogDescription>
              새로운 사용자의 정보를 입력하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newName">이름 *</Label>
                <Input
                  id="newName"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="홍길동"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newEmail">이메일 *</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="hong@hcompany.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newDepartment">부서</Label>
                <Input
                  id="newDepartment"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  placeholder="플랜트본부"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newTeam">팀</Label>
                <Input
                  id="newTeam"
                  value={newUser.team}
                  onChange={(e) => setNewUser({ ...newUser, team: e.target.value })}
                  placeholder="설계엔지니어링팀"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPosition">직급</Label>
                <Input
                  id="newPosition"
                  value={newUser.position}
                  onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                  placeholder="대리"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPhone">휴대폰</Label>
                <Input
                  id="newPhone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="02-1234-5678"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newRole">역할</Label>
              <Input
                id="newRole"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                placeholder="설계 엔지니어"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newLicense">라이선스 유형</Label>
              <Select
                value={newUser.licenseType}
                onValueChange={(value: 'basic' | 'pro') => setNewUser({ ...newUser, licenseType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (Meta-Drive만)</SelectItem>
                  <SelectItem 
                    value="pro"
                    disabled={licenseUsage.pro >= LICENSE_LIMITS.pro}
                  >
                    Pro (Meta-Drive + Meta-Drawing)
                    {licenseUsage.pro >= LICENSE_LIMITS.pro && ' - 할당량 초과'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddUser}>
              추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              선택된 {selectedUsers.filter(id => id !== '1').length}명의 사용자를 삭제하시겠습니까? 
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUsers} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}