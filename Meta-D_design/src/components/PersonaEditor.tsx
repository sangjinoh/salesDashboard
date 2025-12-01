import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Header } from './Header';
import { DataSourceSelector } from './DataSourceSelector';
import { 
  ArrowLeft,
  Bot,
  Settings,
  MessageSquare,
  Brain,
  Target,
  Shield,
  Database,
  Save,
  RefreshCw,
  Lock,
  Globe,
  X,
  Info,
  Lightbulb,
  Folder,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Eye
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { User, ChatbotPersona, Project, FolderNode } from '../types/app';

interface PersonaEditorProps {
  onBack: () => void;
  user: User;
  persona?: ChatbotPersona | null;
  userProjects: Project[];
  onProfileSettingsClick: () => void;
  onSystemSettingsClick: () => void;
  onAISettingsClick: () => void;
  onProjectManagementClick: () => void;
  onUserManagementClick: () => void;
  onLogout: () => void;
  onModuleSwitch: (module: 'Meta-Drive' | 'Meta-Drawing') => void;
  onSave: (formData: Partial<ChatbotPersona>) => void;
}

// 목업 폴더 구조 데이터
const mockFolderStructure: FolderNode[] = [
  {
    id: 'proj1',
    name: 'LNG 플랜트 건설 프로젝트',
    type: 'project',
    children: [
      {
        id: 'proj1-general',
        name: 'Project General',
        type: 'folder',
        fileCount: 45,
        children: [
          { id: 'proj1-general-specs', name: 'Project Specifications', type: 'folder', fileCount: 12 },
          { id: 'proj1-general-contracts', name: 'Contracts', type: 'folder', fileCount: 8 },
          { id: 'proj1-general-standards', name: 'Standards & Codes', type: 'folder', fileCount: 25 }
        ]
      },
      {
        id: 'proj1-engineering',
        name: 'Engineering',
        type: 'folder',
        fileCount: 234,
        children: [
          { id: 'proj1-eng-pid', name: 'P&ID Drawings', type: 'folder', fileCount: 89 },
          { id: 'proj1-eng-mech', name: 'Mechanical', type: 'folder', fileCount: 67 },
          { id: 'proj1-eng-pipe', name: 'Piping', type: 'folder', fileCount: 45 },
          { id: 'proj1-eng-inst', name: 'Instrumentation', type: 'folder', fileCount: 33 }
        ]
      },
      {
        id: 'proj1-procurement',
        name: 'Procurement',
        type: 'folder',
        fileCount: 156,
        children: [
          { id: 'proj1-proc-specs', name: 'Material Specifications', type: 'folder', fileCount: 78 },
          { id: 'proj1-proc-vendors', name: 'Vendor Documents', type: 'folder', fileCount: 45 },
          { id: 'proj1-proc-purchase', name: 'Purchase Orders', type: 'folder', fileCount: 33 }
        ]
      },
      {
        id: 'proj1-construction',
        name: 'Construction',
        type: 'folder',
        fileCount: 89,
        children: [
          { id: 'proj1-const-drawings', name: 'Construction Drawings', type: 'folder', fileCount: 34 },
          { id: 'proj1-const-procedures', name: 'Procedures', type: 'folder', fileCount: 28 },
          { id: 'proj1-const-reports', name: 'Progress Reports', type: 'folder', fileCount: 27 }
        ]
      }
    ]
  },
  {
    id: 'proj2',
    name: '정유공장 개보수 프로젝트',
    type: 'project',
    children: [
      {
        id: 'proj2-general',
        name: 'Project General',
        type: 'folder',
        fileCount: 23,
        children: [
          { id: 'proj2-general-scope', name: 'Project Scope', type: 'folder', fileCount: 8 },
          { id: 'proj2-general-safety', name: 'Safety Plans', type: 'folder', fileCount: 15 }
        ]
      },
      {
        id: 'proj2-engineering',
        name: 'Engineering',
        type: 'folder',
        fileCount: 167,
        children: [
          { id: 'proj2-eng-process', name: 'Process Engineering', type: 'folder', fileCount: 56 },
          { id: 'proj2-eng-civil', name: 'Civil & Structural', type: 'folder', fileCount: 45 },
          { id: 'proj2-eng-electrical', name: 'Electrical', type: 'folder', fileCount: 66 }
        ]
      }
    ]
  }
];

export function PersonaEditor({
  onBack,
  user,
  persona,
  userProjects,
  onProfileSettingsClick,
  onSystemSettingsClick,
  onAISettingsClick,
  onProjectManagementClick,
  onUserManagementClick,
  onLogout,
  onModuleSwitch,
  onSave
}: PersonaEditorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ChatbotPersona>>({
    displayName: '',
    description: '',
    role: '',
    visibility: 'private',
    conversationTone: 'professional',
    language: 'korean',
    specialties: [],
    knowledgeBase: '',
    guidelines: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 3000,
    systemPrompt: '',
    dataSources: []
  });

  const [specialtyInput, setSpecialtyInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const isAdmin = user.chatbotRole === 'system_admin';
  const totalSteps = isAdmin ? 5 : 4;

  // 폼 초기화
  useEffect(() => {
    if (persona) {
      setFormData({
        name: persona.name,
        displayName: persona.displayName,
        description: persona.description,
        role: persona.role,
        visibility: persona.visibility,
        conversationTone: persona.conversationTone,
        language: persona.language,
        specialties: persona.specialties || [],
        knowledgeBase: persona.knowledgeBase || '',
        guidelines: persona.guidelines || '',
        model: persona.model,
        temperature: persona.temperature,
        maxTokens: persona.maxTokens,
        systemPrompt: persona.systemPrompt || '',
        dataSources: persona.dataSources || []
      });
      setSelectedDataSources(persona.dataSources?.map(ds => ds.folderId) || []);
    }
  }, [persona]);

  // 단계별 validation
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // 기본 정보
        if (!formData.displayName?.trim()) {
          newErrors.displayName = '페르소나 이름은 필수입니다.';
        }
        if (!formData.description?.trim()) {
          newErrors.description = '설명을 입력해주세요.';
        }
        if (!formData.role?.trim()) {
          newErrors.role = '역할을 입력해주세요.';
        }
        break;
        
      case 2: // 대화 스타일
        // 필수 항목 없음
        break;
        
      case 3: // 지식 기반
        if (!formData.knowledgeBase?.trim()) {
          newErrors.knowledgeBase = '기본 지식을 입력해주세요.';
        }
        if (!formData.guidelines?.trim()) {
          newErrors.guidelines = '동작 가이드라인을 입력해주세요.';
        }
        break;
        
      case 4: // 데이터 소스
        if (selectedDataSources.length === 0) {
          newErrors.dataSources = '최소 하나의 데이터 소스를 선택해주세요.';
        }
        break;
        
      case 5: // 고급 설정 (Admin만)
        // 필수 항목 없음
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 다음 단계
  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    } else {
      toast.error('필수 항목을 확인해주세요.');
    }
  };

  // 이전 단계
  const handlePrev = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!validateCurrentStep()) {
      toast.error('필수 항목을 확인해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 데이터 소스 정보 구성
      const dataSources = selectedDataSources.map(folderId => {
        const findFolder = (nodes: FolderNode[]): FolderNode | null => {
          for (const node of nodes) {
            if (node.id === folderId) return node;
            if (node.children) {
              const found = findFolder(node.children);
              if (found) return found;
            }
          }
          return null;
        };
        
        const folder = findFolder(mockFolderStructure);
        return {
          folderId,
          folderName: folder?.name || 'Unknown Folder',
          projectId: folderId.split('-')[0],
          enabled: true
        };
      });

      const finalFormData = {
        ...formData,
        name: formData.name || formData.displayName?.toLowerCase().replace(/\s+/g, '_'),
        systemPrompt: formData.systemPrompt || `당신은 ${formData.role}입니다. ${formData.guidelines}`,
        dataSources
      };

      onSave(finalFormData);
      toast.success(persona ? '페르소나가 성공적으로 업데이트되었습니다.' : '새 페르소나가 성공적으로 생성되었습니다.');
      onBack();
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 전문분야 추가
  const addSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties?.includes(specialtyInput.trim())) {
      setFormData({
        ...formData,
        specialties: [...(formData.specialties || []), specialtyInput.trim()]
      });
      setSpecialtyInput('');
    }
  };

  // 전문분야 제거
  const removeSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties?.filter(s => s !== specialty) || []
    });
  };

  // 데이터 소스 선택 변경
  const handleDataSourceChange = (selectedFolders: string[]) => {
    setSelectedDataSources(selectedFolders);
  };

  // 선택된 데이터 소스 통계
  const getDataSourceStats = () => {
    let totalFiles = 0;
    let selectedFolders = 0;

    const countFiles = (nodes: FolderNode[], folderId: string): number => {
      for (const node of nodes) {
        if (node.id === folderId) {
          return node.fileCount || 0;
        }
        if (node.children) {
          const count = countFiles(node.children, folderId);
          if (count > 0) return count;
        }
      }
      return 0;
    };

    selectedDataSources.forEach(folderId => {
      totalFiles += countFiles(mockFolderStructure, folderId);
      selectedFolders++;
    });

    return { totalFiles, selectedFolders };
  };

  const stats = getDataSourceStats();

  return (
    <div className="h-screen flex flex-col bg-gradient-subtle">
      <Header
        user={user}
        onProfileSettingsClick={onProfileSettingsClick}
        onSystemSettingsClick={onSystemSettingsClick}
        onAISettingsClick={onAISettingsClick}
        onProjectManagementClick={onProjectManagementClick}
        onUserManagementClick={onUserManagementClick}
        onLogout={onLogout}
        currentModule="Meta-Delta"
        onModuleSwitch={onModuleSwitch}
      />

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                돌아가기
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">
                    {persona ? `${persona.displayName} 편집` : 'AI 페르소나 만들기'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    ChatGPT처럼 나만의 AI 어시스턴트를 설정하세요
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {showPreview && (
                <Button variant="outline" onClick={() => setShowPreview(false)} className="gap-2">
                  <Eye className="w-4 h-4" />
                  미리보기 닫기
                </Button>
              )}
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                미리보기
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 진행 단계 사이드바 */}
                <div className="lg:col-span-1">
                  <Card className="bg-white/70 backdrop-blur-sm sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-base">설정 단계</CardTitle>
                      <CardDescription>
                        {currentStep}/{totalSteps} 단계 완료
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
                      
                      <div className="space-y-3">
                        {[
                          { step: 1, icon: Settings, title: '기본 정보', desc: '이름, 역할, 설명' },
                          { step: 2, icon: MessageSquare, title: '대화 스타일', desc: '톤, 언어, 전문분야' },
                          { step: 3, icon: Brain, title: '지식 기반', desc: '기본 지식, 가이드라인' },
                          { step: 4, icon: Database, title: '데이터 소스', desc: '학습할 폴더 선택' },
                          ...(isAdmin ? [{ step: 5, icon: Zap, title: '고급 설정', desc: 'AI 모델, 창의성' }] : [])
                        ].map(({ step, icon: Icon, title, desc }) => (
                          <div
                            key={step}
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                              currentStep === step
                                ? 'bg-blue-50 border border-blue-200'
                                : currentStep > step
                                ? 'bg-green-50 border border-green-200'
                                : 'hover:bg-slate-50'
                            }`}
                            onClick={() => currentStep > step && setCurrentStep(step)}
                          >
                            <div className={`p-2 rounded-lg ${
                              currentStep === step
                                ? 'bg-blue-100 text-blue-600'
                                : currentStep > step
                                ? 'bg-green-100 text-green-600'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {currentStep > step ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Icon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{title}</h4>
                              <p className="text-xs text-muted-foreground">{desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 메인 콘텐츠 */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/70 backdrop-blur-sm">
                    <CardContent className="p-8">
                      {/* 단계 1: 기본 정보 */}
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 pb-4 border-b">
                            <Settings className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-blue-600">기본 정보</h3>
                          </div>

                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="displayName" className="flex items-center gap-1">
                                  페르소나 이름 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="displayName"
                                  value={formData.displayName || ''}
                                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                  placeholder="예: 설계 도우미"
                                  className={errors.displayName ? 'border-red-500' : ''}
                                />
                                {errors.displayName && (
                                  <p className="text-sm text-red-500">{errors.displayName}</p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="role" className="flex items-center gap-1">
                                  역할 <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="role"
                                  value={formData.role || ''}
                                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                  placeholder="예: 개인 어시스턴트"
                                  className={errors.role ? 'border-red-500' : ''}
                                />
                                {errors.role && (
                                  <p className="text-sm text-red-500">{errors.role}</p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description" className="flex items-center gap-1">
                                설명 <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="이 AI가 어떤 일을 도와주는지 설명해주세요"
                                rows={4}
                                className={errors.description ? 'border-red-500' : ''}
                              />
                              {errors.description && (
                                <p className="text-sm text-red-500">{errors.description}</p>
                              )}
                            </div>

                            <div className="space-y-3">
                              <Label className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                공개 범위
                              </Label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className={`p-4 cursor-pointer transition-colors border-2 ${
                                  formData.visibility === 'private' ? 'bg-blue-50 border-blue-300' : 'border-border hover:bg-slate-50'
                                }`} onClick={() => setFormData({ ...formData, visibility: 'private' })}>
                                  <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-slate-600" />
                                    <div>
                                      <h6 className="font-medium">비공개</h6>
                                      <p className="text-sm text-muted-foreground">나만 사용 가능</p>
                                    </div>
                                  </div>
                                </Card>
                                <Card className={`p-4 cursor-pointer transition-colors border-2 ${
                                  formData.visibility === 'public' ? 'bg-blue-50 border-blue-300' : 'border-border hover:bg-slate-50'
                                }`} onClick={() => setFormData({ ...formData, visibility: 'public' })}>
                                  <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-slate-600" />
                                    <div>
                                      <h6 className="font-medium">공개</h6>
                                      <p className="text-sm text-muted-foreground">모든 사용자</p>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 단계 2: 대화 스타일 */}
                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 pb-4 border-b">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-green-600">대화 스타일</h3>
                          </div>

                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>대화 톤</Label>
                                <Select
                                  value={formData.conversationTone || 'professional'}
                                  onValueChange={(value) => setFormData({ ...formData, conversationTone: value as any })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="professional">전문적</SelectItem>
                                    <SelectItem value="friendly">친근함</SelectItem>
                                    <SelectItem value="casual">편안함</SelectItem>
                                    <SelectItem value="formal">격식</SelectItem>
                                    <SelectItem value="technical">기술적</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>언어</Label>
                                <Select
                                  value={formData.language || 'korean'}
                                  onValueChange={(value) => setFormData({ ...formData, language: value as any })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="korean">한국어</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="mixed">혼용</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <Label className="flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                전문 분야
                              </Label>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <Input
                                    value={specialtyInput}
                                    onChange={(e) => setSpecialtyInput(e.target.value)}
                                    placeholder="전문 분야 추가 (예: 문서 작성)"
                                    onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                                  />
                                  <Button type="button" onClick={addSpecialty} disabled={!specialtyInput.trim()}>
                                    추가
                                  </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {formData.specialties?.map((specialty) => (
                                    <Badge key={specialty} variant="secondary" className="gap-1 px-3 py-1">
                                      {specialty}
                                      <X 
                                        className="w-3 h-3 cursor-pointer hover:text-red-500" 
                                        onClick={() => removeSpecialty(specialty)}
                                      />
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 단계 3: 지식 기반 */}
                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 pb-4 border-b">
                            <Brain className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-purple-600">지식 기반</h3>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="knowledgeBase" className="flex items-center gap-1">
                                기본 지식 <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="knowledgeBase"
                                value={formData.knowledgeBase || ''}
                                onChange={(e) => setFormData({ ...formData, knowledgeBase: e.target.value })}
                                placeholder="이 AI가 알아야 할 기본 정보나 지식을 설명해주세요"
                                rows={4}
                                className={errors.knowledgeBase ? 'border-red-500' : ''}
                              />
                              {errors.knowledgeBase && (
                                <p className="text-sm text-red-500">{errors.knowledgeBase}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="guidelines" className="flex items-center gap-1">
                                동작 가이드라인 <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="guidelines"
                                value={formData.guidelines || ''}
                                onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                                placeholder="AI가 어떻게 동작해야 하는지 가이드라인을 설명해주세요"
                                rows={4}
                                className={errors.guidelines ? 'border-red-500' : ''}
                              />
                              {errors.guidelines && (
                                <p className="text-sm text-red-500">{errors.guidelines}</p>
                              )}
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <h6 className="font-medium text-blue-600 mb-1">팁</h6>
                                <p className="text-sm text-blue-600">
                                  구체적이고 명확한 지식과 가이드라인을 제공할수록 AI가 더 정확하고 일관된 답변을 제공합니다.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 단계 4: 데이터 소스 */}
                      {currentStep === 4 && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 pb-4 border-b">
                            <Database className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-lg font-semibold text-indigo-600">데이터 소스 선택</h3>
                          </div>

                          <div className="space-y-6">
                            <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg">
                              <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
                              <div>
                                <h6 className="font-medium text-indigo-600 mb-1">데이터 소스란?</h6>
                                <p className="text-sm text-indigo-600">
                                  AI가 답변할 때 참고할 폴더와 파일들을 선택합니다. 
                                  선택한 폴더의 문서들을 기반으로 더 정확하고 전문적인 답변을 제공합니다.
                                </p>
                              </div>
                            </div>

                            {errors.dataSources && (
                              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <p className="text-sm text-red-600">{errors.dataSources}</p>
                              </div>
                            )}

                            <DataSourceSelector
                              folderStructure={mockFolderStructure}
                              selectedFolders={selectedDataSources}
                              onSelectionChange={handleDataSourceChange}
                            />

                            {selectedDataSources.length > 0 && (
                              <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    <h6 className="font-medium text-green-600">선택된 데이터 소스</h6>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Folder className="w-4 h-4 text-green-600" />
                                      <span>선택된 폴더: {stats.selectedFolders}개</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-green-600" />
                                      <span>총 파일 수: {stats.totalFiles}개</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 단계 5: 고급 설정 (Admin만) */}
                      {currentStep === 5 && isAdmin && (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 pb-4 border-b">
                            <Zap className="w-5 h-5 text-orange-600" />
                            <h3 className="text-lg font-semibold text-orange-600">고급 설정</h3>
                            <Badge variant="outline" className="text-xs">Admin 전용</Badge>
                          </div>

                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>AI 모델</Label>
                                <Select
                                  value={formData.model || 'gpt-3.5-turbo'}
                                  onValueChange={(value) => setFormData({ ...formData, model: value as any })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="gpt-4">GPT-4 (고성능)</SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (일반)</SelectItem>
                                    <SelectItem value="claude-3">Claude-3 (추론 특화)</SelectItem>
                                    <SelectItem value="gemini-pro">Gemini Pro (다중모달)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>창의성 수준</Label>
                                <Select
                                  value={formData.temperature?.toString() || '0.7'}
                                  onValueChange={(value) => setFormData({ ...formData, temperature: parseFloat(value) })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="0.1">매우 보수적 (0.1)</SelectItem>
                                    <SelectItem value="0.3">보수적 (0.3)</SelectItem>
                                    <SelectItem value="0.7">균형적 (0.7)</SelectItem>
                                    <SelectItem value="1.0">창의적 (1.0)</SelectItem>
                                    <SelectItem value="1.2">매우 창의적 (1.2)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>최대 토큰 수</Label>
                              <Select
                                value={formData.maxTokens?.toString() || '3000'}
                                onValueChange={(value) => setFormData({ ...formData, maxTokens: parseInt(value) })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1000">1,000 토큰 (짧은 응답)</SelectItem>
                                  <SelectItem value="3000">3,000 토큰 (일반 응답)</SelectItem>
                                  <SelectItem value="4000">4,000 토큰 (긴 응답)</SelectItem>
                                  <SelectItem value="8000">8,000 토큰 (매우 긴 응답)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="systemPrompt">시스템 프롬프트 (선택)</Label>
                              <Textarea
                                id="systemPrompt"
                                value={formData.systemPrompt || ''}
                                onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                                placeholder="고급 시스템 프롬프트를 직접 작성할 수 있습니다 (비워두면 자동 생성)"
                                rows={4}
                              />
                              <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                                <Info className="w-4 h-4 text-orange-600 mt-0.5" />
                                <p className="text-sm text-orange-600">
                                  비워두면 역할과 가이드라인을 기반으로 자동 생성됩니다.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* 미리보기 패널 */}
                {showPreview && (
                  <div className="lg:col-span-1">
                    <Card className="bg-white/70 backdrop-blur-sm sticky top-6">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          미리보기
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {formData.displayName?.charAt(0) || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h6 className="font-medium">{formData.displayName || '새 페르소나'}</h6>
                            <p className="text-sm text-muted-foreground">{formData.role || '역할 미설정'}</p>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">설명:</span>
                            <p className="text-xs mt-1">{formData.description || '설명이 없습니다.'}</p>
                          </div>

                          <div>
                            <span className="text-muted-foreground">대화 톤:</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {formData.conversationTone === 'professional' ? '전문적' :
                               formData.conversationTone === 'friendly' ? '친근함' :
                               formData.conversationTone === 'casual' ? '편안함' :
                               formData.conversationTone === 'formal' ? '격식' : '기술적'}
                            </Badge>
                          </div>

                          <div>
                            <span className="text-muted-foreground">전문 분야:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {formData.specialties?.slice(0, 3).map(specialty => (
                                <Badge key={specialty} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                              {(formData.specialties?.length || 0) > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(formData.specialties?.length || 0) - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-muted-foreground">데이터 소스:</span>
                            <p className="text-xs mt-1">{stats.selectedFolders}개 폴더, {stats.totalFiles}개 파일</p>
                          </div>

                          {isAdmin && (
                            <div>
                              <span className="text-muted-foreground">AI 모델:</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {formData.model?.toUpperCase()}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* 하단 네비게이션 */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  이전
                </Button>

                <div className="flex items-center gap-3">
                  {currentStep < totalSteps ? (
                    <Button onClick={handleNext} className="gap-2">
                      다음
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  ) : (
                    <Button onClick={handleSave} disabled={isSubmitting} className="gap-2">
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          저장 중...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {persona ? '저장' : '생성'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}