// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Landing runs on 4321, docs on 4322, so both dev servers can run side by side.
	server: { port: 4321 },
});
