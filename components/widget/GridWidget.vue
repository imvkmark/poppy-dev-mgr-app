<template>
    <div :class="{'py--form':true, ...sizeClass(trans.size)}">
        <h3 class="form-title" v-if="title">
            {{ title }}
            <small v-if="description">{{ description }}</small>
        </h3>
        <Filter :attr="props.filter" @search="onFilter" @reset="resetGrid"/>
        <!-- 表格数据 -->
        <ElTable :data="trans.rows" border stripe v-loading="trans.loading">
            <template v-for="col in cols" :key="col">
                <ElTableColumn :prop="get(col, 'field')" :width="get(col, 'width', '')" :label="get(col, 'label')">
                    <template #default="scope">
                        <ColumnText v-if="get(col, 'type') === 'text'" :ellipsis="get(col, 'ellipsis', false)"
                            :value="get(scope.row, String(get(col, 'field')))"/>
                        <ColumnLink v-else-if="get(col, 'type') === 'link'" :ellipsis="get(col, 'ellipsis', false)"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnImage v-else-if="get(col, 'type') === 'image'"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnDownload v-else-if="get(col, 'type') === 'download'"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnActions v-else-if="get(col, 'type') === 'actions'"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <span v-else>
                            {{ get(scope.row, String(get(col, 'field'))) }}
                        </span>
                    </template>
                </ElTableColumn>
            </template>
        </ElTable>
        <div class="pagination">
            <ElPagination :page-sizes="pageSizes" :total="trans.total" background :page-size="pagesizeRef"
                layout="sizes,prev, pager, next, total" @size-change="onSizeChange" @current-change="onPageChange"
                :current-page="pageRef"/>
        </div>
    </div>
    <ElDrawer v-model="drawerRef" :size="sizePercent(trans.size)">
        <FormDrawer :url="trans.page"/>
    </ElDrawer>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { each, get, merge, set } from 'lodash-es';
import { sizeClass, sizePercent } from '@/framework/utils/helper';
import { useStore } from '@/store';
import ColumnText from "@/framework/components/grid/ColumnText.vue";
import ColumnLink from "@/framework/components/grid/ColumnLink.vue";
import ColumnImage from "@/framework/components/grid/ColumnImage.vue";
import ColumnDownload from "@/framework/components/grid/ColumnDownload.vue";
import ColumnActions from "@/framework/components/grid/ColumnActions.vue";
import FormDrawer from "@/framework/components/grid/FormDrawer.vue";
import { apiPyGrid } from "@/framework/services/poppy";
import Filter from "@/framework/components/widget/FilterWidget.vue";

const props = defineProps({
    title: String,
    description: String,
    pageSizes: {
        type: Array,
        default: () => {
            return [15]
        }
    },
    filter: {
        type: Object,
        default: () => {
            return {}
        }
    },
    url: {
        type: String,
        default: () => {
            return ''
        }
    },
    cols: {
        type: Array,
        default: () => {
            return []
        }
    },
})
const store = useStore();
const trans = reactive({
    rows: [],
    total: 0,
    size: computed(() => store.state.poppy.size),
    loading: computed(() => store.state.grid.loading),
    page: computed(() => store.state.grid.page)
})
const pagesizeRef = ref(15);
const pageRef = ref(1);
const drawerRef = ref(false);
const params = reactive({
    page: 1,
    pagesize: 15
})
const model = reactive({});

watch(() => store.state.grid.page, (newVal) => {
    drawerRef.value = Boolean(newVal);
})
watch(() => drawerRef.value, (newVal) => {
    if (!newVal) {
        store.commit('grid/PAGE_EMPTY')
    }
})

// 分页数据变更
const onSizeChange = (size: any) => {
    params.pagesize = size;
    pagesizeRef.value = size;
    reloadGrid()
}

// 页码变更
const onPageChange = (page: any) => {
    params.page = page;
    pageRef.value = page;
    reloadGrid()
}

// 刷新请求
const reloadGrid = () => {
    store.commit('grid/LOADING')
    apiPyGrid(props.url, merge({
        _query: 1
    }, params, model), 'post').then(({ data }) => {
        trans.rows = get(data, 'list');
        trans.total = get(data, 'total');
        store.commit('grid/LOADED')
    })
}

// 搜索
const onFilter = (query: any) => {
    each(query, (val, key) => {
        set(model, key, val);
    })
    params.page = 1;
    pageRef.value = 1;
    store.commit('grid/LOADING')
    apiPyGrid(props.url, merge({
        _query: 1,
    }, params, query), 'post').then(({ data }) => {
        trans.rows = get(data, 'list');
        trans.total = get(data, 'total');
        store.commit('grid/LOADED')
    })
}

// 重置: 参数置空
const resetGrid = () => {
    store.commit('grid/LOADING')
    apiPyGrid(props.url, {
        _query: 1,
        page: 1,
        pagesize: pagesizeRef.value
    }, 'post').then(({ data }) => {
        trans.rows = get(data, 'list');
        trans.total = get(data, 'total');
        store.commit('grid/LOADED')
    })
}

// 监听重置操作
watch(() => store.state.grid.reset, (val) => {
    if (!val) {
        return;
    }
    resetGrid()
    store.commit('grid/RESET_OVER')
})
// 监听刷新操作
watch(() => store.state.grid.reload, (val) => {
    if (!val) {
        return;
    }
    reloadGrid()
    store.commit('grid/RELOAD_OVER')
})

// 更换URL, 重置请求
watch(() => props.url, (newVal, oldVal) => {
    if ((oldVal === '' && newVal) || (newVal !== oldVal)) {
        resetGrid();
    }
})

onMounted(() => {
    resetGrid();
})

</script>

<style scoped lang="less">
@import '../../../assets/style/vars';

.pagination {
    padding-top: var(--wc-pagination-padding)
}
</style>
