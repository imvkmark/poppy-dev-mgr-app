<template>
    <router-view/>
</template>

<script lang="ts" setup>
import useAuth from '@/composables/useAuth';
import useGlobalInit from "@/composables/useGlobalInit";

useGlobalInit();
useAuth();
</script>
<style scoped lang="less">
</style>
