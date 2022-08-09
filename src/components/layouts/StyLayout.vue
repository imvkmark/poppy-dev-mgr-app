<template>
    <PxMenu/>
    <ElScrollbar :always="true" height="100vh" class="content">
        <div class="main" :class="{'main-has_menu': hasMenu}">
            <PxTitle :title="get(meta, 'title')" v-if="!hasMenu"/>
            <div class="d-flex inner-content" :class="{'content-has_menu' : hasMenu}">
                <PxSidebar v-if="hasMenu"/>
                <div class="inner-main" :class="{'with-menu' : hasMenu, smaller : sizeLte(media, 'sm'),larger : sizeGt(media, 'sm'),}">
                    <router-view/>
                </div>
            </div>
        </div>
    </ElScrollbar>
    <Listen/>
</template>

<script lang="ts" setup>
import useBackendAuth from '@/composables/useBackendAuth';
import useGlobalInit from '@/composables/useGlobalInit';
import PxSidebar from '@/components/backend/PxSidebar.vue';
import { sizeGt, sizeLte } from "@popjs/core/utils/helper";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "@/store";
import useNav from "@/composables/useNav";
import useGlobalTheme from "@/composables/useGlobalTheme";
import useGlobalEmit from "@/composables/useGlobalEmit";
import Listen from "@/components/element/Listen.vue";
import { useRouter } from "vue-router";
import PxMenu from "@/components/backend/PxMenu.vue";
import { get } from "lodash-es";
import PxTitle from "@/components/backend/PxTitle.vue";

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
.content {
    flex: auto;
}

.inner-content {
    box-sizing: border-box;
    min-width: 320px;
    width: 100%;
    border-radius: 4px;
    min-height: calc(100vh - 12px - 12px - 40px);
    &.content-has_menu {
        min-height: 100vh;
    }
    &.larger {
        padding-top: var(--wc-header-height);
        &.with-menu {
            padding-left: 240px;
        }
    }
    &.smaller {
        &.with-menu {
            .py--main {
                min-height: calc(100vh - var(--wc-header-height) - var(--wc-menubar-height) - 0.1rem);
            }
        }
    }
}

.inner-main {
    flex: auto;
}

.main {
    padding: 12px 24px;
    box-sizing: border-box;
    &.main-has_menu {
        padding: 0;
    }
}
</style>
