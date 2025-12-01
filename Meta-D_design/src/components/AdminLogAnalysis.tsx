import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  User,
  Bot
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { User } from '../types/app';

interface AdminLogAnalysisProps {
  user: User;
}

export function AdminLogAnalysis({ user }: AdminLogAnalysisProps) {
  const [logLevel, setLogLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('24h');

  // 로그 레벨별 통계
  const logStats = {
    total: 2847,
    info: 2156,
    warning: 534,
    error: 89,
    critical: 68
  };

  // 시간별 오류 발생 추이
  const errorTrends = [
    { time: '00:00', errors: 2, warnings: 8 },
    { time: '04:00', errors: 1, warnings: 5 },
    { time: '08:00', errors: 4, warnings: 12 },
    { time: '12:00', errors: 3, warnings: 15 },
    { time: '16:00', errors: 5, warnings: 18 },
    { time: '20:00', errors: 2, warnings: 9 }
  ];

  // 로그 항목들
  const logEntries = [
    {
      id: '1',
      timestamp: '2024-06-07 14:23:15',
      level: 'error',
      category: 'persona',
      message: 'GPT-4 API rate limit exceeded for user kim_cheolsu',
      details: {
        userId: 'kim_cheolsu',
        personaId: 'engineering_ai',
        requestId: 'req_abc123',
        retryCount: 3
      }
    },
    {
      id: '2',
      timestamp: '2024-06-07 14:22:48',
      level: 'warning',
      category: 'system',
      message: 'High memory usage detected on server node-2',
      details: {
        memoryUsage: '87%',
        threshold: '85%',
        nodeId: 'node-2'
      }
    },
    {
      id: '3',
      timestamp: '2024-06-07 14:22:01',
      level: 'info',
      category: 'user',
      message: 'User park_gubae successfully registered new persona',
      details: {
        userId: 'park_gubae',
        personaName: '조달 전문가 v2',
        personaId: 'procurement_ai_v2'
      }
    },
    {
      id: '4',
      timestamp: '2024-06-07 14:21:33',
      level: 'error',
      category: 'api',
      message: 'Claude-3 API authentication failed',
      details: {
        apiKey: 'claude_***masked***',
        errorCode: 'AUTH_INVALID',
        endpoint: 'https://api.anthropic.com/v1/messages'
      }
    },
    {
      id: '5',
      timestamp: '2024-06-07 14:20:15',
      level: 'warning',
      category: 'persona',
      message: 'Persona response time exceeded threshold',
      details: {
        personaId: 'safety_ai',
        responseTime: '3.2s',
        threshold: '2.0s',
        userId: 'lee_anjeon'
      }
    },
    {
      id: '6',
      timestamp: '2024-06-07 14:19:47',
      level: 'info',
      category: 'system',
      message: 'Daily backup completed successfully',
      details: {
        backupSize: '2.4GB',
        duration: '12m 34s',
        location: 's3://metadelta-backups/2024-06-07'
      }
    }
  ];

  // 오류 카테고리별 분석
  const errorCategories = [
    { category: 'API 오류', count: 45, percentage: 50.6 },
    { category: '인증 실패', count: 23, percentage: 25.8 },
    { category: '시스템 오류', count: 12, percentage: 13.5 },
    { category: '네트워크 오류', count: 9, percentage: 10.1 }
  ];

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'critical':
        return 'bg-red-200 text-red-900 border-red-300';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'persona':
        return <Bot className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'system':
      case 'api':
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredLogs = logEntries.filter(log => {
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl">로그 분석</h2>
          <p className="text-muted-foreground">
            시스템 로그 모니터링 및 오류 분석
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            로그 내보내기
          </Button>
        </div>
      </div>

      {/* 로그 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 로그</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logStats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">최근 24시간</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정보</CardTitle>
            <Info className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{logStats.info.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((logStats.info / logStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">경고</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{logStats.warning.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((logStats.warning / logStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오류</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{logStats.error.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((logStats.error / logStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">치명적</CardTitle>
            <XCircle className="h-4 w-4 text-red-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{logStats.critical.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((logStats.critical / logStats.total) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 분석 탭 */}
      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">실시간 로그</TabsTrigger>
          <TabsTrigger value="trends">오류 추이</TabsTrigger>
          <TabsTrigger value="analysis">오류 분석</TabsTrigger>
        </TabsList>

        {/* 실시간 로그 */}
        <TabsContent value="logs" className="space-y-4">
          {/* 필터 컨트롤 */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="로그 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 레벨</SelectItem>
                    <SelectItem value="info">정보</SelectItem>
                    <SelectItem value="warning">경고</SelectItem>
                    <SelectItem value="error">오류</SelectItem>
                    <SelectItem value="critical">치명적</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">최근 1시간</SelectItem>
                    <SelectItem value="24h">최근 24시간</SelectItem>
                    <SelectItem value="7d">최근 7일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 로그 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>실시간 로그 ({filteredLogs.length})</CardTitle>
              <CardDescription>시스템 로그를 실시간으로 모니터링합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getLevelIcon(log.level)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`text-xs ${getLevelColor(log.level)}`}>
                              {log.level.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(log.category)}
                                {log.category}
                              </div>
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {log.timestamp}
                            </span>
                          </div>
                          <p className="text-sm font-medium mb-1">{log.message}</p>
                          {log.details && (
                            <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key}:</span>
                                  <span className="font-mono">{value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 오류 추이 */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>시간별 오류/경고 발생 추이</CardTitle>
              <CardDescription>24시간 동안의 오류와 경고 발생 패턴</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="오류"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="warnings" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="경고"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 오류 분석 */}
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>오류 카테고리별 분포</CardTitle>
                <CardDescription>주요 오류 유형과 발생 빈도</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {errorCategories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm text-muted-foreground">
                          {category.count}회 ({category.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>최근 중요 이슈</CardTitle>
                <CardDescription>해결이 필요한 주요 문제들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-medium text-red-700">API Rate Limit 초과</h4>
                  <p className="text-sm text-muted-foreground">
                    GPT-4 API 호출 한도 초과로 인한 서비스 지연
                  </p>
                  <p className="text-xs text-muted-foreground">5회 발생 • 최근 2시간</p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-orange-700">높은 응답 시간</h4>
                  <p className="text-sm text-muted-foreground">
                    일부 페르소나에서 응답 시간이 임계값을 초과
                  </p>
                  <p className="text-xs text-muted-foreground">12회 발생 • 최근 6시간</p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-medium text-yellow-700">메모리 사용량 증가</h4>
                  <p className="text-sm text-muted-foreground">
                    서버 메모리 사용량이 경고 수준에 도달
                  </p>
                  <p className="text-xs text-muted-foreground">지속적 모니터링 중</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}