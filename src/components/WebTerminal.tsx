'use client'

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

interface Command {
  id: string;
  name: string;
  description: string;
  example: string;
}

const SECURITY_COMMANDS: Command[] = [
  // Subdomain Discovery
  { id: 'subfinder', name: 'subfinder', description: 'Subdomain discovery tool', example: 'subfinder -d example.com -all' },
  { id: 'assetfinder', name: 'assetfinder', description: 'Find domains and subdomains', example: 'assetfinder example.com' },

  // HTTP Tools
  { id: 'httpx', name: 'httpx', description: 'HTTP toolkit for reconnaissance', example: 'echo example.com | httpx' },
  { id: 'httprobe', name: 'httprobe', description: 'Probe for working HTTP/HTTPS servers', example: 'echo example.com | httprobe' },

  // Web Crawling & URL Collection
  { id: 'katana', name: 'katana', description: 'Web crawler and spider', example: 'katana -u https://example.com -d 5' },
  { id: 'gau', name: 'gau', description: 'Get All URLs', example: 'echo example.com | gau' },

  // Vulnerability Scanning
  { id: 'nuclei', name: 'nuclei', description: 'Vulnerability scanner', example: 'nuclei -u https://example.com' },
  { id: 'nmap', name: 'nmap', description: 'Network discovery and security auditing', example: 'nmap -sV example.com' },

  // Web Fuzzing
  { id: 'ffuf', name: 'ffuf', description: 'Web fuzzer', example: 'ffuf -u https://example.com/FUZZ -w wordlist.txt' },

  // Port Scanning
  { id: 'masscan', name: 'masscan', description: 'Fast port scanner', example: 'masscan -p0-65535 example.com --rate 100000' },
  { id: 'naabu', name: 'naabu', description: 'Fast port scanner', example: 'naabu -list ip.txt -c 50' },

  // CMS Specific
  { id: 'wpscan', name: 'wpscan', description: 'WordPress security scanner', example: 'wpscan --url https://example.com' },

  // Parameter Discovery
  { id: 'arjun', name: 'arjun', description: 'HTTP parameter discovery', example: 'arjun -u https://example.com/endpoint.php' },

  // XSS Testing
  { id: 'dalfox', name: 'dalfox', description: 'XSS scanner', example: 'dalfox url https://example.com' },
  { id: 'gxss', name: 'gxss', description: 'XSS parameter discovery', example: 'echo "https://example.com/?q=test" | gxss' },
  { id: 'kxss', name: 'kxss', description: 'XSS finder', example: 'echo "https://example.com/?q=test" | kxss' },

  // Subdomain Takeover
  { id: 'subzy', name: 'subzy', description: 'Subdomain takeover checker', example: 'subzy run --targets subdomains.txt' },

  // Cloud Storage
  { id: 's3scanner', name: 's3scanner', description: 'S3 bucket scanner', example: 's3scanner scan -d example.com' },

  // URL Processing
  { id: 'uro', name: 'uro', description: 'URL reducer', example: 'cat urls.txt | uro' },
  { id: 'qsreplace', name: 'qsreplace', description: 'Query string replacer', example: 'cat urls.txt | qsreplace "FUZZ"' },

  // Network Tools
  { id: 'curl', name: 'curl', description: 'Transfer data from servers', example: 'curl -I https://example.com' },
  { id: 'wget', name: 'wget', description: 'Download files from web', example: 'wget https://example.com' },

  // System Tools
  { id: 'grep', name: 'grep', description: 'Search text patterns', example: 'cat file.txt | grep "pattern"' },
  { id: 'cat', name: 'cat', description: 'Display file contents', example: 'cat file.txt' },
  { id: 'echo', name: 'echo', description: 'Display text', example: 'echo "Hello World"' },
];

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
  exitCode?: number;
  error?: string;
}

