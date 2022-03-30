<template>
    <ElEmpty :description="trans.message" v-if="trans.message"/>
    <FormWidget v-else :attr="trans.attr" :items="trans.items" :model="trans.model" @submit="onSubmit"/>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import FormWidget from '@/components/widget/FormWidget.vue';
import { get, set } from 'lodash-es';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { apiPyRequest } from "@/services/poppy";
import useUtil from "@/composables/useUtil";

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
    items: [],
    model: {},
    attr: {},
    message: '',
})

const emits = defineEmits([
    'update:title',
    'success',
])

const queryRef = ref('struct,data')

const doRequest = () => {
    if (!props.url) {
        return;
    }
    trans.message = '';
    apiPyRequest(props.url, {
        '_query': queryRef.value
    }, 'get').then(({ data, success, message }) => {
        if (!success) {
            emits('update:title', '通知')
            trans.message = message;
            return;
        }
        emits('update:title', get(data, 'title'))
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
        trans.attr = get(data, 'attr');
    })
}

const onSubmit = (data: any) => {
    set(data, '_query', 'submit');
    apiPyRequest(props.url, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '失败',
            message
        });

        pyAction(data);

        if (success) {
            emits('success')
        }
    })
}

watch(() => props.url, () => {
    doRequest();
})

onMounted(() => {
    doRequest();
})
</script>

<style scoped lang="less">
</style>
