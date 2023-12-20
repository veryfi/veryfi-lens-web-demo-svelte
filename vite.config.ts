import { sveltekit } from "@sveltejs/kit/vite";
import { nodePolyfills} from 'vite-plugin-node-polyfills';
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    nodePolyfills(),
  ],
  ssr: {
    noExternal: ["veryfi-lens-wasm"],
  },
  resolve: {
    alias: {
      fs: 'browserify-fs',
      path: 'path-browserify',
      crypto: 'crypto-browserify'
    }
  }
});


