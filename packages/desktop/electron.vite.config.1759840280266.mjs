// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";
var __electron_vite_injected_dirname = "Z:\\CodingProjects\\ipmc\\packages\\desktop";
var electron_vite_config_default = defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__electron_vite_injected_dirname, "src/main/index.ts")
        }
      }
    },
    plugins: [
      externalizeDepsPlugin()
    ]
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__electron_vite_injected_dirname, "src/preload/index.ts")
        },
        output: {
          format: "es"
        }
      }
    },
    plugins: [
      externalizeDepsPlugin()
    ]
  },
  renderer: {
    server: {
      port: 5174
    },
    build: {
      rollupOptions: {
        treeshake: true
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [
      //TODO: fix externalized dependencies
      //externalizeDepsPlugin(),
      react({
        babel: {
          plugins: [["module:@preact/signals-react-transform"]]
        }
      }),
      nodePolyfills({
        include: ["crypto", "buffer", "stream", "util"],
        globals: {
          Buffer: true,
          global: true,
          process: true
        },
        protocolImports: true
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
