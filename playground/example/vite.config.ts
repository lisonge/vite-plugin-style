import { defineConfig } from 'vite';
import style from 'vite-plugin-style';

export default defineConfig({
  plugins: [style()],
  esbuild: { legalComments: 'none' },
  build: {
    minify: false,
    cssMinify: true,
  },
});
