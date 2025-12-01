import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';
import { Search, Download, Printer, Copy, Filter, RefreshCw, ArrowLeft, Home, BarChart3, Package, Settings, FileText } from 'lucide-react';

interface ReportViewProps {
  reportType: string;
  onBack: () => void;
}

export function ReportView({ reportType, onBack }: ReportViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const reportData = {
    lineList: [
      { id: 'L001', lineNo: '1"-CS-001-A1B', from: 'P-101', to: 'V-101', size: '1"', material: 'CS', insulation: 'Yes', heatTracing: 'No', status: 'Active' },
      { id: 'L002', lineNo: '2"-CS-002-A1B', from: 'V-101', to: 'HE-101', size: '2"', material: 'CS', insulation: 'Yes', heatTracing: 'No', status: 'Active' },
      { id: 'L003', lineNo: '6"-CS-003-A1B', from: 'HE-101', to: 'T-101', size: '6"', material: 'CS', insulation: 'No', heatTracing: 'Yes', status: 'Design' },
      { id: 'L004', lineNo: '4"-SS-004-A1B', from: 'T-101', to: 'P-102', size: '4"', material: 'SS', insulation: 'Yes', heatTracing: 'No', status: 'Active' }
    ],
    itemList: [
      { id: 'I001', tag: 'P-101', description: 'Centrifugal Pump', type: 'Pump', material: 'CS', pressure: '10 bar', temperature: '80°C', qty: 1, status: 'Installed' },
      { id: 'I002', tag: 'HE-101', description: 'Shell & Tube Heat Exchanger', type: 'Heat Exchanger', material: 'CS', pressure: '16 bar', temperature: '150°C', qty: 1, status: 'Installed' },
      { id: 'I003', tag: 'V-101', description: 'Gate Valve', type: 'Valve', material: 'CS', pressure: '10 bar', temperature: '80°C', qty: 1, status: 'Installed' },
      { id: 'I004', tag: 'T-101', description: 'Storage Tank', type: 'Tank', material: 'CS', pressure: 'Atmospheric', temperature: '40°C', qty: 1, status: 'Design' }
    ],
    valveList: [
      { id: 'V001', tag: 'V-101', type: 'Gate Valve', size: '2"', material: 'CS', pressure: '10 bar', operator: 'Manual', location: 'Unit A', status: 'Active' },
      { id: 'V002', tag: 'V-102', type: 'Ball Valve', size: '1"', material: 'SS', pressure: '16 bar', operator: 'Pneumatic', location: 'Unit A', status: 'Active' },
      { id: 'V003', tag: 'V-103', type: 'Control Valve', size: '3"', material: 'CS', pressure: '10 bar', operator: 'Electric', location: 'Unit B', status: 'Design' },
      { id: 'V004', tag: 'V-104', type: 'Check Valve', size: '4"', material: 'CS', pressure: '16 bar', operator: 'Passive', location: 'Unit B', status: 'Active' }
    ],
    noteReport: [
      { id: 'N001', noteNo: 'NOTE-01', description: 'Design pressure based on ASME B31.3', category: 'Design', priority: 'High', date: '2024-01-15', author: '김철수' },
      { id: 'N002', noteNo: 'NOTE-02', description: 'Material selection requires approval', category: 'Engineering', priority: 'Medium', date: '2024-01-16', author: '박영희' },
      { id: 'N003', noteNo: 'NOTE-03', description: 'Insulation specification TBD', category: 'Construction', priority: 'Low', date: '2024-01-17', author: '이민수' },
      { id: 'N004', noteNo: 'NOTE-04', description: 'Hydro test pressure: 1.5 x design', category: 'Testing', priority: 'High', date: '2024-01-18', author: '최지영' }
    ]
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'lineList': return 'Line List';
      case 'itemList': return 'Item List';
      case 'valveList': return 'Valve List';
      case 'noteReport': return 'Note Report';
      default: return 'Report';
    }
  };

  const getReportIcon = () => {
    switch (reportType) {
      case 'lineList': return <BarChart3 className="w-4 h-4" />;
      case 'itemList': return <Package className="w-4 h-4" />;
      case 'valveList': return <Settings className="w-4 h-4" />;
      case 'noteReport': return <FileText className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getReportDescription = () => {
    switch (reportType) {
      case 'lineList': return '프로젝트의 배관 라인 목록을 확인하고 관리할 수 있습니다.';
      case 'itemList': return '프로젝트의 기자재 목록을 확인하고 관리할 수 있습니다.';
      case 'valveList': return '프로젝트의 밸브 목록을 확인하고 관리할 수 있습니다.';
      case 'noteReport': return '프로젝트의 설계 노트 및 검토 의견을 확인할 수 있습니다.';
      default: return '리포트 데이터를 확인하고 관리할 수 있습니다.';
    }
  };

  const getCurrentData = () => {
    switch (reportType) {
      case 'lineList': return reportData.lineList;
      case 'itemList': return reportData.itemList;
      case 'valveList': return reportData.valveList;
      case 'noteReport': return reportData.noteReport;
      default: return [];
    }
  };

  const filteredData = getCurrentData().filter(item => 
    Object.values(item).some(value => 
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(filteredData.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    console.log(`Exporting ${reportType} as ${format}`, { selectedItems: Array.from(selectedItems) });
    alert(`${getReportTitle()}을 ${format.toUpperCase()} 형식으로 내보내기 합니다.`);
  };

  const renderLineListColumns = () => (
    <TableRow>
      <TableHead className="w-12">
        <input 
          type="checkbox" 
          checked={selectedItems.size === filteredData.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      </TableHead>
      <TableHead>Line No</TableHead>
      <TableHead>From</TableHead>
      <TableHead>To</TableHead>
      <TableHead>Size</TableHead>
      <TableHead>Material</TableHead>
      <TableHead>Insulation</TableHead>
      <TableHead>Heat Tracing</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  );

  const renderLineListRow = (item: any) => (
    <TableRow key={item.id}>
      <TableCell>
        <input 
          type="checkbox" 
          checked={selectedItems.has(item.id)}
          onChange={(e) => handleItemSelect(item.id, e.target.checked)}
        />
      </TableCell>
      <TableCell className="font-medium">{item.lineNo}</TableCell>
      <TableCell>{item.from}</TableCell>
      <TableCell>{item.to}</TableCell>
      <TableCell>{item.size}</TableCell>
      <TableCell>{item.material}</TableCell>
      <TableCell>{item.insulation}</TableCell>
      <TableCell>{item.heatTracing}</TableCell>
      <TableCell>
        <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
          {item.status}
        </Badge>
      </TableCell>
    </TableRow>
  );

  const renderItemListColumns = () => (
    <TableRow>
      <TableHead className="w-12">
        <input 
          type="checkbox" 
          checked={selectedItems.size === filteredData.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      </TableHead>
      <TableHead>Tag</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Material</TableHead>
      <TableHead>Pressure</TableHead>
      <TableHead>Temperature</TableHead>
      <TableHead>Qty</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  );

  const renderItemListRow = (item: any) => (
    <TableRow key={item.id}>
      <TableCell>
        <input 
          type="checkbox" 
          checked={selectedItems.has(item.id)}
          onChange={(e) => handleItemSelect(item.id, e.target.checked)}
        />
      </TableCell>
      <TableCell className="font-medium">{item.tag}</TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell>{item.type}</TableCell>
      <TableCell>{item.material}</TableCell>
      <TableCell>{item.pressure}</TableCell>
      <TableCell>{item.temperature}</TableCell>
      <TableCell>{item.qty}</TableCell>
      <TableCell>
        <Badge variant={item.status === 'Installed' ? 'default' : 'secondary'}>
          {item.status}
        </Badge>
      </TableCell>
    </TableRow>
  );

  const renderValveListColumns = () => (
    <TableRow>
      <TableHead className="w-12">
        <input 
          type="checkbox" 
          checked={selectedItems.size === filteredData.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      </TableHead>
      <TableHead>Tag</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Size</TableHead>
      <TableHead>Material</TableHead>
      <TableHead>Pressure</TableHead>
      <TableHead>Operator</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  );

  const renderValveListRow = (item: any) => (
    <TableRow key={item.id}>
      <TableCell>
        <input 
          type="checkbox" 
          checked={selectedItems.has(item.id)}
          onChange={(e) => handleItemSelect(item.id, e.target.checked)}
        />
      </TableCell>
      <TableCell className="font-medium">{item.tag}</TableCell>
      <TableCell>{item.type}</TableCell>
      <TableCell>{item.size}</TableCell>
      <TableCell>{item.material}</TableCell>
      <TableCell>{item.pressure}</TableCell>
      <TableCell>{item.operator}</TableCell>
      <TableCell>{item.location}</TableCell>
      <TableCell>
        <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
          {item.status}
        </Badge>
      </TableCell>
    </TableRow>
  );

  const renderNoteReportColumns = () => (
    <TableRow>
      <TableHead className="w-12">
        <input 
          type="checkbox" 
          checked={selectedItems.size === filteredData.length}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      </TableHead>
      <TableHead>Note No</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Priority</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Author</TableHead>
    </TableRow>
  );

  const renderNoteReportRow = (item: any) => (
    <TableRow key={item.id}>
      <TableCell>
        <input 
          type="checkbox" 
          checked={selectedItems.has(item.id)}
          onChange={(e) => handleItemSelect(item.id, e.target.checked)}
        />
      </TableCell>
      <TableCell className="font-medium">{item.noteNo}</TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell>{item.category}</TableCell>
      <TableCell>
        <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}>
          {item.priority}
        </Badge>
      </TableCell>
      <TableCell>{item.date}</TableCell>
      <TableCell>{item.author}</TableCell>
    </TableRow>
  );

  const renderTableContent = () => {
    if (reportType === 'lineList') {
      return (
        <>
          <TableHeader>{renderLineListColumns()}</TableHeader>
          <TableBody>
            {filteredData.map(renderLineListRow)}
          </TableBody>
        </>
      );
    } else if (reportType === 'itemList') {
      return (
        <>
          <TableHeader>{renderItemListColumns()}</TableHeader>
          <TableBody>
            {filteredData.map(renderItemListRow)}
          </TableBody>
        </>
      );
    } else if (reportType === 'valveList') {
      return (
        <>
          <TableHeader>{renderValveListColumns()}</TableHeader>
          <TableBody>
            {filteredData.map(renderValveListRow)}
          </TableBody>
        </>
      );
    } else if (reportType === 'noteReport') {
      return (
        <>
          <TableHeader>{renderNoteReportColumns()}</TableHeader>
          <TableBody>
            {filteredData.map(renderNoteReportRow)}
          </TableBody>
        </>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/20">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm h-[50px]">
        <div className="flex items-center gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  onClick={onBack}
                  className="cursor-pointer flex items-center gap-1.5 breadcrumb-link hover:text-blue-600"
                >
                  <Home className="w-4 h-4 breadcrumb-icon breadcrumb-icon-inactive breadcrumb-icon-home" />
                  Meta-Drawing
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <span className="text-blue-600">
                    {getReportIcon()}
                  </span>
                  {getReportTitle()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <p className="text-slate-600 text-sm ml-2">
            {getReportDescription()}
          </p>
          <div className="flex items-center gap-2 ml-3">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">{filteredData.length}개 항목</Badge>
            {selectedItems.size > 0 && (
              <Badge className="bg-slate-800 text-white">{selectedItems.size}개 선택됨</Badge>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex flex-col gap-6 flex-1 min-h-0 p-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-slate-200">
          {/* 검색 및 필터 도구 */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-white/80 border-slate-200 focus:border-blue-300 focus:ring-blue-200"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('excel')}
                className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('pdf')}
                className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Printer className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleExport('csv')}
                className="bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              >
                <Copy className="w-4 h-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="flex-1 min-h-0 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm">
          <ScrollArea className="h-full">
            <Table>
              {renderTableContent()}
            </Table>
          </ScrollArea>
        </div>

        {/* 요약 정보 */}
        <div className="flex items-center justify-between text-sm text-slate-600 flex-shrink-0 bg-white/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200">
          <span className="font-medium">총 {filteredData.length}개 항목</span>
          {selectedItems.size > 0 && (
            <span className="font-medium bg-slate-800 text-white px-2 py-1 rounded-md">{selectedItems.size}개 항목이 선택됨</span>
          )}
        </div>
      </div>
    </div>
  );
}