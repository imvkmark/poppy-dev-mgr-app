<template>
    <ElDatePicker v-model="val"
        :type="get(attr, 'type', '')"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)"
        :start-placeholder="get(attr, 'start-placeholder', '')"
        :end-placeholder="get(attr, 'end-placeholder', '')"
        range-separator="-">
    </ElDatePicker>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

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

const emit = defineEmits([
    'update:modelValue'
])

const val: any = ref([]);

watch(() => val.value, (newVal) => {
    let formatVal: any = [];
    if (newVal) {
        formatVal = [
            dayjs(newVal[0]).format(get(props.attr, 'format')),
            dayjs(newVal[1]).format(get(props.attr, 'format'))
        ]
    }
    emit('update:modelValue', formatVal)
})

watch(() => props.modelValue, () => {
    val.value = props.modelValue;
})

onMounted(() => {
    val.value = props.modelValue;
})
</script>
