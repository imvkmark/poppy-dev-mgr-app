<template>
    <PxMain v-loading="trans.loading">
        <template #title>
            <h3 class="main-title" v-if="trans.title">
                <span>
                    {{ trans.title }}
                </span>
            </h3>
        </template>
        <TableWidget :headers="trans.headers" :rows="trans.rows"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { get } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import { base64Decode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";
import TableWidget from "@/framework/components/widget/TableWidget.vue";

let router = useRouter();

const store = useStore();
const trans = reactive({
    title: '',
    rows: [],
    headers: [],
    loading: false,
})


const doRequest = () => {
    trans.loading = true;
    const path = base64Decode(String(router.currentRoute.value.params.type))
    apiPyRequest(path, {}, 'get').then(({ data }) => {
        trans.title = get(data, 'title');
        trans.headers = get(data, 'headers');
        trans.rows = get(data, 'rows');
        trans.loading = false;
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
