<template>
    <ElRadioGroup v-model="val" :disabled="get(attr, 'disabled', false)">
        <template v-if="!get(attr, 'button', false)">
            <ElRadio :label="get(item, 'value')" :disabled="get(item, 'disabled')" v-for="item in get(attr, 'options')"
                :key="get(item, 'value')">{{ get(item, 'label') }}
            </ElRadio>
        </template>
        <template v-else>
            <ElRadioButton :label="get(item, 'value')" :disabled="get(item, 'disabled')"
                v-for="item in get(attr, 'options')"
                :key="get(item, 'value')">{{ get(item, 'label') }}
            </ElRadioButton>
        </template>
    </ElRadioGroup>
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
