'use client';

import { useState } from 'react';
import { ChatSidebar } from '@/components/features/ai-chat/chat-sidebar';
import { ChatMessages } from '@/components/features/ai-chat/chat-messages';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}

// Mock initial chat sessions
const initialChatSessions: ChatSession[] = [
    { id: '1', title: 'Portfolio feedback and ideas', messages: [] },
    { id: '2', title: 'Building free school websites', messages: [] },
    { id: '3', title: 'Name inquiry response', messages: [] },
    { id: '4', title: 'UGO AI Studio review', messages: [] },
];


export default function AiChatFeature() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(initialChatSessions);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  const activeChat = chatSessions.find(session => session.id === activeChatId);

  const handleSendMessage = async (message: string) => {
    let currentChatId = activeChatId;
    let newChatCreated = false;

    // If there's no active chat, create a new one
    if (!currentChatId) {
      newChatCreated = true;
      currentChatId = uuidv4();
      const newChatSession: ChatSession = {
        id: currentChatId,
        title: message.substring(0, 40) + (message.length > 40 ? '...' : ''),
        messages: [],
      };
      setChatSessions(prev => [newChatSession, ...prev]);
      setActiveChatId(currentChatId);
    }
    
    // Add user message to the active chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatSessions(prev =>
      prev.map(session =>
        session.id === currentChatId
          ? { ...session, messages: [...session.messages, userMessage] }
          : session
      )
    );

    setIsLoading(true);

    // Prepare for streaming AI response
    const botMessage: ChatMessage = { role: 'model', content: '' };
     setChatSessions(prev =>
      prev.map(session =>
        session.id === currentChatId
          ? { ...session, messages: [...session.messages, botMessage] }
          : session
      )
    );
    
    try {
        const history = (newChatCreated ? [] : activeChat?.messages) || [];
        await generateChatResponse(
            { history, message },
            (chunk) => {
            setChatSessions(prev =>
                prev.map(session =>
                    session.id === currentChatId
                    ? {
                        ...session,
                        messages: session.messages.map((msg, index) =>
                        index === session.messages.length - 1
                            ? { ...msg, content: msg.content + chunk }
                            : msg
                        ),
                      }
                    : session
                )
            );
            }
        );
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get a response from the AI. Please try again.',
      });
       // Remove the optimistic bot message on error
        setChatSessions(prev =>
            prev.map(session =>
                session.id === currentChatId
                ? { ...session, messages: session.messages.slice(0, -1) }
                : session
            )
        );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
  };
  
  const selectChat = (id: string) => {
    setActiveChatId(id);
  };

  return (
    <div className={cn(
        "grid h-full rounded-lg border bg-background transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "grid-cols-[0px_1fr]" : "grid-cols-[260px_1fr]"
      )}>
      <ChatSidebar 
        sessions={chatSessions} 
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={selectChat}
        isCollapsed={isSidebarCollapsed}
      />
      <div className="relative flex h-full flex-col">
         <div className="absolute top-3 left-3 z-10">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
        <ChatMessages 
            messages={activeChat?.messages || []}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
