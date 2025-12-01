import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Switch } from './ui/switch';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Bot,
  Sparkles,
  Lock,
  Globe,
  Star,
  StarOff,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { initialPersonas } from '../constants/metaDelta';
import { filterUserPersonas, filterPersonas } from '../utils/metaDelta';
import type { User, ChatbotPersona } from '../types/app';

interface UserPersonaManagementProps {
  user: User;
  onPersonaCreate: () => void;
  onPersonaEdit: (persona: ChatbotPersona) => void;
  onUserUpdate?: (user: User) => void;
}

export function UserPersonaManagement({
  user,
  onPersonaCreate,
  onPersonaEdit,
  onUserUpdate
}: UserPersonaManagementProps) {
  const [personas, setPersonas] = useState<ChatbotPersona[]>(initialPersonas);
  const [selectedPersona, setSelectedPersona] = useState<ChatbotPersona | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'all' | 'registered'>('all');

  // 사용자별 페르소나 필터링
  const userPersonas = useMemo(() => {
    return filterUserPersonas(personas, false, user);
  }, [personas, user]);

  // 필터링된 페르소나 목록
  const filteredPersonas = useMemo(() => {
    let personas = filterPersonas(userPersonas, searchQuery, statusFilter);
    
    // 등록된 페르소나만 보기 필터
    if (viewMode === 'registered') {
      personas = personas.filter(persona => user.registeredPersonas?.includes(persona.id));
    }
    
    return personas;
  }, [userPersonas, searchQuery, statusFilter, viewMode, user.registeredPersonas]);

  const handleDeletePersona = (persona: ChatbotPersona) => {
    setSelectedPersona(persona);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePersona = () => {
    if (selectedPersona) {
      setPersonas(personas.filter(p => p.id !== selectedPersona.id));
      
      // 삭제된 페르소나가 등록되어 있었다면 등록��서도 제거
      if (user.registeredPersonas?.includes(selectedPersona.id)) {
        const updatedUser = {
          ...user,
          registeredPersonas: user.registeredPersonas.filter(id => id !== selectedPersona.id)
        };
        onUserUpdate?.(updatedUser);
      }
      
      toast.success(`${selectedPersona.displayName} 페르소나가 삭제되었습니다.`);
    }
    setIsDeleteDialogOpen(false);
    setSelectedPersona(null);
  };

  // 페르소나 등록/해제 핸들러
  const handlePersonaToggle = (personaId: string, isRegistered: boolean) => {
    const currentRegistered = user.registeredPersonas || [];
    let newRegistered: string[];
    
    if (isRegistered) {
      // 등록
      newRegistered = [...currentRegistered, personaId];
      const persona = personas.find(p => p.id === personaId);
      toast.success(`${persona?.displayName}을(를) 사용 등록했습니다.`);
    } else {
      // 해제
      newRegistered = currentRegistered.filter(id => id !== personaId);
      const persona = personas.find(p => p.id === personaId);
      toast.success(`${persona?.displayName}을(를) 사용 해제했습니다.`);
    }
    
    const updatedUser = {
      ...user,
      registeredPersonas: newRegistered
    };
    
    onUserUpdate?.(updatedUser);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">활성</Badge>;
      case 'inactive':
        return <Badge variant="secondary">비활성</Badge>;
      case 'training':
        return <Badge className="bg-blue-100 text-blue-800">학습중</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">오류</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVisibilityBadge = (visibility: string) => {
    return visibility === 'public' ? (
      <Badge variant="outline" className="text-blue-600">
        <Globe className="w-3 h-3 mr-1" />
        공개
      </Badge>
    ) : (
      <Badge variant="outline" className="text-slate-600">
        <Lock className="w-3 h-3 mr-1" />
        비공개
      </Badge>
    );
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {/* 검색 및 필터 */}
      <div className="mb-6 space-y-4">
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
            </SelectContent>
          </Select>
        </div>

        {/* 보기 모드 선택 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('all')}
              className="gap-2"
            >
              <Bot className="w-4 h-4" />
              모든 페르소나 ({userPersonas.length})
            </Button>
            <Button
              variant={viewMode === 'registered' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('registered')}
              className="gap-2"
            >
              <Star className="w-4 h-4" />
              사용 등록됨 ({user.registeredPersonas?.length || 0})
            </Button>
          </div>
          
          {user.registeredPersonas && user.registeredPersonas.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Meta-Drawing에서는 등록된 페르소나만 사용 가능합니다
            </div>
          )}
        </div>
      </div>

      {/* 페르소나 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonas.map((persona) => {
          const isRegistered = user.registeredPersonas?.includes(persona.id) || false;
          const canEdit = persona.createdBy === user.name;
          
          return (
            <Card key={persona.id} className={`bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-200 ${isRegistered ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={persona.avatar} alt={persona.displayName} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {persona.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isRegistered && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {persona.displayName}
                        {isRegistered && <Star className="w-4 h-4 text-blue-600 fill-current" />}
                      </CardTitle>
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

                {/* 데이터 소스 정보 */}
                {persona.dataSources && persona.dataSources.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">데이터 소스:</span>
                    <p className="text-xs mt-1">{persona.dataSources.length}개 폴더 연결됨</p>
                  </div>
                )}

                {/* 사용 등록 토글 */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">사용 등록</span>
                      <Switch
                        checked={isRegistered}
                        onCheckedChange={(checked) => handlePersonaToggle(persona.id, checked)}
                      />
                    </div>
                    {isRegistered && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        <Star className="w-3 h-3 mr-1" />
                        등록됨
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    등록하면 Meta-Drawing에서 사용할 수 있습니다
                  </p>
                </div>

                {/* 편집/삭제 버튼 (본인이 만든 페르소나만) */}
                {canEdit && (
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
                      onClick={() => handleDeletePersona(persona)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPersonas.length === 0 && (
        <div className="text-center py-12">
          {viewMode === 'registered' ? (
            <>
              <Star className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">등록된 페르소나가 없습니다</h3>
              <p className="text-slate-500 mb-4">
                {searchQuery ? '검색 조건에 맞는 등록된 페르소나가 없습니다.' : '사용할 페르소나를 등록해보세요!'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setViewMode('all')} variant="outline">
                  <Bot className="w-4 h-4 mr-2" />
                  모든 페르소나 보기
                </Button>
              )}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>페르소나 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 "{selectedPersona?.displayName}" 페르소나를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
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