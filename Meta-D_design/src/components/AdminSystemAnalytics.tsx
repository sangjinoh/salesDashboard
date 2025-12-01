import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  Target,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import type { User } from '../types/app';

interface AdminSystemAnalyticsProps {
  user: User;
}

export function AdminSystemAnalytics({ user }: AdminSystemAnalyticsProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('usage');

  // 시간별 사용량 데이터
  const hourlyUsage = [
    { hour: '00', conversations: 12, users: 3 },
    { hour: '01', conversations: 8, users: 2 },
    { hour: '02', conversations: 5, users: 1 },
    { hour: '03', conversations: 3, users: 1 },
    { hour: '04', conversations: 4, users: 1 },
    { hour: '05', conversations: 7, users: 2 },
    { hour: '06', conversations: 15, users: 4 },
    { hour: '07', conversations: 28, users: 8 },
    { hour: '08', conversations: 45, users: 12 },
    { hour: '09', conversations: 62, users: 18 },
    { hour: '10', conversations: 78, users: 22 },
    { hour: '11', conversations: 84, users: 25 },
    { hour: '12', conversations: 72, users: 20 },
    { hour: '13', conversations: 85, users: 24 },
    { hour: '14', conversations: 91, users: 26 },
    { hour: '15', conversations: 88, users: 25 },
    { hour: '16', conversations: 76, users: 21 },
    { hour: '17', conversations: 68, users: 19 },
    { hour: '18', conversations: 42, users: 12 },
    { hour: '19', conversations: 35, users: 10 },
    { hour: '20', conversations: 28, users: 8 },
    { hour: '21', conversations: 22, users: 6 },
    { hour: '22', conversations: 18, users: 5 },
    { hour: '23', conversations: 15, users: 4 }
  ];

  // 사용자별 활동 데이터
  const userActivity = [
    { name: '김철수', conversations: 145, avgResponseTime: 1.2, satisfaction: 4.8 },
    { name: '박구매', conversations: 98, avgResponseTime: 1.4, satisfaction: 4.6 },
    { name: '이안전', conversations: 87, avgResponseTime: 1.1, satisfaction: 4.9 },
    { name: '정품질', conversations: 76, avgResponseTime: 1.3, satisfaction: 4.7 },
    { name: '최건설', conversations: 65, avgResponseTime: 1.5, satisfaction: 4.5 },
    { name: '강관리', conversations: 54, avgResponseTime: 1.2, satisfaction: 4.6 }
  ];

  // 페르소나 성능 데이터
  const personaPerformance = [
    { 
      name: '설계 엔지니어 AI', 
      usage: 85, 
      satisfaction: 4.8, 
      responseTime: 1.1,
      errorRate: 0.02,
      totalConversations: 432
    },
    { 
      name: '구매 조달 AI', 
      usage: 72, 
      satisfaction: 4.6, 
      responseTime: 1.3,
      errorRate: 0.03,
      totalConversations: 298
    },
    { 
      name: '안전 관리 AI', 
      usage: 68, 
      satisfaction: 4.9, 
      responseTime: 0.9,
      errorRate: 0.01,
      totalConversations: 256
    },
    { 
      name: '품질 관리 AI', 
      usage: 45, 
      satisfaction: 4.5, 
      responseTime: 1.4,
      errorRate: 0.04,
      totalConversations: 187
    }
  ];

  // 토큰 사용량 데이터
  const tokenUsage = [
    { date: '6/1', input: 15420, output: 28340, cost: 45.60 },
    { date: '6/2', input: 16890, output: 31250, cost: 52.30 },
    { date: '6/3', input: 18240, output: 29870, cost: 48.90 },
    { date: '6/4', input: 17650, output: 32150, cost: 55.20 },
    { date: '6/5', input: 19340, output: 35420, cost: 62.80 },
    { date: '6/6', input: 20180, output: 36890, cost: 67.40 },
    { date: '6/7', input: 18950, output: 34210, cost: 59.70 }
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl">사용량 분석</h2>
          <p className="text-muted-foreground">
            시스템 사용량과 성능 지표를 상세히 분석합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">최근 7일</SelectItem>
              <SelectItem value="30d">최근 30일</SelectItem>
              <SelectItem value="90d">최근 90일</SelectItem>
              <SelectItem value="1y">최근 1년</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      {/* 핵심 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">일간 평균 대화</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> 전일 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 응답시간</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.24초</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-8.2%</span> 전일 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용자 만족도</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.1</span> 전일 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+6</span> 신규 가입
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 탭으로 구분된 상세 분석 */}
      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hourly">시간별 사용량</TabsTrigger>
          <TabsTrigger value="personas">페르소나 성능</TabsTrigger>
          <TabsTrigger value="users">사용자 활동</TabsTrigger>
          <TabsTrigger value="tokens">토큰 사용량</TabsTrigger>
        </TabsList>

        {/* 시간별 사용량 */}
        <TabsContent value="hourly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>24시간 사용량 패턴</CardTitle>
              <CardDescription>시간대별 대화 수와 활성 사용자 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Area 
                      type="monotone" 
                      dataKey="conversations" 
                      stackId="1"
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stackId="2"
                      stroke="#10B981" 
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 페르소나 성능 */}
        <TabsContent value="personas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {personaPerformance.map((persona, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{persona.name}</CardTitle>
                  <CardDescription>성능 및 사용량 지표</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">총 대화</span>
                      <p className="text-lg font-medium">{persona.totalConversations}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">만족도</span>
                      <p className="text-lg font-medium">{persona.satisfaction}/5</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">응답시간</span>
                      <p className="text-lg font-medium">{persona.responseTime}초</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">오류율</span>
                      <p className="text-lg font-medium">{persona.errorRate}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>사용률</span>
                      <span>{persona.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${persona.usage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 사용자 활동 */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>사용자별 활동 현황</CardTitle>
              <CardDescription>상위 활성 사용자들의 활동 지표</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userActivity.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.conversations}회 대화
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-right">
                      <div>
                        <p className="font-medium">{user.avgResponseTime}초</p>
                        <p className="text-muted-foreground">평균 응답시간</p>
                      </div>
                      <div>
                        <p className="font-medium">{user.satisfaction}/5</p>
                        <p className="text-muted-foreground">만족도</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 토큰 사용량 */}
        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>일별 토큰 사용량</CardTitle>
              <CardDescription>입력/출력 토큰과 비용 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tokenUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Bar dataKey="input" fill="#3B82F6" name="입력 토큰" />
                    <Bar dataKey="output" fill="#10B981" name="출력 토큰" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}