export const WebTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const initTerminal = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Dynamically import xterm modules
        const { Terminal: XTerm } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');
        const { WebLinksAddon } = await import('@xterm/addon-web-links');
        const { SearchAddon } = await import('@xterm/addon-search');

        // Import CSS (try different path)
        try {
          await import('@xterm/xterm/css/xterm.css');
        } catch {
          // Fallback - CSS might be included by default
          console.log('XTerm CSS loaded via alternative method');
        }

        const term = new XTerm({
          theme: {
            background: '#0f172a',
            foreground: '#e2e8f0',
            cursor: '#22d3ee',
            selectionBackground: '#334155',
            black: '#0f172a',
            red: '#ef4444',
            green: '#10b981',
            yellow: '#f59e0b',
            blue: '#3b82f6',
            magenta: '#8b5cf6',
            cyan: '#06b6d4',
            white: '#f1f5f9',
            brightBlack: '#475569',
            brightRed: '#f87171',
            brightGreen: '#34d399',
            brightYellow: '#fbbf24',
            brightBlue: '#60a5fa',
            brightMagenta: '#a78bfa',
            brightCyan: '#22d3ee',
            brightWhite: '#ffffff'
          },
          fontFamily: 'JetBrains Mono, Monaco, "Courier New", monospace',
          fontSize: window.innerWidth < 768 ? 12 : 14,
          cursorBlink: true,
          cursorStyle: 'block',
          scrollback: 10000,
          tabStopWidth: 4,
          allowTransparency: true,
          convertEol: true,
          disableStdin: false,
          macOptionIsMeta: true,
        });

        const fitAddon = new FitAddon();
        const webLinksAddon = new WebLinksAddon();
        const searchAddon = new SearchAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(webLinksAddon);
        term.loadAddon(searchAddon);

        if (terminalRef.current) {
          term.open(terminalRef.current);
          fitAddon.fit();
        }

        // Enhanced welcome message
        const prompt = '\r\n\x1b[32mrunner@penquin\x1b[0m:\x1b[34m~/workspace\x1b[0m$ ';
        term.write('\x1b[36m╔══════════════════════════════════════════╗\x1b[0m\r\n');
        term.write('\x1b[36m║      🐧 Penquin Security Terminal       ║\x1b[0m\r\n');
        term.write('\x1b[36m║         Professional Bug Hunting        ║\x1b[0m\r\n');
        term.write('\x1b[36m╚══════════════════════════════════════════╝\x1b[0m\r\n');
        term.write('\x1b[33m⚡ Ready for reconnaissance and vulnerability assessment\x1b[0m\r\n');
        term.write('\x1b[90m• Type \'help\' to see available security tools\x1b[0m\r\n');
        term.write('\x1b[90m• Type \'install-tools\' to install all penetration testing tools\x1b[0m\r\n');
        term.write('\x1b[90m• Copy commands from Bug Hunting Toolkit and paste here\x1b[0m\r\n');
        term.write(prompt);

        let currentLine = '';
        let historyIndex = -1;
        const history: string[] = [];

        const executeCommand = async (command: string) => {
          if (!command.trim()) return;

          history.push(command);
          historyIndex = history.length;
          setCurrentCommand(command);
          setIsExecuting(true);

          // Add command to history immediately
          const newHistoryEntry: CommandHistory = {
            command: command.trim(),
            output: 'Executing...',
            timestamp: new Date(),
          };
          
          setCommandHistory(prev => [...prev, newHistoryEntry]);

          if (command.trim() === 'help') {
            const helpOutput = getHelpOutput();
            updateCommandHistory(command.trim(), helpOutput, 0);
          } else if (command.trim() === 'clear') {
            setCommandHistory([]);
            setIsExecuting(false);
            return;
          } else {
            try {
              const response = await fetch('/api/terminal', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  command: command.trim(),
                  autoInstall: command.trim() === 'install-tools'
                }),
              });

              if (response.ok) {
                const result = await response.json();
                updateCommandHistory(command.trim(), result.output || '', result.exitCode, result.error);
              } else {
                updateCommandHistory(command.trim(), '', undefined, `Failed to execute command (HTTP ${response.status})`);
              }
            } catch (error) {
              updateCommandHistory(command.trim(), '', undefined, `Network error: ${error}`);
            }
          }

          setIsExecuting(false);
          // Show new prompt in terminal
          term.write(`\r\n\x1b[32mrunner@penquin\x1b[0m:\x1b[34m~/workspace\x1b[0m$ `);
        };

        const updateCommandHistory = (command: string, output: string, exitCode?: number, error?: string) => {
          setCommandHistory(prev => {
            const newHistory = [...prev];
            const lastEntry = newHistory[newHistory.length - 1];
            if (lastEntry && lastEntry.command === command) {
              lastEntry.output = output;
              lastEntry.exitCode = exitCode;
              lastEntry.error = error;
            }
            return newHistory;
          });
        };

        const getHelpOutput = () => {
          const categories = {
            'Reconnaissance': ['subfinder', 'assetfinder', 'httpx', 'httprobe'],
            'Web Crawling': ['katana', 'gau'],
            'Vulnerability Scanning': ['nuclei', 'nmap'],
            'Web Fuzzing': ['ffuf'],
            'Port Scanning': ['naabu', 'masscan'],
            'Specialized Tools': ['wpscan', 'arjun', 'dalfox', 'subzy', 's3scanner']
          };

          let helpText = '🛡️  PENQUIN SECURITY ARSENAL\n\n';
          
          Object.entries(categories).forEach(([category, tools]) => {
            helpText += `${category}:\n`;
            tools.forEach(toolName => {
              const tool = SECURITY_COMMANDS.find(t => t.name === toolName);
              if (tool) {
                helpText += `  ${tool.name.padEnd(12)} - ${tool.description}\n`;
                helpText += `${' '.repeat(14)}Example: ${tool.example}\n`;
              }
            });
            helpText += '\n';
          });

          helpText += '🔧 System Commands: clear, ls, pwd, whoami, cat, grep, curl, wget\n';
          helpText += '🚀 Installation: install-tools (sets up all security tools)\n';
          helpText += '💡 Pro Tip: All tools execute with real output for actual penetration testing';
          
          return helpText;
        };

        term.onData(async (data) => {
          const code = data.charCodeAt(0);

          if (code === 13) { // Enter
            term.write('\r\n');
            await executeCommand(currentLine);
            currentLine = '';
          } else if (code === 127) { // Backspace
            if (currentLine.length > 0) {
              currentLine = currentLine.slice(0, -1);
              term.write('\b \b');
            }
          } else if (code === 27) { // Handle escape sequences (arrow keys, etc.)
            // Skip escape sequences for now
            return;
          } else if (code >= 32) { // Printable characters
            currentLine += data;
            term.write(data);
          }
        });

        // Handle resize
        const handleResize = () => {
          setTimeout(() => {
            fitAddon.fit();
            // Ensure terminal scrolls to bottom after resize
            term.scrollToBottom();
          }, 100);
        };

        window.addEventListener('resize', handleResize);
        setTerminal(term);
        setIsReady(true);

        return () => {
          window.removeEventListener('resize', handleResize);
          term.dispose();
        };
      } catch (error) {
        console.error('Failed to initialize terminal:', error);
      }
    };

    initTerminal();
  }, []);

  const executeCommand = async (command: string) => {
    if (!terminal) return;

    terminal.write(`> ${command}\r\n`);

    if (command === 'install-tools') {
      setIsInstalling(true);
    }

    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          command: command,
          autoInstall: command === 'install-tools'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.output) {
          // Apply enhanced color coding
          let coloredOutput = result.output;
          coloredOutput = coloredOutput.replace(/(\[✓ SUCCESS\]|\[INF\]|\[INFO\]|✅)/g, '\x1b[32m$1\x1b[0m');
          coloredOutput = coloredOutput.replace(/(\[⚠ WARNING\]|\[WRN\]|⚠️)/g, '\x1b[33m$1\x1b[0m');
          coloredOutput = coloredOutput.replace(/(\[✗ ERROR\]|\[ERR\]|\[CRITICAL\]|❌)/g, '\x1b[31m$1\x1b[0m');
          coloredOutput = coloredOutput.replace(/(\[ℹ INFO\]|\[FOUND\]|\[MEDIUM\]|\[HIGH\])/g, '\x1b[35m$1\x1b[0m');
          coloredOutput = coloredOutput.replace(/(https?:\/\/[^\s]+)/g, '\x1b[36m$1\x1b[0m');
          coloredOutput = coloredOutput.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, '\x1b[34m$1\x1b[0m');
          coloredOutput = coloredOutput.replace(/(🐧|🔧|📦|🔍|📊|🎯|🚀|⚡|🛡️|💡)/g, '\x1b[36m$1\x1b[0m');

          terminal.write(coloredOutput + '\r\n');
        }
        if (result.error) {
          terminal.write(`\x1b[31m❌ Error: ${result.error}\x1b[0m\r\n`);
        }
      } else {
        terminal.write(`\x1b[31m❌ Failed to execute command\x1b[0m\r\n`);
      }
    } catch (error) {
      terminal.write(`\x1b[31m❌ Network error: ${error}\x1b[0m\r\n`);
    } finally {
      if (command === 'install-tools') {
        setIsInstalling(false);
      }
    }

    terminal.write(`\r\n\x1b[32mrunner@penquin\x1b[0m:\x1b[34m~/workspace\x1b[0m$ `);
  };

  const installAllTools = async () => {
    if (!terminal || isInstalling) return;

    setIsInstalling(true);
    terminal.write('\r\n\x1b[33m🚀 Starting comprehensive security tools installation...\x1b[0m\r\n');
    terminal.write('\x1b[36m⏳ This process may take several minutes. Please be patient...\x1b[0m\r\n\r\n');

    await executeCommand('install-tools');
  };

  // Scroll to bottom when new command history is added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const formatOutput = (output: string) => {
    if (!output) return '';
    
    // Convert ANSI escape sequences to HTML spans for better display
    let formatted = output
      .replace(/\x1b\[[0-9;]*m/g, '') // Remove ANSI codes for now
      .replace(/\n/g, '\n');
    
    return formatted;
  };

  const getStatusColor = (exitCode?: number, error?: string) => {
    if (error) return 'text-red-400';
    if (exitCode === 0) return 'text-green-400';
    if (exitCode && exitCode > 0) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <div className="w-full h-full min-h-[800px] flex flex-col bg-slate-900 rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-200 font-semibold">🐧 Penquin Security Terminal</span>
        </div>
        <div className="flex items-center space-x-3">
          {isExecuting && (
            <span className="text-blue-400 text-sm animate-pulse">⚡ Executing...</span>
          )}
          <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => executeCommand('install-tools')}
            disabled={isExecuting}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
          >
            🚀 Install Tools
          </button>
          <button
            onClick={() => executeCommand('help')}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
          >
            📖 Help
          </button>
          <button
            onClick={() => executeCommand('clear')}
            className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded transition-colors"
          >
            🗑️ Clear
          </button>
          <button
            onClick={() => executeCommand('ls -la')}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded transition-colors"
          >
            📁 List Files
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Terminal Input Area */}
        <div className="bg-slate-900 border-b border-slate-700 p-4">
          <div className="mb-2">
            <h3 className="text-slate-300 text-sm font-medium mb-2">Command Input:</h3>
          </div>
          <div className="bg-black rounded-lg p-3 min-h-[200px]">
            <div
              ref={terminalRef}
              className="h-full w-full"
              style={{ minHeight: '150px' }}
            />
          </div>
        </div>

        {/* Output Window */}
        <div className="flex-1 bg-slate-800 p-4 min-h-0">
          <div className="mb-2">
            <h3 className="text-slate-300 text-sm font-medium">Command Output:</h3>
          </div>
          <div 
            ref={outputRef}
            className="bg-black rounded-lg p-4 h-full overflow-y-auto font-mono text-sm"
          >
            {commandHistory.length === 0 ? (
              <div className="text-slate-500 text-center py-8">
                <div className="text-4xl mb-2">🐧</div>
                <div>No commands executed yet</div>
                <div className="text-xs mt-2">Type 'help' to see available commands</div>
              </div>
            ) : (
              commandHistory.map((entry, index) => (
                <div key={index} className="mb-4 border-b border-slate-700 pb-4 last:border-b-0">
                  {/* Command Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <span className="text-white font-medium">{entry.command}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">
                        {entry.timestamp.toLocaleTimeString()}
                      </span>
                      {entry.exitCode !== undefined && (
                        <span className={`px-2 py-1 rounded ${getStatusColor(entry.exitCode, entry.error)}`}>
                          {entry.error ? '❌' : entry.exitCode === 0 ? '✅' : '⚠️'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Command Output */}
                  <div className="pl-4">
                    {entry.error ? (
                      <div className="text-red-400 bg-red-900/20 p-3 rounded border-l-4 border-red-400">
                        <div className="font-semibold mb-1">Error:</div>
                        <div>{entry.error}</div>
                      </div>
                    ) : entry.output === 'Executing...' ? (
                      <div className="text-blue-400 animate-pulse">⏳ Executing command...</div>
                    ) : (
                      <pre className="text-slate-300 whitespace-pre-wrap break-words bg-slate-900/50 p-3 rounded">
                        {formatOutput(entry.output)}
                      </pre>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800 px-4 py-2 border-t border-slate-700 text-xs text-slate-400">
        <div className="flex justify-between items-center">
          <span>
            {isExecuting ? 'Executing command...' : commandHistory.length > 0 ? `${commandHistory.length} commands executed` : 'Ready for commands'}
          </span>
          <span>{isReady ? 'Terminal Active' : 'Loading...'}</span>
        </div>
      </div>
    </div>
  );
};

export default WebTerminal;