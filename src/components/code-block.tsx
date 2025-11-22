
'use client';
import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <div className={cn('relative rounded-lg border bg-[#282c34] font-code', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <span className="text-xs font-semibold uppercase text-gray-400">{language}</span>
        <Button variant="ghost" size="icon" onClick={onCopy} className="h-8 w-8 text-gray-400 hover:bg-gray-700 hover:text-white">
          {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        customStyle={{ 
            margin: 0, 
            padding: '1rem',
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
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
