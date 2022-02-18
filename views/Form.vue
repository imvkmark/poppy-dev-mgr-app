<template>
    <PxMain :title="trans.title" v-loading="trans.loading">
        <FormWidget :attr="form.attr" :description="form.description" :items="form.items"
            :title="form.title" :model="form.model" @submit="onSubmit"/>
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
    loading: false
})
const form = reactive({
    title: '',
    description: '',
    items: [],
    model: {},
    attr: {}
})

const doRequest = () => {
    trans.loading = true;
    const path = base64Decode(String(router.currentRoute.value.params.type));
    console.log(path, 'form');
    apiPyRequest(path, {}, 'get').then(({ data }) => {
        trans.title = get(data, 'title');
        form.title = get(data, 'title');
        form.description = get(data, 'description');
        form.items = get(data, 'items');
        form.model = get(data, 'model');
        form.attr = get(data, 'attr');
        trans.loading = false
    })
}

const onSubmit = (data: any) => {
    const path = base64Decode(String(router.currentRoute.value.params.type))
    apiPyRequest(path, data, 'post').then(({ message, success }) => {
        ElNotification({
            title: success ? '成功' : '失败',
            message
        })
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
@import '../../assets/style/vars';
</style>
