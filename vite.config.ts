import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    server: {
      allowedHosts: [
        "periodically-airlines-menu-ancient.trycloudflare.com",
      ],
    },
  },
});