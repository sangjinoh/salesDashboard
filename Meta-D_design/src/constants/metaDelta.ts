import type { ChatbotPersona, PersonaLog } from '../types/app';

// 목업 데이터 - 확장된 페르소나 구조
export const initialPersonas: ChatbotPersona[] = [
  {
    id: '1',
    name: 'engineering_ai',
    displayName: '설계 엔지니어 AI',
    description: 'P&ID, 설계도면 분석 및 설계 검토를 담당하는 AI 어시스턴트',
    role: '설계 엔지니어링 전문가',
    avatar: '',
    status: 'active',
    createdAt: '2024-11-01T09:00:00Z',
    updatedAt: '2024-12-10T14:30:00Z',
    createdBy: '김철수',
    teamType: 'engineering',
    visibility: 'private',
    
    conversationTone: 'technical',
    language: 'korean',
    specialties: ['P&ID 분석', '설계도면 검토', '배관 설계', '장비 사양', '안전 규정'],
    
    knowledgeBase: '플랜트 설계 전문 지식을 바탕으로 P&ID 분석, 설계도면 검토, 배관 설계 등의 업무를 지원합니다.',
    guidelines: '정확하고 안전한 설계 가이드라인을 제공하며, 관련 규정과 표준을 준수합니다.',
    
    model: 'gpt-4',
    temperature: 0.3,
    maxTokens: 4000,
    systemPrompt: '당신은 플랜트 설계 전문 엔지니어입니다.',
    
    dataSources: [
      { folderId: 'proj1-engineering', folderName: 'Engineering', projectId: 'proj1', enabled: true },
      { folderId: 'proj1-eng-pid', folderName: 'P&ID Drawings', projectId: 'proj1', enabled: true }
    ],
    allowedUsers: ['김철수'],
    allowedTeams: ['설계엔지니어링팀'],
    isPublic: false,
    usage: {
      totalConversations: 245,
      totalMessages: 1890,
      totalTokensUsed: 890000,
      averageResponseTime: 2.3,
      satisfactionRating: 4.7,
      lastUsed: '2024-12-10T16:45:00Z',
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: []
    }
  },
  {
    id: '2',
    name: 'kimcs_personal_ai',
    displayName: '김철수의 개인 어시스턴트',
    description: '일정 관리, 업무 정리, 회의 준비 등을 도와주는 개인 맞춤 AI',
    role: '개인 어시스턴트',
    avatar: '',
    status: 'active',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-10T15:20:00Z',
    createdBy: '김철수',
    teamType: 'engineering',
    visibility: 'private',
    
    conversationTone: 'friendly',
    language: 'korean',
    specialties: ['일정 관리', '업무 정리', '문서 작성', '회의 준비'],
    
    knowledgeBase: '김철수 엔지니어의 업무 패턴과 선호도를 학습한 개인 맞춤형 어시스턴트입니다.',
    guidelines: '친근하고 효율적인 방식으로 업무를 도와드리며, 개인정보 보호를 최우선으로 합니다.',
    
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 3000,
    systemPrompt: '당신은 김철수 엔지니어의 개인 업무 어시스턴트입니다.',
    
    dataSources: [
      { folderId: 'proj1-general', folderName: 'Project General', projectId: 'proj1', enabled: true }
    ],
    allowedUsers: ['김철수'],
    allowedTeams: [],
    isPublic: false,
    usage: {
      totalConversations: 58,
      totalMessages: 342,
      totalTokensUsed: 156000,
      averageResponseTime: 1.8,
      satisfactionRating: 4.9,
      lastUsed: '2024-12-10T15:20:00Z',
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: []
    }
  },
  {
    id: '3',
    name: 'procurement_ai',
    displayName: '구매 조달 AI',
    description: '자재 사양서, 공급업체 정보, 계약서 분석을 담당하는 AI 어시스턴트',
    role: '구매 조달 전문가',
    avatar: '',
    status: 'active',
    createdAt: '2024-11-15T10:30:00Z',
    updatedAt: '2024-12-08T11:20:00Z',
    createdBy: 'admin',
    teamType: 'procurement',
    visibility: 'public',
    
    conversationTone: 'professional',
    language: 'korean',
    specialties: ['자재 사양', '공급업체 평가', '계약 검토', '비용 분석'],
    
    knowledgeBase: '구매 조달 전문 지식을 기반으로 자재 사양서 분석, 공급업체 평가 등을 지원합니다.',
    guidelines: '비용 효율성과 품질을 모두 고려한 최적의 구매 전략을 제안합니다.',
    
    model: 'gpt-3.5-turbo',
    temperature: 0.5,
    maxTokens: 3000,
    systemPrompt: '당신은 구매 조달 전문가입니다.',
    
    dataSources: [
      { folderId: 'proj1-procurement', folderName: 'Procurement', projectId: 'proj1', enabled: true },
      { folderId: 'proj1-proc-specs', folderName: 'Material Specifications', projectId: 'proj1', enabled: true }
    ],
    allowedUsers: ['박구매'],
    allowedTeams: ['플랜트구매팀'],
    isPublic: true,
    usage: {
      totalConversations: 158,
      totalMessages: 892,
      totalTokensUsed: 445000,
      averageResponseTime: 1.8,
      satisfactionRating: 4.3,
      lastUsed: '2024-12-09T15:20:00Z',
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: []
    }
  },
  {
    id: '4',
    name: 'safety_ai',
    displayName: '안전 관리 AI',
    description: '안전 규정, 위험성 평가, 사고 예방을 담당하는 AI 어시스턴트',
    role: '안전 관리 전문가',
    avatar: '',
    status: 'training',
    createdAt: '2024-12-01T08:00:00Z',
    updatedAt: '2024-12-10T09:15:00Z',
    createdBy: 'admin',
    teamType: 'safety',
    visibility: 'public',
    
    conversationTone: 'formal',
    language: 'korean',
    specialties: ['안전 규정', '위험성 평가', '사고 예방', 'HAZOP', '안전 교육'],
    
    knowledgeBase: '산업안전 및 플랜트 안전 관리 전문 지식을 기반으로 위험성 평가 및 안전 교육을 지원합니다.',
    guidelines: '안전을 최우선으로 하며, 관련 법규와 표준을 엄격히 준수합니다.',
    
    model: 'claude-3',
    temperature: 0.2,
    maxTokens: 3500,
    systemPrompt: '당신은 플랜트 안전 관리 전문가입니다.',
    
    dataSources: [
      { folderId: 'proj1-general-standards', folderName: 'Standards & Codes', projectId: 'proj1', enabled: true }
    ],
    allowedUsers: [],
    allowedTeams: ['안전팀'],
    isPublic: true,
    usage: {
      totalConversations: 12,
      totalMessages: 67,
      totalTokensUsed: 34000,
      averageResponseTime: 3.1,
      satisfactionRating: 4.9,
      lastUsed: '2024-12-09T12:30:00Z',
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: []
    }
  }
];

