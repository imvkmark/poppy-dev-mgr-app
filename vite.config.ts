import vue from '@vitejs/plugin-vue'
import viteSentry, { ViteSentryPluginOptions } from 'vite-plugin-sentry'
// 获取 package 的版本号
import pkgJson from './package.json';
// 如果编辑器提示 path 模块找不到，则可以安装一下 @types/node -> npm i @types/node -D
import { resolve } from 'path'
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 读取环境变量放置到代码中
    const fs = require('fs')
    const dotenv = require('dotenv')
    const envFiles = [
        `./config/.env`, // default file
        `./config/.env.${mode}` // mode file
    ]

    for (const file of envFiles) {
        const envConfig = dotenv.parse(fs.readFileSync(file))
        for (const k in envConfig) {
            process.env[k] = envConfig[k]
        }
    }

    const sentryConfig: ViteSentryPluginOptions = {
        debug: true,
        url: process.env.VITE_SENTRY_URL,
        authToken: String(process.env.VITE_SENTRY_TOKEN),
        org: 'dadi',
        project: 'wulicode-webapp',
        release: `${mode}-${pkgJson.version}`,
        deploy: {
            env: `${mode}`
        },
        setCommits: {
            auto: false
        },
        sourceMaps: {
            include: [
                `build/wulicode-${mode}/assets`
            ],
            ignore: ['node_modules'],
            urlPrefix: '~/webapp/assets'
        }
    }

    return {
        envDir: './config/',
        plugins: [
            vue(),
            // 使用 NODE_ENV, production 时候才会执行错误搜集
            viteSentry(sentryConfig)
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, 'src/') // 设置 `@` 指向 `src` 目录
            }
        },
        base: '/webapp/',
        define: {
            'import.meta.env.PY_APP_VERSION': JSON.stringify(pkgJson.version)
        },
        build: {
            outDir: `build/wulicode-${mode}`,
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
