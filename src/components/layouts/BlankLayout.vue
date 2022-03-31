<template>
    <router-view/>
</template>

<script lang="ts" setup>
import useBackendAuth from '@/services/composables/useBackendAuth';
import useGlobalInit from "@/services/composables/useGlobalInit";

useGlobalInit();
useBackendAuth();
</script>
<style scoped lang="less">
</style>
