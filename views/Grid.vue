<template>
    <PxMain v-loading="trans.loading">
        <template #title>
            <h3 class="main-title" v-if="trans.title">
                <span v-if="trans.description">
                    <ElPopover :content="trans.description">
                        <template #reference>{{ trans.title }}</template>
                    </ElPopover>
                </span>
                <span v-else>
                    {{ trans.title }}
                </span>
                <ElIcon :class="{filter:true, 'active':!trans.isFilterVisible}" v-if="keys(trans.filter).length>0" @click="onSwitchFilter">
                    <Filter/>
                </ElIcon>
            </h3>
        </template>
        <div class="main-actions">
            <QuickActions :items="trans.actions"/>
        </div>
        <GridWidget :pk="trans.pk" :show-filter="trans.isFilterVisible" :batch="trans.batch" :filter="trans.filter" :cols="trans.cols" :url="trans.url"
            :scopes="trans.scopes"
            :page-sizes="trans.pageSizes"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { onMounted, reactive, watch } from 'vue';
import { get, keys } from 'lodash-es';
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
    description: '',
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
    pageSizes: [15]
})

const onSwitchFilter = () => {
    trans.isFilterVisible = !trans.isFilterVisible
}

const doRequest = () => {
    trans.loading = true;
    const path = base64Decode(String(router.currentRoute.value.params.type))
    apiPyRequest(path, {}, 'get').then(({ data }) => {

        trans.title = get(data, 'title');
        trans.description = get(data, 'description');
        trans.cols = get(data, 'cols');
        trans.scopes = get(data, 'scopes');
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

watch(() => router.currentRoute.value.params.type, (newVal) => {
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
