'use client';
import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'jsx', className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            setHasCopied(true);
            toast({
                description: 'Code copied to clipboard.',
            });
            setTimeout(() => {
                setHasCopied(false);
            }, 2000);
        });
    }
  };

  return (
    <div className={cn('relative rounded-lg bg-[#1e1e1e] font-code', className)}>
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-700/50 rounded-t-lg">
          <span className="text-xs font-semibold uppercase text-gray-400">{language}</span>
        <Button variant="ghost" size="icon" onClick={onCopy} className="h-7 w-7 text-gray-400 hover:bg-gray-600 hover:text-white">
          {hasCopied ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ 
            margin: 0, 
            padding: '1rem',
            backgroundColor: 'transparent',
            width: '100%',
            overflow: 'auto',
        }}
        codeTagProps={{
          className: "text-sm"
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
