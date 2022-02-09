<template>
    <ElSelect v-model="val" :disabled="get(attr, 'disabled', false)" :multiple="true"
        :multiple-limit="get(attr, 'multiple-limit', 0)"
        :filterable="get(attr, 'filterable', false)"
        :allow-create="get(attr, 'allow-create', false)"
        :placeholder="get(attr, 'placeholder', '')" :clearable="true">
        <template v-if="get(attr, 'complex', false) === false">
            <ElOption :label="get(item, 'label')" :value="key" v-for="(item, key) in get(attr, 'options')"
                :key="get(item, 'value')"/>
        </template>
        <template v-if="get(attr, 'complex', false) === true">
            <ElOption :label="get(item, 'label')" :value="get(item, 'value')" :disabled="get(item, 'disabled')"
                v-for="item in get(attr, 'options')"
                :key="get(item, 'value')"/>
        </template>
        <template v-if="get(attr, 'complex', false) === 'group'">
            <ElOptionGroup v-for="group in get(attr, 'options')" :key="get(group, 'label')" :label="get(group, 'label')">
                <ElOption v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value"
                    :disabled="get(item, 'disabled')"/>
            </ElOptionGroup>
        </template>
    </ElSelect>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

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
    emit('change', {
        name: props.name,
        value: newVal
    })
})

onMounted(() => {
    val.value = props.value;
})
</script>
