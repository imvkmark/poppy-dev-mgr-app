<template>
    <div :class="{
        'py--main': true,
        smaller : sizeLte(trans.media, 'sm'),
        'with-menu' : trans.hasMenu,
        larger : sizeGt(trans.media, 'sm')}">
        <slot name="title"/>
        <template></template>
        <div class="main-area">
            <slot/>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useStore } from '@/store';
import { computed, reactive } from 'vue';
import { sizeGt, sizeLte } from "@popjs/core/utils/helper";

const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    hasMenu: computed(() => store.state.nav.menus.length),
})

const props = defineProps({
    title: String,
    description: String
})
</script>

<style lang="less" scoped>
</style>
