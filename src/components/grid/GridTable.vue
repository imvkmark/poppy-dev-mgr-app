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
                    <div class="table-cell" :class="{ 'table-cell-editable' :get(col, 'edit')}"
                        v-if="!get(inEdit, editKeyName(row, col))"
                        @click="onEdit(row, col)">
                        <ColumnText v-if="get(col, 'type') === 'text'" :ellipsis="get(col, 'ellipsis', false)" :copyable="get(col, 'copyable', false)"
                            :value="get(row, col.field)"/>
                        <ColumnLink v-else-if="get(col, 'type') === 'link'" :ellipsis="get(col, 'ellipsis', false)"
                            :value="get(row, col.field)"/>
                        <ColumnImage v-else-if="get(col, 'type') === 'image'" :value="get(row, col.field)"/>
                        <ColumnDownload v-else-if="get(col, 'type') === 'download'" :value="get(row, col.field)"/>
                        <ColumnHtml v-else-if="get(col, 'type') === 'html'" :value="get(row, col.field)"/>
                        <ColumnActions v-else-if="get(col, 'type') === 'actions'"
                            :value="get(row, col.field)"/>
                        <template v-else>
                            {{ get(row, col.field) }}
                        </template>
                    </div>
                    <div v-else>
                        <FieldText :ref="el => elRef = el" v-if="get(col, 'edit') === 'text'"
                            :model-value="editVal" @update:model-value="onUpdateVal" @modify="onModify"/>
                    </div>
                </template>
            </ElTableColumn>
        </template>
    </ElTable>
</template>
<script lang="ts" setup>
import { computed, nextTick, reactive, ref } from 'vue';
import { clone, find, get, set, unset } from 'lodash-es';
import { useStore } from "@/store";
import { useRouter } from "vue-router";
import ColumnText from "@/components/grid/ColumnText.vue";
import ColumnLink from "@/components/grid/ColumnLink.vue";
import ColumnImage from "@/components/grid/ColumnImage.vue";
import ColumnDownload from "@/components/grid/ColumnDownload.vue";
import ColumnHtml from "@/components/grid/ColumnHtml.vue";
import ColumnActions from "@/components/grid/ColumnActions.vue";
import { toast } from "@/utils/util";
import FieldText from "@/components/form/FieldText.vue";
import { apiPyRequest } from "@/services/poppy";

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

const inEdit = ref({});
const oriVal = ref('');
const editPk = ref('');
const editField = ref('');
const editVal = ref('');
const elRef = ref(null);

const editKeyName = (row: any, col: any) => {
    let pkVal = get(row, props.pk);
    let fieldName = get(col, 'field');
    return `${pkVal}-${fieldName}`
}
const onModify = () => {
    let cpPkVal = clone(editPk.value);
    let cpFieldName = clone(editField.value);
    let cpEditVal = clone(editVal.value);
    let cpOriVal = clone(oriVal.value);
    let key = `${cpPkVal}-${cpFieldName}`;

    // 取消编辑状态
    unset(inEdit.value, key);

    // 值变动请求服务器
    if (editVal.value !== oriVal.value) {
        let row = find(props.rows, { [props.pk]: cpPkVal }) as object;

        // 首先改变数据
        set(row, [cpFieldName], cpEditVal);

        // 请求服务端
        apiPyRequest(props.url, {
            _query: 'edit',
            _pk: cpPkVal,
            _field: cpFieldName,
            _value: cpEditVal,
        }, 'post').then(({ success, message }) => {
            if (!success) {
                set(row, [cpFieldName], cpOriVal);
                toast(message, false);
            }
        })
    }
}

/**
 * 值变动
 * @param val
 */
const onUpdateVal = (val: any) => {
    editVal.value = val;
}

/**
 * 进入编辑模式
 * @param row
 * @param col
 */
const onEdit = (row: any, col: any) => {
    if (!get(col, 'edit')) {
        return;
    }
    if (get(col, 'edit') !== 'text') {
        toast('不支持的编辑模式');
        return;
    }
    editField.value = get(col, 'field');
    editPk.value = get(row, props.pk);
    editVal.value = get(row, editField.value);
    oriVal.value = get(row, editField.value);
    set(inEdit.value, editKeyName(row, col), true);

    nextTick(() => {
        // @ts-ignore 输入框集中
        elRef.value?.focus();
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
