<template>
    <ElIcon :class="className" v-if="!startsWith(props.type, 'mu:')">
        <component :is="get(icon, iconType)"/>
    </ElIcon>
    <span class="material-symbols-outlined" :class="className" v-else>{{ type.substring(3) }}</span>
</template>
<script lang="ts" setup>
import { icon } from "@/utils/icon";
import { get, startsWith } from "lodash-es"
import { toRef } from "vue";
import { upperCamelCase } from "@popjs/core/utils/helper";

const props = defineProps({
    type: {
        type: String
    },
    className: {
        type: [String, Object],
        default: ''
    }
})
const iconType = upperCamelCase(String(toRef(props, 'type').value));
</script>

<style lang="less" scoped>
</style>
