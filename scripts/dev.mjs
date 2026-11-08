import { spawn, execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendDir = path.join(root, 'backend');
const frontendDir = path.join(root, 'frontend');
const windows = process.platform === 'win32';
const ports = [7114, 5170, 5173];
let backend;
let frontend;
let stopping = false;

function cleanPath(value) {
  return String(value ?? '').toLowerCase().replaceAll('/', '\\');
}

function findListeners() {
  if (!windows) return [];

  const query = [
    '$ErrorActionPreference = "Stop"',
    '$ports = @(7114, 5170, 5173)',
    '$rows = @(foreach ($c in (Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue)) {',
    '  if ($ports -contains $c.LocalPort) {',
    '    $proc = Get-CimInstance Win32_Process -Filter ("ProcessId=" + $c.OwningProcess)',
    '    [PSCustomObject]@{ Port = $c.LocalPort; Pid = $c.OwningProcess; Name = $proc.Name; Command = $proc.CommandLine }',
    '  }',
    '})',
    '$rows | ConvertTo-Json -Compress',
  ].join('; ');

  const result = execFileSync('powershell.exe',
    ['-NoProfile', '-NonInteractive', '-Command', query],
    { encoding: 'utf8', windowsHide: true }).trim();

  if (!result) return [];
  const parsed = JSON.parse(result);
  return Array.isArray(parsed) ? parsed : [parsed];
}

function isOurApp(listener) {
  const command = cleanPath(listener.Command);
  const name = cleanPath(listener.Name);
  const port = Number(listener.Port);

  if ([7114, 5170].includes(port)) {
    return command.includes(cleanPath(backendDir)) &&
      command.includes('clinicmanagement.api');
  }
  if (port === 5173) {
    return name === 'node.exe' &&
      command.includes(cleanPath(frontendDir)) &&
      command.includes('vite');
  }
  return false;
}

function stopTree(pid) {
  if (!pid) return;
  if (windows) {
    spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'],
      { windowsHide: true, stdio: 'ignore' });
  } else {
    try { process.kill(pid, 'SIGTERM'); } catch {}
  }
}

function freeProjectPorts() {
  const listeners = findListeners();
  const blocked = listeners.filter(p => !isOurApp(p));
  if (blocked.length) {
    console.error('\n[Dev] Cổng đang bị ứng dụng khác sử dụng:');
    for (const item of blocked) {
      console.error('  Port ' + item.Port + ' | PID ' + item.Pid +
        ' | ' + (item.Name || 'Unknown'));
    }
    console.error('[Dev] Hãy đóng ứng dụng đang chiếm cổng rồi chạy lại.');
    process.exit(1);
  }

  const pids = [...new Set(listeners.map(p => Number(p.Pid)))];
  if (pids.length) {
    console.log('[Dev] Dừng phiên Backend/Frontend cũ của dự án...');
    for (const pid of pids) stopTree(pid);
    const remaining = findListeners().filter(p => ports.includes(Number(p.Port)));
    if (remaining.length) {
      console.error('[Dev] Cổng chưa được giải phóng. Hãy đóng Terminal chạy cũ.');
      process.exit(1);
    }
  }
}

function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  console.log('\n[Dev] Đang dừng Backend và Frontend...');
  stopTree(frontend?.pid);
  stopTree(backend?.pid);
  process.exitCode = code;
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

try {
  if (windows) freeProjectPorts();

  console.log('[Dev] Backend:  https://localhost:7114');
  console.log('[Dev] Frontend: http://localhost:5173');
  console.log('[Dev] Dừng cả hai bằng Ctrl+C.\n');

  backend = spawn('dotnet', ['watch', 'run', '--launch-profile', 'https'], {
    cwd: backendDir,
    stdio: 'inherit',
    env: { ...process.env, ASPNETCORE_ENVIRONMENT: 'Development' },
    windowsHide: false,
  });

  frontend = windows
    ? spawn('cmd.exe', ['/d', '/s', '/c', 'npm run dev -- --strictPort'], {
        cwd: frontendDir,
        stdio: 'inherit',
        env: { ...process.env, VITE_API_BASE_URL: 'https://localhost:7114' },
      })
    : spawn('npm', ['run', 'dev', '--', '--strictPort'], {
        cwd: frontendDir,
        stdio: 'inherit',
        env: { ...process.env, VITE_API_BASE_URL: 'https://localhost:7114' },
      });

  for (const [label, child] of [['Backend', backend], ['Frontend', frontend]]) {
    child.on('error', error => {
      console.error('[Dev] Không thể chạy ' + label + ': ' + error.message);
      shutdown(1);
    });
    child.on('exit', (code, signal) => {
      if (!stopping) {
        console.error('[Dev] ' + label + ' đã dừng (' + (signal || code) + ').');
        shutdown(code || 1);
      }
    });
  }
} catch (error) {
  console.error('[Dev] ' + error.message);
  shutdown(1);
}
