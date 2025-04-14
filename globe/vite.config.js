import { defineConfig } from 'vite';

export default defineConfig({
    base: '/globe/',
    build: {
        outDir: 'dist',  // This is where the built files will go
        assetsDir: 'assets',
        sourcemap: false,  // Optionally, disable sourcemaps for production
        rollupOptions: {
            input: 'index.html',  // The entry point to your app
        },
    },
    server: {
        port: 3000,
    }
});