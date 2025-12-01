import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cloud, Calendar, CheckSquare, TrendingUp, FolderOpen, Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import type { Project } from '../types/app';

interface ChatBotViewProps {
  user: any;
  selectedFolderId?: string;
  selectedProjectId: string;
  userProjects: Project[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatBotView({ user, selectedFolderId, selectedProjectId, userProjects }: ChatBotViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 스크롤을 최하단으로
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // 현재 프로젝트 찾기
  const currentProject = userProjects.find(p => p.id === selectedProjectId);

  // 메시지 전송
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: getAIResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // AI 응답 생성 (Mock)
  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('프로젝트') || lowerQuery.includes('project')) {
      return `현재 "${currentProject?.name || '선택된 프로젝트'}"에서 작업 중입니다. 이 프로젝트는 ${currentProject?.type || 'LNG Plant'} 타입이며, 진행률은 약 ${Math.floor(Math.random() * 40 + 40)}%입니다. 추가로 궁금하신 사항이 있으신가요?`;
    }
    
    if (lowerQuery.includes('도면') || lowerQuery.includes('drawing')) {
      return '프로젝트의 최신 도면을 확인하시려면 Meta-Drawing 모듈로 이동하시면 됩니다. 현재 총 247개의 도면이 등록되어 있으며, 이 중 15개가 지난주에 업데이트되었습니다.';
    }
    
    if (lowerQuery.includes('일정') || lowerQuery.includes('schedule')) {
      return '이번 주 주요 일정:\n• 12/15 (월) - 설계 검토 회의 14:00\n• 12/17 (수) - 구매 담당자 미팅 10:00\n• 12/19 (금) - 프로젝트 진행 보고 15:00\n\n다음 마일스톤은 12/30 Basic Design Freeze입니다.';
    }
    
    if (lowerQuery.includes('파일') || lowerQuery.includes('문서')) {
      return `현재 프로젝트에는 총 1,247개의 파일이 있습니다. 최근 업로드된 파일은 "P&ID_Rev3.pdf" (12/14 업로드)입니다. 특정 파일을 찾으시나요?`;
    }
    
    return `"${query}"에 대한 정보를 검색했습니다. Meta-ChatBot은 프로젝트 문서, 도면, 일정 등에 대해 답변할 수 있습니다. 구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있습니다.`;
  };

  // 엔터키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 빈 화면 (채팅이 없을 때)
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full">
        {/* 대시보드 그���드 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* 환영 메시지 */}
            <div className="text-center space-y-3 py-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold">Meta-ChatBot에 오신 것을 환영합니다</h2>
              <p className="text-muted-foreground">
                프로젝트 정보, 문서, 일정 등에 대해 무엇이든 질문해보세요
              </p>
            </div>

            {/* 대시보드 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 현재 프로젝트 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">현재 프로젝트</div>
                    <div className="font-semibold">{currentProject?.name || 'LNG Plant A'}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">진행률</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">활성 문서</span>
                  <span className="font-medium">1,247개</span>
                </div>
              </Card>

              {/* 날씨 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">오늘의 날씨</div>
                    <div className="font-semibold">서울, 대한민국</div>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="text-4xl font-bold">12°C</div>
                  <div className="text-muted-foreground mb-1">맑음</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">습도</div>
                    <div className="font-medium">45%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">풍속</div>
                    <div className="font-medium">2.5 m/s</div>
                  </div>
                </div>
              </Card>

              {/* 다가오는 일정 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">다가오는 일정</div>
                    <div className="font-semibold">이번 주</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">설계 검토 회의</div>
                      <div className="text-xs text-muted-foreground">12/15 (월) 14:00</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">구매 담당자 미팅</div>
                      <div className="text-xs text-muted-foreground">12/17 (수) 10:00</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">프로젝트 진행 보고</div>
                      <div className="text-xs text-muted-foreground">12/19 (금) 15:00</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 할 일 목록 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">할 일 목록</div>
                    <div className="font-semibold">오늘</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">P&ID 도면 검토 완료</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">설계 변경 승인 요청</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm line-through text-muted-foreground">주간 보고서 작성</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Plus className="w-4 h-4" />
                  <span>새 작업 추가</span>
                </Button>
              </Card>

              {/* 최근 활동 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">최근 활동</div>
                    <div className="font-semibold">지난 7일</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">업로드한 파일</span>
                    <span className="font-medium">34개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">검토한 도면</span>
                    <span className="font-medium">12개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">작성한 코멘트</span>
                    <span className="font-medium">8개</span>
                  </div>
                </div>
              </Card>

              {/* AI 페르소나 */}
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">활성 AI 페르소나</div>
                    <div className="font-semibold">설계 검토 전문가</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  설계 문서와 도면 검토에 특화된 AI 어시스턴트입니다.
                </p>
                {user.licenseType === 'pro' && (
                  <Button variant="outline" size="sm" className="w-full">
                    페르소나 변경
                  </Button>
                )}
              </Card>
            </div>

            {/* 빠른 질문 제안 */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">빠른 질문</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  '이번 주 일정을 알려줘',
                  '프로젝트 진행 현황은?',
                  '최근 업데이트된 도면 목록',
                  '검토가 필요한 문서는?',
                ].map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                    onClick={() => setInputValue(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 입력 영역 */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요... (Shift + Enter로 줄바꿈)"
                className="min-h-[60px] max-h-[200px] resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-4"
                size="lg"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              {user.licenseType === 'pro' ? '프로 라이선스로 고급 AI 기능을 사용할 수 있습니다' : '베이직 라이선스 사용 중'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 채팅 화면
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 메시지 영역 */}
      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-purple-100">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col gap-2 max-w-[70%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                <Card className={`p-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-accent'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </Card>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.role === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-100">
                    <User className="w-5 h-5 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-purple-100">
                  <Bot className="w-5 h-5 text-purple-600" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-accent">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 입력 영역 */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요... (Shift + Enter로 줄바꿈)"
              className="min-h-[60px] max-h-[200px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="px-4"
              size="lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}