import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Users, 
  Bot, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import type { User } from '../types/app';

interface AdminOverviewProps {
  user: User;
}

export function AdminOverview({ user }: AdminOverviewProps) {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 47,
    activePersonas: 23,
    totalConversations: 1284,
    monthlyUsage: 89420,
    systemHealth: 99.8,
    activeSessions: 12,
    errorRate: 0.02,
    avgResponseTime: 1.2
  });

  // 사용량 추이 데이터
  const usageData = [
    { name: '1월', conversations: 980, users: 38, cost: 124.50 },
    { name: '2월', conversations: 1150, users: 42, cost: 148.20 },
    { name: '3월', conversations: 1284, users: 47, cost: 178.30 },
    { name: '4월', conversations: 1420, users: 51, cost: 195.80 },
    { name: '5월', conversations: 1580, users: 55, cost: 218.40 },
    { name: '6월', conversations: 1750, users: 58, cost: 245.60 }
  ];

  // 페르소나별 사용량
  const personaUsage = [
    { name: '설계 엔지니어 AI', value: 35, color: '#3B82F6' },
    { name: '구매 조달 AI', value: 28, color: '#10B981' },
    { name: '안전 관리 AI', value: 20, color: '#F59E0B' },
    { name: '품질 관리 AI', value: 12, color: '#EF4444' },
    { name: '기타', value: 5, color: '#8B5CF6' }
  ];

  // 최근 활동
  const recentActivities = [
    {
      id: '1',
      user: '김철수',
      action: '새 페르소나 생성',
      persona: '배관 설계 전문가',
      timestamp: '5분 전',
      type: 'create'
    },
    {
      id: '2',
      user: '박구매',
      action: '페르소나 사용',
      persona: '구매 조달 AI',
      timestamp: '12분 전',
      type: 'usage'
    },
    {
      id: '3',
      user: '이안전',
      action: '오류 보고',
      persona: '안전 관리 AI',
      timestamp: '1시간 전',
      type: 'error'
    },
    {
      id: '4',
      user: '정품질',
      action: '페르소나 수정',
      persona: '품질 관리 AI',
      timestamp: '2시간 전',
      type: 'update'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return <Bot className="w-4 h-4 text-green-600" />;
      case 'usage': return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'update': return <CheckCircle2 className="w-4 h-4 text-orange-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* 헤더 */}
      <div className="space-y-2">
        <h2 className="text-2xl">시스템 개요</h2>
        <p className="text-muted-foreground">
          Meta-ChatBot 시스템의 전체 현황과 주요 지표를 확인하세요.
        </p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 총 사용자 수 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              전월 대비 +12%
            </div>
          </CardContent>
        </Card>

        {/* 활성 페르소나 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 페르소나</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activePersonas}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              전월 대비 +8%
            </div>
          </CardContent>
        </Card>

        {/* 월간 대화 수 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">월간 대화</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalConversations.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              전월 대비 +24%
            </div>
          </CardContent>
        </Card>

        {/* 시스템 상태 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">시스템 상태</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.systemHealth}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
              정상 운영 중
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 사용량 추이 */}
        <Card>
          <CardHeader>
            <CardTitle>월간 사용량 추이</CardTitle>
            <CardDescription>대화 수 및 사용자 증가 추이</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="conversations" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="대화 수"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="사용자 수"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 페르소나별 사용 비율 */}
        <Card>
          <CardHeader>
            <CardTitle>페르소나별 사용 비율</CardTitle>
            <CardDescription>이번 달 페르소나별 사용량 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={personaUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {personaUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 실시간 현황 및 최근 활동 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 실시간 현황 */}
        <Card>
          <CardHeader>
            <CardTitle>실시간 현황</CardTitle>
            <CardDescription>현재 시스템 상태 및 성능 지표</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm">활성 세션</span>
              </div>
              <Badge variant="outline">{systemStats.activeSessions}개</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm">평균 응답시간</span>
              </div>
              <Badge variant="outline">{systemStats.avgResponseTime}초</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm">오류율</span>
              </div>
              <Badge variant="outline">{systemStats.errorRate}%</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>서버 사용률</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>메모리 사용률</span>
                <span>54%</span>
              </div>
              <Progress value={54} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* 최근 활동 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>실시간 사용자 활동 로그</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{activity.user}</span>
                      <span className="text-xs text-muted-foreground">{activity.action}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.persona} • {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}