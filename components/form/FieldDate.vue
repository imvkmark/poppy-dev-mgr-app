<template>
    <ElDatePicker v-model="val"
        :type="get(attr, 'type', '')"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)" :placeholder="get(attr, 'placeholder', '')">
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
        type: String,
        default: () => {
            return ''
        }
    }
})

const emit = defineEmits([
    'update:modelValue'
])

const val: any = ref('');

watch(() => val.value, (newVal) => {
    let formatVal = '';
    if (newVal) {
        formatVal = dayjs(newVal).format(get(props.attr, 'format'));
    }
    emit('update:modelValue', formatVal)
})

onMounted(() => {
    val.value = props.modelValue;
})
</script>
