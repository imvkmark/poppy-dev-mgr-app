<template>
    <ElInput v-model="val" :disabled="get(attr, 'disabled', false)" :clearable="get(attr, 'clearable', false)"
        :placeholder="get(attr, 'options.placeholder', '')">
        <template #prepend v-if="get(attr, 'prepend', '')">
            {{ get(attr, 'prepend', '') }}
        </template>
        <template #prefix v-if="get(attr, 'prefix-icon', '')">
            <XIcon class-name="el-input__icon" :type="get(attr, 'prefix-icon', '')"/>
        </template>
        <template #suffix v-if="get(attr, 'suffix-icon', '')">
            <XIcon class-name="el-input__icon" :type="get(attr, 'suffix-icon', '')"/>
        </template>
        <template #append v-if="get(attr, 'append', '')">
            {{ get(attr, 'append', '') }}
        </template>
    </ElInput>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import XIcon from "@/framework/components/element/XIcon.vue";

const props = defineProps({
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
