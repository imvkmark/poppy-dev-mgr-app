<template>
    <!--  批量操作需要传递 PK  -->
    <div class="batch-actions" v-if="items.length">
        <template v-for="item in items" :key="item">
            <Action :item="item" :pk="pk" :pk-values="pkValues"/>
        </template>
    </div>
</template>
<script lang="ts" setup>
import Action from "@/components/element/Action.vue";

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
.batch-actions {
    padding-bottom: 0.5rem;
}
</style>
