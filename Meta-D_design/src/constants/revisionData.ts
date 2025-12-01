import type { DrawingRevisionData } from '../types/revision';

// 업로드된 실제 P&ID 도면 이미지들
import pidDrawingRev1 from 'figma:asset/be6428dd388234d2076aad6dcdad8b2dcd4e6eff.png';
import pidDrawingRev2 from 'figma:asset/309c71e86b032c244f5e064a3aa2ca2e18e6b0ba.png';

export const MOCK_DRAWING_DATA: DrawingRevisionData[] = [
  {
    fileName: 'P&ID-001-Main-Process.pdf',
    status: 'modified',
    revisions: {
      'Rev.01': {
        lastModified: '2024-01-15 14:30:00',
        fileSize: '2.3MB',
        checksum: 'abc123def456',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev1
      },
      'Rev.02': {
        lastModified: '2024-01-18 09:15:00',
        fileSize: '2.4MB',
        checksum: 'def456ghi789',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev2
      },
      'Rev.03': {
        lastModified: '2024-01-20 16:45:00',
        fileSize: '2.5MB',
        checksum: 'ghi789jkl012',
        aiRecognitionStatus: 'processing',
        thumbnailUrl: pidDrawingRev2
      }
    }
  },
  {
    fileName: 'P&ID-002-Secondary-Loop.pdf',
    status: 'added',
    revisions: {
      'Rev.02': {
        lastModified: '2024-01-18 11:20:00',
        fileSize: '1.8MB',
        checksum: 'new123file456',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev2
      },
      'Rev.03': {
        lastModified: '2024-01-20 13:10:00',
        fileSize: '1.9MB',
        checksum: 'new123file789',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev1
      }
    }
  },
  {
    fileName: 'P&ID-003-Utility-Systems.pdf',
    status: 'unchanged',
    revisions: {
      'Rev.01': {
        lastModified: '2024-01-10 10:00:00',
        fileSize: '1.5MB',
        checksum: 'unchanged123same',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev1
      },
      'Rev.02': {
        lastModified: '2024-01-10 10:00:00',
        fileSize: '1.5MB',
        checksum: 'unchanged123same',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev1
      },
      'Rev.03': {
        lastModified: '2024-01-10 10:00:00',
        fileSize: '1.5MB',
        checksum: 'unchanged123same',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev1
      }
    }
  },
  {
    fileName: 'P&ID-Legacy-Process.pdf',
    status: 'removed',
    revisions: {
      'Rev.01': {
        lastModified: '2024-01-05 15:45:00',
        fileSize: '3.1MB',
        checksum: 'old123removed456',
        aiRecognitionStatus: 'completed',
        thumbnailUrl: pidDrawingRev2
      }
    }
  }
];

export const REVISION_OPTIONS = [
  { value: 'Rev.01', label: 'Rev.01' },
  { value: 'Rev.02', label: 'Rev.02' },
  { value: 'Rev.03', label: 'Rev.03' }
];