import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();
export const isDevMode = process.env.DEV_MODE === "true";

export default defineConfig({
  testDir: "./.",
  fullyParallel: true,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    baseURL: process.env.PREPROD,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
