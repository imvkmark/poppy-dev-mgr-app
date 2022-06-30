<template>
    <!--  监听, 这里写的比较别扭, 改的时候需要注意数据传值的问题  -->
    <ElDrawer v-model="refDrawer.visible" :title="trans.title" :size="sizePercent(trans.media)" v-if="trans.method === 'page'">
        <ElScrollbar>
            <FormDrawer v-if="refDrawer.render === 'form'" :url="refDrawer.url" v-model:title="trans.title" @success="onSuccess"/>
            <TableDrawer v-if="refDrawer.render === 'table'" :url="refDrawer.url" v-model:title="trans.title"/>
            <GridDrawer v-if="refDrawer.render === 'grid'" :url="refDrawer.url" v-model:title="trans.title"/>
        </ElScrollbar>
    </ElDrawer>
    <Progress v-if="progress.url" :url="progress.url" :title="progress.title" @over="onProgressOver" @cancel="onProgressCancel"/>
    <XIframe :title="refIframe.title" v-model:visible="refIframe.visible" :url="refIframe.url" :width="refIframe.width"/>
    <ElDialog v-model="refDialog.visible" :title="refDialog.title" custom-class="py--listen-dialog">
        <ElScrollbar class="ld-scrollbar">
            <FormDrawer v-if="refDialog.render === 'form'" :url="refDialog.url" v-model:title="refDialog.title"/>
            <TableDrawer v-if="refDialog.render === 'table'" :url="refDialog.url" v-model:title="refDialog.title"/>
            <GridDrawer v-if="refDialog.render === 'grid'" :url="refDialog.url" v-model:title="refDialog.title"/>
        </ElScrollbar>
    </ElDialog>
    <ElImageViewer :url-list="refPreview.urls" v-if="refPreview.visible" @close="onClosePreview"/>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, watch } from "vue";
import { useStore } from "@/store";
import { httpBuildQuery, sizePercent } from '@popjs/core/utils/helper';
import FormDrawer from "@/components/element/FormDrawer.vue";
import { get, indexOf } from "lodash-es";
import { apiPyRequest } from "@/services/poppy";
import TableDrawer from "@/components/element/TableDrawer.vue";
import { pyGlobalMotion, toast } from "@/utils/util";
import Progress from "@/components/element/Progress.vue";
import { emitter } from "@popjs/core/bus/mitt";
import {
    MGR_APP_ACTION_DIALOG,
    MGR_APP_ACTION_IFRAME,
    MGR_APP_ACTION_PAGE,
    MGR_APP_ACTION_PROCESS,
    MGR_APP_ACTION_REQUEST,
    MGR_APP_INNER_IMAGE_VIEW
} from "@/bus";
import XIframe from "@/components/element/XIframe.vue";
import GridDrawer from "@/components/element/GridDrawer.vue";

const store = useStore();
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

const refDrawer = reactive({
    visible: false,
    url: '',
    render: ''
})

const refPreview = reactive({
    visible: false,
    urls: [],
    index: 0,
})

const refIframe = reactive({
    title: '',
    visible: false,
    url: '',
    width: 400
})

const refDialog = reactive({
    title: '',
    visible: false,
    render: '',
    url: '',
    width: 400
})

const onSuccess = () => {
    refDrawer.visible = false;
}

const onProgressOver = () => {
    progress.url = '';
}
const onProgressCancel = () => {
    progress.url = '';
}

/**
 * 关闭预览
 */
const onClosePreview = () => {
    refPreview.visible = false;
}


watch(() => refDrawer.visible, (newVal) => {
    if (!newVal) {
        refDrawer.url = ''
    }
})

// 清空 Dialog
watch(() => refDialog.visible, (newVal) => {
    if (!newVal) {
        refDialog.url = ''
    }
})


onMounted(() => {
    // 页面请求
    emitter.on(MGR_APP_ACTION_REQUEST, (data) => {
        console.log(data, 'action-request')
        apiPyRequest(get(data, 'url', ''), get(data, 'params', {}), 'post').then(({ data, success, message }) => {
            toast(message, success)
            pyGlobalMotion(data);
        })
    })

    // 使用 dialog 嵌入Url
    emitter.on(MGR_APP_ACTION_IFRAME, (data) => {
        refIframe.title = get(data, 'title');
        refIframe.url = get(data, 'url');
        refIframe.visible = true;
        refIframe.width = get(data, 'width', 400)
    })

    // 侧栏页面打开
    emitter.on(MGR_APP_ACTION_PAGE, (data: any) => {
        trans.method = 'page';
        refDrawer.render = get(data, 'render');
        refDrawer.url = httpBuildQuery(get(data, 'url', ''), get(data, 'params'));
        refDrawer.visible = true;
    })

    // 对话框打开
    emitter.on(MGR_APP_ACTION_DIALOG, (data: any) => {
        trans.method = 'dialog';
        refDialog.render = get(data, 'render');
        trans.action = data;
        refDialog.url = httpBuildQuery(get(data, 'url', ''), get(data, 'params'));
        refDialog.visible = true;
    })

    // 状态更新
    emitter.on(MGR_APP_ACTION_PROCESS, (data) => {
        if (progress.url) {
            toast('有更新进行中, 请取消后在进行处理', false);
            return;
        }
        progress.url = httpBuildQuery(get(data, 'url', ''), get(data, 'params'));
        progress.title = get(data, 'title', '');
    })

    // 激活全局图片预览
    emitter.on(MGR_APP_INNER_IMAGE_VIEW, (data) => {
        refPreview.visible = true;
        refPreview.urls = get(data, 'urls');
        refPreview.index = indexOf(get(data, 'urls'), get(data, 'url'));
    })
})

onUnmounted(() => {
    emitter.off(MGR_APP_ACTION_REQUEST);
    emitter.off(MGR_APP_ACTION_PAGE);
    emitter.off(MGR_APP_ACTION_PROCESS);
    emitter.off(MGR_APP_ACTION_IFRAME);
    emitter.off(MGR_APP_INNER_IMAGE_VIEW);
})

</script>
