<template>
    <template v-for="item in items" :key="item">
        <Action :item="item" :scope="scope"></Action>
    </template>
</template>
<script lang="ts" setup>
import Action from "@/framework/components/element/Action.vue";

const props = defineProps({
    items: {
        type: Array,
        default: () => {
            return []
        }
    },
    scope: {
        type: String,
        default: () => {
            return ''
        }
    },
})

</script>
<style lang="less" scoped>
</style>
