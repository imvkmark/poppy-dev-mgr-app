<template>
    <PxMain>
        <template #title>
            <h3 class="main-title" v-if="trans.title">
                <span>{{ trans.title }}</span>
                <ElIcon :class="{filter:true, 'active':!trans.isFilterVisible}" v-if="get(trans.filter, 'items', []).length > 0"
                    @click="trans.isFilterVisible = !trans.isFilterVisible">
                    <Filter/>
                </ElIcon>
            </h3>
        </template>
        <div class="main-actions">
            <QuickActions :items="trans.actions" :scope="trans.scope"/>
        </div>
        <ElTabs :model-value="trans.scope" v-if="trans.scopes" @update:model-value="onUpdateScope">
            <ElTabPane :label="get(scope, 'label')" :name="get(scope, 'value')" v-for="scope in trans.scopes" :key="get(scope, 'value')"/>
        </ElTabs>
        <FilterWidget v-show="trans.isFilterVisible" :attr="trans.filter" :model-value="searchRef"
            @update:model-value="onHandleFilter"/>
        <div class="batch-actions" v-if="trans.batch.length">
            <ElPopover content="当前数据中未设定 PK, 无法进行批量操作" v-if="!trans.pk">
                <template #reference>
                    <ElButton disabled type="danger" :icon="Bell"></ElButton>
                </template>
            </ElPopover>
            <ElPopover content="当前数据中不存在主键数据" v-if="trans.batchNoField">
                <template #reference>
                    <ElButton disabled type="danger" :icon="Bell"></ElButton>
                </template>
            </ElPopover>
            <BatchActions :items="trans.batch" :append="trans.append"/>
        </div>
        <!-- 表格数据 -->
        <ElTable :data="trans.rows" border stripe v-loading="dataLoading" :size="trans.size" @sort-change="onSortChange"
            @selection-change="onSelection">
            <ElTableColumn type="selection" width="55" v-if="trans.batch.length"/>
            <template v-for="col in trans.cols" :key="col">
                <ElTableColumn
                    :align="get(col, 'align', 'left')" :fixed="get(col, 'fixed', false)" :sortable="get(col, 'sortable')"
                    :prop="get(col, 'field')" :min-width="get(col, 'min-width', '')" :width="get(col, 'width', '')" :label="get(col, 'label')">
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
            <ElPagination :page-sizes="trans.pageSizes" :total="trans.total" background v-model:page-size="pagesizeRef"
                layout="sizes, prev, pager, next, total" v-model:current-page="pageRef"/>
        </div>
    </PxMain>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { clone, each, first, get, isEmpty, isEqual, isNull, keys, merge, omit, set } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { Bell } from "@element-plus/icons";
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import { base64Decode, pyWarning } from "@/framework/utils/helper";
import { apiPyRequest } from "@/framework/services/poppy";
import { Filter } from "@element-plus/icons-vue";
import QuickActions from "@/framework/components/Tools/QuickActions.vue";
import BatchActions from "@/framework/components/Tools/BatchActions.vue";
import ColumnText from "@/framework/components/grid/ColumnText.vue";
import ColumnLink from "@/framework/components/grid/ColumnLink.vue";
import ColumnImage from "@/framework/components/grid/ColumnImage.vue";
import ColumnActions from "@/framework/components/grid/ColumnActions.vue";
import ColumnDownload from "@/framework/components/grid/ColumnDownload.vue";
import FilterWidget from "@/framework/components/widget/FilterWidget.vue";

const store = useStore();
const trans = reactive({
    title: '',
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
    pageSizes: [15],
    total: 0,
    append: {},
    batchNoField: false,
    media: computed(() => store.state.poppy.media),
    size: computed(() => store.state.poppy.size)
})

const pagesizeRef = ref(15);
const dataLoading = computed(() => {
    return queryRef.value.indexOf('data') !== -1 && store.getters["poppy/isLoading"](trans.url)
});
const pageRef = ref(1);
const sortRef = ref({});
const router = useRouter();
const searchRef = ref({});
const queryRef = ref('struct,data')

const onSortChange = (col: any) => {
    let prop = get(col, 'prop');
    let order = get(col, 'order');
    let sort = {
        column: prop,
        type: order === 'descending'
            ? 'desc'
            : (order === 'ascending' ? 'asc' : null)
    }
    const { queryParams } = combineQuery(null, null, null, sort);
    onRequest(queryParams)
}

/**
 * 批量选择
 * @param row
 */
