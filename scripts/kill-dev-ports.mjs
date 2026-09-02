/**
 * Libera los puertos de dev (client + api) antes de `pnpm dev` en la raíz.
 * Evita EADDRINUSE cuando queda un proceso zombie de una sesión anterior.
 */
import { execSync } from 'node:child_process';

const PORTS = [3000, 3001];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortListening(port) {
  if (process.platform === 'win32') {
    try {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const portPattern = new RegExp(`:${port}\\s`);
      return output.split(/\r?\n/).some((line) => line.includes('LISTENING') && portPattern.test(line));
    } catch {
      return false;
    }
  }

  try {
    const output = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim();
    return Boolean(output);
  } catch {
    return false;
  }
}

function killPortWindows(port) {
  let output;
  try {
    output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
  } catch {
    return;
  }

  const portPattern = new RegExp(`:${port}\\s`);
  const pids = new Set();

  for (const line of output.split(/\r?\n/)) {
    if (!line.includes('LISTENING') || !portPattern.test(line)) continue;
    const pid = line.trim().split(/\s+/).at(-1);
    if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`[kill-dev-ports] Puerto ${port} liberado (PID ${pid})`);
    } catch {
      // proceso ya terminado
    }
  }
}

function killPortUnix(port) {
  let output;
  try {
    output = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).trim();
  } catch {
    return;
  }

  if (!output) return;

  for (const pid of output.split(/\s+/)) {
    try {
      execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      console.log(`[kill-dev-ports] Puerto ${port} liberado (PID ${pid})`);
    } catch {
      // proceso ya terminado
    }
  }
}

function killPortOnce(port) {
  if (process.platform === 'win32') {
    killPortWindows(port);
  } else {
    killPortUnix(port);
  }
}

export async function killDevPorts() {
  for (const port of PORTS) {
    killPortOnce(port);
  }

  await sleep(1000);

  for (const port of PORTS) {
    if (isPortListening(port)) {
      console.log(`[kill-dev-ports] Puerto ${port} aún ocupado, reintentando...`);
      killPortOnce(port);
      await sleep(500);
    }
  }
}

const isCli = process.argv[1]?.replace(/\\/g, '/').includes('kill-dev-ports');
if (isCli) {
  await killDevPorts();
}
