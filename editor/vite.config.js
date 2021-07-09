import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import reactSvgPlugin from "vite-plugin-react-svg";

export default defineConfig({
  publicDir: "../flag",
  plugins: [reactRefresh(), reactSvgPlugin()],
});
