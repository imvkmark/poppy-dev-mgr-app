import { createApp } from 'vue'
import router from '@/services/router/index'
import { key, store } from '@/services/store'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import '@/assets/less/style.less';
const app = createApp(App)


app.use(ElementPlus, {
    locale: zhCn
})
    .use(router)
    .use(store, key)
    .mount('#app');
