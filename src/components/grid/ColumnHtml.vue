<template>
    <div v-html="value" class="text-ellipsis" :title="stripTags(value)"/>
</template>
<script lang="ts" setup>

import { stripTags } from "@/services/utils/helper";

const props = defineProps({
    value: {
        type: String,
        default: ''
    }
})


</script>
<style lang="less" scoped>
</style>
