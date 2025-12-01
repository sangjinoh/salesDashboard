import { MetaDrawing } from './components/MetaDrawing';
import { MetaDriveLayout } from './components/MetaDriveLayout';
import { ChatBotLayout } from './components/ChatBotLayout';
import { ProjectManagement } from './components/ProjectManagement';
import { ProjectCreation } from './components/ProjectCreation';
import { ProjectEdit } from './components/ProjectEdit';
import { ProjectDetail } from './components/ProjectDetail';
import { MetaDeltaSettings } from './components/MetaDeltaSettings';
import { PersonaEditor } from './components/PersonaEditor';
import { UserManagement } from './components/UserManagement';
import { LoginScreen } from './components/LoginScreen';
import { RevisionComparison } from './components/RevisionComparison';
import { FileUploadDialog } from './components/FileUploadDialog';
import { AISettingsDialog } from './components/AISettingsDialog';
import { ProfileSettingsDialog } from './components/ProfileSettingsDialog';
import { SystemSettingsDialog } from './components/SystemSettingsDialog';
import { NewProjectDialog } from './components/NewProjectDialog';
import { Toaster } from './components/ui/sonner';

import { useAppState } from './hooks/useAppState';
import { useDialogState } from './hooks/useDialogState';
import { useAppHandlers } from './hooks/useAppHandlers';
import { getFolderDisplayName } from './utils/app';

