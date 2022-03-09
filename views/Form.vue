<template>
    <PxMain v-loading="store.getters['poppy/isLoading'](trans.url)">
        <template #title>
            <h3 class="main-title" v-if="trans.title">
                {{ trans.title }}
                <small v-if="trans.description">{{ trans.description }}</small>
            </h3>
        </template>
        <FormWidget :attr="trans.attr" :items="trans.items" :model="trans.model" @submit="onSubmit"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { get } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";
import useUtil from "@/framework/composables/useUtil";

let router = useRouter();

const { pyAction } = useUtil();

const store = useStore();
const trans = reactive({
    type: '',
    title: '',
    description: '',
    items: [],
    model: {},
    url: '',
    attr: {}
})
const form = reactive({})

const doRequest = () => {
    const path = base64Decode(String(router.currentRoute.value.params.type));
    trans.url = path;
    apiPyRequest(path, {}, 'get').then(({ data }) => {
        trans.title = get(data, 'title');
        trans.description = get(data, 'description');
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
        trans.attr = get(data, 'attr');
    })
}

const onSubmit = (data: any) => {
    const path = base64Decode(String(router.currentRoute.value.params.type))
    trans.url = path;
    apiPyRequest(path, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '提示',
            type: success ? 'info' : 'warning',
            message,
        });

        pyAction(data);
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
