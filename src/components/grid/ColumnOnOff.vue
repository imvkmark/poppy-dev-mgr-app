<template>
    <template v-if="!editable">
        <div v-html="value" class="d-flex align-items-center"></div>
    </template>
    <template v-else>
        <FieldSwitch :model-value="editVal" :attr="refAttr" @update:model-value="onUpdateVal"/>
    </template>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { get } from "lodash-es";
import FieldSwitch from "@/components/form/FieldSwitch.vue";

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

const emits = defineEmits([
    'update'
]);

const isMounted = ref(false);
const refAttr = computed(() => {
    return {
        size: 'small',
        disabled: !props.pkId || get(props.value, 'disabled'),
        ...props.attr
    }
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
    let type = props.editable === 'modify' ? 'modify' : 'inline-save';

    emits('update', {
        type,
        pk: props.pkId,
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
