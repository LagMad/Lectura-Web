import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            input: "resources/js/app.jsx", // File utama JS
            refresh: true,
        }),
        react(),
    ],
});
