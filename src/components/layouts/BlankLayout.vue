<template>
    <router-view/>
</template>

<script lang="ts" setup>
import useBackendAuth from '@/composables/useBackendAuth';
import useGlobalInit from "@/composables/useGlobalInit";

useGlobalInit();
useBackendAuth();
</script>
<style scoped lang="less">
</style>
