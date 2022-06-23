<template>
    <PxMain :title="trans.title" :has-filter="get(trans.filter, 'items', []).length > 0" v-model:filter="trans.isFilterVisible" :tip="gridTip"
        :actions="trans.actions" :action-scope="trans.scope">
        <!--范围-->
        <GridScope :scope="trans.scope" :scopes="trans.scopes"/>
        <!--搜索-->
        <GridSearch v-show="trans.isFilterVisible" :attr="trans.filter" :pk="trans.pk" :pk-values="trans.pkValues"/>
        <!--批处理-->
        <GridBatch :items="trans.batch" :pk="trans.pk" :pk-values="trans.pkValues"/>
        <!-- 表格数据 -->
        <GridTable :rows="trans.rows" :loading="dataLoading" :cols="trans.cols" :url="trans.url"
            :selection="trans.selection" :pk="trans.pk"
            @select="onSelection" @sort="onSortChange"
        />
        <!--分页-->
        <ElPagination class="pagination" :page-sizes="trans.pageSizes" :total="trans.total" background v-model:page-size="pagesizeRef"
            layout="sizes, prev, pager, next, total" v-model:current-page="pageRef"/>
    </PxMain>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { each, first, get, isEmpty, isEqual, isNull, merge, omit, pick, set, unset } from 'lodash-es';
import PxMain from '@/components/backend/PxMain.vue';
import { useRouter } from 'vue-router';
import { useStore } from "@/store";
import { base64Decode, queryDecode, queryEncode } from "@popjs/core/utils/helper";
import { apiPyRequest } from "@/services/poppy";
import { appSessionStore, baseUrl, toast } from "@/utils/util";
import { enableSkeleton, sessionGridKey } from "@/utils/conf";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_MOTION_GRID, MGR_APP_MOTION_GRID_EXPORT, MGR_APP_MOTION_GRID_SCOPE, MGR_APP_MOTION_GRID_SEARCH } from "@/bus";
import GridScope from "@/components/grid/GridScope.vue";
import GridBatch from "@/components/grid/GridBatch.vue";
import GridSearch from "@/components/grid/GridSearch.vue";
import GridTable from "@/components/grid/GridTable.vue";

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
    return '';
});
const pageRef = ref(1);
// 在搜索中
const isAtSearch = ref(false);
const sortRef = ref({});
const router = useRouter();
const queryRef = ref('frame,data')

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

    let queryOri: any = queryDecode(query);                              // 来自于路由的数据
    let queryParams = { '_query': queryRef.value }; // 进行请求的参数


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
    let routeCoverEncoded = queryEncode(routerParams);

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
// 搜索条件变化也会触发页码的变更, 这里是无需进行请求的
watch([() => pageRef.value, () => pagesizeRef.value], ([page, pagesize]) => {
    if (isAtSearch.value) {
        return;
    }
    const { queryParams } = combineQuery(page, pagesize, null);
    onRequest(queryParams)
})


const onRequest = (params: any = {}) => {

    if (queryRef.value.indexOf('frame') >= 0 && enableSkeleton()) {
        let frame = appSessionStore(sessionGridKey(trans.url));
        if (frame) {
            // remove frame
            queryRef.value = 'data';
            trans.title = get(frame, 'title');
            trans.cols = get(frame, 'cols');
            trans.scopes = get(frame, 'scopes', []);
            if (get(params, '_scope')) {
                trans.scope = get(params, '_scope')
            } else {
                trans.scope = get(frame, 'scope', '')
            }
            trans.actions = get(frame, 'actions');
            trans.filter = get(frame, 'filter');
            trans.batch = get(frame, 'batch', []);
            trans.pk = get(frame, 'pk');
            trans.pageSizes = get(frame, 'pageSizes');
            trans.selection = get(frame, 'selection');
            store.dispatch('poppy/SetTitle', trans.title);
        }
    }

    return apiPyRequest(trans.url, params, 'post').then(({ data }) => {
        if (queryRef.value.indexOf('data') !== -1) {
            trans.rows = get(data, 'list');
            trans.total = get(data, 'total');
        }
        // load frame
        if (queryRef.value.indexOf('frame') !== -1) {
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

            // cached trans;
            const { title, cols, scopes, scope, actions, filter, batch, pk, pageSizes, selection } = trans;
            appSessionStore(sessionGridKey(trans.url), {
                title, cols, scopes, scope, actions, filter, batch, pk, pageSizes, selection
            })
        }
        // filter
        if (queryRef.value.indexOf('filter') !== -1) {
            trans.actions = get(data, 'actions');
            trans.filter = get(data, 'filter');
        }
    })
}


