<template>
    <PxMain>
        <template #title>
            <h3 class="main-title" v-if="trans.title">
                <span>{{ trans.title }}</span>
                <ElIcon :class="{filter:true, 'active':!trans.isFilterVisible}" v-if="get(trans.filter, 'items', []).length > 0"
                    @click="trans.isFilterVisible = !trans.isFilterVisible">
                    <Filter/>
                </ElIcon>
                <ElPopover :content="gridTip" v-if="gridTip">
                    <template #reference>
                        <ElButton type="danger" plain round :icon="Bell"/>
                    </template>
                </ElPopover>
            </h3>
        </template>
        <div class="main-actions">
            <QuickActions :items="trans.actions" :scope="trans.scope"/>
        </div>
        <ElTabs :model-value="trans.scope" v-if="trans.scopes" @update:model-value="onUpdateScope">
            <ElTabPane :label="get(scope, 'label')" :name="get(scope, 'value')" v-for="scope in trans.scopes" :key="get(scope, 'value')"/>
        </ElTabs>
        <FilterWidget v-show="trans.isFilterVisible" :attr="trans.filter" :model-value="searchRef" @filter="onFilter" :pk="trans.pk"
            :pk-values="trans.pkValues"/>
        <div class="batch-actions" v-if="trans.batch.length">
            <BatchActions :items="trans.batch" :pk="trans.pk" :pk-values="trans.pkValues"/>
        </div>
        <!-- 表格数据 -->
        <ElTable :data="trans.rows" border stripe v-loading="dataLoading" :size="trans.size" @sort-change="onSortChange"
            @selection-change="onSelection">
            <ElTableColumn type="selection" width="55" align="center" v-if="trans.selection" :selectable="()=> {return trans.selection && trans.pk}"/>
            <template v-for="col in trans.cols" :key="col">
                <ElTableColumn
                    :align="get(col, 'align', 'left')" :fixed="get(col, 'fixed', false)" :sortable="get(col, 'sortable')"
                    :prop="get(col, 'field')" :min-width="get(col, 'min-width', '')" :width="get(col, 'width', '')" :label="get(col, 'label')">
                    <template #default="scope">
                        <ColumnText v-if="get(col, 'type') === 'text'" :ellipsis="get(col, 'ellipsis', false)" :copyable="get(col, 'copyable', false)"
                            :value="get(scope.row, String(get(col, 'field')))"/>
                        <ColumnLink v-else-if="get(col, 'type') === 'link'" :ellipsis="get(col, 'ellipsis', false)"
                            :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnImage v-else-if="get(col, 'type') === 'image'" :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnDownload v-else-if="get(col, 'type') === 'download'" :value="JSON.parse(get(scope.row, String(get(col, 'field'))))"/>
                        <ColumnHtml v-else-if="get(col, 'type') === 'html'" :value="get(scope.row, String(get(col, 'field')))"/>
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
import { each, first, get, isEmpty, isEqual, isNull, isObject, map, merge, omit, pick, set, unset } from 'lodash-es';
import PxMain from '@/framework/components/base/PxMain.vue';
import { Bell } from "@element-plus/icons";
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import { base64Decode, base64Encode } from "@/framework/utils/helper";
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
import { baseUrl, toast } from "@/framework/utils/util";
import ColumnHtml from "@/framework/components/grid/ColumnHtml.vue";

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
    pkValues: <any>[],
    pkNotInRow: false,
    filter: {},
    scopes: [],
    scope: '',
    pageSizes: [15],
    selection: false,
    total: 0,
    media: computed(() => store.state.poppy.media),
    size: computed(() => store.state.poppy.size)
})

const pagesizeRef = ref(15);
const dataLoading = computed(() => {
    return queryRef.value.indexOf('data') !== -1 && store.getters["poppy/isLoading"](trans.url)
});
const gridTip = computed(() => {
    if (!trans.pk && trans.batch) {
        return '当前数据中未设定 PK, 无法进行批量操作';
    }
    if (trans.pkNotInRow) {
        return '当前数据中无ID 返回, 无法进行批处理操作或者导出'
    }
    return false;
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
        trans.pkNotInRow = false;
        trans.pkValues = [];
        return;
    }
    const one = first(row);
    let id = get(one, trans.pk, '');
    if (!id) {
        trans.pkNotInRow = true;
        return;
    }
    let ids: any[] = [];
    each(row, (item) => {
        ids.push(get(item, trans.pk, ''))
    })
    trans.pkValues = ids;
}

/**
 * _query, _scope, page, pagesize
 */
