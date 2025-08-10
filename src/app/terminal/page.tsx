
import React from 'react';
import WebTerminal from '@/components/WebTerminal';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terminal - Penquin',
  description: 'Interactive web terminal with pre-installed security tools',
};

export default function TerminalPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-shrink-0">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Interactive Terminal</h1>
          <p className="text-muted-foreground">
            Execute security tools and commands directly in your browser. All tools from the toolkit are pre-installed and ready to use.
          </p>
        </div>
      </div>
      <div className="flex-1 container mx-auto px-4 pb-4">
        <WebTerminal />
      </div>
    </div>
  );
}
