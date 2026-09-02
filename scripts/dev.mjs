/**
 * Arranca API primero, espera health, luego worker y Client.
 * Evita ECONNREFUSED en SSR/proxy del dashboard.
 */
import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import { killDevPorts } from './kill-dev-ports.mjs';

const HEALTH_URL = process.env.API_HEALTH_URL ?? 'http://127.0.0.1:3001/api/v1/health';
const HEALTH_TIMEOUT_MS = Number(process.env.API_HEALTH_TIMEOUT_MS ?? 120000);
const WORKER_BUNDLE_TIMEOUT_MS = 90000;
const POLL_MS = 1000;

const API_DIR = join(import.meta.dirname, '../apps/api');
const WORKER_ENTRY = join(API_DIR, 'dist/src/worker.js');

const children = [];
let apiExitedEarly = false;
let webStarted = false;

function spawnDev(name, args, envExtra = {}) {
  const child = spawn('pnpm', args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...envExtra },
  });
  children.push(child);
  child.on('exit', (code, signal) => {
    if (name === 'api' && !webStarted) {
      apiExitedEarly = true;
    }
    if (signal) {
      console.log(`[dev] ${name} terminó por señal ${signal}`);
    } else if (code !== 0 && code !== null) {
      console.error(`[dev] ${name} salió con código ${code}`);
      shutdown(code ?? 1);
    }
  });
  return child;
}

function spawnWorker() {
  const child = spawn('node', ['--watch', 'dist/src/worker.js'], {
    cwd: API_DIR,
    stdio: 'inherit',
    env: { ...process.env, APP_MODE: 'worker' },
  });
  children.push(child);
  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[dev] worker terminó por señal ${signal}`);
    } else if (code !== 0 && code !== null) {
      console.error(
        `[dev] worker salió con código ${code}. Sin worker activo.`,
      );
    }
  });
  console.log(
    '[dev] Worker iniciado (APP_MODE=worker). Busca: [WorkerBootstrap] BullMQ workers running',
  );
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

async function waitForApi() {
  const start = Date.now();
  while (Date.now() - start < HEALTH_TIMEOUT_MS) {
    if (apiExitedEarly) {
      throw new Error(
        'La API terminó antes de estar lista. Cierra otras terminales con `pnpm dev` o libera el puerto 3001.',
      );
    }

    try {
      const response = await fetch(HEALTH_URL);
      if (response.ok) {
        const body = await response.json();
        if (body?.status === 'ok' || body?.status === 'degraded') {
          console.log(`[dev] API lista en ${HEALTH_URL}`);
          return;
        }
      }
    } catch {
      // API aún no escucha
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }

  throw new Error(
    `La API no respondió en ${HEALTH_TIMEOUT_MS}ms (${HEALTH_URL}). Cierra otras terminales con \`pnpm dev\` o libera el puerto 4000.`,
  );
}

async function waitForWorkerBundle() {
  const start = Date.now();
  while (Date.now() - start < WORKER_BUNDLE_TIMEOUT_MS) {
    try {
      await access(WORKER_ENTRY);
      console.log(`[dev] Worker bundle listo: ${WORKER_ENTRY}`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error('dist/src/worker.js no apareció. ¿La API watch compiló?');
}

async function main() {
  console.log('[dev] Liberando puertos 3000/3001...');
  await killDevPorts();

  console.log('[dev] Iniciando API (@elrincondelnini/api)...');
  spawnDev('api', ['--filter', '@elrincondelnini/api', 'start:dev'], { APP_MODE: 'api' });

  await waitForApi();
  await waitForWorkerBundle();

  console.log('[dev] Iniciando worker BullMQ (@elrincondelnini/api)...');
  console.log('[dev] Sin worker activo.');
  spawnWorker();

  console.log('[dev] Iniciando Web (@elrincondelnini/web)...');
  webStarted = true;
  spawnDev('web', ['--filter', '@elrincondelnini/web', 'dev']);
}

main().catch((err) => {
  console.error(`[dev] ${err instanceof Error ? err.message : String(err)}`);
  shutdown(1);
});
