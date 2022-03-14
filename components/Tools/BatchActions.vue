<template>
    <!--  批量操作需要传递 PK  -->
    <template v-for="item in items" :key="item">
        <Action :item="item" :pk="pk" :pk-values="pkValues"/>
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
    pkValues: {
        type: Array,
        default: () => {
            return []
        }
    },
    pk: {
        type: String,
        default: () => {
            return ''
        }
    }
})
</script>
<style lang="less" scoped>

</style>
