<template>
    <div class="py--progress">
        <h4>{{ title }} <small>{{ trans.description }}</small></h4>
        <div class="progress-stop" @click="onStop">
            <ElIcon>
                <Remove/>
            </ElIcon>
        </div>
        <ElProgress :percentage="trans.percent"/>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { apiPyRequest } from "@/services/poppy";
import { toast } from "@/framework/utils/util";
import { get } from "lodash-es";
import { Remove } from "@element-plus/icons-vue";

const props = defineProps({
    title: String,
    url: {
        type: String,
        default: ''
    }
})

const trans = reactive({
    percent: 0,
    url: '',
    description: '',
})

const emits = defineEmits([
    'over',
    'cancel',
])


const onStop = () => {
    emits('cancel')
}

const doRequest = () => {
    // continue_time: 500
    // continue_url: "http://poppy.duoli.com/api/backend/py-area/content/fix?max=3663&min=1&section=20&start=21&total=3662&cache=1&method="
    // left: 3661
    // percentage: 0
    // section: 20
    // total: 3662
    apiPyRequest(trans.url, {}, 'get').then(({ data, success, message }) => {
        if (!success) {
            toast(message, false)
            return;
        }
        let percent = get(data, 'percentage', 0);
        let time = get(data, 'continue_time', 200);
        let url = get(data, 'continue_url', 200);
        trans.percent = percent;
        if (percent >= 100) {
            toast('更新完成');
            emits('over');
            return;
        }
        if (url) {
            const overed = (Number(get(data, 'total'))) - (Number(get(data, 'left')))
            trans.description = `${overed}/${get(data, 'total')}`;
            setTimeout(function () {
                trans.url = url;
            }, time);
        }
    })
}

watch(() => trans.url, (newVal, oldVal) => {
    if (!newVal) {
        return;
    }
    if (newVal !== oldVal) {
        doRequest();
    }
})

onMounted(() => {
    trans.url = props.url;
})
</script>

<style scoped lang="less">
</style>
