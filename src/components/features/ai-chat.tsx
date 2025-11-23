'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Loader2, SendHorizontal, User as UserIcon, Bot as BotIcon } from 'lucide-react';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { z } from 'zod';

// Define the schema for a single chat message
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

type FormValues = {
  message: string;
};

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

export default function AiChatFeature() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.message.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: data.message };
    setMessages(prev => [...prev, userMessage]);
    reset();
    setIsLoading(true);

    const botMessage: ChatMessage = { role: 'model', content: '' };
    setMessages(prev => [...prev, botMessage]);

    try {
      await generateChatResponse(
        { history: messages, message: data.message },
        (chunk) => {
          setMessages(prev =>
            prev.map((msg, index) =>
              index === prev.length - 1 ? { ...msg, content: msg.content + chunk } : msg
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
      // Remove the empty bot message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full justify-center">
        <Card className="flex w-full max-w-4xl flex-col">
        <CardHeader className="text-center">
            <h1 className="text-2xl font-bold">AI Chat</h1>
            <p className="text-muted-foreground">Chat with our advanced AI assistant.</p>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
                {messages.length === 0 && (
                     <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                        <BotIcon className="h-16 w-16 text-muted-foreground" />
                        <p className="mt-4 font-semibold text-lg">How can I help you today?</p>
                     </div>
                )}
                {messages.map((message, index) => (
                <div
                    key={index}
                    className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                >
                    {message.role === 'model' && <BotAvatar />}
                    <div
                    className={cn(
                        'max-w-prose rounded-lg p-3 text-sm',
                        message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    )}
                    >
                    {/* Basic markdown simulation for newlines */}
                    {message.content.split('\n').map((line, i) => (
                      <p key={i}>{line || ' '}</p>
                    ))}
                    {isLoading && index === messages.length - 1 && (
                      <span className="ml-1 inline-block h-3 w-3 animate-pulse rounded-full bg-muted-foreground" />
                    )}
                    </div>
                    {message.role === 'user' && <UserAvatar user={user} />}
                </div>
                ))}
            </div>
            </ScrollArea>
        </CardContent>
        <CardFooter>
            <form onSubmit={handleSubmit(onSubmit)} className="flex w-full items-center gap-2">
            <Textarea
                {...register('message')}
                placeholder="Type your message here..."
                className="flex-1 resize-none"
                rows={1}
                onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                }
                }}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <SendHorizontal />}
                <span className="sr-only">Send</span>
            </Button>
            </form>
        </CardFooter>
        </Card>
    </div>
  );
}
