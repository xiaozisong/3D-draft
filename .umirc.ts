import { defineConfig } from "umi";

export default defineConfig({
  hash: true,
  routes: [
    { path: "/", component: "index" },
    { path: "/docs", component: "docs" },
  ],
  define: {
    'process.env.VERSION': '0.0.2'
  },
  npmClient: 'pnpm',
});
