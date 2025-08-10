import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Invalid command' }, { status: 400 });
    }

    // Handle tool installation command
    if (command.trim() === 'install-tools') {
      return new Promise((resolve) => {
        const scriptPath = path.join(process.cwd(), 'public', 'install-tools.sh');
        
        // First make script executable
        spawn('chmod', ['+x', scriptPath], {
          stdio: 'inherit'
        }).on('close', () => {
          
          const installProcess = spawn('sudo', ['bash', scriptPath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: { 
              ...process.env, 
              PATH: `${process.env.PATH}:/root/go/bin:/usr/local/go/bin`,
              GOPATH: '/root/go',
              GOROOT: '/usr/local/go',
              HOME: '/root'
            }
          });

          let output = '';
          let errorOutput = '';

          installProcess.stdout.on('data', (data) => {
            output += data.toString();
          });

          installProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
          });

          installProcess.on('close', (code) => {
            const combinedOutput = output + (errorOutput ? `\n${errorOutput}` : '');
            resolve(NextResponse.json({
              output: combinedOutput || 'Installation process completed',
              exitCode: code
            }));
          });

          installProcess.on('error', (error) => {
            resolve(NextResponse.json({
              output: `Installation error: ${error.message}\nTry running with sudo privileges.`,
              exitCode: 1
            }));
          });
        });
      });
    }

    // Enhanced command execution with proper environment
    return new Promise((resolve) => {
      const args = command.split(' ');
      const cmd = args[0];
      const cmdArgs = args.slice(1);

      // Set environment with Go path and other essential paths
      const env = {
        ...process.env,
        PATH: `${process.env.PATH}:/root/go/bin:/usr/local/go/bin:/usr/local/bin:/usr/bin:/bin`,
        GOPATH: '/root/go',
        GOROOT: '/usr/local/go',
        HOME: '/root',
        USER: 'root'
      };

      const childProcess = spawn(cmd, cmdArgs, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        env: env,
        cwd: process.cwd()
      });

      let output = '';
      let errorOutput = '';

      childProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      childProcess.on('close', (code) => {
        const finalOutput = output + (errorOutput ? `\n${errorOutput}` : '');
        resolve(NextResponse.json({
          output: finalOutput || `Command executed with exit code: ${code}`,
          exitCode: code
        }));
      });

      childProcess.on('error', (error) => {
        resolve(NextResponse.json({
          output: `Command error: ${error.message}`,
          exitCode: 1
        }));
      });

      // Handle command timeout
      setTimeout(() => {
        if (!childProcess.killed) {
          childProcess.kill();
          resolve(NextResponse.json({
            output: output + '\nCommand timed out after 30 seconds',
            exitCode: 124
          }));
        }
      }, 30000);
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute command' },
      { status: 500 }
    );
  }
}