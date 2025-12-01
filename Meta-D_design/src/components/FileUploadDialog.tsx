import { useState, useCallback } from 'react';
import { Upload, X, File, CheckCircle2, Folder, AlertCircle, ChevronDown, ChevronUp, FolderOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { canUploadToProject, getUserAccessibleProjects } from '../utils/permissions';
import type { User } from '../types/app';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFolderId: string;
  onFolderChange: (folderId: string) => void;
  user: User; // 사용자 정보로 변경
  getFolderDisplayName: (folderId: string) => string;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  description: string;
  discipline: string;
  revision: string;
  documentType: string;
  responsible: string;
  tags: string[];
}

export function FileUploadDialog({ isOpen, onClose, selectedFolderId, onFolderChange, user, getFolderDisplayName }: FileUploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [isFolderSelectorOpen, setIsFolderSelectorOpen] = useState(false);

  // 선택된 폴더가 사용자가 업로드 가능한 프로젝트인지 확인
  const isUploadAllowed = () => {
    const projectId = selectedFolderId.split('-')[0];
    return canUploadToProject(user, projectId);
  };

  // 사용자가 접근 가능한 프로젝트 목록
  const allProjects = [
    { id: '1', name: '신재생에너지 플랜트' },
    { id: '2', name: '해상풍력 발전소 A' },
    { id: '3', name: '수소생산시설 B' },
    { id: '4', name: '태양광 단지 C' }
  ];
  const accessibleProjects = getUserAccessibleProjects(user, allProjects);

  const supportedFormats = ['PDF', 'DWG', 'DOCX', 'XLSX', 'PNG', 'JPG', 'CAD'];
  const disciplines = ['Process', 'Mechanical', 'Electrical', 'Civil', 'Instrumentation', 'Construction'];
  const documentTypes = ['Drawing', 'Specification', 'Report', 'Manual', 'Procedure', 'Certificate', 'Photo', 'Other'];
  const responsiblePersons = ['김공정', '이설계', '박재료', '최경제', '정건설', '한전기', '조안전', '윤품질'];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending',
      description: '',
      discipline: '',
      revision: 'Rev.01',
      documentType: '',
      responsible: '',
      tags: [],
    }));
    
    setFiles(prev => [...prev, ...uploadFiles]);
    // 새로 추가된 파일들은 자동으로 펼쳐서 보여주기
    setExpandedFiles(prev => new Set([...prev, ...uploadFiles.map(f => f.id)]));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const updateFileMetadata = (id: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const simulateUpload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading' as const } : f
    ));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: 100, status: 'completed' as const } : f
        ));
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }
    }, 200);
  };

  const uploadAllFiles = () => {
    files.forEach(file => {
      if (canStartUpload(file)) {
        simulateUpload(file.id);
      }
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return <File className="w-6 h-6 text-blue-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 사용자가 업로드 권한을 가진 모든 폴더 목록 생성
  const getUploadableFolders = () => {
    const folders: { id: string; name: string; projectId: string }[] = [];
    
    const baseFolders = ['general', 'correspondence', 'engineering', 'procurement', 'construction', 'partner', 'workflow'];
    const subFolders = ['mechanical', 'electrical', 'civil', 'process', 'instrumentation', 'piping', 'structural', 'safety', 'environmental', 'quality'];
    
    // 업로드 가능한 프로젝트만 처리
    accessibleProjects.forEach(project => {
      if (!canUploadToProject(user, project.id)) return;
      
      // 프로젝트 루트
      folders.push({
        id: project.id,
        name: project.name,
        projectId: project.id
      });
      
      // 기본 폴더들
      baseFolders.forEach(folder => {
        folders.push({
          id: `${project.id}-${folder}`,
          name: getFolderDisplayName(`${project.id}-${folder}`),
          projectId: project.id
        });
        
        // Engineering 하위 폴더들
        if (folder === 'engineering') {
          subFolders.forEach(subFolder => {
            folders.push({
              id: `${project.id}-${folder}-${subFolder}`,
              name: getFolderDisplayName(`${project.id}-${folder}-${subFolder}`),
              projectId: project.id
            });
          });
        }
      });
    });
    
    return folders;
  };

  const validateFile = (uploadFile: UploadFile) => {
    return !!(uploadFile.description && uploadFile.discipline && uploadFile.documentType && uploadFile.responsible);
  };

  const canStartUpload = (uploadFile: UploadFile) => {
    return validateFile(uploadFile) && uploadFile.status === 'pending';
  };

  const toggleFileExpanded = (fileId: string) => {
    setExpandedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            파일 업로드
            {!isUploadAllowed() && (
              <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded-md">
                업로드 권한 없음
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            PDF, DWG, DOCX, XLSX 등 다양한 포맷의 파일을 드래그 앤 드롭으로 업로드하거나 파일 선택 버튼을 클릭하여 업로드할 수 있습니다. 업로드 시 자동 분류 및 메타데이터 태깅이 적용됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden flex flex-col min-h-0">
          {/* 업로드 대상 폴더 정보 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700">
                <Folder className="w-4 h-4" />
                <div>
                  <p className="font-medium text-sm">업로드 대상 폴더</p>
                  <p className="text-xs">{getFolderDisplayName(selectedFolderId)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFolderSelectorOpen(true)}
                className="h-7 text-xs hover:bg-blue-100"
                disabled={!isUploadAllowed()}
              >
                <FolderOpen className="w-3 h-3 mr-1" />
                폴더 변경
              </Button>
            </div>
          </div>

          {!isUploadAllowed() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex-shrink-0">
              <div className="flex items-center gap-2 text-red-700">
                <X className="w-4 h-4" />
                <p className="text-sm">이 프로젝트에 파일을 업로드할 권한이 없습니다. 업로드 권한이 있는 프로젝트에만 파일 업로드가 가능합니다.</p>
              </div>
            </div>
          )}

          {/* 드래그 앤 드롭 영역 */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors flex-shrink-0 ${
              !isUploadAllowed() 
                ? 'border-muted-foreground/10 bg-muted/50 opacity-50 cursor-not-allowed'
                : isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25'
            }`}
            onDragOver={isUploadAllowed() ? handleDragOver : undefined}
            onDragLeave={isUploadAllowed() ? handleDragLeave : undefined}
            onDrop={isUploadAllowed() ? handleDrop : undefined}
          >
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm">파일을 여기로 드래그하거나</p>
            <Button 
              variant="outline" 
              size="sm"
              disabled={!isUploadAllowed()}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              파일 선택
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.dwg,.docx,.xlsx,.png,.jpg,.jpeg"
              onChange={isUploadAllowed() ? handleFileSelect : undefined}
              disabled={!isUploadAllowed()}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground mt-2">
              지원 형식: {supportedFormats.join(', ')}
            </p>
          </div>

          {/* 업로드할 파일 목록 */}
          {files.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <h4 className="text-sm font-medium">업로드할 파일 ({files.length}개)</h4>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">
                    {files.filter(f => validateFile(f)).length}/{files.length} 파일 정보 완료
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (expandedFiles.size === files.length) {
                          setExpandedFiles(new Set());
                        } else {
                          setExpandedFiles(new Set(files.map(f => f.id)));
                        }
                      }}
                    >
                      {expandedFiles.size === files.length ? '모두 접기' : '모두 펼치기'}
                    </Button>
                    {files.some(f => canStartUpload(f)) && (
                      <Button size="sm" onClick={uploadAllFiles}>
                        모든 파일 업로드
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2" style={{ maxHeight: 'calc(95vh - 280px)' }}>
                {files.map((uploadFile) => {
                  const isExpanded = expandedFiles.has(uploadFile.id);
                  const isValid = validateFile(uploadFile);
                  
                  return (
                    <div key={uploadFile.id} className={`border rounded-lg transition-all ${isValid ? 'border-green-200 bg-green-50/30' : 'border-border'}`}>
                      {/* 파일 헤더 (항상 표시) */}
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {uploadFile.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              getFileIcon(uploadFile.file.name)
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0 mr-3">
                                <p className="truncate text-sm font-medium">{uploadFile.file.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{formatFileSize(uploadFile.file.size)}</span>
                                  {uploadFile.discipline && <span>• {uploadFile.discipline}</span>}
                                  {uploadFile.documentType && <span>• {uploadFile.documentType}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {isValid && (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFileExpanded(uploadFile.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(uploadFile.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* 업로드 상태 표시 */}
                            <div className="mt-2">
                              {uploadFile.status === 'uploading' && (
                                <div className="space-y-1">
                                  <Progress value={uploadFile.progress} className="w-full h-1" />
                                  <p className="text-xs text-muted-foreground">
                                    업로드 중... {Math.round(uploadFile.progress)}%
                                  </p>
                                </div>
                              )}

                              {uploadFile.status === 'completed' && (
                                <p className="text-xs text-green-600 font-medium">✓ 업로드 완료</p>
                              )}

                              {uploadFile.status === 'pending' && !isValid && (
                                <div className="flex items-center gap-1 text-xs text-orange-600">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>필수 정보를 입력해주세요</span>
                                </div>
                              )}

                              {uploadFile.status === 'pending' && isValid && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>업로드 준비 완료</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 펼쳐진 상세 정보 */}
                      {isExpanded && (uploadFile.status === 'pending' || uploadFile.status === 'completed') && (
                        <div className="border-t bg-muted/30 p-3 space-y-3">
                          {/* 필수 정보 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs flex items-center gap-1 mb-1">
                                Discipline
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={uploadFile.discipline}
                                onValueChange={(value) => updateFileMetadata(uploadFile.id, { discipline: value })}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  {disciplines.map(discipline => (
                                    <SelectItem key={discipline} value={discipline}>
                                      {discipline}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-xs flex items-center gap-1 mb-1">
                                문서 유형
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={uploadFile.documentType}
                                onValueChange={(value) => updateFileMetadata(uploadFile.id, { documentType: value })}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  {documentTypes.map(type => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs flex items-center gap-1 mb-1">
                                담당자
                                <span className="text-red-500">*</span>
                              </Label>
                              <Select
                                value={uploadFile.responsible}
                                onValueChange={(value) => updateFileMetadata(uploadFile.id, { responsible: value })}
                              >
                                <SelectTrigger className="h-7 text-xs">
                                  <SelectValue placeholder="선택하세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  {responsiblePersons.map(person => (
                                    <SelectItem key={person} value={person}>
                                      {person}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs mb-1">Revision</Label>
                              <Input
                                placeholder="Rev.01"
                                value={uploadFile.revision}
                                onChange={(e) => updateFileMetadata(uploadFile.id, { revision: e.target.value })}
                                className="h-7 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs flex items-center gap-1 mb-1">
                              파일 설명
                              <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              placeholder="파일에 대한 상세 설명을 입력하세요"
                              value={uploadFile.description}
                              onChange={(e) => updateFileMetadata(uploadFile.id, { description: e.target.value })}
                              className="resize-none text-xs"
                              rows={2}
                            />
                          </div>

                          {/* 업로드 버튼 */}
                          {uploadFile.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => simulateUpload(uploadFile.id)}
                              disabled={!validateFile(uploadFile)}
                              className="w-full h-7 text-xs"
                            >
                              {validateFile(uploadFile) ? '업로드 시작' : '필수 정보를 입력하세요'}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

      {/* 폴더 선택 시트 */}
      <Sheet open={isFolderSelectorOpen} onOpenChange={setIsFolderSelectorOpen}>
        <SheetContent side="right" className="w-96">
          <SheetHeader>
            <SheetTitle>업로드 대상 폴더 선택</SheetTitle>
            <SheetDescription>
              파일을 업로드할 폴더를 선택하세요. 업로드 권한이 있는 프로젝트에만 업로드할 수 있습니다.
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* 현재 선택된 폴더 */}
            <div>
              <h4 className="text-sm font-medium mb-2">현재 선택된 폴더</h4>
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 text-primary">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm font-medium">{getFolderDisplayName(selectedFolderId)}</span>
                </div>
              </div>
            </div>

            {/* 추천 폴더 (자주 사용되는 폴더들) */}
            <div>
              <h4 className="text-sm font-medium mb-2">추천 폴더</h4>
              <div className="space-y-1">
                {(() => {
                  if (accessibleProjects.length === 0) return null;
                  
                  const firstProject = accessibleProjects[0];
                  const recommendedFolders = [
                    `${firstProject.id}-engineering`,
                    `${firstProject.id}-general`,
                    `${firstProject.id}-construction`,
                  ].filter(id => id !== selectedFolderId && canUploadToProject(user, id.split('-')[0]));

                  return recommendedFolders.slice(0, 3).map((folderId) => (
                    <div
                      key={folderId}
                      className="p-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => {
                        const newProjectId = folderId.split('-')[0];
                        if (canUploadToProject(user, newProjectId)) {
                          onFolderChange(folderId);
                          setIsFolderSelectorOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Folder className="w-3 h-3" />
                        <span className="text-sm">{getFolderDisplayName(folderId).split(' > ').slice(1).join(' > ')}</span>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* 모든 폴더 */}
            <div>
              <h4 className="text-sm font-medium mb-2">모든 폴더</h4>
              <div className="space-y-1">
            {(() => {
              const folders = getUploadableFolders();
              const groupedFolders = folders.reduce((acc, folder) => {
                if (!acc[folder.projectId]) {
                  acc[folder.projectId] = [];
                }
                acc[folder.projectId].push(folder);
                return acc;
              }, {} as Record<string, typeof folders>);

              return Object.entries(groupedFolders).map(([projectId, projectFolders]) => {
                const project = accessibleProjects.find(p => p.id === projectId);
                const projectName = project?.name || `프로젝트 ${projectId}`;

                return (
                  <div key={projectId} className="space-y-1">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground bg-muted/50 rounded">
                      {projectName}
                    </div>
                    {projectFolders.map((folder) => (
                      <div
                        key={folder.id}
                        className={`p-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50 ${
                          selectedFolderId === folder.id 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'hover:bg-muted/30'
                        }`}
                        onClick={() => {
                          // 폴더 변경 시 업로드 권한 재확인
                          const newProjectId = folder.id.split('-')[0];
                          if (canUploadToProject(user, newProjectId)) {
                            onFolderChange(folder.id);
                            setIsFolderSelectorOpen(false);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Folder className="w-3 h-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate">
                              {folder.id === projectId ? '프로젝트 루트' : 
                               folder.name.split(' > ').slice(1).join(' > ')}
                            </p>
                          </div>
                          {selectedFolderId === folder.id && (
                            <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              });
            })()}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}