<template>
    <div class="table-cell table-cell-editable" :class="{'table-cell-disabled': refDisabled}" v-if="!refInEdit" @click="onEdit">
        {{ refValue }}
    </div>
    <template v-else>
        <div class="d-flex flex-nowrap align-items-center select-on-edit">
            <FieldSelect :model-value="editVal" :attr="refAttr" @update:model-value="onUpdateVal"/>
            <ElButton size="small" @click="onModify" plain :disabled="editVal === oriVal">
                <span class="material-symbols-outlined">done</span>
            </ElButton>
            <ElButton size="small" @click="refInEdit = false" plain type="warning">
                <span class="material-symbols-outlined">block</span>
            </ElButton>
        </div>
    </template>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { find, get } from "lodash-es";
import FieldSelect from "@/components/form/FieldSelect.vue";

const props = defineProps({
    field: {
        type: String,
        required: true,
        default: ''
    },
    editable: {
        type: String,
        default: ''
    },
    attr: {
        type: Object,
        default: () => ({})
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

const refEditable = computed(() => {
    return props.editable && props.pkId && !get(props.value, 'disabled');
})
const refDisabled = computed(() => {
    return props.editable && (!props.pkId || get(props.value, 'disabled'));
})

const emits = defineEmits([
    'update'
]);

const isMounted = ref(false);
const refInEdit = ref(false);
const oriVal = ref('');
const editVal = ref('');
const refAttr = computed(() => {
    return {
        size: 'small',
        disabled: !props.pkId || get(props.value, 'disabled'),
        ...props.attr
    }
})
const refValue = computed(() => {
    let item = find(get(props.attr, 'options'), { value: get(props.value, 'value') });
    return item ? item.label : '';
})
/**
 * 进入编辑模式
 */
const onEdit = () => {
    if (!refEditable.value || refDisabled.value) {
        return '';
    }
    editVal.value = get(props.value, 'value');
    oriVal.value = get(props.value, 'value');
    refInEdit.value = true;
}


/**
 * 值变动
 * @param val
 */
const onUpdateVal = (val: any) => {
    editVal.value = val;
}
const onModify = () => {
    if (editVal.value === oriVal.value) {
        refInEdit.value = false
        return;
    }
    let type = props.editable === 'modify' ? 'modify' : 'inline-save';

    emits('update', {
        type,
        pk: props.pkId,
        field: props.field,
        value: editVal.value
    });
    refInEdit.value = false
}


onMounted(() => {
    isMounted.value = true;
})

</script>
<style lang="less" scoped>
.select-on-edit {
    cursor: pointer;
    .material-symbols-outlined {
        font-size: 22px;
    }
    ::v-deep(.el-button) {
        padding-left: 0;
        padding-right: 0;
        margin-left: 4px;
    }
}

</style>
