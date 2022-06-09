<template>
    <ElRow>
        <ElCol :span="10">
            <ElInput :model-value="start" @update:model-value="onUpdateStart" :clearable="true"
                :placeholder="get(attr, 'start_placeholder', '')">
            </ElInput>
        </ElCol>
        <ElCol :span="4" class="box-center">
            <XIcon type="minus"/>
        </ElCol>
        <ElCol :span="10">
            <ElInput :model-value="end" @update:model-value="onUpdateEnd" :clearable="true"
                :placeholder="get(attr, 'end_placeholder', '')">
            </ElInput>
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
                end: '',
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
