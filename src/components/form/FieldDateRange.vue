<template>
    <ElDatePicker :model-value="modelValue" @update:model-value="onUpdate" style="max-width: 360px"
        :type="get(attr, 'type', '')"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)"
        :start-placeholder="get(attr, 'start-placeholder', '')"
        :end-placeholder="get(attr, 'end-placeholder', '')"
        range-separator="-">
    </ElDatePicker>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { onMounted, ref } from "vue";

dayjs.extend(advancedFormat)

const props = defineProps({
    attr: Object,
    modelValue: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const refMounted = ref(false);
const emit = defineEmits([
    'update:modelValue'
])

const onUpdate = (newVal: any) => {
    let formatVal: any = [];
    if (newVal) {
        formatVal = [
            dayjs(newVal[0]).format(get(props.attr, 'format')),
            dayjs(newVal[1]).format(get(props.attr, 'format'))
        ]
    }
    emit('update:modelValue', formatVal)
}


onMounted(() => {
    refMounted.value = true;
})
</script>