export default function App() {
  const appState = useAppState();
  const dialogState = useDialogState();

  // 로그인 핸들러
  const handleLogin = (user: any) => {
    appState.setUser(user);
    appState.setIsLoggedIn(true);
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    appState.setIsLoggedIn(false);
    appState.setCurrentModule('Meta-Drive');
  };

  // 로그인되지 않은 상태면 로그인 화면 표시
  if (!appState.isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  
  const handlers = useAppHandlers({
    setSemanticSearchResults: appState.setSemanticSearchResults,
    setSearchQuery: appState.setSearchQuery,
    setSelectedFolderId: appState.setSelectedFolderId,
    selectedProjectId: appState.selectedProjectId,
    setUser: appState.setUser,
    currentModule: appState.currentModule,
    setCurrentModule: appState.setCurrentModule,
    selectedFile: appState.selectedFile,
    setSelectedFile: appState.setSelectedFile,
    isFolderPanelCollapsed: appState.isFolderPanelCollapsed,
    setIsFolderPanelCollapsed: appState.setIsFolderPanelCollapsed,
    onLogout: handleLogout,
    setSelectedPersona: appState.setSelectedPersona,
  });

  // 라이선스 기반 접근 제어
  const canAccessMetaDrawing = appState.user.licenseType === 'pro';

  // 공통 다이얼로그 컴포넌트
  const CommonDialogs = () => (
    <>
      <ProfileSettingsDialog
        isOpen={dialogState.isProfileSettingsOpen}
        onClose={() => dialogState.setIsProfileSettingsOpen(false)}
        user={appState.user}
        onUserUpdate={handlers.handleUserUpdate}
      />

      <SystemSettingsDialog
        isOpen={dialogState.isSystemSettingsOpen}
        onClose={() => dialogState.setIsSystemSettingsOpen(false)}
      />
    </>
  );

  // Project Management 모드
  if (appState.currentModule === 'Project-Management') {
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <ProjectManagement 
          onBack={() => appState.setCurrentModule('Meta-Drive')}
          user={appState.user}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          onProjectCreate={() => {
            appState.setCurrentModule('Project-Creation');
          }}
          onProjectEdit={(project) => {
            appState.setSelectedProject(project);
            appState.setCurrentModule('Project-Edit');
          }}
          onProjectView={(project) => {
            appState.setSelectedProject(project);
            appState.setCurrentModule('Project-Detail');
          }}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Project Creation 드
  if (appState.currentModule === 'Project-Creation') {
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <ProjectCreation 
          onBack={() => appState.setCurrentModule('Project-Management')}
          user={appState.user}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          onProjectCreate={(project) => {
            // 여기에 프로젝트 생성 로직 추가
            console.log('프로젝트 생성:', project);
            // 실제로는 프로젝트를 저장하는 로직이 필요합니다
          }}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Project Edit 모드
  if (appState.currentModule === 'Project-Edit') {
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <ProjectEdit 
          onBack={() => appState.setCurrentModule('Project-Management')}
          user={appState.user}
          project={appState.selectedProject}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          onProjectUpdate={(project) => {
            // 여기에 프로젝트 업데이트 로직 추가
            console.log('프로젝트 업데이트:', project);
            // 실제로는 프로젝트를 업데이트하는 로직이 필요합니다
          }}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Project Detail 모드
  if (appState.currentModule === 'Project-Detail') {
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <ProjectDetail 
          onBack={() => appState.setCurrentModule('Project-Management')}
          user={appState.user}
          project={appState.selectedProject}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          onProjectEdit={(project) => {
            appState.setSelectedProject(project);
            appState.setCurrentModule('Project-Edit');
          }}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Meta-Delta 설정 모드
  if (appState.currentModule === 'Meta-Delta') {
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <MetaDeltaSettings 
          onBack={() => appState.setCurrentModule('Meta-Drive')}
          user={appState.user}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          onPersonaEdit={handlers.handlePersonaEdit}
          onPersonaCreate={handlers.handlePersonaCreate}
          onUserUpdate={handlers.handleUserUpdate}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Persona Editor 모드 (Meta-Delta에서 페르소나 편집 시)
  if (appState.currentModule === 'Meta-Delta-Editor') {
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <PersonaEditor
          onBack={() => appState.setCurrentModule('Meta-Delta')}
          user={appState.user}
          persona={appState.selectedPersona}
          userProjects={appState.userProjects}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          onSave={handlers.handlePersonaSave}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // User Management 모드 (admin 전용)
  if (appState.currentModule === 'User-Management') {
    if (appState.user.chatbotRole !== 'system_admin') {
      // 권한이 없으면 Meta-Drive로 리다이렉트
      appState.setCurrentModule('Meta-Drive');
    }
    
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <UserManagement 
          onBack={() => appState.setCurrentModule('Meta-Drive')}
          user={appState.user}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Meta-Drawing 모드 (유저 라이선스 필요)
  if (appState.currentModule === 'Meta-Drawing') {
    if (!canAccessMetaDrawing) {
      // 라이선스가 없으면 Meta-Drive로 리다이렉트
      appState.setCurrentModule('Meta-Drive');
    }
    
    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <MetaDrawing 
          onBack={() => appState.setCurrentModule('Meta-Drive')}
          user={appState.user}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          selectedProjectId={appState.selectedProjectId}
          onProjectChange={appState.setSelectedProjectId}
          selectedDrawingPersona={appState.selectedDrawingPersona}
          onDrawingPersonaChange={appState.setSelectedDrawingPersona}
          targetView={appState.targetDrawingView}
          onTargetViewClear={() => appState.setTargetDrawingView(null)}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Meta-ChatBot 모드
  if (appState.currentModule === 'Meta-ChatBot') {
    // 대화 세션 핸들러
    const handleSessionSelect = (sessionId: string) => {
      appState.setCurrentSessionId(sessionId);
      // 실제로는 여기서 해당 세션의 메시지를 로드해야 함
    };

    const handleNewChat = () => {
      appState.setCurrentSessionId(null);
      // 새 대화 시작
    };

    const handleDeleteSession = (sessionId: string) => {
      appState.setChatSessions(
        appState.chatSessions.filter(session => session.id !== sessionId)
      );
      if (appState.currentSessionId === sessionId) {
        appState.setCurrentSessionId(null);
      }
    };

    return (
      <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
        <ChatBotLayout
          user={appState.user}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
          selectedFolderId={appState.selectedFolderId}
          selectedProjectId={appState.selectedProjectId}
          userProjects={appState.userProjects}
          isFolderPanelCollapsed={appState.isFolderPanelCollapsed}
          onToggleFolderPanel={handlers.handleToggleFolderPanel}
          onFolderSelect={appState.setSelectedFolderId}
          chatSessions={appState.chatSessions}
          currentSessionId={appState.currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Revision Comparison 모드 (독립된 SPA)
  if (appState.currentModule === 'Revision-Comparison') {
    if (!canAccessMetaDrawing) {
      // 라이선스가 없으면 Meta-Drive로 리다이렉트
      appState.setCurrentModule('Meta-Drive');
    }
    
    return (
      <div className="h-screen flex flex-col animate-fade-in">
        <RevisionComparison 
          onBack={() => appState.setCurrentModule('Meta-Drawing')}
          user={appState.user}
          selectedProjectId={appState.selectedProjectId}
          onProjectChange={appState.setSelectedProjectId}
          onViewSwitch={appState.setTargetDrawingView}
          onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
          onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
          onAISettingsClick={handlers.handleAISettings}
          onProjectManagementClick={handlers.handleProjectManagement}
          onUserManagementClick={handlers.handleUserManagement}
          onLogout={handlers.handleLogout}
          onModuleSwitch={handlers.handleModuleSwitch}
        />
        
        <CommonDialogs />
        <Toaster />
      </div>
    );
  }

  // Meta-Drive 모드 (기본)
  return (
    <div className="h-screen flex flex-col bg-gradient-subtle animate-fade-in">
      <MetaDriveLayout
        user={appState.user}
        onProfileSettingsClick={() => dialogState.setIsProfileSettingsOpen(true)}
        onSystemSettingsClick={() => dialogState.setIsSystemSettingsOpen(true)}
        onAISettingsClick={handlers.handleAISettings}
        onProjectManagementClick={handlers.handleProjectManagement}
        onUserManagementClick={handlers.handleUserManagement}
        onLogout={handlers.handleLogout}
        onModuleSwitch={handlers.handleModuleSwitch}
        searchQuery={appState.searchQuery}
        onSearchChange={(query) => {
          appState.setSearchQuery(query);
          if (!query.trim()) {
            appState.setSemanticSearchResults([]);
          }
        }}
        viewMode={appState.viewMode}
        onViewModeChange={appState.setViewMode}
        onUploadClick={() => dialogState.setIsUploadDialogOpen(true)}
        selectedFolderId={appState.selectedFolderId}
        onSemanticSearch={handlers.handleSemanticSearch}
        onClearSearchScope={handlers.handleClearSearchScope}
        selectedProjectId={appState.selectedProjectId}
        userProjects={appState.userProjects}
        selectedFile={appState.selectedFile}
        onFileSelect={appState.setSelectedFile}
        semanticSearchResults={appState.semanticSearchResults}
        onFileDelete={handlers.handleFileDelete}
        isFolderPanelCollapsed={appState.isFolderPanelCollapsed}
        onToggleFolderPanel={handlers.handleToggleFolderPanel}
        onFolderSelect={appState.setSelectedFolderId}
      />

      {/* 파일 업로드 다이얼로그 */}
      <FileUploadDialog
        isOpen={dialogState.isUploadDialogOpen}
        onClose={() => dialogState.setIsUploadDialogOpen(false)}
        selectedFolderId={appState.selectedFolderId}
        onFolderChange={appState.setSelectedFolderId}
        user={appState.user}
        getFolderDisplayName={getFolderDisplayName}
      />

      {/* 새 프로젝트 생성 다이얼로그 */}
      <NewProjectDialog
        isOpen={dialogState.isNewProjectDialogOpen}
        onClose={() => dialogState.setIsNewProjectDialogOpen(false)}
        onProjectCreate={handlers.handleNewProjectCreate}
      />

      <CommonDialogs />
      <Toaster />
    </div>
  );
}