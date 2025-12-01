import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { FolderTree } from './FolderTree';
import { FileList } from './FileList';
import { FilePreview } from './FilePreview';
import { useAutoHideScrollbar } from './useAutoHideScrollbar';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { getFolderPanelWidth } from '../utils/app';
import type { User, FileItem, ViewMode } from '../types/app';

interface MetaDriveLayoutProps {
  user: User;
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onUserManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing' | 'Meta-ChatBot') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onUploadClick: () => void;
  selectedFolderId: string;
  onSemanticSearch: (query: string, folderId?: string) => void;
  onClearSearchScope: () => void;
  selectedProjectId: string;
  userProjects: readonly string[];
  selectedFile: FileItem | null;
  onFileSelect: (file: FileItem | null) => void;
  semanticSearchResults: string[];
  onFileDelete: (fileId: string) => void;
  isFolderPanelCollapsed: boolean;
  onToggleFolderPanel: () => void;
  onFolderSelect: (folderId: string) => void;
}

export function MetaDriveLayout({
  user,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onUploadClick,
  selectedFolderId,
  onSemanticSearch,
  onClearSearchScope,
  selectedProjectId,
  userProjects,
  selectedFile,
  onFileSelect,
  semanticSearchResults,
  onFileDelete,
  isFolderPanelCollapsed,
  onToggleFolderPanel,
  onFolderSelect,
}: MetaDriveLayoutProps) {
  const folderTreeScrollbar = useAutoHideScrollbar(2000);
  const fileListScrollbar = useAutoHideScrollbar(2000);
  const filePreviewScrollbar = useAutoHideScrollbar(2000);

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
        currentModule="Meta-Drive"
        onModuleSwitch={onModuleSwitch}
      />

      {/* 검색 및 도구 모음 */}
      <SearchBar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        onUploadClick={onUploadClick}
        onAISettingsClick={() => {}}
        selectedFolderId={selectedFolderId}
        onSemanticSearch={onSemanticSearch}
        onClearSearchScope={onClearSearchScope}
        selectedProjectId={selectedProjectId}
        userProjects={userProjects}
      />

      {/* 메인 콘텐츠 영역 */}
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
              hasSelectedFile={!!selectedFile}
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

        {/* 중앙 파일 목록 */}
        <div 
          ref={fileListScrollbar.elementRef}
          className={`flex-1 transition-all duration-300 auto-hide-scrollbar overflow-y-auto ${fileListScrollbar.scrollbarClass}`}
        >
          <FileList
            viewMode={viewMode}
            selectedFolderId={selectedFolderId}
            searchQuery={searchQuery}
            onFileSelect={onFileSelect}
            semanticSearchResults={semanticSearchResults}
            hasSelectedFile={!!selectedFile}
            onFileDelete={onFileDelete}
          />
        </div>

        {/* 우측 파일 미리보기 */}
        <div 
          ref={filePreviewScrollbar.elementRef}
          className={`transition-all duration-300 auto-hide-scrollbar overflow-y-auto ${filePreviewScrollbar.scrollbarClass} ${selectedFile ? 'w-[47rem]' : 'w-0 overflow-hidden'}`}
        >
          <FilePreview
            file={selectedFile}
            onClose={() => onFileSelect(null)}
          />
        </div>
      </div>
    </>
  );
}