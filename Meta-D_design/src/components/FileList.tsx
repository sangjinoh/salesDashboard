import { useState } from 'react';
import { File, FileText, Image, Download, Eye, MoreHorizontal, Sparkles, Brain, Search, FolderOpen, Upload, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  discipline: string;
  thumbnail?: string;
  description: string;
}

interface FileMapping {
  [folderId: string]: FileItem[];
}

const mockFiles: FileMapping = {
  // 기본 파일들 (일반 폴더) - 3행 4열 총 12개 전문 P&ID 도면
  'default': [
    {
      id: '1',
      name: 'P&ID_Main_Process_Unit_100.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-12-15',
      uploadedBy: '김공정',
      discipline: 'Process',
      description: '주공정부 Unit 100 배관계장도',
    },
    {
      id: '2',
      name: 'P&ID_Distillation_Tower_200.pdf',
      type: 'PDF',
      size: '2.8 MB',
      uploadDate: '2024-12-14',
      uploadedBy: '이공정',
      discipline: 'Process',
      description: '증류탑 Unit 200 배관계장도',
    },
    {
      id: '3',
      name: 'P&ID_Heat_Exchanger_Network.pdf',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2024-12-13',
      uploadedBy: '박열교',
      discipline: 'Process',
      description: '열교환기 네트워크 배관계장도',
    },
    {
      id: '4',
      name: 'P&ID_Compression_System_300.pdf',
      type: 'PDF',
      size: '2.9 MB',
      uploadDate: '2024-12-12',
      uploadedBy: '최압축',
      discipline: 'Process',
      description: '압축시스템 Unit 300 배관계장도',
    },
    {
      id: '5',
      name: 'P&ID_Steam_Generation_Unit.pdf',
      type: 'PDF',
      size: '2.5 MB',
      uploadDate: '2024-12-11',
      uploadedBy: '정스팀',
      discipline: 'Process',
      description: '스팀 생성부 배관계장도',
    },
    {
      id: '6',
      name: 'P&ID_Cooling_Water_System.pdf',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-12-10',
      uploadedBy: '한냉각',
      discipline: 'Process',
      description: '냉각수 순환시스템 배관계장도',
    },
    {
      id: '7',
      name: 'P&ID_Waste_Treatment_Unit.pdf',
      type: 'PDF',
      size: '2.7 MB',
      uploadDate: '2024-12-09',
      uploadedBy: '김폐수',
      discipline: 'Process',
      description: '폐수처리장치 배관계장도',
    },
    {
      id: '8',
      name: 'P&ID_Emergency_Shutdown.pdf',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2024-12-08',
      uploadedBy: '이안전',
      discipline: 'Process',
      description: '비상정지시스템 배관계장도',
    },
    {
      id: '9',
      name: 'P&ID_Instrument_Air_System.pdf',
      type: 'PDF',
      size: '1.9 MB',
      uploadDate: '2024-12-07',
      uploadedBy: '박계기',
      discipline: 'Process',
      description: '계기용 공기공급 시스템 배관계장도',
    },
    {
      id: '10',
      name: 'P&ID_Fire_Protection_System.pdf',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-12-06',
      uploadedBy: '최소방',
      discipline: 'Process',
      description: '화재방호시스템 배관계장도',
    },
    {
      id: '11',
      name: 'P&ID_Electrical_Utility_Feed.pdf',
      type: 'PDF',
      size: '2.6 MB',
      uploadDate: '2024-12-05',
      uploadedBy: '한전력',
      discipline: 'Electrical',
      description: '전력공급시스템 배관계장도',
    },
    {
      id: '12',
      name: 'P&ID_Control_Room_Layout.pdf',
      type: 'PDF',
      size: '3.4 MB',
      uploadDate: '2024-12-04',
      uploadedBy: '김제어',
      discipline: 'Process',
      description: '제어실 레이아웃 배관계장도',
    },
  ],
  
  // P&ID Rev.01 폴더 파일들
  '1-eng-process-pid-rev01': [
    {
      id: 'pid-rev01-001',
      name: 'P&ID_Area_100_Rev01.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-11-15',
      uploadedBy: '김공정',
      discipline: 'Process',
      description: 'Area 100 P&ID 도면 Rev.01',
    },
    {
      id: 'pid-rev01-002',
      name: 'P&ID_Area_200_Rev01.pdf',
      type: 'PDF',
      size: '2.8 MB',
      uploadDate: '2024-11-14',
      uploadedBy: '이공정',
      discipline: 'Process',
      description: 'Area 200 P&ID 도면 Rev.01',
    },
    {
      id: 'pid-rev01-003',
      name: 'P&ID_Utilities_Rev01.pdf',
      type: 'PDF',
      size: '2.1 MB',
      uploadDate: '2024-11-13',
      uploadedBy: '박유틸',
      discipline: 'Process',
      description: '유틸리티 P&ID 도면 Rev.01',
    },
    {
      id: 'pid-rev01-004',
      name: 'P&ID_Overview_Rev01.jpg',
      type: 'JPG',
      size: '4.5 MB',
      uploadDate: '2024-11-12',
      uploadedBy: '김공정',
      discipline: 'Process',
      description: '전체 공정 개요 P&ID Rev.01',
    },
  ],
  
  // P&ID Rev.02 폴더 파일들
  '1-eng-process-pid-rev02': [
    {
      id: 'pid-rev02-001',
      name: 'P&ID_Area_100_Rev02.pdf',
      type: 'PDF',
      size: '3.4 MB',
      uploadDate: '2024-12-01',
      uploadedBy: '김공정',
      discipline: 'Process',
      description: 'Area 100 P&ID 도면 Rev.02 (업데이트됨)',
    },
    {
      id: 'pid-rev02-002',
      name: 'P&ID_Area_200_Rev02.pdf',
      type: 'PDF',
      size: '3.0 MB',
      uploadDate: '2024-11-30',
      uploadedBy: '이공정',
      discipline: 'Process',
      description: 'Area 200 P&ID 도면 Rev.02 (안전밸브 추가)',
    },
    {
      id: 'pid-rev02-003',
      name: 'P&ID_Area_300_Rev02.pdf',
      type: 'PDF',
      size: '2.9 MB',
      uploadDate: '2024-11-29',
      uploadedBy: '최공정',
      discipline: 'Process',
      description: 'Area 300 P&ID 도면 Rev.02 (신규 영역)',
    },
    {
      id: 'pid-rev02-004',
      name: 'P&ID_Utilities_Rev02.pdf',
      type: 'PDF',
      size: '2.3 MB',
      uploadDate: '2024-11-28',
      uploadedBy: '박유틸',
      discipline: 'Process',
      description: '유틸리티 P&ID 도면 Rev.02 (냉각수 계통 개선)',
    },
    {
      id: 'pid-rev02-005',
      name: 'P&ID_Emergency_Systems_Rev02.jpg',
      type: 'JPG',
      size: '3.8 MB',
      uploadDate: '2024-11-27',
      uploadedBy: '정안전',
      discipline: 'Process',
      description: '비상시스템 P&ID Rev.02',
    },
  ],
  
  // P&ID Rev.03 폴더 파일들
  '1-eng-process-pid-rev03': [
    {
      id: 'pid-rev03-001',
      name: 'P&ID_Area_100_Rev03.pdf',
      type: 'PDF',
      size: '3.6 MB',
      uploadDate: '2024-12-10',
      uploadedBy: '김공정',
      discipline: 'Process',
      description: 'Area 100 P&ID 도면 Rev.03 (최종 승인)',
    },
    {
      id: 'pid-rev03-002',
      name: 'P&ID_Area_200_Rev03.pdf',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-12-09',
      uploadedBy: '이공정',
      discipline: 'Process',
      description: 'Area 200 P&ID 도면 Rev.03 (계측 라인 수정)',
    },
    {
      id: 'pid-rev03-003',
      name: 'P&ID_Area_300_Rev03.pdf',
      type: 'PDF',
      size: '3.1 MB',
      uploadDate: '2024-12-08',
      uploadedBy: '최공정',
      discipline: 'Process',
      description: 'Area 300 P&ID 도면 Rev.03 (펌프 사양 변경)',
    },
    {
      id: 'pid-rev03-004',
      name: 'P&ID_Area_400_Rev03.pdf',
      type: 'PDF',
      size: '2.7 MB',
      uploadDate: '2024-12-07',
      uploadedBy: '한공정',
      discipline: 'Process',
      description: 'Area 400 P&ID 도면 Rev.03 (신규 구역)',
    },
    {
      id: 'pid-rev03-005',
      name: 'P&ID_Utilities_Rev03.pdf',
      type: 'PDF',
      size: '2.5 MB',
      uploadDate: '2024-12-06',
      uploadedBy: '박유틸',
      discipline: 'Process',
      description: '유틸리티 P&ID 도면 Rev.03 (스팀 시스템 개선)',
    },
    {
      id: 'pid-rev03-006',
      name: 'P&ID_Control_Systems_Rev03.jpg',
      type: 'JPG',
      size: '4.1 MB',
      uploadDate: '2024-12-05',
      uploadedBy: '이제어',
      discipline: 'Process',
      description: '제어시스템 P&ID Rev.03',
    },
    {
      id: 'pid-rev03-007',
      name: 'P&ID_Emergency_Systems_Rev03.jpg',
      type: 'JPG',
      size: '3.9 MB',
      uploadDate: '2024-12-04',
      uploadedBy: '정안전',
      discipline: 'Process',
      description: '비상시스템 P&ID Rev.03 (최종)',
    },
    {
      id: 'pid-rev03-008',
      name: 'P&ID_Master_Rev03.pdf',
      type: 'PDF',
      size: '12.5 MB',
      uploadDate: '2024-12-03',
      uploadedBy: '김공정',
      discipline: 'Process',
      description: '마스터 P&ID 종합도면 Rev.03',
    },
  ],
};

