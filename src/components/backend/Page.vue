<template>
    <div class="py--main">
        <div class="main-header">
            <h3 class="main-title">
                <span>{{ title }}</span>
            </h3>
            <div class="main-actions" v-if="actions.length">
                <QuickActions :items="actions"/>
            </div>
        </div>
        <div class="main-area" :class="{'main-area-intangible' : intangible}">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import QuickActions from "@/components/tools/QuickActions.vue";

const props = defineProps({
    title: {
        type: String,
        default: ' '
    },
    intangible: {
        type: Boolean,
        default: false
    },
    actions: {
        type: Array,
        default: () => {
            return []
        }
    },
})
</script>

<style lang="less" scoped>
</style>
