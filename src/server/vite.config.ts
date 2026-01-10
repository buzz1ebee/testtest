import { defineConfig } from 'vite';
import { builtinModules } from 'module';
export default defineConfig({
  ssr: { noExternal: true },
  build: {
    ssr: 'index.ts',
    outDir: '../../dist/server',
    target: 'node22',
    rollupOptions: { external: [...builtinModules] },
    lib: { entry: 'index.ts', formats: ['es'], fileName: () => 'index.js' },
  },
});
