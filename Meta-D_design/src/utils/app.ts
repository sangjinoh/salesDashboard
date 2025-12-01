import { PROJECT_NAMES, FOLDER_NAMES } from '../constants/app';

export const getFolderDisplayName = (folderId: string): string => {
  const [projectId, ...folderParts] = folderId.split('-');
  
  if (folderParts.length === 0) {
    return PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES] || `프로젝트 ${projectId}`;
  }
  
  const projectName = PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES] || `프로젝트 ${projectId}`;
  const folderPath = folderParts.map(part => 
    FOLDER_NAMES[part as keyof typeof FOLDER_NAMES] || 
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join(' > ');
  
  return `${projectName} > ${folderPath}`;
};

export const getFolderPanelWidth = (isCollapsed: boolean): string => {
  if (isCollapsed) return 'w-0';
  return 'w-80';
};

export const simulateSemanticSearch = (query: string, folderId?: string): string[] => {
  if (!query.trim()) return [];

  console.log(`시맨틱 검색: "${query}" in ${folderId ? getFolderDisplayName(folderId) : '전체 프로젝트'}`);
  
  // 실제 구현에서는 여기서 AI API를 호출하여 시맨틱 검색을 수행
  // 예시로 몇 가지 결과를 시뮬레이션
  return [
    'Process Flow Diagram_Rev03.pdf',
    'Equipment Layout_Building A.dwg',
    'Material Specification.docx'
  ];
};