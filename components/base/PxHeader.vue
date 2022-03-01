<template>
    <header :class="{fixed : sizeGt(trans.size, 'sm'), absolute : sizeLte(trans.size, 'sm')}">
        <div class="nav" @click="onLogoClick">
            <div class="logo">
                <img src="@/framework/assets/image/logo.png" alt="Wulicode">
            </div>
        </div>
        <div class="right">
            <PxNav/>
            <PxTheme v-if="trans.isLogin"/>
        </div>
    </header>
    <div class="menubar" v-if="sizeLte(trans.size, 'sm') && trans.hasMenu">
        <ElIcon>
            <DArrowRight @click="store.dispatch('nav/OpenSidebar')"/>
        </ElIcon>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, reactive } from 'vue';
import { sizeGt, sizeLte } from "@/framework/utils/helper";
import PxNav from "@/framework/components/base/PxNav.vue";
import { DArrowRight } from "@element-plus/icons-vue";
import PxTheme from "@/framework/components/base/PxTheme.vue";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const trans = reactive({
    prefix: computed(() => store.state.nav.prefix),
    sidebarActive: computed(() => store.state.nav.sidebarActive),
    size: computed(() => store.state.poppy.size),
    hasMenu: computed(() => store.state.nav.menus.length),
    isLogin: computed(() => store.state.poppy.token),
})

const onLogoClick = () => {
    router.push({
        name: 'user.cp'
    })
}

</script>

<style lang="less" scoped>
header {
    height: 3.5rem;
    background-color: #FFF;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex: auto;
    justify-content: space-between;
    border-bottom: 1px solid var(--wc-header-border-color);
    &.fixed {
        position: fixed;
        width: 100%;
        z-index: 4;
    }
    &.absolute {
        top: 0;
        left: 0;
        position: relative;
    }
    .nav {
        width: 5rem;
        height: 3.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s;
        .logo {
            cursor: pointer;
            img {
                height: 2rem;
            }
        }
    }
    .right {
        display: flex;
    }
}


.menubar {
    position: sticky;
    display: flex;
    top: 0;
    z-index: 4;
    background: #fff;
    height: var(--wc-menubar-height);
    align-items: center;
    padding-left: 1rem;
    border-bottom: var(--wc-header-border-color) 1px solid;
    .el-icon {
        font-size: 1.2rem;
        font-weight: lighter;
        cursor: pointer;
    }
    .filter {
        cursor: pointer;
        &.active {
            color: var(--wc-color-primary);
        }
    }
}
</style>
