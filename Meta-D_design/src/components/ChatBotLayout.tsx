import { Header } from './Header';
import { FolderTree } from './FolderTree';
import { ChatBotView } from './ChatBotView';
import { ChatHistoryPanel, type ChatSession } from './ChatHistoryPanel';
import { useAutoHideScrollbar } from './useAutoHideScrollbar';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { PanelLeftClose, PanelLeft, PanelRightClose, PanelRight } from 'lucide-react';
import { getFolderPanelWidth } from '../utils/app';
import type { User, Project } from '../types/app';
import { useState } from 'react';

interface ChatBotLayoutProps {
  user: User;
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onUserManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing' | 'Meta-ChatBot') => void;
  selectedFolderId: string;
  selectedProjectId: string;
  userProjects: readonly Project[];
  isFolderPanelCollapsed: boolean;
  onToggleFolderPanel: () => void;
  onFolderSelect: (folderId: string) => void;
  chatSessions?: ChatSession[];
  currentSessionId?: string | null;
  onSessionSelect?: (sessionId: string) => void;
  onNewChat?: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

export function ChatBotLayout({
  user,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  selectedFolderId,
  selectedProjectId,
  userProjects,
  isFolderPanelCollapsed,
  onToggleFolderPanel,
  onFolderSelect,
  chatSessions = [],
  currentSessionId = null,
  onSessionSelect = () => {},
  onNewChat = () => {},
  onDeleteSession = () => {},
}: ChatBotLayoutProps) {
  const folderTreeScrollbar = useAutoHideScrollbar(2000);
  const [isHistoryPanelCollapsed, setIsHistoryPanelCollapsed] = useState(false);

  const historyPanelWidth = '320px';

  return (
    <>
      {/* 상단 헤더 */}
      <Header 
        user={user}
        onProfileSettingsClick={onProfileSettingsClick}
        onSystemSettingsClick={onSystemSettingsClick}
        onAISettingsClick={onAISettingsClick}
        onProjectManagementClick={onProjectManagementClick}
        onUserManagementClick={onUserManagementClick}
        onLogout={onLogout}
        currentModule="Meta-ChatBot"
        onModuleSwitch={onModuleSwitch}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex h-full overflow-hidden">
        {/* 좌측 폴더 트리 */}
        <div 
          ref={folderTreeScrollbar.elementRef}
          className={`relative transition-all duration-300 auto-hide-scrollbar overflow-y-auto ${folderTreeScrollbar.scrollbarClass} ${getFolderPanelWidth(isFolderPanelCollapsed)} ${isFolderPanelCollapsed ? 'overflow-hidden' : ''}`}
        >
          {/* 폴더 패널 토글 버튼 - div 내부 우측 상단 */}
          {!isFolderPanelCollapsed && (
            <div className="absolute top-2 right-2 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleFolderPanel}
                      className="h-8 w-8 p-0 bg-card border-border shadow-modern hover:bg-accent hover:text-accent-foreground hover:shadow-modern-lg transition-all duration-300 hover-lift rounded-xl"
                    >
                      <PanelLeftClose className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    폴더 패널 접기
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {!isFolderPanelCollapsed && (
            <FolderTree
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
              user={user}
              hasSelectedFile={false}
            />
          )}
        </div>

        {/* 폴더 패널이 접혔을 때의 토글 버튼 */}
        {isFolderPanelCollapsed && (
          <div className="flex-shrink-0 w-12 relative">
            <div className="absolute top-2 left-2 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleFolderPanel}
                      className="h-8 w-8 p-0 bg-card border-border shadow-modern hover:bg-accent hover:text-accent-foreground hover:shadow-modern-lg transition-all duration-300 hover-lift rounded-xl"
                    >
                      <PanelLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    폴더 패널 펼치기
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}

        {/* 중앙: ChatBot 메인 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <ChatBotView 
            user={user}
            selectedFolderId={selectedFolderId}
            selectedProjectId={selectedProjectId}
            userProjects={userProjects as any[]}
          />
        </div>

        {/* 우측: 대화 히스토리 패널 */}
        <div 
          className={`border-l border-border bg-white flex flex-col transition-all duration-300 overflow-hidden ${
            isHistoryPanelCollapsed ? 'w-0 border-l-0' : ''
          }`}
          style={{
            width: isHistoryPanelCollapsed ? '0' : historyPanelWidth,
            visibility: isHistoryPanelCollapsed ? 'hidden' : 'visible',
            opacity: isHistoryPanelCollapsed ? 0 : 1,
          }}
        >
          <ChatHistoryPanel
            sessions={chatSessions}
            currentSessionId={currentSessionId}
            onSessionSelect={onSessionSelect}
            onNewChat={onNewChat}
            onDeleteSession={onDeleteSession}
          />
        </div>

        {/* 우측 패널 토글 버튼 */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryPanelCollapsed(!isHistoryPanelCollapsed)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-16 w-6 rounded-r-none rounded-l-lg border border-r-0 bg-white hover:bg-gray-50 shadow-md transition-all duration-300"
                style={{
                  right: isHistoryPanelCollapsed ? '0' : historyPanelWidth,
                }}
              >
                {isHistoryPanelCollapsed ? (
                  <PanelRight className="h-4 w-4 text-gray-600" />
                ) : (
                  <PanelRightClose className="h-4 w-4 text-gray-600" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isHistoryPanelCollapsed ? '히스토리 패널 펼치기' : '히스토리 패널 접기'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}