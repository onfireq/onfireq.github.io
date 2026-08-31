import { fileURLToPath } from "node:url";
import { cloudflareTest } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

const wranglerConfigPath = fileURLToPath(new URL("../../wrangler.jsonc", import.meta.url));
process.env.ZHIHU_ACCESS_SECRET ??= "test-only-secret";

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: wranglerConfigPath },
      miniflare: {
        bindings: {
          ZHIHU_ACCESS_SECRET: "test-only-secret",
        },
      },
    }),
  ],
  test: {
    include: ["workers/zhihu-sync/test/**/*.spec.ts"],
  },
});
