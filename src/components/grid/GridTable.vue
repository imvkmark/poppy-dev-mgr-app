<template>
    <ElTable class="py--table" :data="rows" border stripe v-loading="loading" :size="trans.size" @sort-change="onSort"
        @selection-change="onSelect">
        <!-- 是否存在 | 是否启用 -->
        <ElTableColumn type="selection" width="55" align="center" v-if="selection" :selectable="()=> {return selection && pk}"/>
        <template v-for="col in cols" :key="col">
            <ElTableColumn
                :align="get(col, 'align', 'left')" :fixed="get(col, 'fixed', false)" :sortable="get(col, 'sortable')"
                :prop="get(col, 'field')" :min-width="get(col, 'min-width', '')" :width="get(col, 'width', '')" :label="get(col, 'label')">
                <template #default="{row}">
                    <ColumnText v-if="get(col, 'type') === 'text'" :ellipsis="get(col, 'ellipsis', false)" :copyable="get(col, 'copyable', false)"
                        :value="get(row, col.field)"/>
                    <ColumnHidden v-else-if="get(col, 'type') === 'hidden'"
                        :pk="get(row, [props.pk])" :value="get(row, col.field)"/>
                    <ColumnLink v-else-if="get(col, 'type') === 'link'"
                        :ellipsis="get(col, 'ellipsis', false)" :value="get(row, col.field)"/>
                    <ColumnImage v-else-if="get(col, 'type') === 'image'"
                        :value="get(row, col.field)"/>
                    <ColumnDownload v-else-if="get(col, 'type') === 'download'"
                        :value="get(row, col.field)"/>
                    <ColumnHtml v-else-if="get(col, 'type') === 'html'"
                        :value="get(row, col.field)"/>
                    <ColumnEditable v-else-if="get(col, 'type') === 'editable'"
                        :field="get(col, 'field')" :value="get(row, col.field)" :pk-id="row[props.pk]" @modify="onModify"/>
                    <ColumnSwitchable v-else-if="get(col, 'type') === 'switchable'"
                        :field="get(col, 'field')" :value="get(row, col.field)" :pk-id="row[props.pk]" @modify="onModify"/>
                    <ColumnActions v-else-if="get(col, 'type') === 'actions'"
                        :value="get(row, col.field)"/>
                    <template v-else>{{ get(row, col.field) }}</template>
                </template>
            </ElTableColumn>
        </template>
    </ElTable>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { clone, find, get, set } from 'lodash-es';
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import ColumnText from "@/components/grid/ColumnText.vue";
import ColumnLink from "@/components/grid/ColumnLink.vue";
import ColumnImage from "@/components/grid/ColumnImage.vue";
import ColumnDownload from "@/components/grid/ColumnDownload.vue";
import ColumnHtml from "@/components/grid/ColumnHtml.vue";
import ColumnActions from "@/components/grid/ColumnActions.vue";
import { toast } from "@/utils/util";
import { apiPyRequest } from "@/services/poppy";
import ColumnHidden from "@/components/grid/ColumnHidden.vue";
import ColumnEditable from "@/components/grid/ColumnEditable.vue";
import ColumnSwitchable from "@/components/grid/ColumnSwitchable.vue";

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    url: {
        type: String,
        default: ''
    },
    selection: {
        type: Boolean,
        default: false
    },
    pk: {
        type: String,
        default: ''
    },
    rows: {
        type: Array,
        default: () => {
            return []
        }
    },
    cols: {
        type: Array,
        default: () => {
            return []
        }
    }
})

/**
 * 进行修改
 * @param obj
 */
const onModify = (obj: object) => {
    let pk = get(obj, 'pk');
    let postField = get(obj, 'post_field');
    let field = get(obj, 'field');
    let value = get(obj, 'value');
    // 值变动请求服务器

    let row = find(props.rows, { [props.pk]: pk }) as object;

    // 当前变动的对象是 {value}
    let cpOriVal = get(row, [field]);

    // 自定义修改地址, 可以自定义验证
    let queryUrl = get(cpOriVal, 'query', '')

    // 首先改变数据
    let cpEditVal = clone(cpOriVal);
    set(cpEditVal, 'value', value);
    set(row, [field], cpEditVal);

    // 请求服务端
    apiPyRequest(queryUrl ? queryUrl : props.url, {
        _query: 'edit',
        _pk: pk,
        _field: postField,
        _value: value,
    }, 'post').then(({ success, message }) => {
        if (!success) {
            // 修改失败重置数据
            set(row, [field], cpOriVal);
            toast(message, false);
        }
    })
}

const emits = defineEmits([
    'sort',
    'select'
])

const store = useStore();
const router = useRouter();

const trans = reactive({
    size: computed(() => store.state.poppy.size),
})

const onSort = (val: any) => {
    emits('sort', val)
}
const onSelect = (val: any) => {
    emits('select', val)
}
</script>
