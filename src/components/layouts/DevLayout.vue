<template>
    <ElScrollbar :always="true" height="100vh">
        <div class="py--dev">
            <DevTab/>
            <router-view/>
        </div>
    </ElScrollbar>
</template>

<script lang="ts" setup>
import useGlobalInit from '@/composables/useGlobalInit';
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import useGlobalTheme from "@/composables/useGlobalTheme";
import useDevelopAuth from "@/composables/useDevelopAuth";
import DevTab from "../dev/DevTab.vue";

useGlobalInit();
useGlobalTheme()
useDevelopAuth();
const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
})

</script>
<style scoped lang="less">
.container {
    position: relative;
    box-sizing: border-box;
}
</style>
