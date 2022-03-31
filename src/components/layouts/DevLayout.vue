<template>
    <ElScrollbar :always="true" height="100vh">
        <div class="py--dev">
            <DevTab/>
            <router-view/>
        </div>
    </ElScrollbar>
</template>

<script lang="ts" setup>
import useGlobalInit from '@/services/composables/useGlobalInit';
import { computed, reactive } from "vue";
import { useStore } from "@/services/store";
import useGlobalTheme from "@/services/composables/useGlobalTheme";
import useDevelopAuth from "@/services/composables/useDevelopAuth";
import DevTab from "@/components/dev/DevTab.vue";

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
