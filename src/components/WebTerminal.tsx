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

export const WebTerminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const initTerminal = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Dynamically import xterm modules
        const { Terminal: XTerm } = await import('xterm');
        const { FitAddon } = await import('xterm-addon-fit');
        const { WebLinksAddon } = await import('xterm-addon-web-links');
        const { SearchAddon } = await import('xterm-addon-search');

        // Import CSS
        await import('xterm/css/xterm.css');

        const term = new XTerm({
          theme: {
            background: '#0f172a',
            foreground: '#e2e8f0',
            cursor: '#22d3ee',
            selection: '#334155',
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

          if (command.trim() === 'help') {
            term.write('\r\n\x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m\r\n');
            term.write('\x1b[36m║                🛡️  PENQUIN SECURITY ARSENAL               ║\x1b[0m\r\n');
            term.write('\x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m\r\n');

            const categories = {
              'Reconnaissance': ['subfinder', 'assetfinder', 'httpx', 'httprobe'],
              'Web Crawling': ['katana', 'gau'],
              'Vulnerability Scanning': ['nuclei', 'nmap'],
              'Web Fuzzing': ['ffuf'],
              'Port Scanning': ['naabu', 'masscan'],
              'Specialized Tools': ['wpscan', 'arjun', 'dalfox', 'subzy', 's3scanner']
            };

            Object.entries(categories).forEach(([category, tools]) => {
              term.write(`\r\n\x1b[35m${category}:\x1b[0m\r\n`);
              tools.forEach(toolName => {
                const tool = SECURITY_COMMANDS.find(t => t.name === toolName);
                if (tool) {
                  term.write(`  \x1b[32m${tool.name.padEnd(12)}\x1b[0m - ${tool.description}\r\n`);
                  term.write(`  \x1b[90m${' '.repeat(14)}Example: ${tool.example}\x1b[0m\r\n`);
                }
              });
            });

            term.write('\r\n\x1b[33m🔧 System Commands:\x1b[0m clear, ls, pwd, whoami, cat, grep, curl, wget\r\n');
            term.write('\x1b[33m🚀 Installation:\x1b[0m install-tools (sets up all security tools)\r\n');
            term.write('\x1b[36m💡 Pro Tip:\x1b[0m All tools execute with real output for actual penetration testing\x1b[0m\r\n');

          } else if (command.trim() === 'clear') {
            term.clear();
            return; // Don't show prompt after clear
          } else {
            // Show command being executed
            term.write(`\r\n\x1b[90m> ${command}\x1b[0m\r\n`);

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
                if (result.output) {
                  // Enhanced color coding for better readability
                  let coloredOutput = result.output;

                  // Status indicators
                  coloredOutput = coloredOutput.replace(/(\[✓ SUCCESS\]|\[INF\]|\[INFO\]|✅)/g, '\x1b[32m$1\x1b[0m');
                  coloredOutput = coloredOutput.replace(/(\[⚠ WARNING\]|\[WRN\]|⚠️)/g, '\x1b[33m$1\x1b[0m');
                  coloredOutput = coloredOutput.replace(/(\[✗ ERROR\]|\[ERR\]|\[CRITICAL\]|❌)/g, '\x1b[31m$1\x1b[0m');
                  coloredOutput = coloredOutput.replace(/(\[ℹ INFO\]|\[FOUND\]|\[MEDIUM\]|\[HIGH\])/g, '\x1b[35m$1\x1b[0m');

                  // URLs and domains
                  coloredOutput = coloredOutput.replace(/(https?:\/\/[^\s]+)/g, '\x1b[36m$1\x1b[0m');
                  coloredOutput = coloredOutput.replace(/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g, '\x1b[36m$1\x1b[0m');

                  // IP addresses
                  coloredOutput = coloredOutput.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, '\x1b[34m$1\x1b[0m');

                  // Ports
                  coloredOutput = coloredOutput.replace(/(:(\d{1,5}))/g, '\x1b[35m$1\x1b[0m');

                  // File paths
                  coloredOutput = coloredOutput.replace(/(\/[^\s]+)/g, '\x1b[90m$1\x1b[0m');

                  // Emojis and special characters
                  coloredOutput = coloredOutput.replace(/(🐧|🔧|📦|🔍|📊|🎯|🚀|⚡|🛡️|💡)/g, '\x1b[36m$1\x1b[0m');

                  term.write(coloredOutput);

                  // Add separator for better readability
                  if (!coloredOutput.endsWith('\n')) {
                    term.write('\r\n');
                  }
                }

                if (result.error) {
                  term.write(`\x1b[31m❌ Error: ${result.error}\x1b[0m\r\n`);
                  term.write(`\x1b[90m💡 Tip: Try 'install-tools' first, or check if the command exists\x1b[0m\r\n`);
                }

                // Show execution status
                if (result.exitCode !== undefined) {
                  if (result.exitCode === 0) {
                    term.write(`\x1b[32m✓ Command completed successfully\x1b[0m\r\n`);
                  } else {
                    term.write(`\x1b[33m⚠ Command finished with exit code ${result.exitCode}\x1b[0m\r\n`);
                  }
                }

              } else {
                term.write(`\x1b[31m❌ Failed to execute command (HTTP ${response.status})\x1b[0m\r\n`);
                term.write(`\x1b[90m💡 Try refreshing the page or check your network connection\x1b[0m\r\n`);
              }
            } catch (error) {
              term.write(`\x1b[31m❌ Network error: ${error}\x1b[0m\r\n`);
              term.write(`\x1b[90m💡 Check your internet connection and try again\x1b[0m\r\n`);
            }
          }

          // Show new prompt
          term.write(`\r\n\x1b[32mrunner@penquin\x1b[0m:\x1b[34m~/workspace\x1b[0m$ `);
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

  return (
    <div className="w-full h-full min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex flex-col bg-slate-900 rounded-lg overflow-hidden shadow-2xl touch-manipulation">
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-slate-300 text-sm font-medium">🐧 Penquin Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          {isInstalling && (
            <span className="text-orange-400 text-xs animate-pulse">Installing tools...</span>
          )}
          <span className="text-slate-400 text-xs hidden md:block">Professional Security Environment</span>
          <div className={`w-2 h-2 rounded-full animate-pulse ${isReady ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex-shrink-0">
        <div className="flex flex-wrap gap-1 md:gap-2">
          <button
            onClick={installAllTools}
            disabled={isInstalling}
            className={`px-2 md:px-3 py-1 md:py-2 font-semibold text-xs md:text-sm rounded transition-colors ${
              isInstalling 
                ? 'bg-orange-700 text-orange-100 cursor-not-allowed animate-pulse' 
                : 'bg-green-700 hover:bg-green-600 text-green-100 animate-pulse'
            }`}
          >
            {isInstalling ? '⏳ Installing...' : '🚀 Install All Tools'}
          </button>
          <button
            onClick={() => executeCommand('clear')}
            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => executeCommand('help')}
            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
          >
            Help
          </button>
          <button
            onClick={() => executeCommand('ls -la')}
            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors hidden md:block"
          >
            List Files
          </button>
          <button
            onClick={() => executeCommand('subfinder -d bugcrowd.com')}
            className="px-2 py-1 bg-blue-700 hover:bg-blue-600 text-blue-100 text-xs rounded transition-colors hidden lg:block"
          >
            Demo: Subfinder
          </button>
          <button
            onClick={() => executeCommand('nuclei -u https://scanme.nmap.org')}
            className="px-2 py-1 bg-purple-700 hover:bg-purple-600 text-purple-100 text-xs rounded transition-colors hidden lg:block"
          >
            Demo: Nuclei
          </button>
          <button
            onClick={() => executeCommand('echo "hackthebox.com" | httpx')}
            className="px-2 py-1 bg-cyan-700 hover:bg-cyan-600 text-cyan-100 text-xs rounded transition-colors hidden xl:block"
          >
            Demo: httpx
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div className="flex-1 relative min-h-0">
        <div
          ref={terminalRef}
          className="absolute inset-0 p-2 md:p-4"
          style={{ 
            height: '100%', 
            width: '100%'
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-slate-800 px-4 py-1 border-t border-slate-700 flex-shrink-0">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span className="hidden md:block">
            {isInstalling ? 'Installing security tools...' : 'Ready - Professional penetration testing environment'}
          </span>
          <span className="md:hidden">
            {isInstalling ? 'Installing...' : 'Ready'}
          </span>
          <span>{isReady ? 'Terminal Active' : 'Loading...'}</span>
        </div>
      </div>
    </div>
  );
};

export default WebTerminal;