const onSelection = (row: []) => {
    if (row.length === 0) {
        trans.append = {};
        return;
    }
    const one = first(row);
    let id = get(one, trans.pk, '');
    if (!id) {
        trans.batchNoField = true;
        return;
    }
    let ids: any[] = [];
    each(row, (item) => {
        ids.push(get(item, trans.pk, ''))
    })
    let obj: any = {};
    obj[trans.pk] = ids;
    trans.append = obj;
}

const combineQuery = (page: null | number, page_size: null, params: {} | null, sort: {} | null = null) => {
    // null  => default
    // value => change

    // 如果存在 Query
    const { query } = router.currentRoute.value;

    let queryOri = clone(query);
    let queryParams = {
        '_query': queryRef.value
    };
    let resetParams = {
        '_query': queryRef.value
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
    if (trans.scope) {
        set(queryParams, '_scope', trans.scope)
        set(resetParams, '_scope', trans.scope)
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

    /* 排序查询条件(当前查询条件不放置在 Query 中)
     * ---------------------------------------- */
    let sortVal;
    if (isNull(sort) || isEmpty(sort)) {  // Default : 使用默认的
        sortVal = sortRef.value
    } else {
        sortVal = sort;
    }
    sortRef.value = sortVal
    set(queryParams, '_sort', sortVal);
    return {
        queryParams,
        resetParams,
        queryOri
    }
}

// 页码变更 / 分页数量变更
watch([() => pageRef.value, () => pagesizeRef.value], () => {
    const { queryParams } = combineQuery(null, null, {});
    onRequest(queryParams)
})

const onHandleFilter = (model: {}) => {
    searchRef.value = model;
    const { queryParams } = combineQuery(1, null, model);
    onRequest(queryParams);
}

const onRequest = (params: any = {}) => {
    return apiPyRequest(trans.url, params, 'get').then(({ data }) => {
        if (queryRef.value.indexOf('data') != -1) {
            trans.rows = get(data, 'list');
            trans.total = get(data, 'total');
        }
        // load struct
        if (queryRef.value.indexOf('struct') !== -1) {
            trans.title = get(data, 'title');
            trans.cols = get(data, 'cols');
            trans.scopes = get(data, 'scopes', []);
            trans.scope = get(data, 'scope', '')
            trans.actions = get(data, 'actions');
            trans.filter = get(data, 'filter');
            trans.batch = get(data, 'batch', []);
            trans.pk = get(data, 'pk');
            trans.pageSizes = get(data, 'options.page_sizes');
            store.dispatch('poppy/SetTitle', get(data, 'title'));
        }
        // filter
        if (queryRef.value.indexOf('filter') !== -1) {
            trans.actions = get(data, 'actions');
            trans.filter = get(data, 'filter');
        }
    })
}

const onUpdateScope = (val) => {
    pyWarning('update-scope', val, trans.scope);
    router.push({
        query: {
            '_scope': val
        }
    })
    if (trans.scope !== val) {
        trans.scope = val;
        queryRef.value = 'struct,data'
        const { queryParams } = combineQuery(1, null, null);
        onRequest(queryParams).then(() => {
            queryRef.value = 'data'
        });
    }
}

// 监听 Grid 操作, 用于操作完成之后的回调
watch(() => store.state.poppy.grid, (newVal) => {
    if (!newVal) {
        return;
    }
    if (newVal === 'reload') {
        queryRef.value = 'data'
        const { queryParams } = combineQuery(1, null, null);
        onRequest(queryParams);

    }
    if (newVal === 'filter') {
        queryRef.value = 'filter';
        const { queryParams } = combineQuery(1, null, null);
        onRequest(queryParams).then(() => {
            queryRef.value = 'data';
        });
    }
    store.dispatch('poppy/ClearGrid')
})

const onInit = () => {
    let url = base64Decode(String(router.currentRoute.value.params.type));
    if (!url) {
        return;
    }
    if (trans.url === url) {
        return;
    }
    queryRef.value = 'struct,data';
    trans.url = url;
    trans.scope = '';
    const { queryParams } = combineQuery(1, null, null);
    // 初始化完成之后仅仅查询数据
    onRequest(queryParams).then(() => {
        queryRef.value = 'data';
    });
}

watch(() => router.currentRoute.value.params.type, () => {
    if (router.currentRoute.value.name !== 'py:grid.index') {
        return;
    }
    onInit()
})
onMounted(() => {
    onInit()
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

.pagination {
    padding-top: var(--wc-pagination-padding)
}

.batch-actions {
    padding-bottom: 0.5rem;
}
</style>
