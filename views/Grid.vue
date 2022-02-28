<template>
    <PxMain v-loading="trans.loading">
        <template #title>
            <h3 :class="{'main-title':true}" v-if="trans.title">
                {{ trans.title }}
                <ElIcon :class="{filter:true, 'active':!trans.showFilter}" v-if="keys(trans.filter).length" @click="onSwitchFilter">
                    <Filter/>
                </ElIcon>
                <small v-if="trans.description">{{ trans.description }}</small>
            </h3>
        </template>
        <ActionsTool :items="trans.actions"/>
        <GridWidget :show-filter="trans.showFilter" :filter="trans.filter" :cols="trans.cols" :url="trans.url" :scopes="trans.scopes"
            :page-sizes="trans.pageSizes"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, watch } from 'vue';
import { get, keys } from 'lodash-es';
import PxMain from '@/components/base/PxMain.vue';
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import GridWidget from "@/framework/components/widget/GridWidget.vue";
import { base64Decode } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";
import ActionsTool from "@/framework/components/Tools/ActionsTool.vue";
import { Filter } from "@element-plus/icons-vue";

let router = useRouter();

const store = useStore();
const trans = reactive({
    title: '',
    description: '',
    loading: false,
    rows: [],
    cols: [],
    actions: [],
    showFilter: true,
    url: '',
    filter: {},
    size: computed(() => store.state.poppy.size),
    scopes: [],
    pageSizes: [15]
})

const onSwitchFilter = () => {
    trans.showFilter = !trans.showFilter;
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
        trans.url = get(data, 'url');
        trans.pageSizes = get(data, 'page_sizes');
        trans.loading = false
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
    &.active {
        color: var(--wc-color-primary);
    }
}
</style>
