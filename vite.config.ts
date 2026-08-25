import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    // Integrated persistence, election/succession, and Housing paths legitimately
    // cross the 5-second unit-test default in CI. Ten seconds preserves hang detection.
    testTimeout: 10_000,
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
