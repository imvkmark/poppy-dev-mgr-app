<template>
    <PxMain title="浏览器信息">
        <p>UserAgent : {{ agent }}</p>
    </PxMain>
</template>
<script lang="ts" setup>
import PxMain from '@/framework/components/base/PxMain.vue';

const agent = window.navigator.userAgent
</script>

<style scoped lang="less">
</style>
