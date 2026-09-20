// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv("dev", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
	server: { port: env.PORT ? Number(env.PORT) : 3000 },
});
