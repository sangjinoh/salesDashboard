import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Edit3, Save, X, Copy, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface ObjectProperty {
  key: string;
  label: string;
  value: string | number;
  type: 'text' | 'number' | 'select' | 'readonly';
  options?: string[];
  confidence?: number;
  isModified?: boolean;
}

interface DrawingObject {
  id: string;
  type: 'symbol' | 'text' | 'line' | 'equipment';
  name: string;
  confidence: number;
  status: 'verified' | 'needs-review' | 'error';
  properties: ObjectProperty[];
  connections?: string[];
  metadata: {
    recognizedAt: string;
    lastModified: string;
    modifiedBy: string;
  };
}

interface ObjectPropertiesProps {
  selectedObjectId?: string;
  onPropertyChange: (objectId: string, propertyKey: string, value: string | number) => void;
  onObjectVerify: (objectId: string) => void;
  className?: string;
}

export function ObjectProperties({ 
  selectedObjectId, 
  onPropertyChange, 
  onObjectVerify,
  className = '' 
}: ObjectPropertiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperties, setEditedProperties] = useState<Record<string, string | number>>({});

  // Mock object data
  const mockObject: DrawingObject | null = selectedObjectId ? {
    id: selectedObjectId,
    type: 'equipment',
    name: 'Heat Exchanger HE-101',
    confidence: 0.95,
    status: 'needs-review',
    properties: [
      { key: 'tag', label: '태그명', value: 'HE-101', type: 'text', confidence: 0.98 },
      { key: 'type', label: '장비 유형', value: 'Shell & Tube', type: 'select', options: ['Shell & Tube', 'Plate', 'Air Cooled'], confidence: 0.92 },
      { key: 'material', label: '재질', value: 'Carbon Steel', type: 'text', confidence: 0.88 },
      { key: 'design_pressure', label: '설계압력', value: '10.5', type: 'number', confidence: 0.85 },
      { key: 'design_temp', label: '설계온도', value: '150', type: 'number', confidence: 0.90 },
      { key: 'duty', label: '열부하', value: '1500', type: 'number', confidence: 0.82 },
      { key: 'area', label: '전열면적', value: '85.5', type: 'number', confidence: 0.87 },
      { key: 'drawing_ref', label: '도면참조', value: 'DWG-HE-101-001', type: 'readonly', confidence: 1.0 }
    ],
    connections: ['P-101', 'V-101', 'TI-101'],
    metadata: {
      recognizedAt: '2024-01-15 14:30:25',
      lastModified: '2024-01-15 15:45:12',
      modifiedBy: '김철수'
    }
  } : null;

  const handleEdit = () => {
    setIsEditing(true);
    const initial = mockObject?.properties.reduce((acc, prop) => {
      acc[prop.key] = prop.value;
      return acc;
    }, {} as Record<string, string | number>) || {};
    setEditedProperties(initial);
  };

  const handleSave = () => {
    if (mockObject) {
      Object.entries(editedProperties).forEach(([key, value]) => {
        onPropertyChange(mockObject.id, key, value);
      });
    }
    setIsEditing(false);
    setEditedProperties({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperties({});
  };

  const handleVerify = () => {
    if (mockObject) {
      onObjectVerify(mockObject.id);
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge variant="default" className="text-xs">높음</Badge>;
    if (confidence >= 0.7) return <Badge variant="secondary" className="text-xs">보통</Badge>;
    return <Badge variant="destructive" className="text-xs">낮음</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (!mockObject) {
    return (
      <div className={`bg-white border-l border-border ${className}`}>
        <div className="p-4 text-center text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <Edit3 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="font-medium">객체를 선택하세요</p>
          <p className="text-sm mt-1">도면에서 객체를 클릭하면 상세 정보가 표시됩니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-l border-border ${className}`}>
      {/* 헤더 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon(mockObject.status)}
              <h3 className="font-semibold text-sm">{mockObject.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{mockObject.type}</Badge>
              {getConfidenceBadge(mockObject.confidence)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleEdit}>
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleVerify}>
                  검증
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 속성 탭 */}
      <Tabs defaultValue="properties" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="properties" className="text-xs">속성</TabsTrigger>
          <TabsTrigger value="connections" className="text-xs">연결</TabsTrigger>
          <TabsTrigger value="metadata" className="text-xs">메타데이터</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="properties" className="p-4 space-y-4 m-0">
            {mockObject.properties.map((property) => (
              <div key={property.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">{property.label}</Label>
                  {property.confidence && property.confidence < 0.9 && (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-yellow-600" />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(property.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {isEditing && property.type !== 'readonly' ? (
                  property.type === 'select' ? (
                    <select
                      className="w-full px-3 py-2 text-sm border border-border rounded-md"
                      value={editedProperties[property.key] || property.value}
                      onChange={(e) => setEditedProperties(prev => ({
                        ...prev,
                        [property.key]: e.target.value
                      }))}
                    >
                      {property.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={property.type === 'number' ? 'number' : 'text'}
                      value={editedProperties[property.key] || property.value}
                      onChange={(e) => setEditedProperties(prev => ({
                        ...prev,
                        [property.key]: property.type === 'number' ? 
                          parseFloat(e.target.value) || 0 : e.target.value
                      }))}
                      className="text-sm"
                    />
                  )
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 flex-1">
                      {property.value}
                      {property.type === 'number' && property.key.includes('pressure') && ' bar'}
                      {property.type === 'number' && property.key.includes('temp') && ' °C'}
                      {property.type === 'number' && property.key.includes('duty') && ' kW'}
                      {property.type === 'number' && property.key.includes('area') && ' m²'}
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="connections" className="p-4 space-y-3 m-0">
            <div>
              <Label className="text-xs font-medium mb-2 block">연결된 장비</Label>
              <div className="space-y-2">
                {mockObject.connections?.map((connection) => (
                  <div key={connection} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{connection}</span>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metadata" className="p-4 space-y-3 m-0">
            <div className="space-y-3 text-sm">
              <div>
                <Label className="text-xs font-medium">인식 시간</Label>
                <p className="text-muted-foreground mt-1">{mockObject.metadata.recognizedAt}</p>
              </div>
              <div>
                <Label className="text-xs font-medium">마지막 수정</Label>
                <p className="text-muted-foreground mt-1">{mockObject.metadata.lastModified}</p>
              </div>
              <div>
                <Label className="text-xs font-medium">수정자</Label>
                <p className="text-muted-foreground mt-1">{mockObject.metadata.modifiedBy}</p>
              </div>
              <div>
                <Label className="text-xs font-medium">전체 신뢰도</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${mockObject.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">{Math.round(mockObject.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}