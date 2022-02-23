<template>
    <ElInputNumber v-model="val"
        :disabled="get(attr, 'disabled', false)"
        :step="get(attr, 'step', 1)" :step-strictly="get(attr, 'step-strictly', false)"
        :placeholder="get(attr, 'placeholder', '')"
        :precision="get(attr, 'precision', 0)"
        :max="get(attr, 'max')"
        :min="get(attr, 'min')">
    </ElInputNumber>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
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

const val = ref(0);

watch(() => val.value, (newVal) => {
    emit('update:modelValue', newVal)
})

onMounted(() => {
    val.value = props.modelValue;
})
</script>
