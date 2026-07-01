import { defineConfig } from "vitest/config";

// The calculation engine is pure TypeScript with no React/DOM dependencies,
// so the unit tests run in a plain Node environment.
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
