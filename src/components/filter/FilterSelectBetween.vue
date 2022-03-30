<template>
    <ElRow>
        <ElCol :span="10">
            <ElSelect :model-value="start" @update:model-value="onUpdateStart" :placeholder="get(attr, 'start_placeholder', '')" :clearable="true"
                class="filter-select">
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
        </ElCol>
        <ElCol :span="4" class="box-center">
            <XIcon type="minus"/>
        </ElCol>
        <ElCol :span="10">
            <ElSelect :model-value="end" @update:model-value="onUpdateEnd" :placeholder="get(attr, 'end_placeholder', '')" :clearable="true"
                class="filter-select">
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
        </ElCol>
    </ElRow>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import XIcon from "@/components/element/XIcon.vue";

const props = defineProps({
    attr: Object,
    modelValue: {
        type: Object,
        default: () => {
            return {
                start: '',
                end: ''
            }
        }
    }
})

const emit = defineEmits([
    'update:modelValue',
])

const start = ref('');
const end = ref('');

const onUpdateStart = (st: string) => {
    start.value = st;
    emit('update:modelValue', {
        start: start.value,
        end: end.value,
    })
}
const onUpdateEnd = (st: string) => {
    end.value = st;
    emit('update:modelValue', {
        start: start.value,
        end: end.value,
    })
}

watch(() => props.modelValue, () => {
    start.value = get(props.modelValue, 'start');
    end.value = get(props.modelValue, 'end');
})

onMounted(() => {
    start.value = get(props.modelValue, 'start');
    end.value = get(props.modelValue, 'end');
})
</script>
