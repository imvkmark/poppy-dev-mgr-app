<template>
    <ElTooltip effect="dark" :content="get(item, 'title', '')" placement="top" v-if="get(item, 'only', false)">
        <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)"
            :type="get(item, 'type', 'default')"
            :size="trans.size"
            :circle="get(item, 'circle', false)"
            :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
            :loading="store.getters['poppy/isLoading'](get(item, 'url'))"
            :disabled="pk ? pkValues.length <= 0 : get(item, 'disabled', false)"/>
    </ElTooltip>
    <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)" v-else
        :type="get(item, 'type', 'default')"
        :size="trans.size"
        :circle="get(item, 'circle', false)"
        :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
        :loading="store.getters['poppy/isLoading'](get(item, 'url'))"
        :disabled="pk ? pkValues.length <= 0 : get(item, 'disabled', false)">
        {{ get(item, 'title', '') }}
    </ElButton>
</template>
<script setup lang="ts">
import { get, set } from "lodash-es";
import { icon } from "@/framework/utils/icon";
import { upperCamelCase } from "@/framework/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";

const props = defineProps({
    scope: {
        type: String,
        default: () => {
            return ''
        }
    },
    pk: {
        type: String,
        default: () => {
            return ''
        }
    },
    pkValues: {
        type: Array,
        default: () => {
            return []
        }
    },
    item: {
        type: Object,
        default: () => {
            return {}
        }
    },
})
const store = useStore();
const trans = reactive({
    size: computed(() => store.state.poppy.size),
})

const doRequest = (item: any) => {
    if (props.scope) {
        set(item, 'params._scope', props.scope)
    }
    // 设置主键的选择数据
    if (props.pk) {
        set(item, `params._batch`, props.pkValues)
    }
    store.dispatch('poppy/SetAction', item);
}
</script>
