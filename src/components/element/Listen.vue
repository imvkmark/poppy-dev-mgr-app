<template>
    <!--  监听, 这里写的比较别扭, 改的时候需要注意数据传值的问题  -->
    <ElDrawer v-model="drawerRef" :title="trans.title" :size="sizePercent(trans.media)" v-if="trans.method === 'page'">
        <FormDrawer v-if="get(trans.action, 'render') === 'form'" :url="trans.url" v-model:title="trans.title" @success="onSuccess"/>
        <TableDrawer v-if="get(trans.action, 'render') === 'table'" :url="trans.url" v-model:title="trans.title"/>
    </ElDrawer>
    <Progress v-if="progress.url" :url="progress.url" :title="progress.title" @over="onProgressOver" @cancel="onProgressCancel"/>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useStore } from "@/store";
import { httpBuildQuery, sizePercent } from '@popjs/core/utils/helper';
import FormDrawer from "@/components/element/FormDrawer.vue";
import { get } from "lodash-es";
import { apiPyRequest } from "@/services/poppy";
import TableDrawer from "@/components/element/TableDrawer.vue";
import { pyGlobalMotion, toast } from "@/utils/util";
import Progress from "@/components/element/Progress.vue";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_ACTION_PAGE, MGR_APP_ACTION_PROCESS, MGR_APP_ACTION_REQUEST } from "@/bus";

const store = useStore();
const drawerRef = ref(false);
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    url: '',
    title: '',
    method: '',
    action: {},
})
const progress = reactive({
    url: '',
    title: '',
})

const onSuccess = () => {
    drawerRef.value = false;
}

const onProgressOver = () => {
    progress.url = '';
}
const onProgressCancel = () => {
    progress.url = '';
}

watch(() => drawerRef.value, (newVal) => {
    if (!newVal) {
        trans.url = ''
    }
})


onMounted(() => {
    emitter.on(MGR_APP_ACTION_REQUEST, (data) => {
        console.log(data, 'action-request')
        apiPyRequest(get(data, 'url', ''), get(data, 'params', {}), 'POST').then(({ data, success, message }) => {
            toast(message, success)
            pyGlobalMotion(data);
        })
    })
    emitter.on(MGR_APP_ACTION_PAGE, (data: any) => {
        trans.method = 'page';
        trans.action = data;
        trans.url = httpBuildQuery(get(data, 'url', ''), get(data, 'params'));
        drawerRef.value = true;
    })
    emitter.on(MGR_APP_ACTION_PROCESS, (data) => {
        if (progress.url) {
            toast('有更新进行中, 请取消后在进行处理', false);
            return;
        }
        progress.url = httpBuildQuery(get(data, 'url', ''), get(data, 'params'));
        progress.title = get(data, 'title', '');
    })
})

onUnmounted(() => {
    emitter.off(MGR_APP_ACTION_REQUEST);
    emitter.off(MGR_APP_ACTION_PAGE);
    emitter.off(MGR_APP_ACTION_PROCESS);
})

</script>
