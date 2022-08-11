<template>
    <PageMain :title="trans.title" :intangible="refScopes.length === 0">
        <ElTabs v-if="refScopes.length" v-model="trans.scope" type="card" @tab-click="onPanelClick">
            <ElTabPane :label="get(item, 'label')" :name="get(item, 'value')" :key="get(item, 'value')" v-for="item in refScopes"/>
        </ElTabs>
        <ElRow :gutter="8">
            <template v-for="panel in refPanels" :key="get(panel, '_key', '')">
                <ElCol :span="get(panel, 'width')">
                    <ElCard :header="get(panel, 'title')">
                        <FormWidget v-if="get(panel, 'type') === 'form'"
                            v-loading="store.getters['poppy/isLoading'](trans.url)" @submit="onSubmit"
                            :attr="get(panel, 'attr', {})" :items="get(panel, 'items', [])"
                            :model="merge(get(panel, 'model', {}), {_key: get(panel, '_key', '')})" :buttons="get(panel, 'buttons', [])"/>
                    </ElCard>
                </ElCol>
            </template>
        </ElRow>
    </PageMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import FormWidget from '@/components/form/FormWidget.vue';
import { get, merge, set } from 'lodash-es';
import { useRouter } from 'vue-router';
import { ElNotification, TabsPaneContext } from 'element-plus';
import { useStore } from "@/store";
import { base64Decode, base64Encode } from "@popjs/core/utils/helper";
import { apiPyRequest } from "@/services/poppy";
import { pyGlobalMotion } from "@/utils/util";
import PageMain from "@/components/backend/PageMain.vue";

const router = useRouter();
const store = useStore();
const trans = reactive({
    url: '',
    title: '',
    scope: '',
})

const queryRef = ref('frame,data');
const refPanels = ref([]);
const refScopes = ref([]);

const getUrl = () => {
    const { type } = router.currentRoute.value.params;
    if (!type) {
        return '';
    }

    return base64Decode(String(type));
}

const doRequest = (scope: string = '') => {
    trans.url = getUrl();

    let query = {
        _query: 'frame,data',
    }

    // 更换 Scope
    if (scope) {
        set(query, '_scope', scope);
    }

    apiPyRequest(trans.url, query).then(({ data }) => {
        trans.title = get(data, 'title');
        refPanels.value = get(data, 'panels');
        trans.scope = get(data, 'scope');
        refScopes.value = get(data, 'scopes');
        store.dispatch('poppy/SetTitle', trans.title);
    })
}

/**
 * 分组切换, 重新请求结构
 */
const onPanelClick = (pane: TabsPaneContext) => {
    console.debug(pane.paneName, trans.scope)
    if (pane.paneName === trans.scope) {
        return;
    }
    router.push({
        query: {
            scope: base64Encode(pane.paneName)
        }
    }).then(() => {
        queryRef.value = 'frame,data';
        doRequest(String(pane.paneName));
    })
}

const onSubmit = (data: any) => {
    trans.url = getUrl();
    set(data, '_query', 'submit');
    if (trans.scope) {
        set(data, '_scope', trans.scope);
    }
    apiPyRequest(trans.url, data, 'post').then(({ message, success, data }) => {
        ElNotification({
            title: success ? '成功' : '提示',
            type: success ? 'info' : 'warning',
            message,
        });
        pyGlobalMotion(data);
    })
}

const init = () => {
    let url = base64Decode(String(router.currentRoute.value.params.type));
    if (!url) {
        return;
    }
    if (trans.url === url) {
        return;
    }
    doRequest();
}

watch(() => router.currentRoute.value.params.type, () => {
    if (router.currentRoute.value.name !== 'py:dashboard.index') {
        return;
    }
    init();
})
onMounted(() => {
    init();
})
</script>

<style scoped lang="less">
</style>
