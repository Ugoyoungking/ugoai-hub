'use client';

import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { FileEdit, MessageSquare, Plus, Search } from 'lucide-react';
import type { ChatSession } from '../ai-chat';
import { Input } from '@/components/ui/input';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  isCollapsed: boolean;
}

export function ChatSidebar({
  sessions,
  activeChatId,
  onNewChat,
  onSelectChat,
  isCollapsed,
}: ChatSidebarProps) {
  const { user } = useAuth();

  return (
    <div className={cn("flex h-full flex-col border-r bg-muted/20 p-2", isCollapsed && "p-0 invisible")}>
      <div className="p-2">
        <Button onClick={onNewChat} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

       <div className="relative mt-2 mb-2 px-2">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-8" />
        </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {sessions.map(session => (
            <Button
              key={session.id}
              variant="ghost"
              className={cn(
                'w-full justify-start gap-2 truncate',
                activeChatId === session.id && 'bg-accent text-accent-foreground'
              )}
              onClick={() => onSelectChat(session.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{session.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-2">
        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted">
           <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL ?? ''} />
            <AvatarFallback>
              {user?.displayName ? user.displayName.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="text-sm font-semibold">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground">Free</p>
          </div>
          <Button variant="outline" size="sm">Upgrade</Button>
        </div>
      </div>
    </div>
  );
}
