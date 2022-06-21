<template>
    <ElTimePicker :model-value="refValue" @update:model-value="onUpdate" style="max-width: 200px"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)"
        :is-range="true"
        :start-placeholder="get(attr, 'start-placeholder', '')"
        :end-placeholder="get(attr, 'end-placeholder', '')"
        range-separator="-">
    </ElTimePicker>
</template>
<script lang="ts" setup>
import { first, get, last } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { onMounted, ref } from "vue";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)

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
const refValue: any = ref([]);

const strDate = dayjs().format('YYYY-MM-DD');
const emit = defineEmits([
    'update:modelValue'
])


const onUpdate = (newVal: any) => {
    if (!refMounted.value) {
        return;
    }

    if (newVal === refValue.value) {
        return;
    }

    let formatVal: any = null;
    if (newVal) {
        let startDate = typeof newVal[0] !== 'undefined' ? newVal[0] : '';
        let endDate = typeof newVal[1] !== 'undefined' ? newVal[1] : '';
        let strStart = '';
        let strEnd = '';
        if (startDate) {
            strStart = dayjs(startDate).format(get(props.attr, 'format'));
        }
        if (endDate) {
            strEnd = dayjs(endDate).format(get(props.attr, 'format'));
        }
        formatVal = [strStart, strEnd]
    }

    refValue.value = newVal;
    emit('update:modelValue', formatVal)
}


onMounted(() => {
    refMounted.value = true;
    let start = first(props.modelValue);
    let end = last(props.modelValue);
    let startDayjs = dayjs();
    let endDayjs = dayjs().add(1, 'hour');
    if (start) {
        startDayjs = dayjs(`${strDate} ${start}`, `YYYY-MM-DD ${get(props.attr, 'format')}`);
    }
    if (end) {
        endDayjs = dayjs(`${strDate} ${end}`, `YYYY-MM-DD ${get(props.attr, 'format')}`);
    }
    refValue.value = [startDayjs, endDayjs];
})
</script>
