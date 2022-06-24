<template>
    <ElIcon :class="get(props, 'className')" v-if="!startsWith(props.type, 'mu:')">
        <component :is="get(icon, iconType)"/>
    </ElIcon>
    <span class="material-symbols-outlined" v-else>{{ type.substring(3) }}</span>
</template>
<script lang="ts" setup>
import { icon } from "@/utils/icon";
import { get } from "lodash-es"
import { toRef } from "vue";
import { upperCamelCase } from "@popjs/core/utils/helper";
import { startsWith } from "lodash-es";

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
