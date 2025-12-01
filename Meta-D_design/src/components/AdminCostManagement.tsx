import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  AlertTriangle,
  Download,
  Settings,
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import type { User } from '../types/app';

interface AdminCostManagementProps {
  user: User;
}

export function AdminCostManagement({ user }: AdminCostManagementProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [costBreakdown, setCostBreakdown] = useState('model');

  // 월별 비용 데이터
  const monthlyCosts = [
    { month: '1월', total: 124.50, gpt4: 89.20, gpt35: 35.30, claude: 0 },
    { month: '2월', total: 148.20, gpt4: 105.80, gpt35: 42.40, claude: 0 },
    { month: '3월', total: 178.30, gpt4: 128.60, gpt35: 49.70, claude: 0 },
    { month: '4월', total: 195.80, gpt4: 142.30, gpt35: 53.50, claude: 0 },
    { month: '5월', total: 218.40, gpt4: 159.80, gpt35: 58.60, claude: 0 },
    { month: '6월', total: 245.60, gpt4: 180.20, gpt35: 52.40, claude: 13.00 }
  ];

  // 모델별 비용 분포
  const modelCosts = [
    { name: 'GPT-4', value: 73.4, cost: 180.20, color: '#3B82F6' },
    { name: 'GPT-3.5 Turbo', value: 21.3, cost: 52.40, color: '#10B981' },
    { name: 'Claude-3', value: 5.3, cost: 13.00, color: '#F59E0B' }
  ];

  // 사용자별 비용 현황
  const userCosts = [
    { name: '김철수', cost: 45.20, usage: 1450, efficiency: 0.031 },
    { name: '박구매', cost: 32.80, usage: 980, efficiency: 0.033 },
    { name: '이안전', cost: 28.50, usage: 850, efficiency: 0.034 },
    { name: '정품질', cost: 24.70, usage: 720, efficiency: 0.034 },
    { name: '최건설', cost: 21.90, usage: 650, efficiency: 0.034 },
    { name: '기타', cost: 92.50, usage: 2800, efficiency: 0.033 }
  ];

  // 예산 및 한도 설정
  const budgetInfo = {
    monthly: 300,
    current: 245.60,
    projected: 285.40,
    dailyAverage: 8.19,
    daysRemaining: 5
  };

  // 비용 최적화 제안
  const optimizationSuggestions = [
    {
      type: 'model',
      title: '모델 최적화',
      description: '간단한 질문은 GPT-3.5로 라우팅',
      impact: '월 $45-60 절약 가능',
      status: 'recommended'
    },
    {
      type: 'cache',
      title: '응답 캐싱',
      description: '자주 묻는 질문 캐싱 활성화',
      impact: '월 $25-35 절약 가능',
      status: 'implemented'
    },
    {
      type: 'limit',
      title: '사용량 제한',
      description: '사용자별 일일 토큰 한도 설정',
      impact: '과사용 방지',
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended': return 'bg-blue-100 text-blue-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl">요금 관리</h2>
          <p className="text-muted-foreground">
            AI 사용 비용 분석 및 예산 관리
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">이번 달</SelectItem>
              <SelectItem value="last">지난 달</SelectItem>
              <SelectItem value="quarter">분기</SelectItem>
              <SelectItem value="year">연간</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            비용 리포트
          </Button>
        </div>
      </div>

      {/* 비용 개요 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 비용</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetInfo.current.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-red-600" />
              전월 대비 +12.4%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예상 월말 비용</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetInfo.projected.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <AlertTriangle className="w-3 h-3 mr-1 text-orange-600" />
              예산 95% 예상
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">일평균 비용</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetInfo.dailyAverage.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              목표 대비 -8%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예산 사용률</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((budgetInfo.current / budgetInfo.monthly) * 100).toFixed(1)}%</div>
            <Progress value={(budgetInfo.current / budgetInfo.monthly) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 상세 분석 탭 */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">비용 추이</TabsTrigger>
          <TabsTrigger value="breakdown">비용 분석</TabsTrigger>
          <TabsTrigger value="users">사용자별</TabsTrigger>
          <TabsTrigger value="optimization">최적화</TabsTrigger>
        </TabsList>

        {/* 비용 추이 */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>월별 비용 추이</CardTitle>
              <CardDescription>모델별 비용 분포와 전체 추이</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="gpt4" stackId="a" fill="#3B82F6" name="GPT-4" />
                    <Bar dataKey="gpt35" stackId="a" fill="#10B981" name="GPT-3.5" />
                    <Bar dataKey="claude" stackId="a" fill="#F59E0B" name="Claude-3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 비용 분석 */}
        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>모델별 비용 분포</CardTitle>
                <CardDescription>이번 달 모델별 비용 비율</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={modelCosts}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {modelCosts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>모델별 상세 비용</CardTitle>
                <CardDescription>모델별 비용과 사용량 정보</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {modelCosts.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: model.color }}
                      ></div>
                      <div>
                        <p className="font-medium">{model.name}</p>
                        <p className="text-sm text-muted-foreground">{model.value}% 사용</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${model.cost.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">이번 달</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 사용자별 비용 */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>사용자별 비용 현황</CardTitle>
              <CardDescription>사용자별 비용과 효율성 지표</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userCosts.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.usage} 토큰 사용
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-right">
                      <div>
                        <p className="font-medium">${user.cost.toFixed(2)}</p>
                        <p className="text-muted-foreground">총 비용</p>
                      </div>
                      <div>
                        <p className="font-medium">${user.efficiency.toFixed(3)}</p>
                        <p className="text-muted-foreground">토큰당 비용</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 최적화 제안 */}
        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {optimizationSuggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    <Badge className={getStatusColor(suggestion.status)}>
                      {suggestion.status === 'recommended' && '권장'}
                      {suggestion.status === 'implemented' && '적용됨'}
                      {suggestion.status === 'active' && '활성'}
                    </Badge>
                  </div>
                  <CardDescription>{suggestion.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{suggestion.impact}</span>
                    </div>
                    {suggestion.status === 'recommended' && (
                      <Button size="sm">적용하기</Button>
                    )}
                    {suggestion.status === 'implemented' && (
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        설정
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 예산 설정 카드 */}
          <Card>
            <CardHeader>
              <CardTitle>예산 및 알림 설정</CardTitle>
              <CardDescription>월간 예산과 알림 임계값을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">월간 예산 한도</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">${budgetInfo.monthly}</span>
                    <Button size="sm" variant="outline">편집</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">알림 임계값</label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>80% 경고</span>
                      <Badge variant="outline">설정됨</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>95% 위험</span>
                      <Badge variant="outline">설정됨</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}