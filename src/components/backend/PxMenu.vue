<template>
    <div class="menu">
        <PxUser/>
        <PxSearch/>
        <PxNav/>
        <div class="fill"></div>
        <PxFooter/>
    </div>
</template>

<script lang="ts" setup>
import PxUser from "@/components/backend/PxUser.vue";
import PxSearch from "@/components/backend/PxSearch.vue";
import PxNav from "@/components/backend/PxNav.vue";
import PxFooter from "@/components/backend/PxFooter.vue";
</script>
<style scoped lang="less">
.menu {
    width: 214px;
    background: linear-gradient(294.17deg, rgb(47, 25, 55) 35.57%, rgb(69, 38, 80) 92.42%, rgb(69, 38, 80) 92.42%);
    padding: 12px 0 2px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.fill {
    flex: 1;
}
</style>
