<template>
    <ElDatePicker :model-value="val" @update:model-value="onUpdate"
        :type="`${get(attr, 'type', '')}range`"
        :value-format="get(attr, 'format', '')"
        range-separator="-"
        :start-placeholder="get(attr, 'start_placeholder', '')"
        :end-placeholder="get(attr, 'end_placeholder', '')">
    </ElDatePicker>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { first, get, last } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat)

const props = defineProps({
    attr: Object,
    modelValue: {
        type: Object,
        default: () => {
            return {
                start: '',
                end: '',
            }
        }
    }
})

const emit = defineEmits([
    'update:modelValue',
])
const val: any = ref([]);

const onUpdate = (newVal: any) => {
    emit('update:modelValue', {
        start: first(newVal),
        end: last(newVal),
    })
}
watch(() => props.modelValue, (newVal) => {
    if (newVal === val.value) {
        return;
    }
    val.value = [get(newVal, 'start', ''), get(newVal, 'end', '')]
})

onMounted(() => {
    val.value = [get(props.modelValue, 'start', ''), get(props.modelValue, 'end', '')]
})
</script>
