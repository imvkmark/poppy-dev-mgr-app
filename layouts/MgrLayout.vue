<template>
    <PxSidebar/>
    <div :class="{'py--content':true,'with-menu' : trans.hasMenu, smaller : sizeLte(trans.media, 'sm'),larger : sizeGt(trans.media, 'sm'),}">
        <router-view/>
    </div>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useInit from '@/framework/composables/useInit';
import PxSidebar from '@/framework/components/base/PxSidebar.vue';
import { sizeGt, sizeLte } from "@/framework/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import useNav from "@/composables/useNav";
import useTheme from "@/framework/composables/useTheme";

useNav();
useInit();
useAuth();
useTheme()
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
