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
