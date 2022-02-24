<template>
    <PxSidebar/>
    <div :class="{'py--content':true,'with-menu' : trans.hasMenu, smaller : sizeLte(trans.size, 'sm'),larger : sizeGt(trans.size, 'sm'),}">
        <router-view/>
    </div>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useInit from '@/framework/composables/useInit';
import useFluid from '@/framework/composables/useFluid';
import PxSidebar from '@/components/base/PxSidebar.vue';
import { sizeGt, sizeLte } from "@/framework/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import useNav from "@/composables/useNav";
import useTheme from "@/framework/composables/useTheme";

useNav();
useInit();
useAuth();
useFluid();
useTheme()
const store = useStore();
const trans = reactive({
    size: computed(() => store.state.poppy.size),
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
