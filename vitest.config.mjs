import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.{js,jsx}", "scripts/**/*.test.js"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.js"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
