<template>
    <ElInput :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)" :disabled="get(attr, 'disabled', false)"
        :clearable="get(attr, 'clearable', false)"
        :show-word-limit="get(attr, 'show-word-limit', false)"
        :show-password="get(attr, 'show-password', false)"
        :placeholder="get(attr, 'placeholder', '')"
        :maxlength="get(attr, 'maxlength', '')"
        :class="{'text-monospace' : get(attr, 'monospace', false)}"
    >
        <template #suffix v-if="get(attr, 'suffix-icon', '')">
            <XIcon class-name="el-input__icon" :type="get(attr, 'suffix-icon', '')"/>
        </template>
        <template #prefix v-if="get(attr, 'prefix-icon', '')">
            <XIcon class-name="el-input__icon" :type="get(attr, 'prefix-icon', '')"/>
        </template>
    </ElInput>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';
import XIcon from "@/framework/components/element/XIcon.vue";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: ''
    }
})
const emit = defineEmits([
    'update:modelValue'
])
</script>
