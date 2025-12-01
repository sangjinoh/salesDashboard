export const PROJECT_NAMES = {
  '1': '신재생에너지 플랜트',
  '2': '해상풍력 발전소 A',
  '3': '수소생산시설 B',
  '4': '태양광 단지 C',
} as const;

export const FOLDER_NAMES = {
  'general': 'Project General',
  'correspondence': 'Correspondence', 
  'engineering': 'Engineering',
  'procurement': 'Procurement',
  'construction': 'Construction',
  'partner': 'Partner',
  'workflow': 'Workflow',
  // 하위 폴더들
  'mechanical': 'Mechanical',
  'electrical': 'Electrical',
  'civil': 'Civil',
  'process': 'Process',
  'instrumentation': 'Instrumentation',
  'piping': 'Piping',
  'structural': 'Structural',
  'safety': 'Safety',
  'environmental': 'Environmental',
  'quality': 'Quality'
} as const;

export const DEFAULT_USER = {
  name: '김철수',
  email: 'kim.cs@metad.com',
  role: '설계 엔지니어',
  chatbotRole: 'system_admin', // 'system_admin', 'team_admin', 'user'
  teamType: 'engineering',
  licenseType: 'user',
  phone: '010-1234-5678',
  department: 'engineering',
  location: '서울본사',
  joinDate: '2023-03-15',
  bio: '플랜트 설계 전문가로 10년 이상의 경험을 보유하고 있습니다.'
} as const;

export const DEFAULT_USER_PROJECTS = ['1', '2'] as const;

export const MOCK_PROJECTS = [
  { id: '1', name: '신재생에너지 플랜트', color: 'bg-blue-500', status: 'active' as const },
  { id: '2', name: '해상풍력 발전소 A', color: 'bg-green-500', status: 'active' as const },
  { id: '3', name: '수소생산시설 B', color: 'bg-orange-500', status: 'active' as const },
  { id: '4', name: '태양광 단지 C', color: 'bg-purple-500', status: 'completed' as const }
] as const;