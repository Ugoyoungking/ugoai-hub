
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mic, Paperclip, SendHorizontal } from 'lucide-react';
import { Plus } from 'lucide-react';

type FormValues = {
  message: string;
};

interface ChatFormProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatForm({ onSendMessage, isLoading }: ChatFormProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!data.message.trim()) return;
    onSendMessage(data.message);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl mx-auto">
        <div className="relative flex items-center rounded-2xl border bg-background shadow-sm">
            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
            </Button>
            <Textarea
                {...register('message')}
                placeholder="Ask anything..."
                className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0"
                rows={1}
                onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                }
                }}
            />
            <div className="flex items-center p-2">
                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                    <Mic className="h-5 w-5" />
                    <span className="sr-only">Use microphone</span>
                </Button>
                <Button type="submit" size="icon" disabled={isLoading} className="h-10 w-10 shrink-0">
                    {isLoading ? <Loader2 className="animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </div>
    </form>
  );
}
