<template>
    <ElSelect :model-value="modelValue" @update:model-value="(val) => emit('update:modelValue', val)"
        :disabled="get(attr, 'disabled', false)" :placeholder="get(attr, 'placeholder', '')" :clearable="true" :filterable="get(attr, 'filterable', false)">
        <template v-if="refGroup">
            <ElOptionGroup v-for="group in refOptions" :key="get(group, 'label')" :label="get(group, 'label')">
                <ElOption v-for="item in get(group, 'options')" :key="item.value" :label="item.label" :value="item.value" :disabled="get(item, 'disabled')"/>
            </ElOptionGroup>
        </template>
        <template v-else>
            <ElOption :label="get(item, 'label')" :value="get(item, 'value')" :disabled="get(item, 'disabled')" v-for="item in refOptions"
                :key="get(item, 'value')"/>
        </template>
    </ElSelect>
</template>
<script lang="ts" setup>
import { get } from 'lodash-es';
import { onMounted, ref, watch } from "vue";
import { apiPyRequest } from "@/services/poppy";
import { toast } from "@/utils/util";

const props = defineProps({
    attr: Object,
    url: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        default: () => {
            return ''
        }
    }
})
const refGroup = ref(false);
const refOptions = ref([]);
const refDepend = ref('');
const emit = defineEmits([
    'update:modelValue'
])

const init = () => {
    refDepend.value = get(props.attr, 'depend', '');
    if (!refDepend.value) {
        refGroup.value = get(props.attr, 'group', false);
        refOptions.value = get(props.attr, 'options', []);
    } else {
        // 请求服务端
        apiPyRequest(props.url, {
            _query: `depend:attr`,
            name: refDepend.value,
            params: get(props.attr, 'depend-params')
        }, 'post').then(({ success, message, data }) => {
            if (!success) {
                toast(message, false);
                return;
            }
            const { options, group } = data;
            refOptions.value = options;
            refGroup.value = group;
        })
    }
}

watch(() => props.attr, () => {
    init()
})

onMounted(() => {
    init()
})
</script>
