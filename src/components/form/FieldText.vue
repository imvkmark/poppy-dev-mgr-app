<template>
    <ElInput :ref="el => elRef = el" :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)"
        :disabled="get(attr, 'disabled', false)"
        :clearable="get(attr, 'clearable', false)"
        :show-word-limit="get(attr, 'show-word-limit', false)"
        :show-password="get(attr, 'show-password', false)"
        :placeholder="get(attr, 'placeholder', '')"
        :maxlength="get(attr, 'maxlength', '')"
        @blur="emit('modify')"
        @keyup.enter="emit('modify')"
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
import XIcon from "@/components/element/XIcon.vue";
import { ref } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: [String, Number],
        default: ''
    }
})

const elRef = ref<InstanceType<typeof ElInput>>();

const focus = () => {
    elRef.value?.focus();
}

const emit = defineEmits([
    'update:modelValue',
    'modify'
])


defineExpose({
    focus
})
</script>
