<template>
    <PxMain :title="trans.title" v-loading="trans.loading">
        <GridWidget :filter="grid.filter" :cols="grid.cols" :url="grid.url" :page-sizes="grid.pageSizes"/>
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
    type: '',
    path: '',
    title: '',
    loading: false
})

const grid = reactive({
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
        grid.cols = get(data, 'cols');
        grid.filter = get(data, 'filter');
        grid.url = get(data, 'url');
        grid.pageSizes = get(data, 'page_sizes');
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
@import '../../assets/style/vars';
</style>
