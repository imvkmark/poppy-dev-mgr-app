import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import MgrLayout from '@/framework/layouts/MgrLayout.vue';
import { get, merge } from 'lodash-es';
import { frameworkRoutes } from "@/framework/router";

const routes: Array<RouteRecordRaw> = merge([
    {
        path: '/',
        component: MgrLayout,
        redirect: '/tool/base64'
    },
    {
        path: '/',
        component: MgrLayout,
        children: [
            { path: 'home', component: () => import('@/views/home/Home.vue'), name: 'home.index' },
        ]
    },
    {
        path: '/user', component: MgrLayout, children: [
            {
                path: 'cp',
                component: () => import('@/views/user/Cp.vue'),
                name: 'user.cp',
                meta: { title: '用户控制中心', auth: true }
            },
            {
                path: 'login',
                component: () => import('@/views/user/Login.vue'),
                name: 'user.login',
                meta: { title: '登录' }
            }
        ]
    }
], frameworkRoutes)

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    let title = get(to, 'meta.title');
    if (title) {
        document.title = title;
    }
    next();
});
export default router
