<template>
    <router-view/>
</template>

<script lang="ts" setup>

import { computed, onMounted, watch } from "vue";
import { useStore } from "@/store";
import { sizeLte } from "@popjs/core/utils/helper";


const store = useStore();
const media = computed(() => store.state.poppy.media)

/**
 * 设置是否竖向布局
 * @param media
 */
const setClass = (media: string) => {
    let elApp = document.getElementById('app') as Element;
    if (sizeLte(media, 'xs')) {
        if (!elApp.classList.contains('vertical')) {
            elApp.classList.add("vertical")
        }
    } else {
        if (elApp.classList.contains('vertical')) {
            elApp.classList.remove("vertical")
        }
    }
}

watch(() => store.state.poppy.media, (newVal) => {
    setClass(newVal)
})

onMounted(() => {
    setClass(media.value);
})

</script>

<style lang="less">
body {
    background: var(--wc-bg-color);
    margin: 0;
}

#app {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
    min-height: 100vh;
    width: 100%;
    display: flex;
    &.vertical {
        flex-direction: column;
    }
}
</style>
