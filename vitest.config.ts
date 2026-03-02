import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    reporters: ["default"]
  }
    globals: true,
    include: ["src/**/*.test.ts"],
    reporters: ["default"],
    passWithNoTests: false,
    isolate: true,
  },
})
