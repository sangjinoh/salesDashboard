import { X, Download, Share, Edit, Calendar, User, Tag, FileText, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';

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

interface FilePreviewProps {
  file: FileItem | null;
  onClose: () => void;
}

export function FilePreview({ file, onClose }: FilePreviewProps) {
  if (!file) {
    return (
      <div className="border-l bg-card p-6 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>파일을 선택하면</p>
          <p>미리보기가 표시됩니다</p>
        </div>
      </div>
    );
  }

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

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'jpg':
      case 'png':
        return <Image className="w-16 h-16 text-purple-500" />;
      default:
        return <FileText className="w-16 h-16 text-blue-500" />;
    }
  };

  return (
    <div className="border-l bg-card flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3>파일 상세정보</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* 파일 미리보기 */}
          <div className="text-center">
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
              {file.type.toLowerCase() === 'jpg' || file.type.toLowerCase() === 'png' ? (
                <div className="text-muted-foreground">
                  <Image className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">이미지 미리보기</p>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  <FileText className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">문서 미리보기</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button>
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                공유
              </Button>
            </div>
          </div>

          <Separator />

          {/* 파일 정보 */}
          <div className="space-y-4">
            <div>
              <h4 className="mb-2">파일명</h4>
              <p className="text-sm break-all">{file.name}</p>
            </div>

            <div>
              <h4 className="mb-2">설명</h4>
              <p className="text-sm text-muted-foreground">{file.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2">파일 형식</h4>
                <Badge variant="secondary">{file.type}</Badge>
              </div>
              <div>
                <h4 className="mb-2">파일 크기</h4>
                <p className="text-sm">{file.size}</p>
              </div>
            </div>

            <div>
              <h4 className="mb-2">Discipline</h4>
              <Badge className={getDisciplineColor(file.discipline)}>
                {file.discipline}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* 업로드 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm">업로드 일시</p>
                <p className="text-sm text-muted-foreground">{file.uploadDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {file.uploadedBy.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">업로드한 사용자</p>
                  <p className="text-sm text-muted-foreground">{file.uploadedBy}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 메타데이터 */}
          <div className="space-y-4">
            <h4>메타데이터</h4>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">자동 태그:</span>
                <Badge variant="outline" className="text-xs">설계도면</Badge>
                <Badge variant="outline" className="text-xs">공정</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• 문서 ID: {file.id}</p>
                <p>• 검색 가능한 키워드 자동 추출됨</p>
                <p>• 버전 관리: Rev.03</p>
                <p>• AI 분석 완료: 95% 정확도</p>
                <p>• 관련 문서: 3개 발견</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              속성 편집
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}