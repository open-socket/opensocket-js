import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Temporarily disable DTS generation
  clean: true,
  sourcemap: true,
  minify: false, // Don't minify test utils
  splitting: false,
  treeshake: true,
  external: ['@open-socket/core'],
  target: 'es2020',
  outDir: 'dist',
});
