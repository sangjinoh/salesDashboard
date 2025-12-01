import { useState } from 'react';
import { Camera, Save, X, Eye, EyeOff, Upload, User2, Mail, Phone, Building, Shield, Bell, BellRing, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  chatbotRole: 'system_admin' | 'team_admin' | 'user';
  teamType?: 'engineering' | 'procurement' | 'construction' | 'management' | 'safety' | 'qa';
  licenseType: 'system' | 'user';
  phone?: string;
  department?: string;
  team?: string;
  joinDate?: string;
  bio?: string;
  projectPermissions?: 'admin' | 'readwrite' | 'readonly';
}

interface NotificationSettings {
  email: {
    enabled: boolean;
    fileChanges: boolean;
    projectUpdates: boolean;
    reportGeneration: boolean;
    aiAnalysis: boolean;
    security: boolean;
    weekly: boolean;
  };
  push: {
    enabled: boolean;
    fileUploads: boolean;
    mentions: boolean;
    comments: boolean;
    urgent: boolean;
  };
  desktop: {
    enabled: boolean;
    sound: boolean;
    frequency: 'all' | 'important' | 'urgent';
  };
  mobile: {
    enabled: boolean;
    vibration: boolean;
    quiet: boolean;
    quietStart: string;
    quietEnd: string;
  };
}

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdate: (user: User) => void;
}

