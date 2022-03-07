<template>
    <PxMain v-loading="trans.loading">
        <template #title>
            <h3 class="main-title" v-if="trans.title">
                <span>
                    {{ trans.title }}
                </span>
                <ElIcon :class="{filter:true, 'active':!trans.isFilterVisible}" v-if="keys(trans.filter).length>0" @click="onSwitchFilter">
                    <Filter/>
                </ElIcon>
            </h3>
        </template>
        <div class="main-actions">
            <QuickActions :items="trans.actions" :scope="trans.scope"/>
        </div>
        <ElTabs v-model="trans.scope" v-if="trans.scopes.length">
            <ElTabPane :label="get(scope, 'label')" :name="get(scope, 'value')" v-for="scope in trans.scopes" :key="get(scope, 'value')"/>
        </ElTabs>
        <GridWidget :pk="trans.pk" :show-filter="trans.isFilterVisible" :batch="trans.batch" :filter="trans.filter" :cols="trans.cols" :url="trans.url"
            :scope="trans.scope"
            :page-sizes="trans.pageSizes"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { first, get, keys, set } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import GridWidget from "@/framework/components/widget/GridWidget.vue";
import { base64Decode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";
import { Filter } from "@element-plus/icons-vue";
import QuickActions from "@/framework/components/Tools/QuickActions.vue";

let router = useRouter();

const store = useStore();
const trans = reactive({
    title: '',
    loading: false,
    rows: [],
    cols: [],
    actions: [],
    batch: [],
    isFilterVisible: true,
    url: '',
    pk: '',
    filter: {},
    scopes: [],
    scope: '',
    pageSizes: [15]
})

const onSwitchFilter = () => {
    trans.isFilterVisible = !trans.isFilterVisible
}

const doRequest = () => {
    trans.loading = true;
    const path = base64Decode(String(router.currentRoute.value.params.type))
    let params = {};
    if (trans.scope) {
        set(params, '_scope', trans.scope);
    }
    apiPyRequest(path, params, 'get').then(({ data }) => {

        trans.title = get(data, 'title');
        trans.cols = get(data, 'cols');
        trans.scopes = get(data, 'scopes');
        // 首次加载渲染 Scope
        if (trans.scopes.length && !trans.scope) {
            let one = first(trans.scopes);
            trans.scope = get(one, 'value', '');
        }
        trans.actions = get(data, 'actions');
        trans.filter = get(data, 'filter');
        trans.batch = get(data, 'batch');
        trans.url = get(data, 'url');
        trans.pk = get(data, 'pk');
        trans.pageSizes = get(data, 'options.page_sizes');
        trans.loading = false;

        store.dispatch('poppy/SetTitle', get(data, 'title'));
    })
}

watch(() => trans.scope, (newVal: string, oldVal: string) => {
    router.push({
        query: {
            '_scope': newVal
        }
    })

    if (oldVal === '') {
        return ''
    }
    // 进行请求
    doRequest();
})

watch(() => store.state.grid.action, (newVal) => {
    if (!newVal) {
        return;
    }
    if (newVal === 'struct') {
        doRequest();
        store.dispatch('grid/ClearAction')
    }
})

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
