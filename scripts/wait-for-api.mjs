/**
 * Poll del health de la API en desarrollo (informativo).
 */
const HEALTH_URL = process.env.API_HEALTH_URL ?? 'http://127.0.0.1:3001/api/v1/health';
const TIMEOUT_MS = Number(process.env.API_HEALTH_TIMEOUT_MS ?? 30000);
const INTERVAL_MS = 1000;

async function waitForApi() {
  const start = Date.now();

  while (Date.now() - start < TIMEOUT_MS) {
    try {
      const response = await fetch(HEALTH_URL);
      if (response.ok) {
        console.log(`[wait-for-api] API lista en ${HEALTH_URL}`);
        return 0;
      }
    } catch {
      // API aún no escucha
    }

    await new Promise((resolve) => setTimeout(resolve, INTERVAL_MS));
  }

  console.warn(
    `[wait-for-api] La API no respondió en ${TIMEOUT_MS}ms (${HEALTH_URL}). Revisa logs de @elrincondelnini/api:dev.`,
  );
  return 1;
}

process.exit(await waitForApi());
