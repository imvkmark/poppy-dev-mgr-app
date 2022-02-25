<template>
    <Filter :attr="filter" :scopes="scopes" @search="onSearch" @reset="resetGrid" v-model:scope="scopeRef"/>
    <!-- 表格数据 -->
    <ElTable :data="trans.rows" border stripe v-loading="trans.loading" :size="trans.elementSize">
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
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { clone, first, get, isEqual, isNull, keys, merge, omit, set } from 'lodash-es';
import { useStore } from '@/store';
import ColumnText from "@/framework/components/grid/ColumnText.vue";
import ColumnLink from "@/framework/components/grid/ColumnLink.vue";
import ColumnImage from "@/framework/components/grid/ColumnImage.vue";
import ColumnDownload from "@/framework/components/grid/ColumnDownload.vue";
import ColumnActions from "@/framework/components/grid/ColumnActions.vue";
import { apiPyRequest } from "@/framework/services/poppy";
import Filter from "@/framework/components/widget/FilterWidget.vue";
import { useRouter } from "vue-router";

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
    scopes: {
        type: Array,
        default: () => {
            return []
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
    elementSize: computed(() => store.state.poppy.elementSize),
    loading: computed(() => store.state.grid.loading)
})
const pagesizeRef = ref(15);
const pageRef = ref(1);
const scopeRef = ref('');
const router = useRouter();

const combineQuery = (page: null | number, page_size: null, scope: null, params: {}) => {
    // null  => default
    // value => change

    // 如果存在 Query
    const { query } = router.currentRoute.value;

    let queryOri = clone(query);
    let queryParams = {
        '_query': 1
    };
    let resetParams = {
        '_query': 1
    };
    // 组合页码
    let pageVal;
    if (isNull(page)) { // 取默认值
        pageVal = pageRef.value
    } else {
        pageVal = page;
    }
    pageRef.value = pageVal;
    set(queryParams, 'page', pageVal);
    set(resetParams, 'page', pageVal);

    // 组合页数
    let pageSizeVal;
    if (isNull(page_size)) { // 取默认值
        pageSizeVal = pagesizeRef.value
        // query 覆盖
        const pagesizeQuery = String(get(queryOri, 'pagesize', ''));
        if (pagesizeQuery) {
            pageSizeVal = Number(pagesizeQuery);
        }
    } else {
        pageSizeVal = page_size;
    }

    pagesizeRef.value = pageSizeVal;
    set(queryParams, 'pagesize', pageSizeVal);
    set(resetParams, 'pagesize', pageSizeVal);
    queryOri = omit(queryOri, 'pagesize')


    // 获取 Scope
    let scopeVal = '';
    if (isNull(scope)) {
        // 取第一个默认值
        if (props.scopes?.length) {
            // 默认Scope
            let one = first(props.scopes);
            scopeVal = get(one, 'value', '');
        }
        // 检测 Query 中是否存在
        const scopeQuery = String(get(queryOri, '_scope', ''));
        if (scopeQuery) {
            scopeVal = scopeQuery;
        }
    } else {
        scopeVal = scope;
    }
    queryOri = omit(queryOri, 'pagesize')
    if (scopeVal) {
        scopeRef.value = scopeVal;
        set(queryParams, '_scope', scopeRef.value)
        set(resetParams, '_scope', scopeRef.value)
        queryOri = omit(queryOri, '_scope')
    }

    // 查询条件参数
    let paramsVal;
    if (isNull(params)) { // null : 保留查询参数
        paramsVal = clone(queryOri);
    } else {              // 以查询传参为主要, 取消记忆参数
        paramsVal = params;
        queryOri = {}
    }
    queryParams = merge(paramsVal, queryParams);

    // 获取参数中的查询条件
    if (keys(queryOri).length) {
        queryParams = merge(queryParams, queryOri);
    }

    let routerParams: any = clone(queryParams);
    routerParams = omit(routerParams, ['page', '_query']);

    const isUpdateRouter = !isEqual(routerParams, query);

    // 更改路由
    if (isUpdateRouter) {
        nextTick(() => {
            router.push({
                query: routerParams
            })
        })
    }

    return {
        queryParams,
        resetParams,
    }
}

// 分页数据变更
const onSizeChange = (size: any) => {
    const { queryParams } = combineQuery(null, size, null, {});
    reloadGrid(queryParams)
}

// 页码变更
const onPageChange = (page: any) => {
    const { queryParams } = combineQuery(page, null, null, {});
    reloadGrid(queryParams)
}

// 刷新请求
const reloadGrid = (query_params: {}) => {
    store.commit('grid/LOADING')
    apiPyRequest(props.url, query_params, 'post').then(({ data }) => {
        trans.rows = get(data, 'list');
        trans.total = get(data, 'total');
        store.commit('grid/LOADED')
    }).catch(() => {
        store.commit('grid/LOADED')
    })
}

// 搜索
const onSearch = (query: any) => {
    const { queryParams } = combineQuery(1, null, null, query);
    store.commit('grid/LOADING')
    apiPyRequest(props.url, queryParams, 'post').then(({ data }) => {
        trans.rows = get(data, 'list');
        trans.total = get(data, 'total');
        store.commit('grid/LOADED')
    })
}

// 重置: 参数置空
const resetGrid = () => {
    store.commit('grid/LOADING');
    if (!props.url) {
        return;
    }
    const { resetParams } = combineQuery(1, null, null, {});
    apiPyRequest(props.url, resetParams, 'post').then(({ data }) => {
        trans.rows = get(data, 'list');
        trans.total = get(data, 'total');
        store.commit('grid/LOADED');
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
    const { queryParams } = combineQuery(null, null, null, {});
    reloadGrid(queryParams)
    store.commit('grid/RELOAD_OVER')
})

watch(() => scopeRef.value, (val: any) => {
    if (!val) {
        return;
    }
    const { queryParams } = combineQuery(1, null, val, {});
    reloadGrid(queryParams)
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
.pagination {
    padding-top: var(--wc-pagination-padding)
}
</style>
