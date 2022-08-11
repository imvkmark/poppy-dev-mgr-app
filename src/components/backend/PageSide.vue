<template>
    <div v-if="!sizeLte(media, 'sm')">
        <ElScrollbar class="sidebar-wrapper" :always="true">
            <PageSideMenu/>
        </ElScrollbar>
    </div>
    <ElDrawer v-if="sizeLte(media, 'sm')" :model-value="trans.active" :with-header="false"
        custom-class="py--sidebar-drawer"
        :show-close="false" :size="240" direction="ltr" @close="onDrawerClose">
        <ElScrollbar class="sidebar-drawer" :always="true">
            <PageSideMenu/>
        </ElScrollbar>
    </ElDrawer>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { sizeLte } from "@popjs/core/utils/helper";
import PageSideMenu from "@/components/backend/PageSideMenu.vue";

const router = useRouter();
const store = useStore();
const media = computed(() => store.state.poppy.media);
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
    height: 100vh;
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
