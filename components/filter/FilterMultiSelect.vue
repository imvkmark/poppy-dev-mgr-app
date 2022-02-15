<template>
    <ElSelect v-model="val" :disabled="get(attr, 'disabled', false)" :multiple="true"
        :multiple-limit="get(attr, 'options.multiple-limit', 0)"
        :filterable="get(attr, 'options.filterable', false)"
        :allow-create="get(attr, 'options.allow-create', false)"
        :placeholder="get(attr, 'options.placeholder', '')" :clearable="true">
        <template v-if="get(attr, 'options.group', false) === true">
            <ElOptionGroup v-for="group in get(attr, 'options.options')" :key="get(group, 'label')" :label="get(group, 'label')">
                <ElOption v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                    :disabled="get(item, 'disabled')"/>
            </ElOptionGroup>
        </template>
        <template v-else>
            <ElOption :label="get(item, 'label')" :value="get(item, 'value')" :disabled="get(item, 'disabled')"
                v-for="item in get(attr, 'options.options')"
                :key="get(item, 'value')"/>
        </template>
    </ElSelect>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
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
    emit('change', {
        name: get(props.attr, 'name'),
        value: newVal
    })
})

watch(() => props.value, (newVal) => {
    val.value = newVal
})

onMounted(() => {
    val.value = props.value;
})
</script>
