<template>
    <!--  监听, 这里写的比较别扭, 改的时候需要注意数据传值的问题  -->
    <ElDrawer v-model="drawerRef" :title="trans.title" :size="sizePercent(trans.media)">
        <FormDrawer v-if="get(trans.action, 'render') === 'form'" :url="trans.page" v-model:title="trans.title" v-model:description="trans.description"/>
        <TableDrawer v-if="get(trans.action, 'render') === 'table'" :url="trans.page" v-model:title="trans.title"/>
    </ElDrawer>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useStore } from "@/store";
import { sizePercent, toast } from '@/framework/utils/helper';
import FormDrawer from "@/framework/components/element/FormDrawer.vue";
import { get } from "lodash-es";
import { ElMessageBox } from "element-plus";
import { apiPyRequest } from "@/framework/services/poppy";
import { PyPoppyRequest } from "@/framework/store/types";
import TableDrawer from "@/framework/components/element/TableDrawer.vue";

const store = useStore();
const drawerRef = ref(false);
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    page: '',
    title: '',
    description: '',
    action: {},
})

const doAction = (item: PyPoppyRequest) => {
    switch (item.method) {
        // 页面请求
        case 'request':
            apiPyRequest(get(item, 'url', ''), get(item, 'params', {}), 'POST').then((resp) => {
                toast(resp);
                const { success } = resp
                // 如果当前请求在 Grid 中, 则触发刷新操作
                // todo 待测试
                if (success) {
                    store.commit('grid/RELOAD_START');
                }

                // 清空 Request
                store.dispatch('poppy/ClearRequest')
            })
            break;
        // 页面
        case 'page':
            trans.page = get(item, 'url', '');
            drawerRef.value = true;
            break;
        default:
            toast('不正确的操作类型');
            break;
    }
}

watch(() => store.state.poppy.request, (newVal: PyPoppyRequest) => {
    trans.action = newVal;
    console.log(trans.action);
    if (!get(newVal, 'method')) {
        return;
    }
    const confirm = get(newVal, 'confirm', false)
    const title = get(newVal, 'title');
    if (!confirm) {
        doAction(newVal);
        return;
    }
    ElMessageBox.confirm(`确认要进行${title}操作?`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        doAction(newVal)
    }).catch(() => {
    })
})
watch(() => drawerRef.value, (newVal) => {
    if (!newVal) {
        trans.page = ''
        store.commit('poppy/SET_REQUEST', {});
    }
})
</script>
