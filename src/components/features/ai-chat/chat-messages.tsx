
'use client';

import { BotIcon, Code, Database, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '../ai-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { ChatForm } from './chat-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UserAvatar = ({ user }: { user: any }) => (
  <Avatar className="h-8 w-8">
    <AvatarImage src={user?.photoURL ?? ''} />
    <AvatarFallback>
      {user?.displayName ? user.displayName.charAt(0) : <UserIcon size={16} />}
    </AvatarFallback>
  </Avatar>
);

const BotAvatar = () => (
  <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
    <AvatarFallback>
      <BotIcon size={16} />
    </AvatarFallback>
  </Avatar>
);

const StarterPromptCard = ({ icon, title, subtitle, onClick }: { icon: React.ReactNode, title: string, subtitle: string, onClick: () => void }) => (
    <Button variant="outline" className="h-auto w-full justify-start p-4 text-left" onClick={onClick}>
        <div className="flex items-start gap-4">
            {icon}
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
        </div>
    </Button>
);

interface ChatMessagesProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

export function ChatMessages({ messages, isLoading, onSendMessage }: ChatMessagesProps) {
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const starterPrompts = [
      {
          icon: <Database className="h-5 w-5" />,
          title: "Design a database schema",
          subtitle: "for an e-commerce app with products, orders, and users.",
      },
      {
          icon: <Code className="h-5 w-5" />,
          title: "Explain this code snippet",
          subtitle: "and suggest ways to improve its performance and readability.",
      },
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="mx-auto max-w-3xl space-y-8">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold">UGO AI Studio</h1>
                    <p className="text-muted-foreground">What can I help with?</p>
                 </div>
                 <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                    {starterPrompts.map(prompt => (
                        <StarterPromptCard 
                            key={prompt.title}
                            {...prompt}
                            onClick={() => onSendMessage(`${prompt.title} ${prompt.subtitle}`)}
                        />
                    ))}
                 </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && <BotAvatar />}
                <div
                  className={cn(
                    'max-w-2xl rounded-lg px-4 py-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary'
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-0">{line || ' '}</p>
                    ))}
                  </div>
                  {isLoading && index === messages.length - 1 && (
                    <span className="ml-1 inline-block h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
                  )}
                </div>
                {message.role === 'user' && <UserAvatar user={user} />}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="w-full px-4 pb-4">
        <ChatForm onSendMessage={onSendMessage} isLoading={isLoading} />
        <p className="text-center text-xs text-muted-foreground mt-2">
            UGO AI Studio can make mistakes. Consider checking important information.
        </p>
      </div>
    </>
  );
}
