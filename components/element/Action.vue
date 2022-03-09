<template>
    <ElTooltip effect="dark" :content="get(item, 'title', '')" placement="top" v-if="get(item, 'only', false)">
        <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)"
            :type="get(item, 'type', 'default')"
            :size="trans.size"
            :circle="get(item, 'circle', false)"
            :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
            :loading="store.getters['poppy/isLoading'](get(item, 'url'))"
            :disabled="useAppend ? !(keys(append).length > 0) : get(item, 'disabled', false)"/>
    </ElTooltip>
    <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)" v-else
        :type="get(item, 'type', 'default')"
        :size="trans.size"
        :circle="get(item, 'circle', false)"
        :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
        :loading="store.getters['poppy/isLoading'](get(item, 'url'))"
        :disabled="useAppend ? !(keys(append).length > 0) : get(item, 'disabled', false)">
        {{ get(item, 'title', '') }}
    </ElButton>
</template>
<script setup lang="ts">
import { get, keys, merge, set } from "lodash-es";
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
    append: {
        type: Object,
        default: () => {
            return {}
        }
    },
    useAppend: {
        type: Boolean,
        default: () => {
            return false
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
    if (keys(props.append).length) {
        set(item, 'params', merge(props.append, get(item, 'params')));
    }
    store.dispatch('poppy/SetAction', item);
}
</script>
