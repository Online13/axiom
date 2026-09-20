import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
		plugins: [react(), cloudflare()],
		server: {
			port: Number(env.PORT) || 4323,
		},
	};
});
