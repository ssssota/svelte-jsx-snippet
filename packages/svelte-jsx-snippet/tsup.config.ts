import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts", "src/jsx-runtime/index.ts", "src/vite.ts"],
  clean: true,
  dts: true,
  outDir: "dist",
  format: "esm",
});
