<template>
    <ElTable :data="ezData" border stripe v-if="isEz">
        <ElTableColumn v-for="(title, hk) in ezHeader" :prop="hk" :key="hk" :label="title"/>
    </ElTable>
    <ElTable class="py--table" :data="refOriValue" border stripe v-else>
        <template v-for="col in get(attr, 'cols')" :key="col">
            <ElTableColumn
                :align="get(col, 'align', 'left')" :fixed="get(col, 'fixed', false)" :sortable="get(col, 'sortable')"
                :prop="get(col, 'field')" :min-width="get(col, 'min-width', '')" :width="get(col, 'width', '')" :label="get(col, 'label')">
                <template #default="{row}">
                    <ColumnText v-if="get(col, 'type') === 'text'" :value="get(row, col.field)"
                        :ellipsis="get(col, 'ellipsis', false)" :copyable="get(col, 'copyable', false)"
                        :editable="get(col, 'editable', '')" :attr="get(col, 'edit-attr', {})" :field="get(col, 'field')" :pk-id="row['_idx']"
                        @update="onUpdateCell"/>
                    <ColumnOnOff v-else-if="get(col, 'type') === 'on-off'" :value="get(row, col.field)"
                        :editable="get(col, 'editable', '')" :attr="get(col, 'edit-attr', {})" :field="get(col, 'field')" :pk-id="row['_idx']"
                        @update="onUpdateCell"/>
                    <ColumnSelect v-else-if="get(col, 'type') === 'select'" :value="get(row, col.field)"
                        :editable="get(col, 'editable', '')" :attr="get(col, 'edit-attr', {})" :field="get(col, 'field')" :pk-id="row['_idx']"
                        @update="onUpdateCell"/>
                    <ColumnImage v-else-if="get(col, 'type') === 'image'"
                        :value="get(row, col.field)"/>
                    <ColumnTableAction v-else-if="get(col, 'type') === 'table-action'"
                        :is-top="get(row, '_idx') === refTopIdx"
                        :is-last="get(row, '_idx') === refLastIdx"
                        @modify="onTableAction"
                        :pk="get(row, '_idx')" :editable="get(col, 'editable', [])"/>
                    <template v-else>{{ get(row, col.field) }}</template>
                </template>
            </ElTableColumn>
        </template>
        <template #empty>
            <ElButton class="el-button-has-mu" @click="onAdd">
                <XIcon type="mu:new_label"/>
                添加一行
            </ElButton>
        </template>
    </ElTable>
</template>
<script lang="ts" setup>
import { clone, each, find, first, get, isObjectLike, last, map, remove, set, slice } from 'lodash-es';
import { computed, onMounted, ref } from "vue";
import ColumnText from "@/components/grid/ColumnText.vue";
import ColumnOnOff from "@/components/grid/ColumnOnOff.vue";
import ColumnSelect from "@/components/grid/ColumnSelect.vue";
import ColumnImage from "@/components/grid/ColumnImage.vue";
import ColumnTableAction from "@/components/grid/ColumnTableAction.vue";
import XIcon from "@/components/element/XIcon.vue";
import dayjs from "dayjs";
import { toast } from "@/utils/util";


const props = defineProps({
    attr: Object,
    modelValue: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const ezHeader = computed(() => {
    return first(get(props.attr, 'easy-data'))
})
const isEz = computed(() => {
    return get(props.attr, 'is-easy')
})
const ezData = computed(() => {
    return slice(get(props.attr, 'easy-data'), 1)
})

const emit = defineEmits([
    'update:modelValue'
]);

const refOriValue = ref<any[]>([]);


const onAdd = () => {
    onTableAction({
        type: 'add',
    })
}

/**
 * 进行修改
 * @param obj
 */
const onUpdateCell = (obj: object) => {
    /* modify: 更新单元格数据
     * save : 保存数据到服务端
     * ---------------------------------------- */
    let pk = get(obj, 'pk');
    let field = get(obj, 'field');
    let value = get(obj, 'value');
    // 值变动请求服务器
    let row = find(refOriValue.value, { '_idx': pk }) as object;

    // 当前变动的对象是 {value} | value
    let cpOriVal = get(row, [field]);

    // 首先改变数据, 根据数据的类型来定, 如果是矢量类型, 则未经过 Render
    let cpEditVal = clone(cpOriVal);
    if (isObjectLike(cpEditVal)) {
        set(cpEditVal, 'value', value);
    } else {
        cpEditVal = value;
    }
    set(row, [field], cpEditVal);

    console.log(refOriValue.value);

    updateModelValue();
}

const createEmptyValue = () => {
    let row = {
        _idx: 'new:' + dayjs().millisecond()
    };
    each(get(props.attr, 'cols'), function (item) {
        if (get(item, 'type') !== 'table-action') {
            if (get(item, 'editable')) {
                set(row, [item.field], {
                    value: '',
                    disabled: false,
                });
            } else {
                set(row, [item.field], '');
            }
        }
    })
    return row;
}

const updateModelValue = () => {
    emit('update:modelValue', refOriValue.value);
}

const refTopIdx = computed(() => {
    let topVal = first(refOriValue.value);
    return get(topVal, '_idx');
})
const refLastIdx = computed(() => {
    let topVal = last(refOriValue.value);
    return get(topVal, '_idx');
})

/**
 * 进行修改
 * @param obj
 */
const onTableAction = (obj: object) => {
    let type = get(obj, 'type');
    let idx = get(obj, 'idx');

    switch (type) {
        case 'delete':
            remove(refOriValue.value, {
                '_idx': idx
            })
            break;
        case 'add':
            console.log(idx);
            if (!idx) {
                // 空数据添加
                refOriValue.value.push(createEmptyValue());
                return;
            }
            let idxAdd = 1;
            each(refOriValue.value, function (item, key) {
                if (get(item, '_idx') === idx) {
                    idxAdd = key + 1
                }
            })
            refOriValue.value.splice(idxAdd, 0, createEmptyValue());
            break;
        case 'down':
            let idxDown = 0;
            each(refOriValue.value, function (item, key) {
                if (get(item, '_idx') === idx) {
                    idxDown = key
                }
            })
            if (idxDown + 1 === refOriValue.value.length) {
                toast('已经是最后一个');
                return;
            }
            [refOriValue.value[idxDown], refOriValue.value[idxDown + 1]] = [refOriValue.value[idxDown + 1], refOriValue.value[idxDown]]
            break;
        case 'up':
            let idxUp = 0;
            each(refOriValue.value, function (item, key) {
                if (get(item, '_idx') === idx) {
                    idxUp = key
                }
            })
            if (idxUp === 0) {
                toast('已经是第一个');
                return;
            }
            [refOriValue.value[idxUp - 1], refOriValue.value[idxUp]] = [refOriValue.value[idxUp], refOriValue.value[idxUp - 1]]
            break;
        case 'copy':
            let idxCopy = 0;
            let valCopy = {}
            each(refOriValue.value, function (item, key) {
                if (get(item, '_idx') === idx) {
                    idxCopy = key;
                    valCopy = item;
                }
            })
            set(valCopy, '_idx', dayjs().millisecond())
            refOriValue.value.splice(idxCopy, 0, valCopy);
            break;
    }
    updateModelValue();
}

onMounted(() => {
    // 需要对数据进行处理加入默认PK
    refOriValue.value = map(props.modelValue, (val: any, index) => {
        let idx = `old:${index}`;
        set(val, '_idx', idx);
        return val;
    })
})

</script>
