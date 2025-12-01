import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Bot,
  Sparkles,
  Lock,
  Globe,
  Users,
  Activity,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { initialPersonas } from '../constants/metaDelta';
import { filterPersonas } from '../utils/metaDelta';
import type { User, ChatbotPersona } from '../types/app';

interface AdminPersonaManagementProps {
  user: User;
  onPersonaCreate: () => void;
  onPersonaEdit: (persona: ChatbotPersona) => void;
}

export function AdminPersonaManagement({
  user,
  onPersonaCreate,
  onPersonaEdit
}: AdminPersonaManagementProps) {
  const [selectedPersona, setSelectedPersona] = useState<ChatbotPersona | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [personas, setPersonas] = useState<ChatbotPersona[]>(initialPersonas);

  // 관리자는 모든 페르소나 관리 가능
  const adminPersonas = personas;

  // 필터링된 페르소나 목록
  const filteredPersonas = useMemo(() => {
    return filterPersonas(adminPersonas, searchQuery, statusFilter);
  }, [adminPersonas, searchQuery, statusFilter]);

  // 통계 계산
  const stats = useMemo(() => {
    const total = adminPersonas.length;
    const active = adminPersonas.filter(p => p.status === 'active').length;
    const public_ = adminPersonas.filter(p => p.visibility === 'public').length;
    const totalUsage = adminPersonas.reduce((sum, p) => sum + (p.usage?.totalConversations || 0), 0);
    
    return { total, active, public: public_, totalUsage };
  }, [adminPersonas]);

  const handleDeletePersona = (persona: ChatbotPersona) => {
    setSelectedPersona(persona);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePersona = () => {
    if (selectedPersona) {
      setPersonas(personas.filter(p => p.id !== selectedPersona.id));
      toast.success(`${selectedPersona.displayName} 페르소나가 삭제되었습니다.`);
    }
    setIsDeleteDialogOpen(false);
    setSelectedPersona(null);
  };

  const handleStatusToggle = (personaId: string) => {
    setPersonas(personas.map(p => 
      p.id === personaId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' as any }
        : p
    ));
    toast.success('페르소나 상태가 변경되었습니다.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">활성</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">비활성</Badge>;
      case 'training':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">학습중</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">오류</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    return visibility === 'public' 
      ? <Badge variant="outline" className="text-xs"><Globe className="w-3 h-3 mr-1" />공개</Badge>
      : <Badge variant="outline" className="text-xs"><Lock className="w-3 h-3 mr-1" />비공개</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl">페르소나 관리</h2>
          <p className="text-muted-foreground">
            시스템 전체 AI 페르소나를 관리하고 모니터링합니다
          </p>
        </div>
        <Button onClick={onPersonaCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          새 페르소나 생성
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 페르소나</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">전체 생성된 페르소나</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 페르소나</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              전체의 {((stats.active / stats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">공개 페르소나</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.public}</div>
            <p className="text-xs text-muted-foreground">모든 사용자 접근 가능</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 대화 수</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">누적 대화 수</p>
          </CardContent>
        </Card>
      </div>

      {/* 탭 구성 */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">모든 페르소나</TabsTrigger>
          <TabsTrigger value="monitoring">모니터링</TabsTrigger>
          <TabsTrigger value="settings">시스템 설정</TabsTrigger>
        </TabsList>

        {/* 모든 페르소나 */}
        <TabsContent value="all" className="space-y-4">
          {/* 검색 및 필터 */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="페르소나 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
                <SelectItem value="training">학습중</SelectItem>
                <SelectItem value="error">오류</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 페르소나 목록 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonas.map((persona) => (
              <Card key={persona.id} className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={persona.avatar} alt={persona.displayName} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {persona.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{persona.displayName}</CardTitle>
                        <CardDescription className="text-sm">{persona.role}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(persona.status)}
                      {getVisibilityBadge(persona.visibility)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {persona.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">생성자</span>
                      <p className="font-medium">{persona.createdBy}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">사용자 수</span>
                      <p className="font-medium">{persona.allowedUsers?.length || 0}</p>
                    </div>
                  </div>
                  
                  {persona.usage && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">대화 수</span>
                        <p className="font-medium">{persona.usage.totalConversations || 0}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">만족도</span>
                        <p className="font-medium">{persona.usage.satisfactionRating || 0}/5</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {persona.model}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {persona.language}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPersonaEdit(persona)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      편집
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusToggle(persona.id)}
                      className={persona.status === 'active' ? 'text-orange-600' : 'text-green-600'}
                    >
                      {persona.status === 'active' ? '비활성화' : '활성화'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePersona(persona)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPersonas.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">페르소나가 없습니다</h3>
              <p className="text-slate-500 mb-4">
                {searchQuery ? '검색 조건에 맞는 페르소나가 없습니다.' : '첫 번째 AI 페르소나를 만들어 보세요!'}
              </p>
              {!searchQuery && (
                <Button onClick={onPersonaCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  첫 번째 페르소나 만들기
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* 모니터링 탭 */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>페르소나별 성능</CardTitle>
                <CardDescription>응답 시간과 만족도 기준 상위 페르소나</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredPersonas.slice(0, 5).map((persona, index) => (
                  <div key={persona.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-sm">{persona.displayName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">
                        {persona.usage?.satisfactionRating || 0}/5
                      </Badge>
                      <Badge variant="outline">
                        {persona.usage?.averageResponseTime || 0}초
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>시스템 알림</CardTitle>
                <CardDescription>페르소나 관련 주요 알림과 이슈</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">높은 응답 시간 감지</p>
                    <p className="text-muted-foreground">품질 관리 AI에서 평균 응답시간 증가</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">새 페르소나 학습 완료</p>
                    <p className="text-muted-foreground">배관 설계 전문가 학습이 완료되었습니다</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">시스템 정상 운영</p>
                    <p className="text-muted-foreground">모든 페르소나가 정상적으로 동작 중입니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 시스템 설정 탭 */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>전역 설정</CardTitle>
                <CardDescription>시스템 전체 페르소나 설정</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">기본 응답 시간 제한</label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15초</SelectItem>
                      <SelectItem value="30">30초</SelectItem>
                      <SelectItem value="60">60초</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">기본 모델</label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude-3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>보안 설정</CardTitle>
                <CardDescription>페르소나 접근 및 보안 정책</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">관리자 승인 필요</p>
                    <p className="text-xs text-muted-foreground">새 페르소나 생성 시 관리자 승인</p>
                  </div>
                  <Button variant="outline" size="sm">활성화됨</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">자동 백업</p>
                    <p className="text-xs text-muted-foreground">페르소나 설정 일일 백업</p>
                  </div>
                  <Button variant="outline" size="sm">활성화됨</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>페르소나 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedPersona?.displayName}" 페르소나를 삭제하시겠습니까? 
              이 작업은 되돌릴 수 없으며, 모든 대화 기록과 설정이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePersona} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}