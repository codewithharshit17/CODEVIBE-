import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["__tests__/**/*.test.js"],
    env: {
      MONGOMS_SYSTEM_BINARY: "/opt/homebrew/bin/mongod",
    },
  },
});
