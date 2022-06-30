<template>
    <ElInput :model-value="val" :disabled="get(attr, 'disabled', false)" :clearable="true" @update:model-value="onUpdate"
        :placeholder="get(attr, 'placeholder', '')">
        <template #prepend v-if="get(attr, 'prepend', '')">
            {{ get(attr, 'prepend', '') }}
        </template>
        <template #append v-if="get(attr, 'append', '')">
            {{ get(attr, 'append', '') }}
        </template>
    </ElInput>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
    attr: Object,
    modelValue: {
        type: [String, Number],
        default: ''
    }
})

const emit = defineEmits([
    'update:modelValue'
])

const val = ref<String | Number>('');

const onUpdate = (newVal: any) => {
    emit('update:modelValue', newVal)
}

watch(() => props.modelValue, (newVal) => {
    val.value = newVal
})

onMounted(() => {
    val.value = props.modelValue;
})
</script>
