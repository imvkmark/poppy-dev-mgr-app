<template>
    <div class="table-cell table-cell-editable" v-if="!inEdit" @click="onEdit">
        {{ get(value, 'value') }}
    </div>
    <div v-else>
        <FieldText :ref="el => elRef = el" :model-value="editVal" @update:model-value="onUpdateVal" @modify="onModify"/>
    </div>
</template>
<script lang="ts" setup>
import { nextTick, ref } from "vue";
import { get } from "lodash-es";
import FieldText from "@/components/form/FieldText.vue";

const props = defineProps({
    field: {
        type: String,
        required: true,
        default: ''
    },
    pkId: {
        type: [String, Number],
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
const editVal = ref('');
const elRef = ref(null);


/**
 * 进入编辑模式
 */
const onEdit = () => {
    editVal.value = get(props.value, 'value');
    oriVal.value = get(props.value, 'value');
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

    // 自定义字段名称, 用于
    let customField = get(props.value, 'field');

    emits('modify', {
        pk: props.pkId,
        post_field: customField ? customField : props.field,
        field: props.field,
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
