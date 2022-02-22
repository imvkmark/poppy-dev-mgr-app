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
    name: String,
    attr: Object,
    defaultValue: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits([
    'change'
])

const val = ref(0);

watch(() => val.value, (newVal) => {
    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = props.defaultValue;
})
</script>
