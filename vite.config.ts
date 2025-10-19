import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://www.bilibili.com/favicon.ico',
        namespace: 'lisonge',
        match: ['https://space.bilibili.com/*'],
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
      server: { prefix: false },
    }),
  ],
  esbuild: {
    legalComments: 'none',
  },
});
