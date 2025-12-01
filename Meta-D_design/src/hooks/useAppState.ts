import { useState } from 'react';
import type { User, Project, FileItem, ChatbotPersona } from '../types/app';
import type { ChatSession } from '../components/ChatHistoryPanel';

export function useAppState() {
  // 인증 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'admin',
    team: 'IT 부서',
    teamType: 'admin',
    role: 'system_admin',
    chatbotRole: 'system_admin',
    licenseType: 'pro',
    email: 'admin@hcompany.com',
    avatar: '',
    registeredPersonas: ['1', '3'], // 기본으로 설계 엔지니어 AI와 구매 조달 AI 등록
    permissions: {
      canManageUsers: true,
      canManageProjects: true,
      canAccessMetaDrawing: true,
      canManageSystem: true,
      canViewAllProjects: true
    }
  });

  // 모듈 상태
  const [currentModule, setCurrentModule] = useState<'Meta-Drive' | 'Meta-Drawing' | 'Project-Management' | 'User-Management' | 'Meta-Delta' | 'Meta-Delta-Editor' | 'Project-Creation' | 'Project-Edit' | 'Project-Detail' | 'Revision-Comparison' | 'Meta-ChatBot'>('Meta-Drive');

  // 프로젝트 관리
  const [selectedProjectId, setSelectedProjectId] = useState<string>('1');
  const [userProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'LNG 플랜트 건설 프로젝트',
      description: '대규모 LNG 플랜트 건설을 위한 통합 엔지니어링 프로젝트',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-12-31',
      clientName: 'Global Energy Corp',
      location: '여수산업단지',
      budget: 2500000000,
      progress: 68,
      members: ['admin', '김철수', '박구매', '이안전'],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-12-10T16:30:00Z'
    },
    {
      id: '2',
      name: '정유공장 개보수 프로젝트',
      description: '기존 정유공장의 효율성 향상을 위한 개보수 작업',
      status: 'active',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      clientName: 'Korea Refinery',
      location: '울산공업단지',
      budget: 850000000,
      progress: 45,
      members: ['admin', '김철수', '박구매'],
      createdAt: '2024-06-01T10:00:00Z',
      updatedAt: '2024-12-10T14:20:00Z'
    }
  ]);

  // 폴더 및 파일 관리
  const [selectedFolderId, setSelectedFolderId] = useState<string>('1-general');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isFolderPanelCollapsed, setIsFolderPanelCollapsed] = useState(false);

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [semanticSearchResults, setSemanticSearchResults] = useState<FileItem[]>([]);

  // UI 상태
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  
  // Meta-Drawing 타겟 뷰 상태
  const [targetDrawingView, setTargetDrawingView] = useState<string | null>(null);

  // 페르소나 관리 상태
  const [selectedPersona, setSelectedPersona] = useState<ChatbotPersona | null>(null);
  const [selectedDrawingPersona, setSelectedDrawingPersona] = useState<ChatbotPersona | null>(null);

  // 프로젝트 편집 상태
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Meta-ChatBot 대화 히스토리 상태
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'session-1',
      title: '프로젝트 진행 현황 문의',
      lastMessage: '현재 프로젝트는 68% 진행되었으며...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      messageCount: 8,
    },
    {
      id: 'session-2',
      title: '도면 검토 요청',
      lastMessage: '최신 P&ID 도면을 확인하시려면...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 어제
      messageCount: 5,
    },
    {
      id: 'session-3',
      title: '일정 조회',
      lastMessage: '이번 주 주요 일정은 다음과 같습니다...',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
      messageCount: 3,
    },
    {
      id: 'session-4',
      title: '문서 검색',
      lastMessage: '총 1,247개의 파일이 있습니다...',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
      messageCount: 12,
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  return {
    // 인증
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,

    // 모듈
    currentModule,
    setCurrentModule,

    // 프로젝트
    selectedProjectId,
    setSelectedProjectId,
    userProjects,

    // 폴더/파일
    selectedFolderId,
    setSelectedFolderId,
    selectedFile,
    setSelectedFile,
    isFolderPanelCollapsed,
    setIsFolderPanelCollapsed,

    // 검색
    searchQuery,
    setSearchQuery,
    semanticSearchResults,
    setSemanticSearchResults,

    // UI
    viewMode,
    setViewMode,
    
    // Meta-Drawing 뷰
    targetDrawingView,
    setTargetDrawingView,

    // 페르소나
    selectedPersona,
    setSelectedPersona,
    selectedDrawingPersona,
    setSelectedDrawingPersona,

    // 프로젝트 편집
    selectedProject,
    setSelectedProject,

    // Meta-ChatBot 대화 히스토리
    chatSessions,
    setChatSessions,
    currentSessionId,
    setCurrentSessionId,
  };
}