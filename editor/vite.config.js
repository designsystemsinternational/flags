import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import reactSvgPlugin from "vite-plugin-react-svg";

export default defineConfig({
  plugins: [
    reactRefresh(),
    reactSvgPlugin({
      defaultExport: "component",
      svgo: false,
    }),
  ],
});
