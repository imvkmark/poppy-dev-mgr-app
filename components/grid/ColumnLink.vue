<template>
    <a :class="{'text-ellipsis' : ellipsis}" :target="get(value, 'target', '_blank')"
        :href="get(value, 'url', '')">
        {{ get(value, 'text', '') }}
    </a>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";

const props = defineProps({
    ellipsis: {
        type: Boolean,
        default: false
    },
    value: {
        type: Object,
        default: () => {
            return {}
        }
    }
})


</script>
<style lang="less">
</style>
