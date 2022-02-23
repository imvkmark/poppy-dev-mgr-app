<template>
    <ElInput
        v-model="val" type="textarea" :disabled="get(attr, 'disabled', false)"
        :show-word-limit="get(attr, 'show-word-limit', false)"
        :maxlength="get(attr, 'maxlength', '')"
        :resize="get(attr, 'resize', 'vertical')"
        :placeholder="get(attr, 'placeholder', '')"
        :autosize="get(attr, 'autosize', false)" :rows="get(attr, 'rows', 5)"
    >
    </ElInput>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';

const props = defineProps({
    attr: Object,
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits([
    'update:modelValue'
])

const val = ref('');

watch(() => val.value, (newVal) => {
    emit('update:modelValue', newVal)
})

onMounted(() => {
    val.value = props.modelValue;
})
</script>
