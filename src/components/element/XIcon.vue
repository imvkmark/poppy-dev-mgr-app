<template>
    <ElIcon :class="get(props, 'className')" v-if="props.type">
        <component :is="get(icon, iconType)"/>
    </ElIcon>
</template>
<script lang="ts" setup>
import { icon } from "@/utils/icon";
import { get } from "lodash-es"
import { toRef } from "vue";
import { upperCamelCase } from "@popjs/core/utils/helper";

const props = defineProps({
    type: {
        type: String
    },
    className: {
        type: [String, Object]
    }
})
const iconType = upperCamelCase(String(toRef(props, 'type').value));
</script>

<style lang="less" scoped>
</style>
