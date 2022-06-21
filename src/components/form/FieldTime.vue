<template>
    <ElTimePicker :model-value="refValue" @update:model-value="onUpdate"
        :format="get(attr, 'format', '')" :disabled="get(attr, 'disabled', false)"/>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { onMounted, ref } from "vue";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})
const refMounted = ref(false);
const refValue: any = ref('');
const strDate = dayjs().format('YYYY-MM-DD');
const emit = defineEmits([
    'update:modelValue'
])

const onUpdate = (newVal: any) => {

    if (refValue.value === newVal) {
        return;
    }
    let formatVal = '';
    if (newVal) {
        formatVal = dayjs(newVal).format(get(props.attr, 'format'));
        refValue.value = newVal;
    } else {
        refValue.value = '';
    }
    emit('update:modelValue', formatVal)
}

onMounted(() => {
    refMounted.value = true;
    let strDayjs = '';
    if (props.modelValue) {
        strDayjs = dayjs(`${strDate} ${props.modelValue}`, `YYYY-MM-DD ${get(props.attr, 'format')}`).format();
    }
    refValue.value = strDayjs;
})
</script>
