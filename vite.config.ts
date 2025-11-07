import vue from '@vitejs/plugin-vue';
import unocssInline from 'unocss-inline';
import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

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
      // build: {
      //   externalGlobals: {
      //     vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
      //   },
      // },
      server: { prefix: false },
    }),
  ],
  esbuild: {
    legalComments: 'none',
  },
});
