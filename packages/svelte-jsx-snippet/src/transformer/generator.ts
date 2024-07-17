import g from "@babel/generator";
export const generate: typeof g =
  typeof g === "function" ? g : (g as any).default;
