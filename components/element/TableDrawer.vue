<template>
    <TableWidget v-loading="trans.loading" :headers="trans.headers" :rows="trans.rows"/>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { get } from 'lodash-es';
import { useStore } from "@/store";
import { apiPyRequest } from "@/framework/services/poppy";
import TableWidget from "@/framework/components/widget/TableWidget.vue";

const props = defineProps({
    title: String,
    url: {
        type: String,
        default: ''
    }
})

const store = useStore();
const trans = reactive({
    loading: false,
    headers: [],
    rows: [],
})

const emits = defineEmits([
    'update:title',
])

const doRequest = () => {
    trans.loading = true;
    apiPyRequest(props.url, {}, 'get').then(({ data }) => {
        emits('update:title', get(data, 'title'))
        trans.headers = get(data, 'headers');
        trans.rows = get(data, 'rows');
        trans.loading = false
    })
}

watch(() => props.url, (newVal, oldVal) => {
    if (!newVal) {
        return;
    }
    if (newVal !== oldVal) {
        doRequest();
    }

})

onMounted(() => {
    doRequest();
})
</script>

<style scoped lang="less">
</style>
