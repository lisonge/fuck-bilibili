import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';
import unocss from 'unocss/vite';
import unocssInline from 'unocss-inline';

export default defineConfig({
  plugins: [
    unocss({ inspector: false }),
    unocssInline(),
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
