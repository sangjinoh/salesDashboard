import { useState, useMemo } from 'react';
import { ArrowLeft, Settings, Users, Bot, BarChart3, CreditCard, Activity, FileText, TrendingUp, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Header } from './Header';
import { UserPersonaManagement } from './UserPersonaManagement';
import { AdminPersonaManagement } from './AdminPersonaManagement';
import { AdminSystemAnalytics } from './AdminSystemAnalytics';
import { AdminCostManagement } from './AdminCostManagement';
import { AdminLogAnalysis } from './AdminLogAnalysis';
import { AdminOverview } from './AdminOverview';
import type { User, ChatbotPersona } from '../types/app';

interface MetaDeltaSettingsProps {
  onBack: () => void;
  user: User;
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onUserManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing') => void;
  onPersonaEdit?: (persona: ChatbotPersona) => void;
  onPersonaCreate?: () => void;
  onUserUpdate?: (user: User) => void;
}

export function MetaDeltaSettings({
  onBack,
  user,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  onPersonaEdit,
  onPersonaCreate,
  onUserUpdate
}: MetaDeltaSettingsProps) {
  const [activeTab, setActiveTab] = useState('personas');
  const [isMobileView, setIsMobileView] = useState(false);

  const isAdmin = user.chatbotRole === 'system_admin';

  const handleCreatePersona = () => {
    onPersonaCreate?.();
  };

  const handleEditPersona = (persona: ChatbotPersona) => {
    onPersonaEdit?.(persona);
  };

  // 탭 구성
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        id: 'personas',
        label: '나의 AI 페르소나',
        icon: Bot,
        description: 'AI 페르소나 생성 및 관리'
      }
    ];

    if (isAdmin) {
      return [
        {
          id: 'overview',
          label: '개요',
          icon: BarChart3,
          description: '시스템 전체 현황'
        },
        ...baseTabs,
        {
          id: 'admin-personas',
          label: '페르소나 관리',
          icon: Settings,
          description: '전체 페르소나 관리'
        },
        {
          id: 'analytics',
          label: '사용량 분석',
          icon: TrendingUp,
          description: '사용량 및 성능 분석'
        },
        {
          id: 'cost',
          label: '요금 관리',
          icon: CreditCard,
          description: '비용 및 요금 관리'
        },
        {
          id: 'logs',
          label: '로그 분석',
          icon: FileText,
          description: '시스템 로그 및 오류 분석'
        }
      ];
    }

    return baseTabs;
  }, [isAdmin]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
      {/* Header 컴포넌트 사용 */}
      <Header 
        user={user}
        currentModule="Meta-Delta"
        onModuleSwitch={onModuleSwitch}
        onProfileSettingsClick={onProfileSettingsClick}
        onSystemSettingsClick={onSystemSettingsClick}
        onAISettingsClick={onAISettingsClick}
        onProjectManagementClick={onProjectManagementClick}
        onUserManagementClick={onUserManagementClick}
        onLogout={onLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 네비게이션 */}
        <div className="w-80 border-r bg-white/50 backdrop-blur-sm flex flex-col">
          {/* 페이지 헤더 */}
          <div className="p-6 border-b">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              뒤로 가기
            </Button>
            
            <div className="space-y-2">
              <h1 className="text-2xl">Meta-ChatBot 설정</h1>
              <p className="text-muted-foreground">
                {isAdmin ? 'AI 시스템 관리 및 설정' : 'AI 페르소나 관리 및 설정'}
              </p>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex-1 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{tab.label}</div>
                      <div className="text-xs text-muted-foreground">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 overflow-hidden">
          {/* 개요 탭 (Admin만) */}
          {activeTab === 'overview' && isAdmin && (
            <AdminOverview user={user} />
          )}

          {/* 나의 AI 페르소나 탭 */}
          {activeTab === 'personas' && (
            <div className="h-full overflow-auto">
              <UserPersonaManagement
                user={user}
                onPersonaCreate={handleCreatePersona}
                onPersonaEdit={handleEditPersona}
                onUserUpdate={onUserUpdate}
              />
            </div>
          )}

          {/* 페르소나 관리 탭 (Admin만) */}
          {activeTab === 'admin-personas' && isAdmin && (
            <div className="h-full overflow-auto">
              <AdminPersonaManagement
                user={user}
                onPersonaCreate={handleCreatePersona}
                onPersonaEdit={handleEditPersona}
              />
            </div>
          )}

          {/* 사용량 분석 탭 (Admin만) */}
          {activeTab === 'analytics' && isAdmin && (
            <AdminSystemAnalytics user={user} />
          )}

          {/* 요금 관리 탭 (Admin만) */}
          {activeTab === 'cost' && isAdmin && (
            <AdminCostManagement user={user} />
          )}

          {/* 로그 분석 탭 (Admin만) */}
          {activeTab === 'logs' && isAdmin && (
            <AdminLogAnalysis user={user} />
          )}
        </div>
      </div>
    </div>
  );
}