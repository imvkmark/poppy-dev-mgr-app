import { createApp } from 'vue'
import router from '@/router/index'
import { key, store } from '@/store'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@/assets/less/style.less';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)

/*
Sentry.init({
    app,
    dsn: sentryDsnUrl,
    release: `${pyAppMode}-${pyAppVersion}`,
    environment: pyAppMode,
    integrations: [
        new Integrations.BrowserTracing({
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            tracingOrigins: ['wulicode.com', 'poppy.duoli.com', /^\//]
        })
    ],
    // 开发环境下不抛出错误
    sampleRate: pyAppIsProd ? 1 : 0,
    // 线上环境捕捉 1%, 开发环境捕捉完整
    // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/sampling/#setting-a-sampling-function
    tracesSampler: () => {
        return 0
    }
});
*/

app.use(ElementPlus, {
    locale: zhCn
})
    .use(mavonEditor)
    .use(router)
    .use(store, key)
    .mount('#app');
