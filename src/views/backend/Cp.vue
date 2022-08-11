<template>
    <ElRow :gutter="4">
        <ElCol :span="sizeWidth(media, 8)">
            <CpUser/>
            <CpUser/>
            <CpUser/>
            <CpUser/>
            <CpUser/>
            <CpUser/>
            <CpUser/>
        </ElCol>
        <ElCol :span="8">
            -
        </ElCol>
        <ElCol :span="8">
            -
        </ElCol>
    </ElRow>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from '@/store';
import { sizeWidth } from "@popjs/core/utils/helper";
import CpUser from "@/components/dashboard/CpUser.vue";

const store = useStore();
const media = computed(() => store.state.poppy.media)
</script>

<style scoped lang="less">
</style>
