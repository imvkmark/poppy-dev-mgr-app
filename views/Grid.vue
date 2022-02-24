<template>
    <PxMain :title="trans.title" :description="trans.description" v-loading="trans.loading">
        <GridWidget :filter="trans.filter" :cols="trans.cols" :url="trans.url" :page-sizes="trans.pageSizes"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { get } from 'lodash-es';
import PxMain from '@/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import GridWidget from "@/framework/components/widget/GridWidget.vue";
import { base64Decode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";

let router = useRouter();

const store = useStore();
const trans = reactive({
    title: '',
    description: '',
    loading: false,
    rows: [],
    cols: [],
    url: '',
    filter: {},
    pageSizes: [15]
})

const doRequest = () => {
    trans.loading = true;
    const path = base64Decode(String(router.currentRoute.value.params.type))
    apiPyRequest(path, {}, 'get').then(({ data }) => {
        trans.title = get(data, 'title');
        trans.description = get(data, 'description');
        trans.cols = get(data, 'cols');
        trans.filter = get(data, 'filter');
        trans.url = get(data, 'url');
        trans.pageSizes = get(data, 'page_sizes');
        trans.loading = false
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
