import { defineConfig } from "umi";

export default defineConfig({
  hash: true,
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  define: {
    VERSION: '0.0.1',
  },
  npmClient: 'pnpm',
});
