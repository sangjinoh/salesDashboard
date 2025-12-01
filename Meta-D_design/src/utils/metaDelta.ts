import { Badge } from '../components/ui/badge';
import { 
  CheckCircle,
  XCircle,
  Activity,
  AlertTriangle,
  Globe,
  Lock
} from 'lucide-react';

// 상태 배지 생성
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return Badge({ 
        children: [CheckCircle({ className: "w-3 h-3 mr-1" }), '활성'], 
        className: "bg-green-100 text-green-800" 
      });
    case 'inactive':
      return Badge({ 
        children: [XCircle({ className: "w-3 h-3 mr-1" }), '비활성'], 
        variant: "secondary" 
      });
    case 'training':
      return Badge({ 
        children: [Activity({ className: "w-3 h-3 mr-1" }), '학습중'], 
        className: "bg-blue-100 text-blue-800" 
      });
    case 'error':
      return Badge({ 
        children: [AlertTriangle({ className: "w-3 h-3 mr-1" }), '오류'], 
        className: "bg-red-100 text-red-800" 
      });
    default:
      return Badge({ children: status, variant: "outline" });
  }
};

// 가시성 배지 생성
export const getVisibilityBadge = (visibility: string) => {
  return visibility === 'public' ? (
    Badge({ 
      children: [Globe({ className: "w-3 h-3 mr-1" }), '공개'], 
      variant: "outline", 
      className: "text-blue-600" 
    })
  ) : (
    Badge({ 
      children: [Lock({ className: "w-3 h-3 mr-1" }), '비공개'], 
      variant: "outline", 
      className: "text-slate-600" 
    })
  );
};

// 로그 레벨 배지 생성
export const getLogLevelBadge = (level: string) => {
  switch (level) {
    case 'error': 
      return Badge({ 
        children: 'ERROR', 
        className: "bg-red-100 text-red-800" 
      });
    case 'warning': 
      return Badge({ 
        children: 'WARN', 
        className: "bg-yellow-100 text-yellow-800" 
      });
    case 'info': 
      return Badge({ 
        children: 'INFO', 
        className: "bg-blue-100 text-blue-800" 
      });
    default: 
      return Badge({ 
        children: level.toUpperCase(), 
        variant: "outline" 
      });
  }
};

// 페르소나 상태 토글
export const togglePersonaStatus = (personas: any[], personaId: string, setPersonas: (personas: any[]) => void) => {
  setPersonas(personas.map(p => 
    p.id === personaId 
      ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
      : p
  ));
};

// 사용자별 페르소나 필터링
export const filterUserPersonas = (personas: any[], isAdmin: boolean, user: any) => {
  if (isAdmin) {
    return personas;
  }
  return personas.filter(persona => 
    persona.createdBy === user.name || 
    persona.visibility === 'public' ||
    persona.allowedUsers.includes(user.name) || 
    (persona.allowedTeams.includes(user.team || '') && user.teamType === persona.teamType)
  );
};

// 검색 및 상태 필터링
export const filterPersonas = (personas: any[], searchQuery: string, statusFilter: string) => {
  return personas.filter(persona => {
    const matchesSearch = persona.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        persona.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || persona.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

// 로그 레벨 필터링
export const filterLogs = (logs: any[], logFilter: string) => {
  return logs.filter(log => {
    const matchesLevel = logFilter === 'all' || log.level === logFilter;
    return matchesLevel;
  });
};