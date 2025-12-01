import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bot, Zap, Shield, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface AISettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AISettingsDialog({ isOpen, onClose }: AISettingsDialogProps) {
  const [settings, setSettings] = useState({
    autoReview: true,
    realTimeAnalysis: false,
    riskLevel: 'medium',
    confidence: [75],
    autoTagging: true,
    semanticSearch: true,
    duplicateDetection: true,
    complianceCheck: true,
    reviewLanguage: 'ko',
    notificationLevel: 'important',
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <DialogTitle>Meta-Delta AI 검토 설정</DialogTitle>
          </div>
          <DialogDescription>
            AI 기반 문서 검토 및 분석 기능을 설정합니다. 프로젝트 요구사항에 맞게 검토 수준과 알림 설정을 조정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
          {/* 좌측 패널 - 기본 설정 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  자동 검토 설정
                </CardTitle>
                <CardDescription>
                  파일 업로드 시 자동으로 AI 검토를 수행합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-review">자동 검토 활성화</Label>
                  <Switch
                    id="auto-review"
                    checked={settings.autoReview}
                    onCheckedChange={(checked) => updateSetting('autoReview', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="real-time">실시간 분석</Label>
                  <Switch
                    id="real-time"
                    checked={settings.realTimeAnalysis}
                    onCheckedChange={(checked) => updateSetting('realTimeAnalysis', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>위험도 임계값</Label>
                  <Select value={settings.riskLevel} onValueChange={(value) => updateSetting('riskLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">낮음 - 모든 이슈 감지</SelectItem>
                      <SelectItem value="medium">보통 - 중요 이슈만</SelectItem>
                      <SelectItem value="high">높음 - 심각한 이슈만</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>AI 신뢰도 수준: {settings.confidence[0]}%</Label>
                  <Slider
                    value={settings.confidence}
                    onValueChange={(value) => updateSetting('confidence', value)}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  검토 범위
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-tagging">자동 태깅</Label>
                  <Switch
                    id="auto-tagging"
                    checked={settings.autoTagging}
                    onCheckedChange={(checked) => updateSetting('autoTagging', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="semantic-search">시맨틱 검색 향상</Label>
                  <Switch
                    id="semantic-search"
                    checked={settings.semanticSearch}
                    onCheckedChange={(checked) => updateSetting('semanticSearch', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="duplicate-detection">중복 문서 감지</Label>
                  <Switch
                    id="duplicate-detection"
                    checked={settings.duplicateDetection}
                    onCheckedChange={(checked) => updateSetting('duplicateDetection', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="compliance-check">규정 준수 검사</Label>
                  <Switch
                    id="compliance-check"
                    checked={settings.complianceCheck}
                    onCheckedChange={(checked) => updateSetting('complianceCheck', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 패널 - 고급 설정 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>언어 및 알림 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>검토 언어</Label>
                  <Select value={settings.reviewLanguage} onValueChange={(value) => updateSetting('reviewLanguage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="auto">자동 감지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>알림 수준</Label>
                  <Select value={settings.notificationLevel} onValueChange={(value) => updateSetting('notificationLevel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">모든 검토 결과</SelectItem>
                      <SelectItem value="important">중요한 이슈만</SelectItem>
                      <SelectItem value="critical">심각한 문제만</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>검토 성능 현황</CardTitle>
                <CardDescription>
                  지난 30일간 AI 검토 통계
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold text-green-600">342</p>
                    <p className="text-sm text-muted-foreground">검토 완료</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold text-orange-600">28</p>
                    <p className="text-sm text-muted-foreground">이슈 발견</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold text-blue-600">94%</p>
                    <p className="text-sm text-muted-foreground">정확도</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-semibold text-purple-600">2.3s</p>
                    <p className="text-sm text-muted-foreground">평균 시간</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4>최근 검토 유형</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      승인됨 (89%)
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      주의 필요 (8%)
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      거부됨 (3%)
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  AI 모델 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>모델 버전:</span>
                  <span>Meta-Delta v2.1.4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>마지막 업데이트:</span>
                  <span>2024-12-10</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>지원 파일 형식:</span>
                  <span>PDF, DWG, DOCX, XLSX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>최대 파일 크기:</span>
                  <span>100MB</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              기본값 복원
            </Button>
            <Button onClick={onClose}>
              설정 저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}