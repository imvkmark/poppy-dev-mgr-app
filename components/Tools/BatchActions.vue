<template>
    <template v-for="item in items" :key="item">
        <Action :item="item" :append="append" :use-append="true"/>
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
    append: {
        type: Object,
        default: () => {
            return {}
        }
    }
})
</script>
<style lang="less" scoped>

</style>
