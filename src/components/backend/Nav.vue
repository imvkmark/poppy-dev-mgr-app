<template>
    <nav>
        <NavUser/>
        <NavSearch/>
        <NavMenu/>
        <div class="nav-fill"/>
        <NavFooter/>
    </nav>
</template>

<script lang="ts" setup>
import { useStore } from "@/store";
import NavUser from "@/components/backend/NavUser.vue";
import NavSearch from "@/components/backend/NavSearch.vue";
import NavMenu from "@/components/backend/NavMenu.vue";
import NavFooter from "@/components/backend/NavFooter.vue";

const store = useStore();
</script>
<style scoped lang="less">
nav {
    width: 214px;
    background: linear-gradient(294.17deg, rgb(47, 25, 55) 35.57%, rgb(69, 38, 80) 92.42%, rgb(69, 38, 80) 92.42%);
    padding: 12px 0 2px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .nav-fill {
        flex: 1;
    }
}

@media screen and (max-width: 768px) {
    nav {
        width: 100%;
        padding-top: 0;
        flex-direction: row;
        .nav-fill {
            display: none;
        }
    }
}
</style>
