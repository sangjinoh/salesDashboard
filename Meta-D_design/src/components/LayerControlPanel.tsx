import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Eye, EyeOff, Layers, Settings, RefreshCw, Download } from 'lucide-react';

export interface LayerConfiguration {
  symbols: {
    visible: boolean;
    valve: boolean;
    fitting: boolean;
    ci: boolean;
    equipment: boolean;
    etc: boolean;
  };
  texts: {
    visible: boolean;
    lineNo: boolean;
    tagNo: boolean;
    ciNo: boolean;
    etc: boolean;
  };
  lines: {
    visible: boolean;
  };
}

interface LayerControlPanelProps {
  onClose: () => void;
  onLayerChange: (config: LayerConfiguration) => void;
}

export function LayerControlPanel({ onClose, onLayerChange }: LayerControlPanelProps) {
  const [layerConfig, setLayerConfig] = useState<LayerConfiguration>({
    symbols: { visible: true, valve: true, fitting: true, ci: true, equipment: true, etc: true },
    texts: { visible: true, lineNo: true, tagNo: true, ciNo: true, etc: true },
    lines: { visible: true }
  });

  const [customSettings, setCustomSettings] = useState({
    symbolOpacity: 100,
    textOpacity: 100,
    lineOpacity: 100,
    symbolSize: 100,
    textSize: 100,
    lineWidth: 100
  });

  const handleLayerToggle = (category: keyof LayerConfiguration, subcategory?: string) => {
    const newConfig = { ...layerConfig };
    
    if (subcategory) {
      // @ts-ignore
      newConfig[category][subcategory] = !newConfig[category][subcategory];
    } else {
      // @ts-ignore
      newConfig[category].visible = !newConfig[category].visible;
    }
    
    setLayerConfig(newConfig);
    onLayerChange(newConfig);
  };

  const handleQuickPreset = (preset: 'all' | 'symbols-only' | 'texts-only' | 'lines-only' | 'none') => {
    let newConfig: LayerConfiguration;
    
    switch (preset) {
      case 'all':
        newConfig = {
          symbols: { visible: true, valve: true, fitting: true, ci: true, equipment: true, etc: true },
          texts: { visible: true, lineNo: true, tagNo: true, ciNo: true, etc: true },
          lines: { visible: true }
        };
        break;
      case 'symbols-only':
        newConfig = {
          symbols: { visible: true, valve: true, fitting: true, ci: true, equipment: true, etc: true },
          texts: { visible: false, lineNo: false, tagNo: false, ciNo: false, etc: false },
          lines: { visible: false }
        };
        break;
      case 'texts-only':
        newConfig = {
          symbols: { visible: false, valve: false, fitting: false, ci: false, equipment: false, etc: false },
          texts: { visible: true, lineNo: true, tagNo: true, ciNo: true, etc: true },
          lines: { visible: false }
        };
        break;
      case 'lines-only':
        newConfig = {
          symbols: { visible: false, valve: false, fitting: false, ci: false, equipment: false, etc: false },
          texts: { visible: false, lineNo: false, tagNo: false, ciNo: false, etc: false },
          lines: { visible: true }
        };
        break;
      case 'none':
        newConfig = {
          symbols: { visible: false, valve: false, fitting: false, ci: false, equipment: false, etc: false },
          texts: { visible: false, lineNo: false, tagNo: false, ciNo: false, etc: false },
          lines: { visible: false }
        };
        break;
    }
    
    setLayerConfig(newConfig);
    onLayerChange(newConfig);
  };

  const getVisibleCount = (category: keyof LayerConfiguration) => {
    const config = layerConfig[category];
    if (typeof config === 'object' && 'visible' in config) {
      if (!config.visible) return 0;
      return Object.entries(config).filter(([key, value]) => key !== 'visible' && value).length;
    }
    return 0;
  };

  const saveCurrentSettings = () => {
    const settings = {
      layerConfig,
      customSettings,
      timestamp: new Date().toISOString()
    };
    console.log('Saving layer settings:', settings);
    alert('현재 레이어 설정이 저장되었습니다.');
  };

  const exportSettings = () => {
    const settings = {
      layerConfig,
      customSettings,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'layer-settings.json';
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            레이어 관리
          </DialogTitle>
          <DialogDescription>
            도면의 각 레이어를 세부적으로 제어하여 원하는 정보만 표시할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 flex-1 min-h-0">
          {/* 빠른 프리셋 */}
          <div className="space-y-3 flex-shrink-0">
            <h3 className="font-medium text-sm">빠른 설정</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={() => handleQuickPreset('all')}>
                전체 표시
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickPreset('symbols-only')}>
                심볼만
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickPreset('texts-only')}>
                텍스트만
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickPreset('lines-only')}>
                라인만
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickPreset('none')}>
                전체 숨김
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleLayerToggle('symbols')}>
                <RefreshCw className="w-4 h-4 mr-1" />
                초기화
              </Button>
            </div>
          </div>

          <Separator />

          {/* 상세 레이어 설정 */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-6 pr-4">
              {/* 심볼 레이어 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={layerConfig.symbols.visible}
                      onCheckedChange={() => handleLayerToggle('symbols')}
                    />
                    <Label className="font-medium">심볼</Label>
                    <Badge variant="outline" className="text-xs">
                      {getVisibleCount('symbols')}/5
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    {layerConfig.symbols.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>

                {layerConfig.symbols.visible && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">밸브</Label>
                      <Switch
                        checked={layerConfig.symbols.valve}
                        onCheckedChange={() => handleLayerToggle('symbols', 'valve')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">피팅</Label>
                      <Switch
                        checked={layerConfig.symbols.fitting}
                        onCheckedChange={() => handleLayerToggle('symbols', 'fitting')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">C&I</Label>
                      <Switch
                        checked={layerConfig.symbols.ci}
                        onCheckedChange={() => handleLayerToggle('symbols', 'ci')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">장비</Label>
                      <Switch
                        checked={layerConfig.symbols.equipment}
                        onCheckedChange={() => handleLayerToggle('symbols', 'equipment')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">기타</Label>
                      <Switch
                        checked={layerConfig.symbols.etc}
                        onCheckedChange={() => handleLayerToggle('symbols', 'etc')}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 텍스트 레이어 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={layerConfig.texts.visible}
                      onCheckedChange={() => handleLayerToggle('texts')}
                    />
                    <Label className="font-medium">텍스트</Label>
                    <Badge variant="outline" className="text-xs">
                      {getVisibleCount('texts')}/4
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    {layerConfig.texts.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>

                {layerConfig.texts.visible && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">라인 번호</Label>
                      <Switch
                        checked={layerConfig.texts.lineNo}
                        onCheckedChange={() => handleLayerToggle('texts', 'lineNo')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">태그 번호</Label>
                      <Switch
                        checked={layerConfig.texts.tagNo}
                        onCheckedChange={() => handleLayerToggle('texts', 'tagNo')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">C&I 번호</Label>
                      <Switch
                        checked={layerConfig.texts.ciNo}
                        onCheckedChange={() => handleLayerToggle('texts', 'ciNo')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">기타</Label>
                      <Switch
                        checked={layerConfig.texts.etc}
                        onCheckedChange={() => handleLayerToggle('texts', 'etc')}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* 라인 레이어 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={layerConfig.lines.visible}
                      onCheckedChange={() => handleLayerToggle('lines')}
                    />
                    <Label className="font-medium">라인</Label>
                  </div>
                  <Button variant="ghost" size="sm">
                    {layerConfig.lines.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* 하단 액션 버튼 */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={saveCurrentSettings}>
                <Settings className="w-4 h-4 mr-1" />
                설정 저장
              </Button>
              <Button variant="outline" size="sm" onClick={exportSettings}>
                <Download className="w-4 h-4 mr-1" />
                내보내기
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                취소
              </Button>
              <Button onClick={onClose}>
                적용
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}