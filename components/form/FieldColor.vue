<template>
    <ElColorPicker v-model="val" :disabled="get(attr, 'disabled', false)"
        :predefine="get(attr, 'predefine', [])" :show-alpha="get(attr, 'show-alpha')" color-format="rbg"
    >
    </ElColorPicker>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
    name: String,
    attr: Object,
    defaultValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})


const emit = defineEmits([
    'change'
])

const val = ref('');

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
