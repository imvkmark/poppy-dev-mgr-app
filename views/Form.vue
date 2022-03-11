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
import { onMounted, reactive, ref, watch } from 'vue';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { get, set } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode, pyWarning } from "@/framework/utils/helper";
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
    atSubmit: false,
    attr: {}
})
const form = reactive({});

const queryRef = ref('struct,data')

const doRequest = () => {
    apiPyRequest(trans.url, {
        '_query': queryRef.value
    }, 'post').then(({ data }) => {
        if (queryRef.value.indexOf('struct') !== -1) {
            trans.title = get(data, 'title');
            trans.description = get(data, 'description');
            trans.items = get(data, 'items');
            trans.attr = get(data, 'attr');
        }
        if (queryRef.value.indexOf('data') !== -1) {
            trans.model = get(data, 'model');
        }
    })
}

const onSubmit = (data: any) => {
    set(data, '_query', 'submit');
    apiPyRequest(trans.url, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '提示',
            type: success ? 'info' : 'warning',
            message,
        });

        pyAction(data);
    })
}

const init = () => {

    let url = base64Decode(String(router.currentRoute.value.params.type));
    if (!url) {
        return;
    }
    if (trans.url === url) {
        return;
    }
    trans.url = url;
    doRequest();
}

watch(() => router.currentRoute.value.params.type, () => {
    if (router.currentRoute.value.name !== 'py:form.index') {
        return;
    }
    init();
})
onMounted(() => {
    init();
})
</script>

<style scoped lang="less">
</style>
