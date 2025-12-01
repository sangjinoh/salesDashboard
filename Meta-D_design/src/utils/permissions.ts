import type { User, UserPermissions } from '../types/app';

/**
 * 사용자 권한을 계산하는 유틸리티 함수
 */
export function getUserPermissions(user: User): UserPermissions {
  const isAdmin = user.chatbotRole === 'system_admin';
  const isTeamAdmin = user.chatbotRole === 'team_admin';
  const hasProLicense = user.licenseType === 'pro';
  const isReadOnly = user.projectPermissions === 'readonly';

  return {
    // 프로젝트 관련 권한
    canEditProjects: isAdmin && !isReadOnly,
    canDeleteProjects: isAdmin && !isReadOnly,
    canCreateProjects: isAdmin && !isReadOnly,
    
    // 사용자 관리 권한
    canManageUsers: isAdmin,
    
    // AI 페르소나 관련 권한
    canEditPersonas: isAdmin || isTeamAdmin,
    canCreatePersonas: isAdmin, // Admin만 새 페르소나 생성 가능
    
    // 시스템 접근 권한
    canAccessMetaDrawing: hasProLicense,
    
    // 파일 관련 권한
    canUploadFiles: !isReadOnly,
    canDeleteFiles: !isReadOnly && (isAdmin || isTeamAdmin),
    canEditFiles: !isReadOnly,
    
    // 프로젝트 접근 권한
    projectAccess: isAdmin ? 'all' : isReadOnly ? 'readonly' : 'assigned'
  };
}

/**
 * 특정 작업에 대한 권한 체크
 */
export function canUserPerform(user: User, action: keyof UserPermissions): boolean {
  const permissions = getUserPermissions(user);
  return permissions[action] as boolean;
}

/**
 * 프로젝트 접근 권한 체크
 * 모든 사용자는 최소 읽기 권한이 있습니다
 */
export function canAccessProject(user: User, projectId: string): boolean {
  // 모든 사용자는 최소 읽기 권한이 있습니다
  return true;
}

/**
 * 프로젝트 편집 권한 체크
 */
export function canEditProject(user: User, projectId: string): boolean {
  // Admin은 모든 프로젝트 편집 가능
  if (user.chatbotRole === 'system_admin') {
    return true;
  }
  
  // 프로젝트별 권한이 정의되어 있는 경우
  if (user.projectAccess && user.projectAccess[projectId]) {
    const projectPermission = user.projectAccess[projectId];
    return projectPermission.level === 'admin' || projectPermission.level === 'readwrite';
  }
  
  // 프로젝트별 권한이 없는 경우 전체 권한 체크
  return user.projectPermissions === 'admin' || user.projectPermissions === 'readwrite';
}

/**
 * 프로젝트 파일 업로드 권한 체크
 */
export function canUploadToProject(user: User, projectId: string): boolean {
  // Admin은 모든 프로젝트에 업로드 가능
  if (user.chatbotRole === 'system_admin') {
    return true;
  }
  
  // 프로젝트별 권한이 정의되어 있는 경우
  if (user.projectAccess && user.projectAccess[projectId]) {
    const projectPermission = user.projectAccess[projectId];
    return projectPermission.canUpload === true && projectPermission.level !== 'readonly';
  }
  
  // 프로젝트별 권한이 없는 경우 접근 권한도 없음
  return false;
}

/**
 * 프로젝트 파일 삭제 권한 체크
 */
export function canDeleteFromProject(user: User, projectId: string): boolean {
  // Admin은 모든 프로젝트에서 삭제 가능
  if (user.chatbotRole === 'system_admin') {
    return true;
  }
  
  // 프로젝트별 권한이 정의되어 있는 경우
  if (user.projectAccess && user.projectAccess[projectId]) {
    const projectPermission = user.projectAccess[projectId];
    return projectPermission.canDelete === true && projectPermission.level !== 'readonly';
  }
  
  // 프로젝트별 권한이 없는 경우 삭제 불가
  return false;
}

/**
 * 사용자의 접근 가능한 프로젝트 목록 반환
 * 모든 사용자는 최소 읽기 권한으로 모든 프로젝트에 접근할 수 있습니다
 */
export function getUserAccessibleProjects(user: User, allProjects: { id: string; name: string }[]): { id: string; name: string }[] {
  // 모든 사용자는 최소 읽기 권한으로 모든 프로젝트에 접근 가능
  return allProjects;
}

/**
 * UI 컴포넌트 비활성화 여부 체크
 */
export function shouldDisableComponent(user: User, requiredPermission: keyof UserPermissions): boolean {
  return !canUserPerform(user, requiredPermission);
}

/**
 * 권한 기반 스타일 클래스 반환
 */
export function getPermissionBasedStyles(user: User, requiredPermission: keyof UserPermissions) {
  const hasPermission = canUserPerform(user, requiredPermission);
  
  return {
    disabled: !hasPermission,
    className: hasPermission ? '' : 'opacity-50 cursor-not-allowed',
    tooltip: hasPermission ? '' : '권한이 없습니다'
  };
}