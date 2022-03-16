<template>
    <a v-for="item in value" :key="item" :target="get(item, 'target', '_blank')"
        :href="get(item, 'src', '')" :download="get(item, 'title', '')" :title="get(item, 'title', '')">
        <ElTooltip :content="get(item, 'title', '')" placement="bottom" effect="light">
            <ElButton circle :icon="Download" size="small"/>
        </ElTooltip>
    </a>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";
import { Download } from "@element-plus/icons";

const props = defineProps({
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})

</script>
<style lang="less" scoped>

</style>
