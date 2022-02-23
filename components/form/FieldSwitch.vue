<template>
    <ElSwitch v-model="val" :disabled="get(attr, 'disabled', false)"
        active-value="1"
        inactive-value="0"
        :inline-prompt="true"
        :active-text="get(attr, 'active-text', '')"
        :inactive-text="get(attr, 'inactive-text', '')">
    </ElSwitch>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
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

const val: any = ref('0');

watch(() => val.value, (newVal) => {
    emit('update:modelValue', newVal)
})

onMounted(() => {
    val.value = String(props.modelValue).toString();
})
</script>
