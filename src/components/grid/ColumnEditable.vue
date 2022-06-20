<template>
    <div class="table-cell table-cell-editable" v-if="!inEdit" @click="onEdit(row, col)">
        {{ isObjectLike(value) ? JSON.stringify(value) : value }}
    </div>
    <div v-else>
        <FieldText :ref="el => elRef = el" :model-value="editVal" @update:model-value="onUpdateVal" @modify="onModify"/>
    </div>
</template>
<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { get, isObjectLike } from "lodash-es";
import FieldText from "@/components/form/FieldText.vue";

const props = defineProps({
    row: {
        type: Object,
        default: () => {
            return {}
        }
    },
    col: {
        type: Object,
        default: () => {
            return {}
        }
    },
    pk: {
        type: String,
        default: ''
    },
    value: {
        type: [String, Number, Array, Object],
        default: ''
    }
})


const emits = defineEmits([
    'modify'
]);

const inEdit = ref(false);
const oriVal = ref('');
const editPk = ref('');
const editField = ref('');
const editVal = ref('');
const elRef = ref(null);


/**
 * 进入编辑模式
 * @param row
 * @param col
 */
const onEdit = (row: any, col: any) => {
    editField.value = get(col, 'field');
    editPk.value = get(row, props.pk);
    editVal.value = get(row, editField.value);
    oriVal.value = get(row, editField.value);
    inEdit.value = true;

    nextTick(() => {
        // @ts-ignore 输入框获取焦点
        elRef.value?.focus();
    })
}


const onModify = () => {
    inEdit.value = false;
    if (editVal.value === oriVal.value) {
        return;
    }
    emits('modify', {
        pk: editPk.value,
        field: editField.value,
        value: editVal.value
    });
}

/**
 * 值变动
 * @param val
 */
const onUpdateVal = (val: any) => {
    editVal.value = val;
}

</script>
<style lang="less" scoped>
.text-ellipsis {
    cursor: pointer;
}

</style>
