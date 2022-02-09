<template>
    <ElTimePicker v-model="val"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)"
        :is-range="true"
        :start-placeholder="get(attr, 'start-placeholder', '')"
        :end-placeholder="get(attr, 'end-placeholder', '')"
        range-separator="-">
    </ElTimePicker>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat)

const props = defineProps({
    name: String,
    attr: Object,
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const emit = defineEmits([
    'change'
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
    emit('change', {
        name: props.name,
        value: formatVal
    })
})

onMounted(() => {
    val.value = props.value;
})
</script>