const combineQuery = (page: null | number, page_size: null | number, params: {} | null, sort: {} | null = null) => {
    // null  => default
    // value => change

    // 如果存在 Query
    const { query } = router.currentRoute.value;

    let queryOri = {};                              // 来自于路由的数据
    let queryParams = { '_query': queryRef.value }; // 进行请求的参数

    // 恢复到查询对象
    map(query, function (val, key) {
        let valDecode = val;
        if (String(val).indexOf('--wb--') === 0) {
            valDecode = JSON.parse(base64Decode(String(val).substring(6)));
        }
        set(queryOri, key, valDecode)
    });


    // 获取参数 : page
    let pageVal;
    if (isNull(page)) { // 取默认值
        pageVal = pageRef.value
        // query 覆盖
        const pageQuery = Number(get(queryOri, 'page', 1));
        if (pageQuery) {
            pageVal = Number(pageQuery);
        }
    } else {
        pageVal = page;
    }
    set(queryParams, 'page', pageVal);

    // 获取参数 : pagesize
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
    set(queryParams, 'pagesize', pageSizeVal);

    // 获取 Scope, Scope 情况下先调整, 没有再进行取值, 也就是刷新保留默认参数
    let scopeVal = '';
    if (trans.scope) {
        scopeVal = trans.scope;
    } else {
        const scopeQuery = String(get(queryOri, '_scope', ''));
        if (scopeQuery) {
            scopeVal = String(scopeQuery);
        }
    }
    set(queryParams, '_scope', scopeVal)

    /* 排序查询
   * ---------------------------------------- */
    let sortVal;
    if (isNull(sort) || isEmpty(sort)) {
        sortVal = sortRef.value
        const sortQuery = get(queryOri, '_sort', {});
        if (sortQuery) {
            sortVal = sortQuery;
        }
    } else {
        sortVal = sort;
    }
    set(queryParams, '_sort', sortVal);

    // 查询条件参数, 原始参数忽略掉 _scope, page, pagesize
    let paramsVal;
    if (isNull(params)) { // null : 保留查询参数
        paramsVal = omit(queryOri, ['_scope', 'page', 'pagesize']);
    } else {              // 以查询传参为主要
        paramsVal = params;
    }
    queryParams = merge(paramsVal, queryParams);

    let routerParams = omit(queryParams, ['_query']);
    // 对路由参数进行 encode
    let routeCoverEncoded = {};
    map(routerParams, function (val, key) {
        let valEncode;
        if (isObject(val)) {
            valEncode = '--wb--' + base64Encode(JSON.stringify(val));
        } else {
            valEncode = val;
        }
        set(routeCoverEncoded, key, valEncode)
    });

    // 是否需要更新路由信息
    if (!isEqual(routeCoverEncoded, query)) {
        nextTick(() => {
            router.push({
                query: routeCoverEncoded
            })
        })
    }


    /* 路由参数删除 pagesize 为 searchRef
     * ---------------------------------------- */
    searchRef.value = omit(queryParams, ['_query', '_scope', '_sort', 'pagesize', 'page']);
    let resetParams = pick(queryParams, ['_query', '_scope', 'page'])
    pageRef.value = pageVal;
    pagesizeRef.value = pageSizeVal;
    sortRef.value = sortVal
    return {
        queryParams,
        resetParams,
        queryOri
    }
}

// 页码变更 / 分页数量变更
watch([() => pageRef.value, () => pagesizeRef.value], ([page, pagesize]) => {
    const { queryParams } = combineQuery(page, pagesize, null);
    onRequest(queryParams)
})

/**
 * 查询
 * @param val
 */
const onFilter = (val: object) => {
    searchRef.value = get(val, 'model', {});
    let type = get(val, 'type', '');
    let model = get(val, 'model', '');
    let ep = get(val, 'ep', '');
    const { queryParams } = combineQuery(1, null, model);
    if (type === 'export') {
        let query = {
            _query: `export:${ep}`
        };
        // all : 所有数据, 清空查询条件
        // select : 存在主键则进行筛选, 传入 pk:
        // query : 根据查询条件输出数据
        // page  : 当前页数据
        if (ep === 'select') { // 选择的数据导出
            if (!trans.pkValues) {
                toast('尚未选中数据, 无法导出', true);
                return;
            }
            set(query, `_batch`, trans.pkValues);
            // add pk
        } else if (ep === 'query') { // 查询数据, 加入查询参数
            unset(queryParams, '_query');
            query = merge(query, queryParams);
        }

        let url = baseUrl(trans.url, query);
        window.open(url, '_blank')
        return;
    }
    onRequest(queryParams);
}

const onRequest = (params: any = {}) => {
    return apiPyRequest(trans.url, params, 'post').then(({ data }) => {
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
            trans.selection = get(data, 'options.selection');
            store.dispatch('poppy/SetTitle', get(data, 'title'));
        }
        // filter
        if (queryRef.value.indexOf('filter') !== -1) {
            trans.actions = get(data, 'actions');
            trans.filter = get(data, 'filter');
        }
    })
}

const onUpdateScope = (val: string) => {
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
    const { queryParams } = combineQuery(null, null, null);
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