export function ProfileSettingsDialog({ isOpen, onClose, user, onUserUpdate }: ProfileSettingsDialogProps) {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [isLoading, setIsLoading] = useState(false);
  const [showBio, setShowBio] = useState(false);
  
  // 알림 설정 상태
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: {
      enabled: true,
      fileChanges: true,
      projectUpdates: true,
      reportGeneration: false,
      aiAnalysis: true,
      security: true,
      weekly: false
    },
    push: {
      enabled: true,
      fileUploads: true,
      mentions: true,
      comments: false,
      urgent: true
    },
    desktop: {
      enabled: true,
      sound: true,
      frequency: 'important'
    },
    mobile: {
      enabled: true,
      vibration: true,
      quiet: true,
      quietStart: '22:00',
      quietEnd: '08:00'
    }
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    // 시뮬레이션된 저장 지연
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onUserUpdate(editedUser);
    setIsLoading(false);
    onClose();
    
    toast.success('프로필과 알림 설정이 성공적으로 업데이트되었습니다.');
  };

  const handleCancel = () => {
    setEditedUser(user);
    onClose();
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 실제로는 파일을 서버에 업로드하고 URL을 받아옴
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedUser(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      toast.success('프로필 이미지가 업로드되었습니다.');
    }
  };

  // 알림 설정 업데이트 함수
  const updateNotificationSetting = (category: keyof NotificationSettings, setting: string, value: boolean | string) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  // 관리자 권한 체크
  const isAdmin = user.chatbotRole === 'system_admin';
  
  // 읽기 전용 필드들 (관리자가 아닌 경우)
  const isReadOnly = (field: string) => {
    if (isAdmin) return false;
    
    // 일반 사용자가 수정 불가능한 필드들
    const adminOnlyFields = ['name', 'email', 'role', 'department', 'team', 'licenseType', 'projectPermissions', 'chatbotRole'];
    return adminOnlyFields.includes(field);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User2 className="w-5 h-5" />
            프로필 설정
          </DialogTitle>
          <DialogDescription>
            사용자 정보, 보안 설정 및 알림 설정을 관리할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">기본 정보</TabsTrigger>
              <TabsTrigger value="security">보안 설정</TabsTrigger>
              <TabsTrigger value="notifications">알림 설정</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              {/* 프로필 이미지 섹션 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">프로필 이미지</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={editedUser.avatar} alt={editedUser.name} />
                        <AvatarFallback className="text-lg">
                          {editedUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-8 h-8 p-0 rounded-full shadow-lg"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-slate-900">{editedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {editedUser.team}{editedUser.position ? ` / ${editedUser.position}` : ''}
                      </p>
                      <div className="flex gap-1">
                        <Badge variant={editedUser.licenseType === 'user' ? 'default' : 'secondary'}>
                          {editedUser.licenseType === 'user' ? '유저 라이선스' : '시스템 라이선스'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 기본 정보 섹션 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">이름</Label>
                      <Input
                        id="name"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                        disabled={isReadOnly('name')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">이메일</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          disabled={isReadOnly('email')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">부서</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="department"
                          value={editedUser.department || ''}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, department: e.target.value }))}
                          className="pl-10"
                          disabled={isReadOnly('department')}
                          placeholder="부서를 입력하세요"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team">팀</Label>
                      <Input
                        id="team"
                        value={editedUser.team || ''}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, team: e.target.value }))}
                        disabled={isReadOnly('team')}
                        placeholder="팀을 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={editedUser.phone || ''}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                        className="pl-10"
                        placeholder="연락처를 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bio">자기소개</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBio(!showBio)}
                        className="h-auto p-1 text-xs"
                      >
                        {showBio ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showBio ? '숨기기' : '표시'}
                      </Button>
                    </div>
                    {showBio && (
                      <Textarea
                        id="bio"
                        value={editedUser.bio || ''}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="간단한 자기소개를 입력하세요"
                        rows={3}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>


            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">보안 설정</CardTitle>
                  <CardDescription>
                    계정 보안과 관련된 설정을 관리합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">이중 인증</h4>
                      <p className="text-sm text-muted-foreground">
                        추가 보안을 위해 이중 인증을 활성화합니다.
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">로그인 알림</h4>
                      <p className="text-sm text-muted-foreground">
                        새 기기에서 로그인할 때 이메일로 알림을 받습니다.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      비밀번호 변경
                    </Button>
                    <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                      활성 세션 모두 종료
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              {/* 이메일 알림 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    이메일 알림
                  </CardTitle>
                  <CardDescription>
                    이메일로 받을 알림을 설정합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">이메일 알림 활성화</h4>
                      <p className="text-sm text-muted-foreground">모든 이메일 알림을 일괄 제어합니다.</p>
                    </div>
                    <Switch 
                      checked={notifications.email.enabled}
                      onCheckedChange={(checked) => updateNotificationSetting('email', 'enabled', checked)}
                    />
                  </div>

                  {notifications.email.enabled && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">파일 변경 알림</Label>
                          <Switch 
                            checked={notifications.email.fileChanges}
                            onCheckedChange={(checked) => updateNotificationSetting('email', 'fileChanges', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">프로젝트 업데이트</Label>
                          <Switch 
                            checked={notifications.email.projectUpdates}
                            onCheckedChange={(checked) => updateNotificationSetting('email', 'projectUpdates', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">보고서 생성 완료</Label>
                          <Switch 
                            checked={notifications.email.reportGeneration}
                            onCheckedChange={(checked) => updateNotificationSetting('email', 'reportGeneration', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">AI 분석 완료</Label>
                          <Switch 
                            checked={notifications.email.aiAnalysis}
                            onCheckedChange={(checked) => updateNotificationSetting('email', 'aiAnalysis', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">보안 알림</Label>
                          <Switch 
                            checked={notifications.email.security}
                            onCheckedChange={(checked) => updateNotificationSetting('email', 'security', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">주간 요약 보고서</Label>
                          <Switch 
                            checked={notifications.email.weekly}
                            onCheckedChange={(checked) => updateNotificationSetting('email', 'weekly', checked)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 푸시 알림 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    푸시 알림
                  </CardTitle>
                  <CardDescription>
                    브라우저 푸시 알림 설정을 관리합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">푸시 알림 활성화</h4>
                      <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 허용합니다.</p>
                    </div>
                    <Switch 
                      checked={notifications.push.enabled}
                      onCheckedChange={(checked) => updateNotificationSetting('push', 'enabled', checked)}
                    />
                  </div>

                  {notifications.push.enabled && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">파일 업로드 완료</Label>
                          <Switch 
                            checked={notifications.push.fileUploads}
                            onCheckedChange={(checked) => updateNotificationSetting('push', 'fileUploads', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">멘션 알림</Label>
                          <Switch 
                            checked={notifications.push.mentions}
                            onCheckedChange={(checked) => updateNotificationSetting('push', 'mentions', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">댓글 알림</Label>
                          <Switch 
                            checked={notifications.push.comments}
                            onCheckedChange={(checked) => updateNotificationSetting('push', 'comments', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">긴급 알림</Label>
                          <Switch 
                            checked={notifications.push.urgent}
                            onCheckedChange={(checked) => updateNotificationSetting('push', 'urgent', checked)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 데스크톱 알림 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    데스크톱 알림
                  </CardTitle>
                  <CardDescription>
                    데스크톱 환경에서의 알림 설정을 관리합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">데스크톱 알림 활성화</h4>
                      <p className="text-sm text-muted-foreground">데스크톱 환경에서 알림을 표시합니다.</p>
                    </div>
                    <Switch 
                      checked={notifications.desktop.enabled}
                      onCheckedChange={(checked) => updateNotificationSetting('desktop', 'enabled', checked)}
                    />
                  </div>

                  {notifications.desktop.enabled && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">알림 소리</Label>
                          <Switch 
                            checked={notifications.desktop.sound}
                            onCheckedChange={(checked) => updateNotificationSetting('desktop', 'sound', checked)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">알림 빈도</Label>
                          <Select 
                            value={notifications.desktop.frequency}
                            onValueChange={(value) => updateNotificationSetting('desktop', 'frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">모든 알림</SelectItem>
                              <SelectItem value="important">중요 알림만</SelectItem>
                              <SelectItem value="urgent">긴급 알림만</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 모바일 알림 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    모바일 알림
                  </CardTitle>
                  <CardDescription>
                    모바일 환경에서의 알림 설정을 관리합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">모바일 알림 활성화</h4>
                      <p className="text-sm text-muted-foreground">모바일 기기에서 알림을 받습니다.</p>
                    </div>
                    <Switch 
                      checked={notifications.mobile.enabled}
                      onCheckedChange={(checked) => updateNotificationSetting('mobile', 'enabled', checked)}
                    />
                  </div>

                  {notifications.mobile.enabled && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">진동</Label>
                          <Switch 
                            checked={notifications.mobile.vibration}
                            onCheckedChange={(checked) => updateNotificationSetting('mobile', 'vibration', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">무음 시간 설정</Label>
                          <Switch 
                            checked={notifications.mobile.quiet}
                            onCheckedChange={(checked) => updateNotificationSetting('mobile', 'quiet', checked)}
                          />
                        </div>

                        {notifications.mobile.quiet && (
                          <div className="grid grid-cols-2 gap-4 pl-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">시작 시간</Label>
                              <Input
                                type="time"
                                value={notifications.mobile.quietStart}
                                onChange={(e) => updateNotificationSetting('mobile', 'quietStart', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">종료 시간</Label>
                              <Input
                                type="time"
                                value={notifications.mobile.quietEnd}
                                onChange={(e) => updateNotificationSetting('mobile', 'quietEnd', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                저장
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}