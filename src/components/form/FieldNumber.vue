<template>
    <ElInputNumber :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)"
        :disabled="get(attr, 'disabled', false)"
        :step="get(attr, 'step', 1)" :step-strictly="get(attr, 'step-strictly', false)"
        :placeholder="get(attr, 'placeholder', '')"
        :precision="get(attr, 'precision', 0)"
        :max="get(attr, 'max')"
        :min="get(attr, 'min')">
    </ElInputNumber>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';

const props = defineProps({
    attr: Object,
    modelValue: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits([
    'update:modelValue'
])
</script>
