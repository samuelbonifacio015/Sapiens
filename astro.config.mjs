import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
<<<<<<< HEAD
=======
import tailwind from '@astrojs/tailwind';
>>>>>>> 4d6d650749cfc2cc5e98d745d8b66bec85505759
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
<<<<<<< HEAD
  integrations: [react()],
=======
  integrations: [react(), tailwind()],
>>>>>>> 4d6d650749cfc2cc5e98d745d8b66bec85505759
});
