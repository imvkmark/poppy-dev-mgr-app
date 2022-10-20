<template>
    <div :class="{'text-ellipsis' : ellipsis, 'table-cell-editable': refEditable, 'table-cell-disabled': refDisabled}"
        class="table-cell" v-if="!refInEdit" @click="onEdit">
        {{ editable ? get(value, 'value') : value }}
        <XIcon :class-name="{'copy' : true,'copy-success': !refCopyTipDisabled}" type="copy-document" @click="onCopy" v-if="copyable"/>
    </div>
    <div v-else>
        <FieldText :ref="el => refDomEl = el" :attr="refAttr" :model-value="editVal" @update:model-value="onUpdateVal" @modify="onModify"/>
    </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { get, isObjectLike } from "lodash-es";
import XIcon from "@/components/element/XIcon.vue";
import FieldText from "@/components/form/FieldText.vue";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_COPY_TIP } from "@/bus";

const props = defineProps({
    ellipsis: {
        type: Boolean,
        default: false
    },
    copyable: {
        type: Boolean,
        default: false
    },
    editable: {
        type: String,
        default: ''
    },
    field: {
        type: String,
        required: true
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
const refCopyTipDisabled = ref(false);
const refInEdit = ref(false);
const refEditable = computed(() => {
    return props.editable && props.pkId && !get(props.value, 'disabled');
})
const refDisabled = computed(() => {
    return props.editable && (!props.pkId || get(props.value, 'disabled'));
})
const refAttr = computed(() => {
    return {
        ...props.attr
    }
})
const oriVal = ref('');
const editVal = ref('');
const refDomEl = ref(null);

const onCopy = async (e: PointerEvent) => {
    if (!props.copyable) {
        return;
    }
    emitter.emit(MGR_APP_COPY_TIP, props.value)
    refCopyTipDisabled.value = true;
    setTimeout(() => {
        refCopyTipDisabled.value = false
    }, 2000)
    e.stopPropagation()
}

const emits = defineEmits([
    'update',
]);

/**
 * 进入编辑模式
 */
const onEdit = () => {
    if (refDisabled.value || !refEditable.value) {
        return '';
    }

    let val = isObjectLike(props.value) ? get(props.value, 'value') : props.value;
    editVal.value = val;
    oriVal.value = val;
    refInEdit.value = true;
    nextTick(() => {
        // @ts-ignore 输入框获取焦点
        refDomEl.value?.focus();
    })
}

const onModify = () => {
    refInEdit.value = false;
    if (editVal.value === oriVal.value) {
        return;
    }

    let type = props.editable === 'modify' ? 'modify' : 'inline-save';

    emits('update', {
        type,
        pk: props.pkId,
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

.table-cell {
    position: relative;
    .copy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    &:hover {
        .copy {
            opacity: 1;
        }
    }
}

.copy {
    cursor: pointer;
    position: absolute;
    top: 7px;
    right: 7px;
    font-size: 18px;
}

.copy-success {
    .el-icon {
        color: #34B7FF;
    }
}
</style>
