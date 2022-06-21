<template>
    <FieldSelect :model-value="editVal" :attr="refAttr" @update:model-value="onUpdateVal"/>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { get, set } from "lodash-es";
import FieldSelect from "@/components/form/FieldSelect.vue";

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

const isMounted = ref(false);

const refAttr = computed(() => {
    let attr = get(props.value, 'attr');
    set(attr, 'disabled', !props.pkId);
    return attr;
})

const editVal = computed(() => {
    return String(get(props.value, 'value'));
})

/**
 * 值变动
 * @param val
 */
const onUpdateVal = (val: any) => {
    if (!isMounted.value) {
        return;
    }

    // 自定义字段名称, 用于传递修改参数
    let customField = get(props.value, 'field');
    emits('modify', {
        pk: props.pkId,
        post_field: customField ? customField : props.field,
        field: props.field,
        value: val
    });
}

onMounted(() => {
    isMounted.value = true;
})

</script>
<style lang="less" scoped>
.text-ellipsis {
    cursor: pointer;
}

</style>