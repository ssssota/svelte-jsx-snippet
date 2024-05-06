import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/jsx-runtime.ts", "src/server.ts", "src/vite.ts"],
  format: "esm",
  clean: true,
  dts: true,
});
