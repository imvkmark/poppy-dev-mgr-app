<template>
    <PxMain :title="trans.title" :description="trans.description" v-loading="trans.loading">
        <FormWidget :attr="form.attr" :items="form.items" :model="form.model" @submit="onSubmit"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { get } from 'lodash-es';
import PxMain from '@/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";

let router = useRouter();

const store = useStore();
const trans = reactive({
    type: '',
    path: '',
    title: '',
    loading: false,
    description: '',
    items: [],
    model: {},
    attr: {}
})
const form = reactive({})

const doRequest = () => {
    trans.loading = true;
    const path = base64Decode(String(router.currentRoute.value.params.type));
    apiPyRequest(path, {}, 'get').then(({ data }) => {
        trans.title = get(data, 'title');
        trans.title = get(data, 'title');
        trans.description = get(data, 'description');
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
        trans.attr = get(data, 'attr');
        trans.loading = false
    })
}

const onSubmit = (data: any) => {
    const path = base64Decode(String(router.currentRoute.value.params.type))
    apiPyRequest(path, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '提示',
            type: success ? 'info' : 'warning',
            message,
        });
        const action = get(data, 'action', '');
        const time = get(data, 'time', 0);

        // 触发全局动作
        if (action) {
            setTimeout(() => {
                store.commit('poppy/SET_ACTION', action);
            }, time)
        }
    })
}

watch(() => router.currentRoute.value.params.type, () => {
    doRequest();
}, { deep: true })
onMounted(() => {
    doRequest();
})
</script>

<style scoped lang="less">
</style>
