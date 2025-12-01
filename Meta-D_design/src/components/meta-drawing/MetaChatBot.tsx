import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Send, Bot, User, Lightbulb, Search, Filter, Maximize2, Minimize2, Settings, Sparkles } from 'lucide-react';
import { initialPersonas } from '../../constants/metaDelta';
import { filterUserPersonas } from '../../utils/metaDelta';
import type { ChatbotPersona } from '../../types/app';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
  metadata?: {
    highlightedObjects?: string[];
    filteredItems?: string[];
    confidence?: number;
  };
}

interface ChatAction {
  id: string;
  label: string;
  type: 'highlight' | 'filter' | 'navigate' | 'export';
  data?: any;
}

interface MetaChatBotProps {
  selectedObjectId?: string;
  selectedDrawingId?: string;
  onObjectsHighlight: (objectIds: string[]) => void;
  onItemsFilter: (filterCriteria: any) => void;
  selectedPersona?: ChatbotPersona | null;
  onPersonaChange?: (persona: ChatbotPersona | null) => void;
  user?: any;
  className?: string;
}

export function MetaChatBot({ 
  selectedObjectId, 
  selectedDrawingId,
  onObjectsHighlight,
  onItemsFilter,
  selectedPersona,
  onPersonaChange,
  user,
  className = '' 
}: MetaChatBotProps) {
  // 사용 가능한 페르소나 목록 (등록된 페르소나만)
  const allPersonas = user ? filterUserPersonas(initialPersonas, user.chatbotRole === 'system_admin', user) : [];
  const availablePersonas = user?.registeredPersonas 
    ? allPersonas.filter(persona => user.registeredPersonas!.includes(persona.id))
    : allPersonas;

  const getInitialMessage = () => {
    if (selectedPersona) {
      return `안녕하세요! ${selectedPersona.displayName}입니다. ${selectedPersona.description} 무엇을 도와드릴까요?`;
    }
    return '안녕하세요! Meta-ChatBot입니다. 도면 검토와 분석을 도와드리겠습니다. AI 페르소나를 선택하시면 더 전문적인 도움을 받으실 수 있습니다.';
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // 페르소나가 변경되면 초기 메시지 업데이트
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      content: getInitialMessage(),
      timestamp: new Date(Date.now() - 60000),
      actions: selectedPersona ? 
        selectedPersona.specialties?.slice(0, 3).map((specialty, index) => ({
          id: `action-${index + 1}`,
          label: `${specialty} 도움받기`,
          type: 'navigate' as const
        })) || [] :
        [
          { id: 'action-1', label: '모든 Heat Exchanger 찾기', type: 'highlight' },
          { id: 'action-2', label: '압력 용기 리스트 보기', type: 'filter' },
          { id: 'action-3', label: 'P&ID 심보 검증하기', type: 'navigate' }
        ]
    };
    setMessages([initialMessage]);
  }, [selectedPersona]);
  
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 선택된 객체가 변경되면 자동 응답
  useEffect(() => {
    if (selectedObjectId) {
      const contextMessage: ChatMessage = {
        id: `context-${Date.now()}`,
        type: 'bot',
        content: `HE-101 Heat Exchanger가 선택되었습니다. 이 장비에 대해 궁금한 점이 있으시면 언제든 물어보세요.`,
        timestamp: new Date(),
        actions: [
          { id: 'action-specs', label: '사양 확인', type: 'navigate' },
          { id: 'action-related', label: '연결된 장비 보기', type: 'highlight' },
          { id: 'action-issues', label: '검토 이슈 확인', type: 'filter' }
        ],
        metadata: { confidence: 0.95 }
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  }, [selectedObjectId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 시뮬레이션된 AI 응답
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();
    const personaPrefix = selectedPersona ? `${selectedPersona.displayName}으로서 ` : '';
    
    // 페르소나별 맞춤 응답
    if (selectedPersona) {
      // 설계 엔지니어 AI 응답
      if (selectedPersona.name === 'engineering_ai') {
        if (input.includes('heat exchanger') || input.includes('열교환기')) {
          return {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: `${personaPrefix}P&ID 도면을 분석했습니다. HE-101, HE-102, HE-103 총 3개의 열교환기가 확인되며, 설계 표준 TEMA에 따른 검증이 필요합니다. 각 열교환기의 열전달 계수와 압손을 확인해드릴까요?`,
            timestamp: new Date(),
            actions: [
              { id: 'highlight-he', label: 'HE 설계 검토', type: 'highlight', data: ['HE-101', 'HE-102', 'HE-103'] },
              { id: 'filter-he', label: 'TEMA 표준 확인', type: 'filter' },
              { id: 'check-he', label: '열전달 계산서', type: 'export' }
            ],
            metadata: { 
              highlightedObjects: ['HE-101', 'HE-102', 'HE-103'],
              confidence: 0.95
            }
          };
        }
      }
      
      // 구매 조달 AI 응답
      if (selectedPersona.name === 'procurement_ai') {
        if (input.includes('heat exchanger') || input.includes('열교환기')) {
          return {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: `${personaPrefix}열교환기 조달 관점에서 분석했습니다. HE-101, HE-102, HE-103의 재질(SS316L), 용량 및 공급업체 정보를 확인했습니다. 예상 납기는 16주이며, 3개 업체 견적 비교가 가능합니다.`,
            timestamp: new Date(),
            actions: [
              { id: 'highlight-he', label: 'HE 사양서 검토', type: 'highlight', data: ['HE-101', 'HE-102', 'HE-103'] },
              { id: 'filter-he', label: '공급업체 비교', type: 'filter' },
              { id: 'check-he', label: '구매 요청서', type: 'export' }
            ],
            metadata: { 
              highlightedObjects: ['HE-101', 'HE-102', 'HE-103'],
              confidence: 0.88
            }
          };
        }
      }
      
      // 안전 관리 AI 응답
      if (selectedPersona.name === 'safety_ai') {
        if (input.includes('pressure') || input.includes('압력')) {
          return {
            id: `bot-${Date.now()}`,
            type: 'bot',
            content: `${personaPrefix}압력 안전 관점에서 검토했습니다. 설계압력 10bar 이상 고압 장비 15개를 확인했으며, PSV(압력안전밸브) 설치 여부와 HAZOP 분석이 필요합니다. 안전 규정 준수 상태를 점검해드릴까요?`,
            timestamp: new Date(),
            actions: [
              { id: 'filter-pressure', label: 'PSV 위치 확인', type: 'filter' },
              { id: 'highlight-vessels', label: '고압 위험구역', type: 'highlight' },
              { id: 'safety-check', label: 'HAZOP 체크리스트', type: 'navigate' }
            ],
            metadata: { 
              filteredItems: ['high-pressure-equipment'],
              confidence: 0.92
            }
          };
        }
      }
    }
    
    // 기본 응답 (페르소나 없음)
    if (input.includes('heat exchanger') || input.includes('열교환기')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: '도면에서 Heat Exchanger를 찾아 표시해드렸습니다. HE-101, HE-102, HE-103 총 3개의 열교환기가 확인됩니다. 각각의 설계 조건과 운전 조건을 확인하시겠습니까?',
        timestamp: new Date(),
        actions: [
          { id: 'highlight-he', label: '모든 HE 하이라이트', type: 'highlight', data: ['HE-101', 'HE-102', 'HE-103'] },
          { id: 'filter-he', label: 'HE 사양 비교표', type: 'filter' },
          { id: 'check-he', label: 'HE 검토 리포트', type: 'export' }
        ],
        metadata: { 
          highlightedObjects: ['HE-101', 'HE-102', 'HE-103'],
          confidence: 0.92
        }
      };
    }
    
    if (input.includes('pressure') || input.includes('압력')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: '압력 관련 정보를 분석했습니다. 설계압력이 10bar 이상인 장비들을 필터링해서 보여드렸습니다. 총 15개 장비가 해당됩니다.',
        timestamp: new Date(),
        actions: [
          { id: 'filter-pressure', label: '고압 장비 필터', type: 'filter' },
          { id: 'highlight-vessels', label: '압력용기 하이라이트', type: 'highlight' },
          { id: 'safety-check', label: '안전밸브 확인', type: 'navigate' }
        ],
        metadata: { 
          filteredItems: ['high-pressure-equipment'],
          confidence: 0.88
        }
      };
    }

    if (input.includes('error') || input.includes('오류') || input.includes('문제')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: '도면에서 인식 오류나 검토가 필요한 항목들을 확인했습니다. 신뢰도가 낮거나 수정이 필요한 5개 항목을 발견했습니다.',
        timestamp: new Date(),
        actions: [
          { id: 'show-errors', label: '오류 항목 표시', type: 'highlight' },
          { id: 'review-list', label: '검토 리스트 보기', type: 'filter' },
          { id: 'auto-fix', label: '자동 수정 제안', type: 'navigate' }
        ],
        metadata: { confidence: 0.85 }
      };
    }

    // 기본 응답
    const suggestions = selectedPersona && selectedPersona.specialties 
      ? selectedPersona.specialties.slice(0, 2).map(s => `"${s}에 대해 알려줘"`).join(', ')
      : '"열교환기를 찾아줘", "압력이 높은 장비는?", "오류가 있는 항목은?"';
      
    return {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: `${personaPrefix}해당 질문에 대해 정확한 답변을 찾지 못했습니다. 다음과 같은 질문을 시도해보세요: ${suggestions}`,
      timestamp: new Date(),
      actions: selectedPersona ? 
        selectedPersona.specialties?.slice(0, 2).map((specialty, index) => ({
          id: `help-${index}`,
          label: `${specialty} 도움말`,
          type: 'navigate' as const
        })) || [] :
        [
          { id: 'help-symbols', label: '심볼 검색 도움말', type: 'navigate' },
          { id: 'help-review', label: '검토 기능 안내', type: 'navigate' }
        ],
      metadata: { confidence: 0.5 }
    };
  };

  const handleActionClick = (action: ChatAction) => {
    switch (action.type) {
      case 'highlight':
        if (action.data) {
          onObjectsHighlight(action.data);
        }
        break;
      case 'filter':
        onItemsFilter(action.data || {});
        break;
      case 'navigate':
        console.log('Navigate action:', action);
        break;
      case 'export':
        console.log('Export action:', action);
        break;
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`bg-white border-l border-border flex flex-col h-full ${className}`}>
      {/* 헤더 - 고정 높이 */}
      <div className="flex-shrink-0 p-3 border-b border-border bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              {selectedPersona ? <Sparkles className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {selectedPersona ? selectedPersona.displayName : 'Meta-ChatBot'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedPersona ? selectedPersona.role : 'AI 도면 분석 어시스턴트'}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* 페르소나 선택 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">AI 페르소나</span>
          </div>
          <Select 
            value={selectedPersona?.id || 'default'} 
            onValueChange={(value) => {
              const persona = value === 'default' ? null : availablePersonas.find(p => p.id === value) || null;
              onPersonaChange?.(persona);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="페르소나를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">기본 어시스턴트</SelectItem>
              {availablePersonas.length > 0 ? (
                availablePersonas.map((persona) => (
                  <SelectItem key={persona.id} value={persona.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-xs">{persona.displayName.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{persona.displayName}</div>
                        <div className="text-xs text-muted-foreground">{persona.role}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Settings className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <p>등록된 페르소나가 없습니다</p>
                      <p className="text-xs">Meta-ChatBot에서 페르소나를 등록하세요</p>
                    </div>
                  </div>
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 메시지 영역 - 스크롤 영역으로 안정화 */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-3 min-h-32">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarFallback className={`text-xs ${message.type === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                        {message.type === 'user' ? (
                          <User className="w-3 h-3" />
                        ) : selectedPersona ? (
                          <span className="text-xs font-medium">{selectedPersona.displayName.charAt(0)}</span>
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      
                      {message.actions && (
                        <div className="mt-2 space-y-1">
                          {message.actions.map((action) => (
                            <Button
                              key={action.id}
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs bg-white"
                              onClick={() => handleActionClick(action)}
                            >
                              {action.type === 'highlight' && <Search className="w-3 h-3 mr-1" />}
                              {action.type === 'filter' && <Filter className="w-3 h-3 mr-1" />}
                              {action.type === 'navigate' && <Lightbulb className="w-3 h-3 mr-1" />}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      {message.metadata?.confidence && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-xs opacity-70">신뢰도:</span>
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(message.metadata.confidence * 100)}%
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-1">
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-purple-100">
                        {selectedPersona ? (
                          <span className="text-xs font-medium">{selectedPersona.displayName.charAt(0)}</span>
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* 입력 영역 - 고정 높이로 항상 표시 */}
      <div className="flex-shrink-0 h-16 p-3 border-t border-border bg-white">
        <div className="flex gap-2 h-full items-center">
          <Input
            placeholder={
              selectedPersona 
                ? `${selectedPersona.displayName}에게 질문해보세요...`
                : "도면에 대해 질문해보세요..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="text-sm"
          />
          <Button size="sm" onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}