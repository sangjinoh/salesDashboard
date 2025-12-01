import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import type { User, FileItem, ChatbotPersona } from '../types/app';

interface UseAppHandlersProps {
  setSemanticSearchResults: (results: any[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFolderId: (folderId: string) => void;
  selectedProjectId: string;
  setUser: (user: User) => void;
  currentModule: string;
  setCurrentModule: (module: string) => void;
  selectedFile: FileItem | null;
  setSelectedFile: (file: FileItem | null) => void;
  isFolderPanelCollapsed: boolean;
  setIsFolderPanelCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
  setSelectedPersona: (persona: ChatbotPersona | null) => void;
}

export function useAppHandlers({
  setSemanticSearchResults,
  setSearchQuery,
  setSelectedFolderId,
  selectedProjectId,
  setUser,
  currentModule,
  setCurrentModule,
  selectedFile,
  setSelectedFile,
  isFolderPanelCollapsed,
  setIsFolderPanelCollapsed,
  onLogout,
  setSelectedPersona
}: UseAppHandlersProps) {

  // 시맨틱 검색 처리
  const handleSemanticSearch = async (query: string) => {
    if (!query.trim()) {
      setSemanticSearchResults([]);
      return;
    }

    // 시뮬레이션된 시맨틱 검색 결과
    const mockResults = [
      {
        id: '1',
        fileName: 'Heat_Exchanger_Design.pdf',
        filePath: '/Project Alpha/Engineering/Heat_Exchanger_Design.pdf',
        relevanceScore: 0.95,
        snippet: '이 문서는 셸-튜브 열교환기의 설계 계산서입니다. TEMA 표준에 따른 열전달 계수와 압력 손실 계산이 포함되어 있습니다.',
        metadata: {
          type: 'pdf',
          size: 2048000,
          uploadDate: '2024-01-15',
          tags: ['설계', '열교환기', 'TEMA']
        }
      },
      {
        id: '2',
        fileName: 'P&ID_Rev03.dwg',
        filePath: '/Project Alpha/Engineering/P&ID_Rev03.dwg',
        relevanceScore: 0.87,
        snippet: 'Process Flow Diagram과 Instrumentation Diagram이 포함된 도면입니다. 주요 장비와 제어 시스템이 상세히 표현되어 있습니다.',
        metadata: {
          type: 'dwg',
          size: 5120000,
          uploadDate: '2024-01-20',
          tags: ['도면', 'P&ID', '계장']
        }
      }
    ];

    // 선택된 폴더가 있으면 해당 폴더 내에서만 검색하는 것처럼 시뮬레이션
    setSemanticSearchResults(mockResults);
    toast.success(`"${query}"에 대한 ${mockResults.length}개의 관련 문서를 찾았습니다.`);
  };

  // 검색 범위 초기화 (전체 프로젝트로)
  const handleClearSearchScope = () => {
    setSelectedFolderId(''); // 전체 프로젝트로 초기화
    setSearchQuery(''); // 검색어도 초기화
    setSemanticSearchResults([]); // 검색 결과도 초기화
    toast.success('검색 범위가 전체 프로젝트로 초기화되었습니다.');
  };

  // 파일 삭제 처리
  const handleFileDelete = (fileId: string) => {
    // 실제 구현에서는 API 호출
    console.log('파일 삭제:', fileId);
    toast.success('파일이 삭제되었습니다.');
    
    // 선택된 파일이 삭제된 파일이면 선택 해제
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  // 폴더 패널 토글
  const handleToggleFolderPanel = () => {
    setIsFolderPanelCollapsed(!isFolderPanelCollapsed);
  };

  // 모듈 전환 처리
  const handleModuleSwitch = (module: 'Meta-Drive' | 'Meta-Drawing' | 'Meta-ChatBot') => {
    setCurrentModule(module);
  };

  // 설정 메뉴 핸들러들
  const handleAISettings = () => {
    setCurrentModule('Meta-Delta');
  };

  const handleProjectManagement = () => {
    setCurrentModule('Project-Management');
  };

  const handleUserManagement = () => {
    setCurrentModule('User-Management');
  };

  // 페르소나 관리 핸들러들
  const handlePersonaEdit = (persona: ChatbotPersona) => {
    setSelectedPersona(persona);
    setCurrentModule('Meta-Delta-Editor');
  };

  const handlePersonaCreate = () => {
    setSelectedPersona(null);
    setCurrentModule('Meta-Delta-Editor');
  };

  const handlePersonaSave = (persona: ChatbotPersona) => {
    // 실제 구현에서는 API 호출
    console.log('페르소나 저장:', persona);
    toast.success(`${persona.displayName} 페르소나가 저장되었습니다.`);
    setCurrentModule('Meta-Delta');
  };

  // 사용자 정보 업데이트
  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    toast.success('사용자 정보가 업데이트되었습니다.');
  };

  // 새 프로젝트 생성
  const handleNewProjectCreate = (projectData: any) => {
    // 실제 구현에서는 API 호출
    console.log('새 프로젝트 생성:', projectData);
    toast.success(`"${projectData.name}" 프로젝트가 생성되었습니다.`);
  };

  return {
    handleSemanticSearch,
    handleClearSearchScope,
    handleFileDelete,
    handleToggleFolderPanel,
    handleModuleSwitch,
    handleAISettings,
    handleProjectManagement,
    handleUserManagement,
    handlePersonaEdit,
    handlePersonaCreate,
    handlePersonaSave,
    handleUserUpdate,
    handleNewProjectCreate,
    handleLogout: onLogout
  };
}