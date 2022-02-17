<template>
    <ElRow>
        <ElCol :span="10">
            <ElInput v-model="start" :clearable="true"
                :placeholder="get(attr, 'start_placeholder', '')">
            </ElInput>
        </ElCol>
        <ElCol :span="4" class="box-center">
            <XIcon type="minus"/>
        </ElCol>
        <ElCol :span="10">
            <ElInput v-model="end" :clearable="true"
                :placeholder="get(attr, 'end_placeholder', '')">
            </ElInput>
        </ElCol>
    </ElRow>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import XIcon from "@/framework/components/element/XIcon.vue";

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

const start = ref('');
const end = ref('');

watch(() => start.value, (newVal) => {
    emit('change', {
        name: `${props.name}[start]`,
        value: newVal
    })
})
watch(() => end.value, (newVal) => {
    emit('change', {
        name: `${props.name}[end]`,
        value: newVal
    })
})

watch(() => props.value, (newVal) => {
    if (newVal === val.value) {
        return;
    }
    val.value = newVal
})

onMounted(() => {
    val.value = props.value;
})
</script>
