import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    // Integrated persistence, election/succession, and Housing paths legitimately
    // cross the 5-second unit-test default in CI. Twenty seconds preserves hang detection
    // while covering observed runner variance in the authenticated tamper suites.
    testTimeout: 20_000,
    // The authenticated runtime suites load large fixed artifacts. Bounding fork
    // concurrency prevents worker-start starvation and cross-suite timeout
    // contention on the authenticated D-drive verification host.
    maxWorkers: 1,
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
