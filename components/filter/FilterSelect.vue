<template>
    <ElSelect v-model="val" :placeholder="get(attr, 'options.placeholder', '')" :clearable="true" class="filter-select">
        <template v-if="get(attr, 'options.group', false) === true">
            <ElOptionGroup v-for="group in get(attr, 'options.options')" :key="get(group, 'label')"
                :label="get(group, 'label')">
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
        type: [String, Number],
        default: () => {
            return null
        }
    }
})

const emit = defineEmits([
    'change'
])

const val = ref('');

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
