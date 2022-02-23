<template>
    <ElColorPicker v-model="val" :disabled="get(attr, 'disabled', false)"
        :predefine="get(attr, 'predefine', [])" :show-alpha="get(attr, 'show-alpha')" color-format="rbg"/>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
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

const val = ref('');

watch(() => val.value, (newVal) => {
    emit('update:modelValue', newVal)
})

onMounted(() => {
    val.value = props.modelValue;
})
</script>
