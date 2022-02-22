<template>
    <ElSelect v-model="val" :disabled="get(attr, 'disabled', false)" :placeholder="get(attr, 'placeholder', '')" :clearable="true">
        <template v-if="get(attr, 'group', false) === true">
            <ElOptionGroup v-for="group in get(attr, 'options')" :key="get(group, 'label')" :label="get(group, 'label')">
                <ElOption v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value" :disabled="get(item, 'disabled')"/>
            </ElOptionGroup>
        </template>
        <template v-else>
            <ElOption :label="get(item, 'label')" :value="get(item, 'value')" :disabled="get(item, 'disabled')" v-for="item in get(attr, 'options')"
                :key="get(item, 'value')"/>
        </template>
    </ElSelect>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
    name: String,
    attr: Object,
    defaultValue: {
        type: String,
        default: () => {
            return ''
        }
    }
})


const emit = defineEmits([
    'change'
])

const val = ref('');

watch(() => val.value, (newVal) => {
    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = props.defaultValue;
})
</script>
