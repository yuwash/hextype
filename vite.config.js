import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/hextype/',
  plugins: [
    svelte({
      compilerOptions: {
        dev: true
      }
    })
  ]
});
