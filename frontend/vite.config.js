import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import { config } from 'dotenv';
// config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // server: {
    //     proxy: {
    //         '/api': {
    //             target: process.env.BACKEND_URL,
    //             changeOrigin: true,
    //             // Taken from https://stackoverflow.com/questions/64677212/how-to-configure-proxy-in-vite for testing purposes
    //             configure: (proxy, _options) => {
    //                 proxy.on('error', (err, _req, _res) => {
    //                     console.log('proxy error', err);
    //                 });
    //                 proxy.on('proxyReq', (proxyReq, req, _res) => {
    //                     console.log('Sending Request to the Target:', req.method, req.url);
    //                 });
    //                 proxy.on('proxyRes', (proxyRes, req, _res) => {
    //                     console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
    //                 });
    //             },
    //         }
    //     }
    // }
})
