<template>
    <div class="py--main" :class="mainClass">
        <slot name="title"/>
        <div class="main-header">
            <div class="main-toggle-sidebar" v-if="sizeLte(trans.media, 'sm') && trans.hasMenu">
                <XIcon type="mu:menu" class-name="main-toggle-icon" @click="toggleSidebar"/>
            </div>
            <h3 class="main-title">
                <span>{{ title }}</span>
                <ElIcon class="main-title-filter" :class="{'active':isFilterVisible}" v-if="hasFilter" @click="updateFilter">
                    <Filter/>
                </ElIcon>
            </h3>
            <div class="main-actions" v-if="actions.length">
                <QuickActions :items="actions" :scope="scope"/>
            </div>
        </div>
        <div class="main-area" :class="{'main-area-intangible' : intangible}">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, onMounted, reactive } from 'vue';
import { sizeGt, sizeLte } from "@popjs/core/utils/helper";
import { Filter } from "@element-plus/icons-vue";
import QuickActions from "@/components/tools/QuickActions.vue";
import XIcon from "@/components/element/XIcon.vue";


const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    hasMenu: computed(() => store.state.nav.menus.length),
    isFilterVisible: false
})


const props = defineProps({
    title: {
        type: String,
        default: ' '
    },
    inPage: {
        type: Boolean,
        default: false
    },
    hasFilter: {
        type: Boolean,
        default: false
    },
    intangible: {
        type: Boolean,
        default: false
    },
    isFilterVisible: {
        type: Boolean,
        default: true
    },
    actions: {
        type: Array,
        default: () => {
            return []
        }
    },
    scope: {
        type: [String, Number],
        default: ''
    },
})


const toggleSidebar = () => {
    if (store.state.nav.sidebarActive) {
        store.dispatch('nav/CloseSidebar')
    } else {
        store.dispatch('nav/OpenSidebar')
    }

}

const mainClass = reactive({
    'smaller': sizeLte(trans.media, 'sm'),
    'with-menu': trans.hasMenu,
    'larger': sizeGt(trans.media, 'sm'),
    'main-in-page': props.inPage,
})

const emits = defineEmits([
    'update:is-filter-visible'
])


const updateFilter = () => {
    trans.isFilterVisible = !trans.isFilterVisible;
    emits('update:is-filter-visible', trans.isFilterVisible)
}

onMounted(() => {
    trans.isFilterVisible = props.isFilterVisible
})

</script>

<style lang="less" scoped>
</style>
