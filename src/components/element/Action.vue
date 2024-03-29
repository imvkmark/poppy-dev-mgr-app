<template>
    <ElTooltip effect="dark" :content="get(item, 'title', '')" placement="top" v-if="get(item, 'only', false)">
        <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)" v-if="iconIsMu" class="el-button-has-mu"
            :type="get(item, 'type', 'default')"
            :size="trans.size" :circle="get(item, 'circle', false)" :link="get(item, 'link', false)"
            :disabled="disabledRef">
            <XIcon v-if="iconIsMu" :type="get(item, 'icon', '')"/>
        </ElButton>
        <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)" v-else
            :type="get(item, 'type', 'default')"
            :size="trans.size" :circle="get(item, 'circle', false)" :link="get(item, 'link', false)"
            :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
            :disabled="disabledRef"/>
    </ElTooltip>
    <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)" v-else
        :type="get(item, 'type', 'default')" :class="{'el-button-has-mu': iconIsMu}"
        :size="trans.size"
        :circle="get(item, 'circle', false)"
        :link="get(item, 'link', false)"
        :icon="(!iconIsMu && get(item, 'icon', '')) ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
        :disabled="disabledRef">
        <XIcon v-if="iconIsMu" :type="get(item, 'icon', '')"/>
        {{ get(item, 'title', '') }}
    </ElButton>
</template>
<script setup lang="ts">
import { get, set, startsWith } from "lodash-es";
import { icon } from "@/utils/icon";
import { upperCamelCase } from "@popjs/core/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_ACTION } from "@/bus";
import XIcon from "@/components/element/XIcon.vue";

const props = defineProps({
    scope: {
        type: [String, Number],
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

const iconIsMu = startsWith(get(props.item, 'icon', ''), 'mu:');

const disabledRef = computed(() => {

    // 是否是批量操作
    return props.pk
        // 检测是否可操作, 检测是否是加载中
        ? (props.pkValues.length <= 0 || store.getters['poppy/isLoading'](get(props.item, 'url')))
        // 是否禁用
        : get(props.item, 'disabled', false)
            ? get(props.item, 'disabled', false)
            // 是否加载中
            : store.getters['poppy/isLoading'](get(props.item, 'url'))
})

const doRequest = (item: any) => {
    if (props.scope) {
        set(item, 'params._scope', props.scope)
    }
    // 设置主键的选择数据
    if (props.pk) {
        set(item, `params._batch`, props.pkValues)
    }
    emitter.emit(MGR_APP_ACTION, item);
}
</script>
