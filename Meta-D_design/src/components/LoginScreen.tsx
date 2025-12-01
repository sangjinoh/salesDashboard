import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertCircle, User, Shield, Eye, EyeOff } from 'lucide-react';

interface User {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  position?: string;
  chatbotRole: 'system_admin' | 'team_admin' | 'user';
  teamType?: 'engineering' | 'procurement' | 'construction' | 'management' | 'safety' | 'qa';
  licenseType: 'basic' | 'pro';
  projectPermissions?: 'admin' | 'readwrite' | 'readonly';
  phone?: string;
  department?: string;
  team?: string;
  joinDate?: string;
  bio?: string;
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

// 사용자 계정 데이터 - 프로젝트별 권한 추가
const accounts = {
  admin: {
    password: '1',
    user: {
      name: 'admin',
      email: 'admin@hcompany.com',
      role: 'IT 부서 시스템 관리자',
      position: '대리',
      chatbotRole: 'system_admin' as const,
      licenseType: 'pro' as const,
      projectPermissions: 'admin' as const,
      department: '경영지원본부',
      team: 'IT팀',
      joinDate: '2020-01-01',
      bio: 'Meta-Drive 시스템 전체 관리자',
      phone: '02-1234-5678',
      // admin은 모든 프로젝트에 전체 권한
      projectAccess: {
        '1': { level: 'admin' as const, canUpload: true, canDelete: true, canEdit: true, canManage: true },
        '2': { level: 'admin' as const, canUpload: true, canDelete: true, canEdit: true, canManage: true },
        '3': { level: 'admin' as const, canUpload: true, canDelete: true, canEdit: true, canManage: true },
        '4': { level: 'admin' as const, canUpload: true, canDelete: true, canEdit: true, canManage: true }
      }
    }
  },
  '김철수': {
    password: '1',
    user: {
      name: '김철수',
      email: 'kim.cheolsu@hcompany.com',
      role: '설계 엔지니어',
      position: '팀장',
      chatbotRole: 'team_admin' as const,
      teamType: 'engineering' as const,
      licenseType: 'pro' as const,
      projectPermissions: 'readwrite' as const,
      department: '플랜트본부',
      team: '설계엔지니어링팀',
      joinDate: '2021-03-15',
      bio: '플랜트 설계 전문 엔지니어',
      phone: '02-1234-5679',
      // 김철수는 신재생에너지 플랜트, 해상풍력 발전소 A만 접근 가능
      projectAccess: {
        '1': { level: 'readwrite' as const, canUpload: true, canDelete: true, canEdit: true, canManage: false }, // 신재생에너지 플랜트
        '2': { level: 'readwrite' as const, canUpload: true, canDelete: true, canEdit: true, canManage: false }, // 해상풍력 발전소 A
        '3': { level: 'none' as const, canUpload: false, canDelete: false, canEdit: false, canManage: false }, // 수소생산시설 B
        '4': { level: 'none' as const, canUpload: false, canDelete: false, canEdit: false, canManage: false } // 태양광 단지 C
      }
    }
  },
  '박구매': {
    password: '1',
    user: {
      name: '박구매',
      email: 'park.procurement@hcompany.com',
      role: '구매 담당자',
      position: '대리',
      chatbotRole: 'user' as const,
      teamType: 'procurement' as const,
      licenseType: 'basic' as const,
      projectPermissions: 'readonly' as const,
      department: '구매본부',
      team: '플랜트구매팀',
      joinDate: '2022-07-01',
      bio: '자재 및 장비 구매 업무 담당',
      phone: '02-1234-5680',
      // 박구매는 프로젝트 권한 없음
      projectAccess: {
        '1': { level: 'none' as const, canUpload: false, canDelete: false, canEdit: false, canManage: false },
        '2': { level: 'none' as const, canUpload: false, canDelete: false, canEdit: false, canManage: false },
        '3': { level: 'none' as const, canUpload: false, canDelete: false, canEdit: false, canManage: false },
        '4': { level: 'none' as const, canUpload: false, canDelete: false, canEdit: false, canManage: false }
      }
    }
  }
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 1초 지연으로 로딩 시뮬레이션
    setTimeout(() => {
      const account = accounts[username as keyof typeof accounts];
      
      if (account && account.password === password) {
        onLogin(account.user);
      } else {
        setError('사용자명 또는 비밀번호가 올바르지 않습니다.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = (demoUser: keyof typeof accounts) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(accounts[demoUser].user);
      setIsLoading(false);
    }, 500);
  };

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">전체 관리자</Badge>;
      case 'readwrite':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">읽기/쓰기</Badge>;
      case 'readonly':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">읽기 전용</Badge>;
      default:
        return null;
    }
  };

  const getLicenseBadge = (license: string) => {
    return license === 'pro' ? (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pro</Badge>
    ) : (
      <Badge variant="secondary" className="bg-slate-100 text-slate-600">Basic</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* 좌측: 로그인 폼 */}
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">Meta-Drive</CardTitle>
              <CardDescription className="text-slate-600">
                중앙집중식 설계 데이터 허브에 로그인하세요
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700">사용자명</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="사용자명을 입력하세요"
                    className="bg-white/70 border-slate-200 focus:bg-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className="bg-white/70 border-slate-200 focus:bg-white pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 우측: 데모 계정 정보 */}
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">데모 계정</h2>
            <p className="text-slate-600">아래 계정들로 시스템을 체험해보세요</p>
          </div>

          <div className="grid gap-4">
            {/* Admin 계정 */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">admin</h3>
                      <p className="text-sm text-slate-600">경영지원본부 - IT팀</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/50 hover:bg-white border-slate-200"
                    onClick={() => handleDemoLogin('admin')}
                    disabled={isLoading}
                  >
                    로그인
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getPermissionBadge('admin')}
                  {getLicenseBadge('pro')}
                  <Badge variant="outline" className="text-xs">모든 프로젝트 접근</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  • 모든 프로젝트 관리 권한 • 사용자 관리 • AI 페르소나 생성/편집
                </p>
              </CardContent>
            </Card>

            {/* 김철수 계정 */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">김철수</h3>
                      <p className="text-sm text-slate-600">플랜트본부 - 설계엔지니어링팀</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/50 hover:bg-white border-slate-200"
                    onClick={() => handleDemoLogin('김철수')}
                    disabled={isLoading}
                  >
                    로그인
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getPermissionBadge('readwrite')}
                  {getLicenseBadge('pro')}
                  <Badge variant="outline" className="text-xs">2개 프로젝트</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  • 신재생에너지 플랜트, 해상풍력 발전소 A 접근 • Meta-Drawing 사용 가능
                </p>
              </CardContent>
            </Card>

            {/* 박구매 계정 */}
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">박구매</h3>
                      <p className="text-sm text-slate-600">구매본부 - 플랜트구매팀</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/50 hover:bg-white border-slate-200"
                    onClick={() => handleDemoLogin('박구매')}
                    disabled={isLoading}
                  >
                    로그인
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getPermissionBadge('readonly')}
                  {getLicenseBadge('basic')}
                  <Badge variant="outline" className="text-xs">프로젝트 권한 없음</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  • 프로젝트 접근 불가 • 파일 업로드/편집 불가 • Meta-Drawing 제한
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              모든 계정의 비밀번호는 <code className="bg-slate-100 px-2 py-1 rounded text-slate-700">1</code> 입니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}