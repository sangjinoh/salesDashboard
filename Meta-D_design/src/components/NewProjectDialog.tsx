import { useState } from 'react';
import { Save, X, FolderPlus, Calendar, Users, MapPin, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface NewProject {
  name: string;
  description: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string;
  budget: string;
  manager: string;
  status: 'planning' | 'active' | 'on-hold';
  priority: 'low' | 'medium' | 'high';
}

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreate: (project: NewProject) => void;
}

export function NewProjectDialog({ isOpen, onClose, onProjectCreate }: NewProjectDialogProps) {
  const [projectData, setProjectData] = useState<NewProject>({
    name: '',
    description: '',
    type: '',
    location: '',
    startDate: '',
    endDate: '',
    budget: '',
    manager: '',
    status: 'planning',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof NewProject, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!projectData.name.trim()) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 실제 구현에서는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
      
      onProjectCreate(projectData);
      
      // 폼 리셋
      setProjectData({
        name: '',
        description: '',
        type: '',
        location: '',
        startDate: '',
        endDate: '',
        budget: '',
        manager: '',
        status: 'planning',
        priority: 'medium'
      });
      
      onClose();
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      alert('프로젝트 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setProjectData({
      name: '',
      description: '',
      type: '',
      location: '',
      startDate: '',
      endDate: '',
      budget: '',
      manager: '',
      status: 'planning',
      priority: 'medium'
    });
    onClose();
  };

  const isFormValid = projectData.name.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5" />
            새 프로젝트 생성
          </DialogTitle>
          <DialogDescription>
            새로운 프로젝트를 생성하고 기본 정보를 설정합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">프로젝트명 *</Label>
                  <Input
                    id="name"
                    value={projectData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="프로젝트명을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">프로젝트 유형</Label>
                  <Select value={projectData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chemical">화학공장</SelectItem>
                      <SelectItem value="power">발전소</SelectItem>
                      <SelectItem value="refinery">정유시설</SelectItem>
                      <SelectItem value="lng">LNG 터미널</SelectItem>
                      <SelectItem value="renewable">신재생에너지</SelectItem>
                      <SelectItem value="infrastructure">인프라</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">위치</Label>
                  <Input
                    id="location"
                    value={projectData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="프로젝트 위치"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">시작일</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={projectData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">완료 예정일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={projectData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">예산 (억원)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={projectData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="예산을 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manager">프로젝트 매니저</Label>
                  <Select value={projectData.manager} onValueChange={(value) => handleInputChange('manager', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="매니저 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kim.cs">김철수</SelectItem>
                      <SelectItem value="lee.ys">이영수</SelectItem>
                      <SelectItem value="park.mh">박민호</SelectItem>
                      <SelectItem value="choi.sh">최수현</SelectItem>
                      <SelectItem value="jung.js">정진석</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">프로젝트 설명</Label>
                  <Textarea
                    id="description"
                    value={projectData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">프로젝트 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>상태</Label>
                  <Select value={projectData.status} onValueChange={(value: 'planning' | 'active' | 'on-hold') => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">계획중</SelectItem>
                      <SelectItem value="active">진행중</SelectItem>
                      <SelectItem value="on-hold">보류</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>우선순위</Label>
                  <Select value={projectData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>자동 생성될 폴더 구조</Label>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span className="font-medium">{projectData.name || '새 프로젝트'}</span>
                    </div>
                    <div className="ml-6 space-y-1 text-muted-foreground">
                      <div>├── Project General</div>
                      <div>├── Correspondence</div>
                      <div>├── Engineering</div>
                      <div>├── Procurement</div>
                      <div>├── Construction</div>
                      <div>├── Partner</div>
                      <div>└── Workflow</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            * 필수 입력 항목
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? '생성 중...' : '프로젝트 생성'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}