import { useState } from 'react';

export const useDialogState = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

  return {
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isAISettingsOpen,
    setIsAISettingsOpen,
    isProfileSettingsOpen,
    setIsProfileSettingsOpen,
    isSystemSettingsOpen,
    setIsSystemSettingsOpen,
    isNewProjectDialogOpen,
    setIsNewProjectDialogOpen,
  };
};