// 사용량 목업 데이터
export const mockUsageData = [
  { date: '12/04', conversations: 28, messages: 187, tokens: 89000, cost: 4.5, users: 8 },
  { date: '12/05', conversations: 35, messages: 245, tokens: 118000, cost: 5.9, users: 12 },
  { date: '12/06', conversations: 42, messages: 298, tokens: 142000, cost: 7.1, users: 15 },
  { date: '12/07', conversations: 38, messages: 267, tokens: 128000, cost: 6.4, users: 11 },
  { date: '12/08', conversations: 45, messages: 312, tokens: 156000, cost: 7.8, users: 14 },
  { date: '12/09', conversations: 52, messages: 389, tokens: 198000, cost: 9.9, users: 18 },
  { date: '12/10', conversations: 48, messages: 342, tokens: 174000, cost: 8.7, users: 16 }
];

export const mockPersonaUsage = [
  { name: '설계 엔지니어 AI', conversations: 245, cost: 28.4, fill: '#3b82f6' },
  { name: '구매 조달 AI', conversations: 158, cost: 15.7, fill: '#10b981' },
  { name: '김철수의 개인 어시스턴트', conversations: 58, cost: 6.2, fill: '#f59e0b' },
  { name: '안전 관리 AI', conversations: 12, cost: 2.1, fill: '#ef4444' }
];

export const mockCostData = [
  { date: '12/04', gpt4: 3.2, gpt35: 0.8, claude: 0.5, total: 4.5 },
  { date: '12/05', gpt4: 4.1, gpt35: 1.2, claude: 0.6, total: 5.9 },
  { date: '12/06', gpt4: 4.8, gpt35: 1.5, claude: 0.8, total: 7.1 },
  { date: '12/07', gpt4: 4.2, gpt35: 1.3, claude: 0.9, total: 6.4 },
  { date: '12/08', gpt4: 5.1, gpt35: 1.8, claude: 0.9, total: 7.8 },
  { date: '12/09', gpt4: 6.2, gpt35: 2.4, claude: 1.3, total: 9.9 },
  { date: '12/10', gpt4: 5.4, gpt35: 2.1, claude: 1.2, total: 8.7 }
];

export const mockLogs: PersonaLog[] = [
  {
    id: '1',
    personaId: '1',
    timestamp: '2024-12-10T16:45:00Z',
    userId: 'kimcs',
    userName: '김철수',
    type: 'conversation',
    level: 'info',
    message: 'P&ID 분석 요청 처리 완료',
    details: {
      conversationId: 'conv_123',
      messageCount: 8,
      tokensUsed: 2450,
      responseTime: 2.1
    }
  },
  {
    id: '2',
    personaId: '3',
    timestamp: '2024-12-10T16:30:00Z',
    userId: 'parkgm',
    userName: '박구매',
    type: 'error',
    level: 'warning',
    message: '응답 생성 중 속도 제한 경고',
    details: {
      conversationId: 'conv_124',
      errorCode: 'RATE_LIMIT_WARNING',
      responseTime: 4.2
    }
  },
  {
    id: '3',
    personaId: '1',
    timestamp: '2024-12-10T16:15:00Z',
    userId: 'admin',
    userName: 'admin',
    type: 'config_change',
    level: 'info',
    message: '시스템 프롬프트 업데이트',
    details: {
      configChanges: {
        systemPrompt: 'Updated system prompt for better P&ID analysis'
      }
    }
  },
  {
    id: '4',
    personaId: '4',
    timestamp: '2024-12-10T16:00:00Z',
    userId: 'system',
    userName: 'System',
    type: 'training',
    level: 'info',
    message: '안전 관리 AI 학습 완료',
    details: {
      responseTime: 0
    }
  },
  {
    id: '5',
    personaId: '2',
    timestamp: '2024-12-10T15:45:00Z',
    userId: 'kimcs',
    userName: '김철수',
    type: 'conversation',
    level: 'info',
    message: '개인 어시스턴트 대화 완료',
    details: {
      conversationId: 'conv_125',
      messageCount: 5,
      tokensUsed: 1200,
      responseTime: 1.5
    }
  }
];