interface FileListProps {
  viewMode: 'grid' | 'list';
  selectedFolderId: string;
  searchQuery: string;
  onFileSelect: (file: FileItem) => void;
  semanticSearchResults?: string[];
  hasSelectedFile?: boolean;
  onFileDelete?: (fileId: string) => void;
}

export function FileList({ viewMode, selectedFolderId, searchQuery, onFileSelect, semanticSearchResults = [], hasSelectedFile = false, onFileDelete }: FileListProps) {
  // 준비 상태 확인: 검색이 없고, 시맨틱 검색 결과가 없고, 프로젝트 루트가 아닌 하위 폴더가 선택되지 않은 상태
  const isReadyState = !searchQuery.trim() && semanticSearchResults.length === 0 && (
    !selectedFolderId || 
    selectedFolderId.split('-').length === 1 ||  // 프로젝트 루트만 선택된 상태
    selectedFolderId === '1-general'  // 기본 선택 상태
  );

  // 현재 폴더에 해당하는 파일들 가져오기
  const getFolderFiles = (folderId: string): FileItem[] => {
    // P&ID 리비전 폴더들의 파일 반환
    if (mockFiles[folderId]) {
      return mockFiles[folderId];
    }
    
    // 기본 파일들 반환 (다른 폴더들)
    return mockFiles['default'];
  };

  const currentFolderFiles = getFolderFiles(selectedFolderId);

  const filteredFiles = currentFolderFiles.filter(file => {
    // 시맨틱 검색 결과가 있는 경우 해당 결과만 표시
    if (semanticSearchResults.length > 0) {
      return semanticSearchResults.includes(file.name);
    }
    
    // 일반 검색
    if (searchQuery === '') return true;
    
    return file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           file.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getFolderDisplayName = (folderId: string) => {
    const [projectId, ...folderParts] = folderId.split('-');
    const projectNames = {
      '1': '신재생에너지 플랜트',
      '2': '해상풍력 발전소 A',
      '3': '수소생산시설 B',
      '4': '태양광 단지 C',
    };
    
    if (folderParts.length === 0) {
      return projectNames[projectId as keyof typeof projectNames] || `프로젝트 ${projectId}`;
    }
    
    const projectName = projectNames[projectId as keyof typeof projectNames] || `프로젝트 ${projectId}`;
    
    // P&ID 리비전 폴더인 경우
    if (folderParts.length >= 4 && folderParts[0] === 'eng' && folderParts[1] === 'process' && folderParts[2] === 'pid') {
      const revisionName = folderParts[3].replace('rev', 'Rev.');
      return `${projectName} > Engineering > Process > P&ID > ${revisionName}`;
    }
    
    // 다단계 폴더 경로 처리
    const folderNames = {
      'general': 'Project General',
      'correspondence': 'Correspondence', 
      'engineering': 'Engineering',
      'eng': 'Engineering',
      'process': 'Process',
      'mechanical': 'Mechanical',
      'electrical': 'Electrical',
      'civil': 'Civil',
      'pid': 'P&ID',
      'pfd': 'PFD',
      'hmi': 'HMI',
      'procurement': 'Procurement',
      'construction': 'Construction',
      'partner': 'Partner',
      'workflow': 'Workflow',
    };
    
    const folderPath = folderParts.map(part => 
      folderNames[part as keyof typeof folderNames] || part
    ).join(' > ');
    
    return `${projectName} > ${folderPath}`;
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'dwg':
        return <File className="w-8 h-8 text-blue-500" />;
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-600" />;
      case 'xlsx':
        return <FileText className="w-8 h-8 text-green-600" />;
      case 'jpg':
      case 'png':
        return <Image className="w-8 h-8 text-purple-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const getDisciplineColor = (discipline: string) => {
    const colors = {
      'Process': 'bg-blue-100 text-blue-800',
      'Mechanical': 'bg-orange-100 text-orange-800',
      'Electrical': 'bg-yellow-100 text-yellow-800',
      'Civil': 'bg-gray-100 text-gray-800',
      'Construction': 'bg-green-100 text-green-800',
      'Project Management': 'bg-purple-100 text-purple-800',
    };
    return colors[discipline as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // 준비 화면 렌더링
  const renderReadyScreen = () => (
    <div className="h-full border-r bg-card flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          {/* 메인 아이콘 */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          
          {/* 메인 메시지 */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Meta-Drive에 오신 것을 환영합니다</h3>
            <p className="text-muted-foreground">
              프로젝트 파일과 문서를 체계적으로 관리하고 검색할 수 있습니다
            </p>
          </div>
          
          {/* 시작하기 안내 */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">폴더 선택</div>
                  <div className="text-xs text-muted-foreground">좌측에서 프로젝트 폴더를 선택하세요</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Search className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">파일 검색</div>
                  <div className="text-xs text-muted-foreground">상단 검색창에서 파일을 찾아보세요</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">AI 시맨틱 검색</div>
                  <div className="text-xs text-muted-foreground">자연어로 원하는 문서를 찾아보세요</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 추가 기능 힌트 */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              파일 업로드, Meta-Drawing 연동 등 다양한 기능을 활용해보세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // 준비 상태일 때 준비 화면 표시
  if (isReadyState) {
    return renderReadyScreen();
  }

  if (viewMode === 'grid') {
    return (
      <div className="h-full border-r bg-card flex flex-col">
        <div className="p-6 pb-0 flex-shrink-0">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {filteredFiles.length}개 파일 발견
                </p>
                {semanticSearchResults.length > 0 && (
                  <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                    <Brain className="w-3 h-3" />
                    <span>AI 검색 결과</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                현재 폴더: <span className="text-foreground">{getFolderDisplayName(selectedFolderId)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 px-6 pb-6">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onFileSelect(file)}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <Badge variant="secondary" className="text-xs">
                          {file.type}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            미리보기
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            다운로드
                          </DropdownMenuItem>
                          {onFileDelete && (
                            <DropdownMenuItem 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                onFileDelete(file.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div>
                      <h4 className="line-clamp-2 mb-1">{file.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {file.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Badge className={`text-xs ${getDisciplineColor(file.discipline)}`}>
                        {file.discipline}
                      </Badge>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{file.size}</span>
                        <span>{file.uploadDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {file.uploadedBy.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{file.uploadedBy}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full border-r bg-card flex flex-col">
      <div className="p-6 pb-0 flex-shrink-0">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {filteredFiles.length}개 파일 발견
              </p>
              {semanticSearchResults.length > 0 && (
                <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  <Brain className="w-3 h-3" />
                  <span>AI 검색 결과</span>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              현재 폴더: <span className="text-foreground">{getFolderDisplayName(selectedFolderId)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-6 pb-6">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="p-4 hover:shadow-sm transition-shadow cursor-pointer" onClick={() => onFileSelect(file)}>
                <div className="flex items-center gap-4">
                  {getFileIcon(file.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="truncate">{file.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {file.type}
                      </Badge>
                      <Badge className={`text-xs ${getDisciplineColor(file.discipline)}`}>
                        {file.discipline}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {file.description}
                    </p>
                  </div>
                  
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{file.size}</div>
                    <div>{file.uploadDate}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Avatar className="w-4 h-4">
                        <AvatarFallback className="text-xs">
                          {file.uploadedBy.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{file.uploadedBy}</span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        미리보기
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </DropdownMenuItem>
                      {onFileDelete && (
                        <DropdownMenuItem 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFileDelete(file.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}