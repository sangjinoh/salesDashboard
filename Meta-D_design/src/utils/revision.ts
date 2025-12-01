import { Plus, Minus, GitCompare, CheckCircle, FileText, AlertCircle, Clock } from 'lucide-react';
import type { DrawingRevisionData, RevisionStats } from '../types/revision';

// 통계 계산
export const calculateRevisionStats = (data: DrawingRevisionData[]): RevisionStats => {
  const stats = {
    total: data.length,
    added: 0,
    removed: 0,
    modified: 0,
    unchanged: 0
  };

  data.forEach(drawing => {
    stats[drawing.status]++;
  });

  return stats;
};

// 필터된 데이터 가져오기
export const getFilteredDrawings = (data: DrawingRevisionData[], status?: string) => {
  if (!status || status === 'all') return data;
  return data.filter(drawing => drawing.status === status);
};

// 상태별 아이콘 가져오기
export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'added':
      return Plus;
    case 'removed':
      return Minus;
    case 'modified':
      return GitCompare;
    case 'unchanged':
      return CheckCircle;
    default:
      return FileText;
  }
};

// 상태별 배지 색상
export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'added':
      return 'default' as const;
    case 'removed':
      return 'destructive' as const;
    case 'modified':
      return 'secondary' as const;
    case 'unchanged':
      return 'outline' as const;
    default:
      return 'outline' as const;
  }
};

// AI 인식 상태 아이콘
export const getAIStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'processing':
      return Clock;
    case 'pending':
      return Clock;
    case 'error':
      return AlertCircle;
    default:
      return null;
  }
};

// 상태별 텍스트 라벨
export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'added':
      return '추가';
    case 'removed':
      return '제거';
    case 'modified':
      return '수정';
    case 'unchanged':
      return '동일';
    default:
      return status;
  }
};

// AI 상태별 텍스트 라벨
export const getAIStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return '완료';
    case 'processing':
      return '처리중';
    case 'pending':
      return '대기중';
    case 'error':
      return '오류';
    default:
      return status;
  }
};

// AI 상태별 색상 클래스
export const getAIStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-500';
    case 'processing':
      return 'text-blue-500';
    case 'pending':
      return 'text-gray-400';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
};