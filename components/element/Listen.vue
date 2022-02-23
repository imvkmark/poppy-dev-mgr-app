<template>
    <ElDrawer v-model="drawerRef" :size="sizePercent(trans.size)" :with-header="false">
        <FormDrawer :url="trans.page"/>
    </ElDrawer>
</template>
<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useStore } from "@/store";
import { base64Encode, sizePercent, toast } from '@/framework/utils/helper';
import FormDrawer from "@/framework/components/grid/FormDrawer.vue";
import { get } from "lodash-es";
import { ElMessageBox } from "element-plus";
import { apiPyRequest } from "@/framework/services/poppy";
import { PyPoppyRequest } from "@/framework/store/types";

const store = useStore();
const drawerRef = ref(false);
const trans = reactive({
    size: computed(() => store.state.poppy.size),
    page: ''
})

const doAction = (item: PyPoppyRequest) => {
    store.commit('poppy/SET_BTN_KEY', base64Encode(get(item, 'url', '')));
    switch (item.method) {
        // 页面请求
        case 'request':
            apiPyRequest(get(item, 'url', ''), {}, 'POST').then((resp) => {
                store.commit('poppy/SET_BTN_KEY', '');
                toast(resp);
                const { success } = resp
                // 如果当前请求在 Grid 中, 则触发刷新操作
                // todo 待测试
                if (success) {
                    store.commit('grid/RELOAD_START');
                }
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

    drawerRef.value = Boolean(newVal);
})
watch(() => drawerRef.value, (newVal) => {
    if (!newVal) {
        trans.page = ''
        store.commit('poppy/SET_REQUEST', {});
    }
})
</script>
