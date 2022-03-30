<template>
    <ElColorPicker
        :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)"
        :predefine="get(attr, 'predefine', [])" :show-alpha="get(attr, 'show-alpha')" color-format="rbg"/>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})

const emit = defineEmits([
    'update:modelValue'
])

</script>
