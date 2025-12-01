export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  position?: string; // 직급 정보 추가
  chatbotRole: 'system_admin' | 'team_admin' | 'user';
  teamType?: 'engineering' | 'procurement' | 'construction' | 'management' | 'safety' | 'qa';
  licenseType: 'basic' | 'pro';
  phone?: string;
  department?: string;
  team?: string; // 팀 정보 추가
  joinDate?: string;
  bio?: string;
  projectPermissions?: 'admin' | 'readwrite' | 'readonly';
  registeredPersonas?: string[]; // 사용자가 등록한 페르소나 ID 목록
  permissions?: {
    canManageUsers?: boolean;
    canManageProjects?: boolean;
    canAccessMetaDrawing?: boolean;
    canManageSystem?: boolean;
    canViewAllProjects?: boolean;
  };
  // 프로젝트별 세부 권한
  projectAccess?: {
    [projectId: string]: {
      level: 'admin' | 'readwrite' | 'readonly' | 'none';
      canUpload?: boolean;
      canDelete?: boolean;
      canEdit?: boolean;
      canManage?: boolean;
    };
  };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'paused' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'dwg' | 'docx' | 'xlsx' | 'image' | 'other';
  size: number;
  uploadDate: string;
  folderId: string;
  projectId: string;
  tags?: string[];
  metadata?: {
    description?: string;
    version?: string;
    author?: string;
  };
}

export interface FolderNode {
  id: string;
  name: string;
  displayName?: string;
  type: 'project' | 'folder';
  children?: FolderNode[];
  projectId?: string;
  parentId?: string;
  isExpanded?: boolean;
  fileCount?: number;
}

export interface SemanticSearchResult {
  id: string;
  fileName: string;
  filePath: string;
  relevanceScore: number;
  snippet: string;
  metadata?: {
    type: string;
    size: number;
    uploadDate: string;
    tags?: string[];
  };
}

// 데이터 소스 관련 새로운 타입들
export interface DataSourceFolder {
  id: string;
  name: string;
  displayName: string;
  description: string;
  projectId: string;
  projectName: string;
  path: string;
  fileCount: number;
  totalSize: number;
  lastUpdated: string;
  fileTypes: FileTypeStats[];
  accessLevel: 'read' | 'write' | 'admin';
  tags: string[];
  isActive: boolean;
}

export interface FileTypeStats {
  type: 'pdf' | 'dwg' | 'docx' | 'xlsx' | 'image' | 'other';
  count: number;
  size: number;
}

export interface DataSourceConfig {
  folderId: string;
  folderName: string;
  projectId: string;
  enabled: boolean;
  accessLevel?: 'read' | 'write' | 'admin';
  fileTypeFilters?: string[];
  includeSubfolders?: boolean;
  keywordFilters?: string[];
  excludePatterns?: string[];
  lastSyncDate?: string;
}

export interface ProjectDataSource {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  folders: DataSourceFolder[];
  totalFiles: number;
  totalSize: number;
  lastUpdated: string;
}

// 챗봇 페르소나 관련 타입들
export interface ChatbotPersona {
  id: string;
  name: string;
  displayName: string;
  description: string;
  role: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  teamType?: 'engineering' | 'procurement' | 'construction' | 'management' | 'safety' | 'qa';
  
  // 개인/공용 설정
  visibility: 'private' | 'public'; // private: 본인만, public: 모든 사용자
  
  // 기본 설정 (생성자가 편집 가능)
  conversationTone: 'professional' | 'friendly' | 'casual' | 'formal' | 'technical';
  language: 'korean' | 'english' | 'mixed';
  specialties: string[]; // 쉼표로 구분된 전문분야 배열
  
  // AI 설정 (admin이 아닌 경우 간소화됨)
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro';
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  
  // 지식 기반 설정 (간소화)
  knowledgeBase: string; // 기본 지식 설명
  guidelines: string; // 동작 가이드라인
  
  // 데이터 소스 (admin 전용)
  dataSources: DataSourceConfig[];
  
  // 접근 권한 (admin 전용)
  allowedUsers: string[];
  allowedTeams: string[];
  isPublic: boolean;
  
  // 사용량 통계
  usage?: PersonaUsageStats;
}

export interface PersonaUsageStats {
  totalConversations: number;
  totalMessages: number;
  totalTokensUsed: number;
  averageResponseTime: number;
  satisfactionRating: number;
  lastUsed: string;
  
  // 시간별 통계
  dailyStats: DailyUsageStats[];
  weeklyStats: WeeklyUsageStats[];
  monthlyStats: MonthlyUsageStats[];
}

export interface DailyUsageStats {
  date: string;
  conversations: number;
  messages: number;
  tokens: number;
  avgResponseTime: number;
  cost: number;
}

export interface WeeklyUsageStats {
  week: string;
  conversations: number;
  messages: number;
  tokens: number;
  avgResponseTime: number;
  cost: number;
}

export interface MonthlyUsageStats {
  month: string;
  conversations: number;
  messages: number;
  tokens: number;
  avgResponseTime: number;
  cost: number;
}

export interface PersonaLog {
  id: string;
  personaId: string;
  timestamp: string;
  userId: string;
  userName: string;
  type: 'conversation' | 'error' | 'training' | 'config_change';
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: {
    conversationId?: string;
    messageCount?: number;
    tokensUsed?: number;
    responseTime?: number;
    errorCode?: string;
    stackTrace?: string;
    configChanges?: Record<string, any>;
  };
}

export interface PersonaCost {
  personaId: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  
  // 토큰 사용량
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  
  // 비용 (USD)
  inputCost: number;
  outputCost: number;
  totalCost: number;
  
  // 모델별 세부사항
  modelUsage: {
    model: string;
    tokens: number;
    cost: number;
  }[];
}

export type ViewMode = 'grid' | 'list' | 'timeline';
export type CurrentModule = 'Meta-Drive' | 'Meta-Drawing' | 'Meta-ChatBot' | 'Project-Management' | 'Meta-Delta' | 'User-Management' | 'Project-Creation' | 'Project-Edit' | 'Project-Detail' | 'Meta-Delta-Editor' | 'Revision-Comparison';

// 권한 체크 유틸리티 인터페이스
export interface UserPermissions {
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canCreateProjects: boolean;
  canManageUsers: boolean;
  canEditPersonas: boolean;
  canCreatePersonas: boolean;
  canAccessMetaDrawing: boolean;
  canUploadFiles: boolean;
  canDeleteFiles: boolean;
  canEditFiles: boolean;
  projectAccess: 'all' | 'assigned' | 'readonly';
}