export interface DrawingRevisionData {
  fileName: string;
  status: 'added' | 'removed' | 'modified' | 'unchanged';
  revisions: {
    [key: string]: {
      lastModified: string;
      fileSize: string;
      checksum: string;
      aiRecognitionStatus: 'completed' | 'processing' | 'pending' | 'error';
      thumbnailUrl?: string;
    };
  };
}

export interface RevisionStats {
  total: number;
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
}

export interface RevisionComparisonProps {
  onBack: () => void;
  user: any;
  selectedProjectId?: string;
  onProjectChange?: (projectId: string) => void;
  onViewSwitch?: (view: string | null) => void;
  onProfileSettingsClick?: () => void;
  onSystemSettingsClick?: () => void;
  onAISettingsClick?: () => void;
  onProjectManagementClick?: () => void;
  onUserManagementClick?: () => void;
  onLogout?: () => void;
  onModuleSwitch?: (module: string) => void;
}

export interface RevisionDetailViewProps {
  drawing: DrawingRevisionData;
  baseRevision: string;
  compareRevision: string;
}