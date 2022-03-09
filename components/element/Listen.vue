<template>
    <!--  监听, 这里写的比较别扭, 改的时候需要注意数据传值的问题  -->
    <ElDrawer v-model="drawerRef" :title="trans.title" :size="sizePercent(trans.media)">
        <FormDrawer v-if="get(trans.action, 'render') === 'form'" :url="trans.url" v-model:title="trans.title" @success="onSuccess"/>
        <TableDrawer v-if="get(trans.action, 'render') === 'table'" :url="trans.url" v-model:title="trans.title"/>
    </ElDrawer>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useStore } from "@/store";
import { httpBuildQuery, sizePercent } from '@/framework/utils/helper';
import FormDrawer from "@/framework/components/element/FormDrawer.vue";
import { get } from "lodash-es";
import { ElMessageBox } from "element-plus";
import { apiPyRequest } from "@/framework/services/poppy";
import { PyPoppyAction } from "@/framework/store/types";
import TableDrawer from "@/framework/components/element/TableDrawer.vue";
import useUtil from "@/framework/composables/useUtil";
import { toast } from "@/framework/utils/util";

const { pyAction } = useUtil();
const store = useStore();
const drawerRef = ref(false);
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    url: '',
    title: '',
    action: {},
})

const doAction = (item: PyPoppyAction) => {
    switch (item.method) {
        // 页面请求
        case 'request':
            apiPyRequest(get(item, 'url', ''), get(item, 'params', {}), 'POST').then(({ resp, data }) => {
                toast(resp);

                pyAction(data);

                // 清空 Request
                store.dispatch('poppy/ClearAction')
            })
            break;
        // 页面
        case 'page':
            console.log(item);
            trans.url = httpBuildQuery(get(item, 'url', ''), get(item, 'params'));
            drawerRef.value = true;
            break;
        default:
            toast('不正确的操作类型');
            break;
    }
}

const onSuccess = () => {
    drawerRef.value = false;
}

watch(() => store.state.poppy.action, (newVal: PyPoppyAction) => {
    trans.action = newVal;
    if (!get(newVal, 'method')) {
        return;
    }
    const confirm = get(newVal, 'confirm', false)
    const defConfirmText = get(newVal, 'confirm-text', '')
    const title = get(newVal, 'title');
    if (!confirm) {
        doAction(newVal);
        return;
    }
    const confirmText = defConfirmText ? defConfirmText : `确认要进行${title}操作?`;
    ElMessageBox.confirm(confirmText, '确认', {
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
        trans.url = ''
        store.dispatch('poppy/ClearAction');
    }
})
</script>
