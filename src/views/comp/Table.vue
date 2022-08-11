<template>
    <PageMain v-loading="store.getters['poppy/isLoading'](trans.url)" :title="trans.title">
        <TableWidget :headers="trans.headers" :rows="trans.rows"/>
    </PageMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { get } from 'lodash-es';
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import { base64Decode } from "@popjs/core/utils/helper";
import { apiPyRequest } from "@/services/poppy";
import TableWidget from "@/components/widget/TableWidget.vue";
import PageMain from "@/components/backend/PageMain.vue";

let router = useRouter();

const store = useStore();
const trans = reactive({
    title: '',
    url: '',
    rows: [],
    headers: [],
    loading: false,
})


const doRequest = () => {
    const path = base64Decode(String(router.currentRoute.value.params.type));
    trans.url = path;
    apiPyRequest(path, {}, 'get').then(({ data }) => {
        trans.title = get(data, 'title');
        trans.headers = get(data, 'headers');
        trans.rows = get(data, 'rows');
    })
}

watch(() => router.currentRoute.value.params.type, () => {
    doRequest();
})
onMounted(() => {
    doRequest();
})
</script>

<style scoped lang="less">
.filter {
    cursor: pointer;
    margin-left: 0.5rem;
    &.active {
        color: var(--wc-color-primary);
    }
}

.sticky {
    position: sticky;
}
</style>
