<template>
    <footer>
        <span>{{ appVersion }}</span>
        <div class="logo">
            <img :src="logo" v-if="logo" alt="">
            <img src="@/assets/images/logo.png" v-else alt="">
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { computed } from 'vue';
import { get } from "lodash-es";
import { appVersion } from "@/utils/conf";

const store = useStore();
const logo = computed(() => get(store.state.poppy.core, 'py-system.logo'));
</script>
<style lang="less" scoped>
footer {
    border-top: 1px solid var(--wc-menu-color);
    padding: 0 24px;
    height: 65px;
    color: var(--wc-menu-color);
    display: flex;
    box-sizing: border-box;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.3s;
    .logo {
        cursor: pointer;
        img {
            height: 32px;
            display: block;
            border-radius: 4px;
        }
    }
}

@media screen and (max-width: 768px) {
    footer {
        display: none;
    }
}
</style>
