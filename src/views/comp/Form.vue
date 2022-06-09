<template>
    <PxMain v-loading="store.getters['poppy/isLoading'](trans.url)" :title="trans.title">
        <FormWidget :attr="trans.attr" :items="trans.items" :model="trans.model" @submit="onSubmit"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import FormWidget from '@/components/widget/FormWidget.vue';
import { get, set } from 'lodash-es';
import PxMain from '@/components/backend/PxMain.vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode } from "@popjs/core/utils/helper";
import { apiPyRequest } from "@/services/poppy";
import { appSessionStore, pyGlobalMotion } from "@/utils/util";
import { enableSkeleton, sessionFormKey } from "@/utils/conf";

let router = useRouter();


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
    if (queryRef.value.indexOf('struct') >= 0 && enableSkeleton()) {
        let struct = appSessionStore(sessionFormKey(trans.url));
        if (struct) {
            // remove struct
            queryRef.value = 'data';
            trans.title = get(struct, 'title');
            trans.description = get(struct, 'description');
            trans.items = get(struct, 'items');
            trans.attr = get(struct, 'attr');
            store.dispatch('poppy/SetTitle', trans.title);
        }
    }

    apiPyRequest(trans.url, {
        '_query': queryRef.value
    }, 'post').then(({ data }) => {
        if (queryRef.value.indexOf('struct') !== -1) {
            trans.title = get(data, 'title');
            trans.description = get(data, 'description');
            trans.items = get(data, 'items');
            trans.attr = get(data, 'attr');
            store.dispatch('poppy/SetTitle', trans.title);

            // cached trans;
            const { title, description, items, attr } = trans;
            appSessionStore(sessionFormKey(trans.url), {
                title, description, items, attr
            })

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

        pyGlobalMotion(data);
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
