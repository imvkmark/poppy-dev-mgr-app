<template>
    <!--  datetime | month | date | year  -->
    <!--  datepicker : datetimerange, daterange   -->
    <ElDatePicker :model-value="val" @update:model-value="onUpdate" v-if="includes(['datetime', 'date'], get(attr, 'type', ''))"
        :type="`${get(attr, 'type', '')}range`"
        :value-format="get(attr, 'format', '')"
        range-separator="-"
        :start-placeholder="get(attr, 'start_placeholder', '')"
        :end-placeholder="get(attr, 'end_placeholder', '')">
    </ElDatePicker>
    <div v-else class="box-center">{{ get(attr, 'type', '') + '类型暂不支持' }}</div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { first, get, last, includes } from 'lodash-es';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { pyWarning } from "@/utils/helper";

dayjs.extend(advancedFormat)

const props = defineProps({
    attr: Object,
    modelValue: {
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
    'update:modelValue',
])
const val: any = ref([]);

const onUpdate = (newVal: any) => {
    pyWarning(first(newVal), newVal);
    emit('update:modelValue', {
        start: first(newVal),
        end: last(newVal),
    })
}
watch(() => props.modelValue, (newVal) => {
    pyWarning(props);
    if (newVal === val.value) {
        return;
    }
    val.value = [get(newVal, 'start', ''), get(newVal, 'end', '')]
})

onMounted(() => {
    pyWarning(props);
    val.value = [get(props.modelValue, 'start', ''), get(props.modelValue, 'end', '')]
})
</script>
<style scoped lang="less">
.box-center {
    color: var(--wuli-color-disabled);
}
</style>
