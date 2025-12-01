import { ChevronDown, LogOut, Settings, User, Bell, Brain, FolderKanban, Database, Layout, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/bef8043f561df2beeff30989332d70bf4ec5e731.png';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  chatbotRole: 'system_admin' | 'team_admin' | 'user';
  teamType?: 'engineering' | 'procurement' | 'construction' | 'management' | 'safety' | 'qa';
  licenseType?: 'basic' | 'pro';
  phone?: string;
  department?: string;
  team?: string; // 팀 정보 추가
  location?: string;
  joinDate?: string;
  bio?: string;
}

interface HeaderProps {
  user?: User;
  onProfileSettingsClick?: () => void;
  onSystemSettingsClick?: () => void;
  onAISettingsClick?: () => void;
  onProjectManagementClick?: () => void;
  onUserManagementClick?: () => void;
  onLogout?: () => void;
  currentModule?: 'Meta-Drive' | 'Meta-Drawing' | 'Revision-Comparison' | 'Meta-ChatBot';
  onModuleSwitch?: (module: string) => void;
}

export function Header({ 
  user = { 
    name: '김철수', 
    email: 'kim.cs@metad.com', 
    role: '설계 엔지니어',
    chatbotRole: 'system_admin',
    teamType: 'engineering',
    licenseType: 'pro',
    phone: '010-1234-5678',
    department: '플랜트본부',
    team: '설계엔지니어링팀', // 기본 팀 이름 추가
    location: '서울본사',
    joinDate: '2023-03-15',
    bio: '플랜트 설계 전문가로 10년 이상의 경험을 보유하고 있습니다.'
  },
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  currentModule = 'Meta-Drive',
  onModuleSwitch
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm">
      {/* 좌측: 로고 및 시스템명 */}
      <div className="flex items-center gap-6">
        {/* Meta-D 로고 */}
        <div className="flex items-center gap-3">
          <div className="relative">
            {/* 로고 이미지 */}
            <div className="w-10 h-10 flex items-center justify-center">
              <ImageWithFallback 
                src={logoImage} 
                alt="Meta-D Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          
          {/* 시스템명 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">Meta-D</span>
            </div>
            <span className="text-sm text-gray-600">엔지니어링 혁신 플랫폼</span>
          </div>
        </div>

        {/* 모듈 선택 메뉴 */}
        <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1.5 shadow-inner">
          <Button
            variant={currentModule === 'Meta-Drive' ? 'default' : 'ghost'}
            size="sm"
            className={`h-9 px-4 text-sm font-medium transition-all duration-300 rounded-lg relative overflow-hidden group ${
              currentModule === 'Meta-Drive' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5 active:scale-95'
            }`}
            onClick={() => onModuleSwitch?.('Meta-Drive')}
          >
            {/* 활성 상태 배경 글로우 효과 */}
            {currentModule === 'Meta-Drive' && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl" />
            )}
            
            {/* 아이콘과 텍스트 */}
            <div className="relative flex items-center gap-2 z-10">
              <Database className={`w-4 h-4 transition-all duration-300 ${
                currentModule === 'Meta-Drive' 
                  ? 'group-hover:animate-pulse' 
                  : 'group-hover:text-blue-600'
              }`} />
              <span>Meta-Drive</span>
            </div>
            
            {/* 호버 시 펄스 효과 */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-pulse rounded-lg" />
          </Button>
          
          <Button
            variant={currentModule === 'Meta-Drawing' ? 'default' : 'ghost'}
            size="sm"
            className={`h-9 px-4 text-sm font-medium transition-all duration-300 rounded-lg relative overflow-hidden group ${
              currentModule === 'Meta-Drawing' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95' 
                : user?.licenseType === 'pro'
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5 active:scale-95'
                  : 'text-gray-400 cursor-not-allowed opacity-50'
            }`}
            onClick={() => {
              if (user?.licenseType === 'pro') {
                onModuleSwitch?.('Meta-Drawing');
              }
            }}
            disabled={user?.licenseType !== 'pro'}
          >
            {/* 활성 상태 배경 글로우 효과 */}
            {currentModule === 'Meta-Drawing' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl" />
            )}
            
            {/* 아이콘과 텍스트 */}
            <div className="relative flex items-center gap-2 z-10">
              <Layout className={`w-4 h-4 transition-all duration-300 ${
                currentModule === 'Meta-Drawing' 
                  ? 'group-hover:animate-pulse' 
                  : 'group-hover:text-purple-600'
              }`} />
              <span>Meta-Drawing</span>
            </div>
            
            {/* 호버 시 펄스 효과 */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-pulse rounded-lg" />
          </Button>

          <Button
            variant={currentModule === 'Meta-ChatBot' ? 'default' : 'ghost'}
            size="sm"
            className={`h-9 px-4 text-sm font-medium transition-all duration-300 rounded-lg relative overflow-hidden group ${
              currentModule === 'Meta-ChatBot' 
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md transform hover:scale-105 hover:-translate-y-0.5 active:scale-95'
            }`}
            onClick={() => onModuleSwitch?.('Meta-ChatBot')}
          >
            {/* 활성 상태 배경 글로우 효과 */}
            {currentModule === 'Meta-ChatBot' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl" />
            )}
            
            {/* 아이콘과 텍스트 */}
            <div className="relative flex items-center gap-2 z-10">
              <MessageSquare className={`w-4 h-4 transition-all duration-300 ${
                currentModule === 'Meta-ChatBot' 
                  ? 'group-hover:animate-pulse' 
                  : 'group-hover:text-green-600'
              }`} />
              <span>Meta-ChatBot</span>
            </div>
            
            {/* 호버 시 펄스 효과 */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-pulse rounded-lg" />
          </Button>
        </div>
      </div>

      {/* 우측: 알림 및 사용자 계정 */}
      <div className="flex items-center gap-3">
        {/* 알림 버튼 */}
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </Button>

        {/* 사용자 계정 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 px-3 flex items-center gap-2 hover:bg-gray-50">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.team || user.role}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer" onClick={onProfileSettingsClick}>
              <User className="w-4 h-4 mr-2" />
              프로필 설정
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer" onClick={onSystemSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              시스템 설정
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer" onClick={onProjectManagementClick}>
              <FolderKanban className="w-4 h-4 mr-2" />
              프로젝트 관리
            </DropdownMenuItem>
            
            {user.chatbotRole === 'system_admin' && (
              <DropdownMenuItem className="cursor-pointer" onClick={onUserManagementClick}>
                <User className="w-4 h-4 mr-2" />
                사용자 관리
              </DropdownMenuItem>
            )}
            
            {(user.chatbotRole !== 'user' || user.licenseType === 'pro') && (
              <DropdownMenuItem className="cursor-pointer" onClick={onAISettingsClick}>
                <Brain className="w-4 h-4 mr-2" />
                Meta-ChatBot 설정
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer text-red-600" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}