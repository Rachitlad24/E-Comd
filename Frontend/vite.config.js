import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({ fastRefresh: false })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: process.env.PORT || 5173,
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ["e-comd-1.onrender.com"], // Allow your deployed Render domain
  }
})
