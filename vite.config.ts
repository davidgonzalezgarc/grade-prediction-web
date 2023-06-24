import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import typescript from "@rollup/plugin-typescript"

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") }

  // https://vitejs.dev/config/
  return defineConfig({
    plugins: [react(), typescript()],
    define: {
      global: {},
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: process.env["MAIN-BACKEND.URL"],
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
