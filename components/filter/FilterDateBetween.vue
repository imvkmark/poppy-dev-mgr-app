<template>
    <ElDatePicker v-model="val"
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
    name: String,
    attr: Object,
    value: {
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
    'change'
])
const val: any = ref('');

watch(() => val.value, (newVal) => {
    if (newVal) {
        emit('change', {
            name: `${props.name}[start]`,
            value: first(newVal)
        })
        emit('change', {
            name: `${props.name}[end]`,
            value: last(newVal)
        })
    }

})
watch(() => props.value, (newVal) => {
    if (newVal === val.value) {
        return;
    }
    val.value = [get(newVal, 'start', ''), get(newVal, 'end', '')]
})

onMounted(() => {
    val.value = [get(props.value, 'start', ''), get(props.value, 'end', '')]
})
</script>
