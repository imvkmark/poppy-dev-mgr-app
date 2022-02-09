<template>
    <ElTimePicker v-model="val"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)">
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
        type: String,
        default: () => {
            return ''
        }
    }
})

const emit = defineEmits([
    'change'
])

const val: any = ref('');

watch(() => val.value, (newVal) => {
    let formatVal = '';
    if (newVal) {
        formatVal = dayjs(newVal).format(get(props.attr, 'format'));
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
