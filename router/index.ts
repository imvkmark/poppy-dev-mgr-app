import MgrLayout from "@/framework/layouts/MgrLayout.vue"

export const frameworkRoutes = [
    {
        path: '/',
        component: MgrLayout,
        children: [
            { path: 'form/:type', component: () => import('@/framework/views/Form.vue'), name: 'py:form.index' },
            { path: 'grid/:type', component: () => import('@/framework/views/Grid.vue'), name: 'py:grid.index' },
            { path: 'table/:type', component: () => import('@/framework/views/Table.vue'), name: 'py:table.index' },
            { path: 'setting/:type', component: () => import('@/framework/views/Setting.vue'), name: 'py:setting.index' }
        ]
    }
]
