/**
 * Levanta Postgres y Redis para desarrollo local.
 * No aborta `pnpm dev` si Docker no está disponible.
 */
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const composeFile = path.join(rootDir, '__infra', 'docker', 'docker-compose.yml');

function run(command) {
  execSync(command, { stdio: 'inherit', cwd: rootDir });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealthy(service, timeoutMs = 30000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const output = execSync(
        `docker compose -f "${composeFile}" ps --format json ${service}`,
        { encoding: 'utf8', cwd: rootDir },
      ).trim();

      if (!output) {
        await sleep(1000);
        continue;
      }

      const lines = output.split(/\r?\n/).filter(Boolean);
      const healthy = lines.every((line) => {
        try {
          const row = JSON.parse(line);
          return row.Health === 'healthy' || row.State === 'running';
        } catch {
          return false;
        }
      });

      if (healthy) return true;
    } catch {
      // Docker aún arrancando
    }

    await sleep(1000);
  }

  return false;
}

async function main() {
  try {
    execSync('docker --version', { stdio: 'ignore' });
  } catch {
    console.warn(
      '[dev-infra] Docker no disponible. Levanta Postgres y Redis manualmente si la API falla al iniciar.',
    );
    return;
  }

  try {
    console.log('[dev-infra] Levantando Postgres y Redis...');
    run(`docker compose -f "${composeFile}" up -d postgres redis`);

    const ready = await waitForHealthy('postgres');
    if (!ready) {
      console.warn('[dev-infra] Postgres no reportó healthy a tiempo; la API puede tardar en conectar.');
    } else {
      console.log('[dev-infra] Postgres listo.');
    }

    const redisReady = await waitForHealthy('redis');
    if (!redisReady) {
      console.warn('[dev-infra] Redis no reportó healthy a tiempo; revisa BullMQ si la API falla.');
    } else {
      console.log('[dev-infra] Redis listo.');
    }
  } catch (err) {
    console.warn(
      `[dev-infra] No se pudo levantar infra local: ${err instanceof Error ? err.message : String(err)}`,
    );
    console.warn('[dev-infra] Continúa con pnpm dev; asegúrate de tener Postgres (5434) y Redis (6379).');
  }
}

await main();