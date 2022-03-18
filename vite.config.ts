import vue from '@vitejs/plugin-vue'
import pkgJson from './package.json';
import { resolve } from 'path'
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        envDir: './config/',
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src/') // 设置 `@` 指向 `src` 目录
            }
        },
        base: '/mgrapp/',
        define: {
            'import.meta.env.PY_APP_VERSION': JSON.stringify(pkgJson.version)
        },
        build: {
            outDir: `build/mgrapp`,
            sourcemap: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        lodash: ['lodash-es'],
                        crypto: ['crypto-js']
                    }
                }
            }
        },
        server: {
            port: 9242, // 设置服务启动端口号
            cors: true, // 允许跨域
            host: '0.0.0.0'
        }
    }
});
