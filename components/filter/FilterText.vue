<template>
    <ElInput v-model="val" :disabled="get(attr, 'disabled', false)" :clearable="true"
        :placeholder="get(attr, 'placeholder', '')">
        <template #prepend v-if="get(attr, 'prepend', '')">
            {{ get(attr, 'prepend', '') }}
        </template>
        <template #append v-if="get(attr, 'append', '')">
            {{ get(attr, 'append', '') }}
        </template>
    </ElInput>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
    name: String,
    attr: Object,
    value: {
        type: String,
        default: ''
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
