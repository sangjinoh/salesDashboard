import { Header } from './Header';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  FolderKanban, 
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Target,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Edit,
  Eye,
  FileText,
  Activity,
  CheckCircle2,
  AlertCircle,
  Pause,
  Circle
} from 'lucide-react';
import type { User } from '../types/app';

interface ProjectDetailProps {
  onBack: () => void;
  user: User;
  project: any; // 상세보기할 프로젝트 데이터
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onUserManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing') => void;
  onProjectEdit?: (project: any) => void; // 편집 버튼 클릭 시 (권한이 있는 경우)
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { 
      label: '진행중', 
      variant: 'default' as const, 
      icon: Activity,
      className: 'bg-green-100 text-green-800 hover:bg-green-100'
    },
    planning: { 
      label: '계획중', 
      variant: 'secondary' as const, 
      icon: Circle,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    },
    paused: { 
      label: '일시정지', 
      variant: 'outline' as const, 
      icon: Pause,
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
    },
    completed: { 
      label: '완료', 
      variant: 'outline' as const, 
      icon: CheckCircle2,
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  };

  return statusConfig[status as keyof typeof statusConfig] || statusConfig.planning;
};

const getPriorityBadge = (priority: string) => {
  const priorityConfig = {
    low: { 
      label: '낮음', 
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    },
    medium: { 
      label: '보통', 
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    },
    high: { 
      label: '높음', 
      className: 'bg-orange-100 text-orange-800 hover:bg-orange-100'
    },
    critical: { 
      label: '긴급', 
      className: 'bg-red-100 text-red-800 hover:bg-red-100'
    }
  };

  return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;
};

export function ProjectDetail({
  onBack,
  user,
  project,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  onProjectEdit
}: ProjectDetailProps) {
  if (!project) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl mb-2">프로젝트를 찾을 수 없습니다</h2>
            <Button onClick={onBack}>프로젝트 관리로 돌아가기</Button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(project.status);
  const priorityBadge = getPriorityBadge(project.priority);
  const StatusIcon = statusBadge.icon;

  // 편집 권한 체크 (임시로 admin만 편집 가능하도록)
  const canEdit = user.chatbotRole === 'system_admin' || 
    (project.members && project.members.some((member: any) => 
      member.id === user.id && (member.role === 'admin' || member.role === 'leader')
    ));

  // 예산 정보 포맷팅
  const formatBudget = (amount: number) => {
    if (amount >= 100000000) {
      return `${(amount / 100000000).toFixed(1)}억원`;
    } else if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}만원`;
    }
    return `${amount.toLocaleString()}원`;
  };

  // 프로젝트 통계
  const projectStats = [
    {
      label: '파일 수',
      value: project.fileCount || 0,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      label: '팀원 수',
      value: project.memberCount || project.members?.length || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: '진행률',
      value: `${project.progress || 0}%`,
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
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
      <div className="flex-1 flex flex-col p-6 gap-6 overflow-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              프로젝트 관리로 돌아가기
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl">{project.name}</h1>
              <p className="text-muted-foreground">
                프로젝트 상세 정보
              </p>
            </div>
          </div>
        </div>

        {/* 프로젝트 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 기본 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FolderKanban className="w-5 h-5 text-blue-600" />
                    기본 정보
                  </CardTitle>
                  {canEdit && onProjectEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onProjectEdit(project)}
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      편집
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2">프로젝트 설명</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description || '설명이 없습니다.'}
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4>상태</h4>
                    <Badge className={statusBadge.className}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusBadge.label}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h4>우선순위</h4>
                    <Badge className={priorityBadge.className}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4>진행률</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>완료도</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-2" />
                  </div>
                </div>

                {project.tags && project.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4>태그</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 분류 및 위치 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  분류 및 위치
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4>카테고리</h4>
                  <p className="text-muted-foreground">
                    {project.category || '미분류'}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4>위치</h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {project.location || '미정'}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4>고객사</h4>
                  <p className="text-muted-foreground">
                    {project.client || project.clientName || '미정'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 일정 및 예산 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  일정 및 예산
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4>시작일</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {project.startDate || '미정'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4>종료일</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {project.endDate || '미정'}
                    </div>
                  </div>
                </div>

                {project.budget && (
                  <div className="space-y-2">
                    <h4>예산</h4>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-lg">{formatBudget(project.budget)}</span>
                    </div>
                    {project.spent && (
                      <div className="text-sm text-muted-foreground">
                        사용: {formatBudget(project.spent)} ({((project.spent / project.budget) * 100).toFixed(1)}%)
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 프로젝트 통계 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  프로젝트 통계
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                        <span className="text-sm">{stat.label}</span>
                      </div>
                      <span className="font-medium">{stat.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* 팀원 정보 */}
            {project.members && project.members.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    팀원 ({project.members.length}명)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.members.slice(0, 5).map((member: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {member.role || member.department || '팀원'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {project.members.length > 5 && (
                    <div className="text-xs text-muted-foreground text-center">
                      외 {project.members.length - 5}명
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 프로젝트 메타 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  메타 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">생성일</span>
                  <span>{project.createdAt || '미상'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수정일</span>
                  <span>{project.updatedAt || '미상'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">프로젝트 ID</span>
                  <span className="font-mono text-xs">{project.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}