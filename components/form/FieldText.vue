<template>
    <ElInput v-model="val" :disabled="get(attr, 'disabled', false)" :clearable="get(attr, 'clearable', false)"
        :show-word-limit="get(attr, 'show-word-limit', false)"
        :show-password="get(attr, 'show-password', false)"
        :placeholder="get(attr, 'placeholder', '')"
        :maxlength="get(attr, 'maxlength', '')"
    >
        <template #suffix v-if="get(attr, 'suffix-icon', '')">
            <XIcon class-name="el-input__icon" :type="get(attr, 'suffix-icon', '')"/>
        </template>
        <template #prefix v-if="get(attr, 'prefix-icon', '')">
            <XIcon class-name="el-input__icon" :type="get(attr, 'prefix-icon', '')"/>
        </template>
    </ElInput>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import XIcon from "@/framework/components/element/XIcon.vue";

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

onMounted(() => {
    val.value = props.value;
})
</script>
