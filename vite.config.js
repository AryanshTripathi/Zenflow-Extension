import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: "public/manifest.json",
					dest: ".",
				},
			],
		}),
	],
	server: {
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin-allow-popups",
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "D:/Zenflow/client/zenflow"), // @ will map to src folder
		},
	},
	build: {
		outDir: "build",
		rollupOptions: {
			input: {
				main: "./index.html",
			},
		},
	},
});
