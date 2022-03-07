<template>
    <FormWidget :attr="trans.attr" :items="trans.items" :model="trans.model" @submit="onSubmit"/>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { get } from 'lodash-es';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { apiPyRequest } from "@/framework/services/poppy";
import useUtil from "@/framework/composables/useUtil";

const props = defineProps({
    title: String,
    url: {
        type: String,
        default: ''
    }
})

const store = useStore();
const { pyAction } = useUtil();
const trans = reactive({
    loading: false,
    items: [],
    model: {},
    attr: {}
})

const emits = defineEmits([
    'update:title',
    'success',
])

const doRequest = () => {
    trans.loading = true;
    apiPyRequest(props.url, {}, 'get').then(({ data }) => {
        emits('update:title', get(data, 'title'))
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
        trans.attr = get(data, 'attr');
        trans.loading = false
    })
}

const onSubmit = (data: any) => {
    apiPyRequest(props.url, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '失败',
            message
        });

        pyAction(data);

        if(success) {
            emits('success')
        }
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
