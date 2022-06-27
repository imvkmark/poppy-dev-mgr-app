<template>
    <ElCascader :model-value="modelValue" @update:model-value="(val) => emits('update:modelValue', val)"
        :size="get(attr, 'size', 'default')" :style="styleObject"
        :options="get(attr, 'options')" :props="casProps"
        :disabled="get(attr, 'disabled', false)" :placeholder="get(attr, 'placeholder', '')" :clearable="true"
        :filterable="get(attr, 'filterable', false)">
    </ElCascader>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';
import { computed, reactive } from "vue";
import { appRequest } from "@/utils/request";
import { CascaderNode } from "element-plus";

const props = defineProps({
    attr: Object,
    url: {
        type: String,
        default: ''
    },
    modelValue: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const emits = defineEmits([
    'update:modelValue'
])

const styleObject = computed(() => {
    if (get(props.attr, 'width')) {
        return {
            width: `${get(props.attr, 'width')}px`
        }
    }
    return {}
})

const casProps = reactive({
    multiple: get(props.attr, 'multiple', false),
    checkStrictly: get(props.attr, 'checkStrictly', false),
    lazy: Boolean(get(props.attr, 'lazy')),
    lazyLoad: ((node: CascaderNode, resolve: any) => {
        let lazyUrl = get(props.attr, 'lazy_url');
        appRequest(lazyUrl, {
            node: node.data
        }, 'post').then(({ data, status }) => {
            if (status) {
                return;
            }
            resolve(data);
        })
    })
})


</script>
