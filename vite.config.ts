import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const host = process.env.TAURI_DEV_HOST

const config = defineConfig({
  server: {
    host: host ?? "localhost",
    port: 3000,
    strictPort: true,
    // Allow Tauri to access the dev server from the Android device
    ...(host
      ? {
          hmr: {
            protocol: "ws",
            host,
            port: 3001,
          },
        }
      : {}),
  },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
