import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "eve.integration.spec.ts",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:5173", channel: "chrome", viewport: { width: 1440, height: 900 } },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:5173/eve/v1/health",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
