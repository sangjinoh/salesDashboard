import { useState } from 'react';
import { Settings, Monitor, Upload, Save, X, Shield, Database, Clock, Palette, Globe, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface SystemSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemSettingsDialog({ isOpen, onClose }: SystemSettingsDialogProps) {
  const [settings, setSettings] = useState({
    // 테마 설정
    theme: 'light',
    language: 'ko',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    
    // 파일 설정
    maxFileSize: 100, // MB
    allowedFileTypes: ['pdf', 'dwg', 'docx', 'xlsx', 'png', 'jpg'],
    autoSave: true,
    autoSaveInterval: 5, // 분
    versionControl: true,
    
    // 데이터 설정
    dataRetentionPeriod: 365, // 일
    autoBackup: true,
    backupFrequency: 'daily',
    compressionEnabled: true,
    
    // 보안 설정
    sessionTimeout: 480, // 분 (8시간)
    twoFactorAuth: false,
    ipRestriction: false,
    auditLog: true,
    
    // 성능 설정
    cacheEnabled: true,
    previewGeneration: true,
    thumbnailQuality: 80,
    searchIndexing: true
  });

  const [isDirty, setIsDirty] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // 실제 구현에서는 API 호출
    console.log('시스템 설정 저장:', settings);
    setIsDirty(false);
  };

  const handleCancel = () => {
    // 원래 설정으로 복원
    setIsDirty(false);
    onClose();
  };

  const formatFileSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)}GB`;
    }
    return `${mb}MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            시스템 설정
          </DialogTitle>
          <DialogDescription>
            화면, 파일, 데이터, 보안, 성능 관련 시스템 설정을 관리할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appearance">화면</TabsTrigger>
            <TabsTrigger value="files">파일</TabsTrigger>
            <TabsTrigger value="data">데이터</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="performance">성능</TabsTrigger>
          </TabsList>

          {/* 화면 설정 탭 */}
          <TabsContent value="appearance" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  화면 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>테마</Label>
                    <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">라이트 모드</SelectItem>
                        <SelectItem value="dark">다크 모드</SelectItem>
                        <SelectItem value="auto">시스템 설정 따름</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>언어</Label>
                    <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ko">한국어</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>날짜 형식</Label>
                      <Select value={settings.dateFormat} onValueChange={(value) => handleSettingChange('dateFormat', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY년 MM월 DD일">YYYY년 MM월 DD일</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>시간 형식</Label>
                      <Select value={settings.timeFormat} onValueChange={(value) => handleSettingChange('timeFormat', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24시간 (14:30)</SelectItem>
                          <SelectItem value="12h">12시간 (2:30 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 파일 설정 탭 */}
          <TabsContent value="files" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  파일 업로드 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>최대 파일 크기: {formatFileSize(settings.maxFileSize)}</Label>
                    <Slider
                      value={[settings.maxFileSize]}
                      onValueChange={(value) => handleSettingChange('maxFileSize', value[0])}
                      max={2048}
                      min={10}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10MB</span>
                      <span>2GB</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>허용 파일 형식</Label>
                    <div className="flex flex-wrap gap-2">
                      {['pdf', 'dwg', 'docx', 'xlsx', 'pptx', 'png', 'jpg', 'jpeg', 'gif', 'zip', 'rar'].map((type) => (
                        <Badge
                          key={type}
                          variant={settings.allowedFileTypes.includes(type) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newTypes = settings.allowedFileTypes.includes(type)
                              ? settings.allowedFileTypes.filter(t => t !== type)
                              : [...settings.allowedFileTypes, type];
                            handleSettingChange('allowedFileTypes', newTypes);
                          }}
                        >
                          {type.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  자동 저장 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">자동 저장 활성화</p>
                    <p className="text-sm text-muted-foreground">변경사항을 자동으로 저장</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                  />
                </div>

                {settings.autoSave && (
                  <div className="space-y-2">
                    <Label>저장 간격: {settings.autoSaveInterval}분</Label>
                    <Slider
                      value={[settings.autoSaveInterval]}
                      onValueChange={(value) => handleSettingChange('autoSaveInterval', value[0])}
                      max={30}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">버전 관리</p>
                    <p className="text-sm text-muted-foreground">파일 변경 이력 관리</p>
                  </div>
                  <Switch
                    checked={settings.versionControl}
                    onCheckedChange={(checked) => handleSettingChange('versionControl', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 데이터 설정 탭 */}
          <TabsContent value="data" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  데이터 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>데이터 보관 기간: {settings.dataRetentionPeriod}일</Label>
                    <Slider
                      value={[settings.dataRetentionPeriod]}
                      onValueChange={(value) => handleSettingChange('dataRetentionPeriod', value[0])}
                      max={1825}
                      min={30}
                      step={30}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>30일</span>
                      <span>5년</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">자동 백업</p>
                      <p className="text-sm text-muted-foreground">정기적으로 데이터 백업</p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                    />
                  </div>

                  {settings.autoBackup && (
                    <div className="space-y-2">
                      <Label>백업 주기</Label>
                      <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">매시간</SelectItem>
                          <SelectItem value="daily">매일</SelectItem>
                          <SelectItem value="weekly">매주</SelectItem>
                          <SelectItem value="monthly">매월</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">데이터 압축</p>
                      <p className="text-sm text-muted-foreground">저장 공간 절약을 위한 압축</p>
                    </div>
                    <Switch
                      checked={settings.compressionEnabled}
                      onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 보안 설정 탭 */}
          <TabsContent value="security" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  보안 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>세션 만료 시간: {Math.floor(settings.sessionTimeout / 60)}시간 {settings.sessionTimeout % 60}분</Label>
                    <Slider
                      value={[settings.sessionTimeout]}
                      onValueChange={(value) => handleSettingChange('sessionTimeout', value[0])}
                      max={1440}
                      min={30}
                      step={30}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>30분</span>
                      <span>24시간</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">2단계 인증</p>
                      <p className="text-sm text-muted-foreground">추가 보안 계층</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">IP 접근 제한</p>
                      <p className="text-sm text-muted-foreground">특정 IP에서만 접근 허용</p>
                    </div>
                    <Switch
                      checked={settings.ipRestriction}
                      onCheckedChange={(checked) => handleSettingChange('ipRestriction', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">감사 로그</p>
                      <p className="text-sm text-muted-foreground">사용자 활동 기록</p>
                    </div>
                    <Switch
                      checked={settings.auditLog}
                      onCheckedChange={(checked) => handleSettingChange('auditLog', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 성능 설정 탭 */}
          <TabsContent value="performance" className="space-y-6 max-h-[60vh] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  성능 최적화
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">캐시 활성화</p>
                      <p className="text-sm text-muted-foreground">빠른 파일 로딩</p>
                    </div>
                    <Switch
                      checked={settings.cacheEnabled}
                      onCheckedChange={(checked) => handleSettingChange('cacheEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">미리보기 생성</p>
                      <p className="text-sm text-muted-foreground">파일 업로드 시 미리보기 자동 생성</p>
                    </div>
                    <Switch
                      checked={settings.previewGeneration}
                      onCheckedChange={(checked) => handleSettingChange('previewGeneration', checked)}
                    />
                  </div>

                  {settings.previewGeneration && (
                    <div className="space-y-2">
                      <Label>썸네일 품질: {settings.thumbnailQuality}%</Label>
                      <Slider
                        value={[settings.thumbnailQuality]}
                        onValueChange={(value) => handleSettingChange('thumbnailQuality', value[0])}
                        max={100}
                        min={20}
                        step={10}
                        className="w-full"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">검색 인덱싱</p>
                      <p className="text-sm text-muted-foreground">빠른 검색을 위한 인덱스 생성</p>
                    </div>
                    <Switch
                      checked={settings.searchIndexing}
                      onCheckedChange={(checked) => handleSettingChange('searchIndexing', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {isDirty && "변경사항이 있습니다"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSave} disabled={!isDirty}>
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}