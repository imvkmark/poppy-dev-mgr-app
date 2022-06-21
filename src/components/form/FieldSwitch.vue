<template>
    <ElSwitch :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)"
        :disabled="get(attr, 'disabled', false)"
        :size="get(attr, 'size', 'default')"
        active-value="1"
        inactive-value="0"
        :inline-prompt="true"
        :active-text="get(attr, 'active-text', '')"
        :inactive-text="get(attr, 'inactive-text', '')">
    </ElSwitch>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';

const props = defineProps({
    attr: Object,
    modelValue: {
        type: [String, Number],
        default: () => {
            return '0'
        }
    }
})

const emit = defineEmits([
    'update:modelValue'
])
</script>
