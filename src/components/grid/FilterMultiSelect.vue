<template>
    <ElSelect v-model="val" :disabled="false" :multiple="true"
        :multiple-limit="get(attr, 'multiple-limit', 0)"
        :filterable="get(attr, 'filterable', false)"
        :placeholder="get(attr, 'placeholder', '')" :clearable="true" class="filter-select">
        <template v-if="get(attr, 'group', false) === true">
            <ElOptionGroup v-for="group in get(attr, 'options')" :key="get(group, 'label')"
                :label="get(group, 'label')">
                <ElOption v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                    :disabled="get(item, 'disabled')"/>
            </ElOptionGroup>
        </template>
        <template v-else>
            <ElOption :label="get(item, 'label')" :value="get(item, 'value')" :disabled="get(item, 'disabled')"
                v-for="item in get(attr, 'options')"
                :key="get(item, 'value')"/>
        </template>
    </ElSelect>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

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
    emit('update:modelValue', newVal)
})

watch(() => props.modelValue, (newVal) => {
    val.value = newVal
})

onMounted(() => {
    val.value = props.modelValue;
})
</script>
