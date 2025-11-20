
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypingEffectProps {
  words: string[];
  className?: string;
}

export function TypingEffect({ words, className }: TypingEffectProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      if (text.length > 0) {
        const timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      if (text.length < currentWord.length) {
         const timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, 150);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [text, isDeleting, wordIndex, words]);

  return (
    <h1 className={cn("font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl", className)}>
      <span>The All-in-One AI Platform to </span>
      <span className="text-primary">{text}</span>
      <span className="animate-pulse">|</span>
    </h1>
  );
}
