<template>
    <div class="py--main" :class="mainClass">
        <slot name="title"/>
        <div class="main-header">
            <h3 class="main-title">
                <span>{{ title }}</span>
                <ElIcon class="main-title-filter" :class="{'active':filter}" v-if="hasFilter"
                    @click="updateFilter">
                    <Filter/>
                </ElIcon>
                <ElTooltip v-if="tip" placement="bottom">
                    <template #content>{{ tip }}</template>
                    <ElButton type="danger" circle size="small" :icon="Bell"/>
                </ElTooltip>
            </h3>
            <div class="main-actions" v-if="actions.length">
                <QuickActions :items="actions" :scope="trans.scope"/>
            </div>
        </div>
        <div class="main-area">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, onMounted, reactive } from 'vue';
import { sizeGt, sizeLte } from "@popjs/core/utils/helper";
import { Bell, Filter } from "@element-plus/icons-vue";
import QuickActions from "@/components/tools/QuickActions.vue";


const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    hasMenu: computed(() => store.state.nav.menus.length),
    isFilterVisible: false,
})

const mainClass = reactive({
    'smaller': sizeLte(trans.media, 'sm'),
    'with-menu': trans.hasMenu,
    'larger': sizeGt(trans.media, 'sm')
})

const props = defineProps({
    title: {
        type: String,
        default: ' '
    },
    tip: {
        type: String,
        default: ''
    },
    hasFilter: {
        type: Boolean,
        default: false
    },
    filter: {
        type: Boolean,
        default: true
    },
    actions: {
        type: Array,
        default: () => {
            return []
        }
    },
    actionScope: {
        type: String,
        default: ''
    },
})

const emits = defineEmits([
    'update:filter'
])


const updateFilter = () => {
    trans.isFilterVisible = !trans.isFilterVisible;
    emits('update:filter', trans.isFilterVisible)
}

onMounted(() => {
    trans.isFilterVisible = props.filter
})
</script>

<style lang="less" scoped>
</style>
