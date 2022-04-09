import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'
import BlankLayout from '@/components/layouts/BlankLayout.vue';
import MgrLayout from '@/components/layouts/MgrLayout.vue';
import DevLayout from '@/components/layouts/DevLayout.vue';
import Login from '@/views/backend/Login.vue';
import { get } from 'lodash-es';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/cp'
    },
    {
        path: '/dev/',
        redirect: '/dev/apidoc'
    },
    {
        path: '/', component: BlankLayout, children: [
            {
                path: 'login',
                component: Login,
                name: 'backend.login',
                meta: { title: '登录' }
            }
        ]
    },
    {
        path: '/', component: MgrLayout, children: [
            {
                path: '/cp',
                component: () => import('@/views/backend/Cp.vue'),
                name: 'backend.cp',
                meta: { title: '用户控制中心', auth: true }
            },
            { path: 'comp/form/:type', component: () => import('@/views/comp/Form.vue'), name: 'py:form.index', meta: { auth: true } },
            { path: 'comp/grid/:type', component: () => import('@/views/comp/Grid.vue'), name: 'py:grid.index', meta: { auth: true } },
            { path: 'comp/table/:type', component: () => import('@/views/comp/Table.vue'), name: 'py:table.index', meta: { auth: true } },
            { path: 'comp/setting/:type', component: () => import('@/views/comp/Setting.vue'), name: 'py:setting.index', meta: { auth: true } }
        ]
    },
    {
        path: '/dev/',
        component: BlankLayout,
        children: [
            { path: 'login', component: () => import('@/views/dev/Login.vue'), name: 'dev.login' },
        ]
    },
    {
        path: '/dev/', component: DevLayout, children: [
            {
                path: 'cp',
                component: () => import('@/views/dev/Cp.vue'),
                name: 'dev.cp',
                meta: { title: '开发控制台', auth: true }
            },
        ]
    },
];

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
