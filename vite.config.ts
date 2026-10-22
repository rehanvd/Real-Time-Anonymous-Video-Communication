import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import basicSsl from "@vitejs/plugin-basic-ssl";
import os from "os";

// This machine's LAN IPv4, so a browser opened via localhost can still reach the
// local TURN server (scripts/turn-server.mjs) on an address other devices can use
const lanIp =
  Object.entries(os.networkInterfaces())
    .filter(([name]) => !/vEthernet|VirtualBox|VMware|WSL|Loopback|Bluetooth/i.test(name))
    .flatMap(([, addrs]) => addrs ?? [])
    .find((a) => a.family === "IPv4" && !a.internal)?.address ?? "";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Local backend (docker compose in the backend repo), used when .env points at /api/*.
    // Going through the dev server means other devices only need this one port.
    proxy: {
      "/api/matching": {
        target: "http://127.0.0.1:8000",
        ws: true,
        rewrite: (p) => p.replace(/^\/api\/matching/, ""),
      },
      "/api/signalling": {
        target: "http://127.0.0.1:8001",
        ws: true,
        rewrite: (p) => p.replace(/^\/api\/signalling/, ""),
      },
    },
  },
  define: {
    global: "globalThis",
    __LAN_IP__: JSON.stringify(lanIp),
  },
  // `npm run dev:lan` serves over HTTPS so camera/mic work on other devices on the network
  plugins: [react(), mode === "development" && componentTagger(), mode === "lan" && basicSsl()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
