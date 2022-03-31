<template>
    <div class="sidebar">
        <router-link :to="{name: 'dev.api'}">API</router-link>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/services/store';

const router = useRouter();
const store = useStore();
const trans = reactive({
    active: computed(() => store.state.nav.sidebarActive),
    media: computed(() => store.state.poppy.media),
    menus: computed(() => store.state.nav.menus),
    key: computed(() => store.state.nav.key)
})

</script>

<style lang="less" scoped>
.sidebar {
    width: 50px;
    background: #0C0603;
    height: 100vh;
}
</style>
