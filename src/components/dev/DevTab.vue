<template>
    <div class="sidebar">
        <router-link :class="{active : router.currentRoute.value.name === 'dev.apidoc'}" :to="{name: 'dev.apidoc'}">API</router-link>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/services/store';

const router = useRouter();
const store = useStore();
const trans = reactive({
    active: computed(() => {
        console.log(router.currentRoute.value.name)
        return router.currentRoute.value.name
    }),
})

</script>

<style lang="less" scoped>
.sidebar {
    width: 50px;
    background: #0C0603;
    height: 100vh;
    a {
        height: 50px;
        font-weight: bold;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #fff;
        box-sizing: border-box;
        &.active {
            background: var(--wc-color-dark-blue);
            border-left: 3px solid var(--wc-color-primary);
        }
    }
}
</style>
