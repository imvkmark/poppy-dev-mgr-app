<template>
    <div v-if="trans.menus.length && !sizeLte(trans.media, 'sm')">
        <ElScrollbar class="sidebar-wrapper" :always="true">
            <PxMenus/>
        </ElScrollbar>
    </div>
    <ElDrawer v-if="trans.menus.length && sizeLte(trans.media, 'sm')" :model-value="trans.active" :with-header="false"
        custom-class="py--sidebar-drawer"
        :show-close="false" :size="240" direction="ltr" @close="onDrawerClose">
        <ElScrollbar class="sidebar-drawer" :always="true">
            <PxMenus/>
        </ElScrollbar>
    </ElDrawer>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { sizeLte } from "@/framework/utils/helper";
import PxMenus from "@/components/base/PxMenus.vue";

const router = useRouter();
const store = useStore();
const trans = reactive({
    active: computed(() => store.state.nav.sidebarActive),
    media: computed(() => store.state.poppy.media),
    menus: computed(() => store.state.nav.menus),
    key: computed(() => store.state.nav.key)
})

const onDrawerClose = () => {
    store.dispatch('nav/CloseSidebar')
}
</script>

<style lang="less" scoped>
.sidebar-wrapper {
    margin-top: var(--wc-header-height);
    height: calc(100vh - var(--wc-header-height));
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    border-right: var(--wc-side-border-color) 1px solid;
}

.sidebar-drawer {
    height: 100vh;
    background: #fff;
    border-right: var(--wc-side-border-color) 1px solid;
}
</style>
