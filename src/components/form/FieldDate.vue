<template>
    <ElDatePicker :model-value="modelValue" @update:model-value="onUpdate"
        :type="get(attr, 'type', '')"
        :format="get(attr, 'format', '')"
        :disabled="get(attr, 'disabled', false)" :placeholder="get(attr, 'placeholder', '')">
    </ElDatePicker>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
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

const refMounted = ref(false);
const onUpdate = (val: any) => {
    if (!refMounted.value) {
        return;
    }
    let formatVal = '';
    if (val) {
        formatVal = dayjs(val).format(get(props.attr, 'format'));
    }
    emit('update:modelValue', formatVal)
}

onMounted(() => {
    refMounted.value = true;
})
</script>
