<template>
    <ElDatePicker v-model="val"
        :type="get(attr, 'options.type', '')"
        :format="get(attr, 'options.format', '')"
        :placeholder="get(attr, 'options.placeholder', '')">
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
        formatVal = dayjs(newVal).format(get(props.attr, 'options.format'));
    }
    emit('change', {
        name: get(props.attr, 'name'),
        value: formatVal
    })
})

watch(() => props.value, (newVal) => {
    val.value = newVal
})

onMounted(() => {
    val.value = props.value;
})
</script>
