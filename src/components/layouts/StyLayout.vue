<template>
    <Nav/>
    <!--no menu-->
    <ElScrollbar :always="true" class="sty-page" v-if="!hasMenu">
        <Page :title="get(meta, 'title')" :intangible="true">
            <router-view/>
        </Page>
    </ElScrollbar>
    <!--has menu-->
    <div class="sty-page d-flex" v-else>
        <PageSide/>
        <ElScrollbar :always="true" class="page-main">
            <router-view/>
        </ElScrollbar>
    </div>
    <Listen/>
</template>

<script lang="ts" setup>
import useBackendAuth from '@/composables/useBackendAuth';
import useGlobalInit from '@/composables/useGlobalInit';
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "@/store";
import useNav from "@/composables/useNav";
import useGlobalTheme from "@/composables/useGlobalTheme";
import useGlobalEmit from "@/composables/useGlobalEmit";
import Listen from "@/components/element/Listen.vue";
import { useRouter } from "vue-router";
import { get } from "lodash-es";
import Nav from "@/components/backend/Nav.vue";
import Page from "@/components/backend/Page.vue";
import PageSide from "@/components/backend/PageSide.vue";

useGlobalEmit();
useGlobalInit();
useGlobalTheme()
useNav();
useBackendAuth();


const store = useStore();
const router = useRouter();
const media = computed(() => store.state.poppy.media);

const meta = ref({})

/**
 * 获取路由中的 meta 信息
 */
const fetchMeta = () => {
    meta.value = get(router.currentRoute.value, 'meta', {});
}
watch(() => router.currentRoute.value, () => {
    fetchMeta();
})

const hasMenu = computed(() => {
    return Boolean(store.state.nav.menus.length)
})

onMounted(() => {
    fetchMeta();
})

</script>
<style scoped lang="less">
.sty-page {
    flex: auto;
    height: 100vh;
    box-sizing: border-box;
    overflow-y: auto;
    .page-main {
        flex: 1;
        box-sizing: border-box;
    }
}

@media screen and (max-width: 768px) {
    .sty-page {
        height: calc(100vh - 50px);
    }
}
</style>