const onInit = () => {
    let url = base64Decode(String(router.currentRoute.value.params.type));
    if (!url) {
        return;
    }
    if (trans.url === url) {
        return;
    }
    queryRef.value = 'frame,data';
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
    onInit();

    // 监听 Scope 变化
    emitter.on(MGR_APP_MOTION_GRID_SCOPE, (scope: any) => {
        router.push({
            query: {
                '_scope': scope
            }
        })
        if (trans.scope !== scope) {
            trans.scope = scope;
            queryRef.value = 'frame,data'
            const { queryParams } = combineQuery(1, null, null);
            onRequest(queryParams).then(() => {
                queryRef.value = 'data'
            });
        }
    })

    // 监听 Grid 操作, 用于操作完成之后的回调
    emitter.on(MGR_APP_MOTION_GRID, (action) => {
        // 刷新当前条件数据
        if (action === 'reload') {
            queryRef.value = 'data'
            const { queryParams } = combineQuery(null, null, null);
            onRequest(queryParams);
        }

        // 请求第一页数据
        if (action === 'reset') {
            emitter.emit(MGR_APP_MOTION_GRID_SEARCH, {});
        }

        // 更新查询条件
        if (action === 'filter') {
            queryRef.value = 'filter';
            const { queryParams } = combineQuery(1, null, null);
            onRequest(queryParams).then(() => {
                queryRef.value = 'data';
            });
        }
    })

    // 进行查询
    emitter.on(MGR_APP_MOTION_GRID_SEARCH, (query: any) => {
        isAtSearch.value = true;
        queryRef.value = 'data'
        const { queryParams } = combineQuery(1, null, query);
        onRequest(queryParams).finally(() => {
            isAtSearch.value = false;
        });
    })

    // 导出
    emitter.on(MGR_APP_MOTION_GRID_EXPORT, (val: any) => {
        let type = get(val, 'type', '');
        let model = get(val, 'model', '');
        const { queryParams } = combineQuery(1, null, model);
        let query = {
            _query: `export:${type}`
        };
        // all    : 所有数据, 清空查询条件
        // select : 当前选中的数据进行导出, 传入PK
        // query  : 根据查询条件输出数据
        // page   : 当前页数据
        if (type === 'select') {
            if (!trans.pkValues) {
                toast('尚未选中数据, 无法导出', true);
                return;
            }
            set(query, `_batch`, trans.pkValues);
        } else if (type === 'query') {
            unset(queryParams, '_query');
            query = merge(query, queryEncode(queryParams));
        } else if (type === 'page') {
            unset(queryParams, '_query');
            query = merge(query, queryEncode(queryParams));
            set(query, 'page', pageRef.value);
            set(query, 'pagesize', pagesizeRef.value);
        }
        let url = baseUrl(trans.url, query);
        window.open(url, '_blank')
    })
})


onUnmounted(() => {
    emitter.off(MGR_APP_MOTION_GRID)
    emitter.off(MGR_APP_MOTION_GRID_SCOPE)
    emitter.off(MGR_APP_MOTION_GRID_SEARCH)
    emitter.off(MGR_APP_MOTION_GRID_EXPORT)
})
</script>

<style scoped lang="less">


.pagination {
    padding-top: var(--wc-pagination-padding)
}


</style>
