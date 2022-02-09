<template>
    <FormWidget :attr="trans.attr" :description="trans.description" :items="trans.items"
        :title="trans.title" :model="trans.model" @submit="onSubmit"/>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import FormWidget from '@/framework/components/widget/FormWidget.vue';
import { get } from 'lodash-es';
import { ElNotification } from 'element-plus';
import { useStore } from "@/store";
import { apiPyGrid } from "@/framework/services/poppy";

const props = defineProps({
    url: {
        type: String,
        default: ''
    }
})

const store = useStore();
const trans = reactive({
    loading: false,
    title: '',
    description: '',
    items: [],
    model: {},
    attr: {}
})

const doRequest = () => {
    trans.loading = true;
    apiPyGrid(props.url, {}, 'get').then(({ data }) => {
        trans.title = get(data, 'title');
        trans.description = get(data, 'description');
        trans.items = get(data, 'items');
        trans.model = get(data, 'model');
        trans.attr = get(data, 'attr');
        trans.loading = false
    })
}

const onSubmit = (data: any) => {
    apiPyGrid(props.url, data, 'post').then(({ message, success }) => {
        ElNotification({
            title: success ? '成功' : '失败',
            message
        })
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
@import '../../../assets/style/vars';
</style>
