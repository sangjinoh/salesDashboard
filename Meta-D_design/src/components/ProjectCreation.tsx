import { useState } from 'react';
import { Header } from './Header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { 
  FolderKanban, 
  Plus, 
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Target,
  Calendar,
  DollarSign
} from 'lucide-react';
import type { User } from '../types/app';

interface ProjectCreationProps {
  onBack: () => void;
  user: User;
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onUserManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing') => void;
  onProjectCreate: (project: any) => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  location: string;
  client: string;
  startDate: string;
  endDate: string;
  budget: string;
  tags: string[];
}

const categories = [
  '에너지', '건설', '인프라', 'IT', '제조', '환경', '교통', '의료', 
  '금융', '교육', '문화', '스포츠', '유통', '농업', '기타'
];

const locations = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', 
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

export function ProjectCreation({
  onBack,
  user,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  onProjectCreate
}: ProjectCreationProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    category: '',
    location: '',
    client: '',
    startDate: '',
    endDate: '',
    budget: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!formData.name.trim()) {
      toast.error('프로젝트명을 입력해주세요.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('프로젝트 설명을 입력해주세요.');
      return;
    }

    if (!formData.category) {
      toast.error('카테고리를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const project = {
        id: Date.now().toString(), // 임시 ID
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        memberCount: 1,
        fileCount: 0,
        progress: 0,
        category: formData.category,
        location: formData.location || undefined,
        client: formData.client || undefined,
        budget: formData.budget ? parseFloat(formData.budget.replace(/,/g, '')) * 100000000 : undefined, // 억원 단위로 저장
        spent: 0,
        members: [
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department || '기타',
            team: user.team,
            joinedDate: new Date().toISOString().split('T')[0]
          }
        ],
        tags: formData.tags,
        isArchived: false
      };

      await onProjectCreate(project);
      toast.success('새 프로젝트가 생성되었습니다.');
      onBack();
    } catch (error) {
      toast.error('프로젝트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
      {/* Header */}
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

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col p-6 gap-6 overflow-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              프로젝트 관리로 돌아가기
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl">새 프로젝트 생성</h1>
              <p className="text-muted-foreground">
                새로운 프로젝트의 기본 정보를 입력해주세요
              </p>
            </div>
          </div>
        </div>

        {/* 프로젝트 생성 폼 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-blue-600" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">프로젝트명 *</Label>
                <Input
                  id="name"
                  placeholder="프로젝트명을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명 *</Label>
                <Textarea
                  id="description"
                  placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">상태</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">계획중</SelectItem>
                      <SelectItem value="active">진행중</SelectItem>
                      <SelectItem value="paused">일시정지</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">우선순위</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="critical">긴급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 분류 및 위치 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                분류 및 위치
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">위치</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="위치를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">고객사</Label>
                <Input
                  id="client"
                  placeholder="고객사명을 입력하세요"
                  value={formData.client}
                  onChange={(e) => handleInputChange('client', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 일정 및 예산 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                일정 및 예산
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">시작일</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">종료일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">예산 (억원)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="예산을 입력하세요"
                    className="pl-10"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 태그 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                태그
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="태그를 입력하세요"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button onClick={handleAddTag} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 액션 버튼 */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                * 표시된 필드는 필수 입력 항목입니다.
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {isSubmitting ? '생성 중...' : '프로젝트 생성'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}