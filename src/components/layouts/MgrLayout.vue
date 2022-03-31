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
import useBackendAuth from '@/services/composables/useBackendAuth';
import useGlobalInit from '@/services/composables/useGlobalInit';
import PxSidebar from '@/components/backend/PxSidebar.vue';
import { sizeGt, sizeLte } from "@/services/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/services/store";
import useNav from "@/services/composables/useNav";
import useGlobalTheme from "@/services/composables/useGlobalTheme";
import useGlobalAction from "@/services/composables/useGlobalAction";
import PxHeader from "@/components/backend/PxHeader.vue";
import Listen from "@/components/element/Listen.vue";

useGlobalAction();
useGlobalInit();
useGlobalTheme()
useNav();
useBackendAuth();
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
