import { useState } from 'react';
import { MessageSquare, Plus, Trash2, ChevronRight, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatHistoryPanelProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatHistoryPanel({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
}: ChatHistoryPanelProps) {
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  // 세션을 날짜별로 그룹화
  const groupedSessions = sessions.reduce((groups, session) => {
    const today = new Date();
    const sessionDate = new Date(session.timestamp);
    
    let groupKey: string;
    
    // 오늘
    if (sessionDate.toDateString() === today.toDateString()) {
      groupKey = '오늘';
    }
    // 어제
    else if (
      sessionDate.toDateString() ===
      new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString()
    ) {
      groupKey = '어제';
    }
    // 이번 주
    else if (sessionDate > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      groupKey = '이번 주';
    }
    // 이번 달
    else if (
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    ) {
      groupKey = '이번 달';
    }
    // 그 외
    else {
      groupKey = `${sessionDate.getFullYear()}년 ${sessionDate.getMonth() + 1}월`;
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  const handleDelete = (sessionId: string) => {
    onDeleteSession(sessionId);
    setDeleteSessionId(null);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-gray-50">
        <h2 className="font-semibold text-gray-900">대화 히스토리</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewChat}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          새 대화
        </Button>
      </div>

      {/* 세션 목록 */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {Object.entries(groupedSessions).map(([groupName, groupSessions]) => (
            <div key={groupName} className="space-y-2">
              {/* 그룹 헤더 */}
              <div className="flex items-center gap-2 px-2 py-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase">
                  {groupName}
                </span>
              </div>

              {/* 세션 카드들 */}
              {groupSessions.map((session) => (
                <Card
                  key={session.id}
                  className={`p-3 cursor-pointer transition-all hover:shadow-md group relative ${
                    currentSessionId === session.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => onSessionSelect(session.id)}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        currentSessionId === session.id
                          ? 'text-blue-600'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-medium mb-1 truncate ${
                          currentSessionId === session.id
                            ? 'text-blue-900'
                            : 'text-gray-900'
                        }`}
                      >
                        {session.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        {session.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {session.messageCount}개 메시지
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {session.timestamp.toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    
                    {/* 삭제 버튼 */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>대화 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            이 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(session.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {currentSessionId === session.id && (
                      <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
              <p className="text-sm text-muted-foreground">대화 히스토리가 없습니다</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewChat}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
                새 대화 시작하기
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
