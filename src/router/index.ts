import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout.vue';
import MgrLayout from '@/layouts/MgrLayout.vue';
import Login from '@/views/user/Login.vue';
import { get, union } from 'lodash-es';

const frameworkRoutes: any = [
    {
        path: '/comp/',
        component: MgrLayout,
        children: [
            { path: 'form/:type', component: () => import('@/framework/views/Form.vue'), name: 'py:form.index' },
            { path: 'grid/:type', component: () => import('@/framework/views/Grid.vue'), name: 'py:grid.index' },
            { path: 'table/:type', component: () => import('@/framework/views/Table.vue'), name: 'py:table.index' },
            { path: 'setting/:type', component: () => import('@/framework/views/Setting.vue'), name: 'py:setting.index' }
        ]
    }
]

const routes: Array<RouteRecordRaw> = union([
    {
        path: '/',
        redirect: '/user/cp'
    },
    {
        path: '/user/', component: BlankLayout, children: [
            {
                path: 'login',
                component: Login,
                name: 'user.login',
                meta: { title: '登录' }
            }
        ]
    },
    {
        path: '/', component: MgrLayout, children: [
            {
                path: '/user/cp',
                component: () => import('@/views/user/Cp.vue'),
                name: 'user.cp',
                meta: { title: '用户控制中心', auth: true }
            },
        ]
    }
], frameworkRoutes);

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
