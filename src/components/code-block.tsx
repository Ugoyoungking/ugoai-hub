'use client';
import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'jsx', className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    toast({
      description: 'Code copied to clipboard.',
    });
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className={cn('relative rounded-lg border bg-secondary/50 font-code', className)}>
      <div className="absolute right-2 top-2">
        <Button variant="ghost" size="icon" onClick={onCopy}>
          {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
