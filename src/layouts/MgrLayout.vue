<template>
    <ElScrollbar :always="true" height="100vh">
        <PxHeader/>
        <PxSidebar/>
        <div :class="{'py--content':true,'with-menu' : trans.hasMenu, smaller : sizeLte(trans.media, 'sm'),larger : sizeGt(trans.media, 'sm'),}">
            <router-view/>
        </div>
        <Listen/>
    </ElScrollbar>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useGlobalInit from '@/composables/useGlobalInit';
import PxSidebar from '@/components/base/PxSidebar.vue';
import { sizeGt, sizeLte } from "@/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import useNav from "@/composables/useNav";
import useGlobalTheme from "@/composables/useGlobalTheme";
import useGlobalAction from "@/composables/useGlobalAction";
import PxHeader from "@/components/base/PxHeader.vue";
import Listen from "@/components/element/Listen.vue";

useGlobalAction();
useGlobalInit();
useGlobalTheme()
useNav();
useAuth();
const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    hasMenu: computed(() => {
        return Boolean(store.state.nav.menus.length)
    }),
})

</script>
<style scoped lang="less">
.container {
    position: relative;
    box-sizing: border-box;
}
</style>
