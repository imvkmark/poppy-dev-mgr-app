<template>
    <div class="dev--cp">
        <ElRow :gutter="4">
            <ElCol :span="sizeWidth(trans.media, 8)">
                <CpChecker/>
            </ElCol>
            <ElCol :span="8">
                -
            </ElCol>
            <ElCol :span="8">
                -
            </ElCol>
        </ElRow>
    </div>
</template>

<script lang="ts" setup>
import CpChecker from "../../components/dev/CpChecker.vue";
import { sizeWidth } from "@popjs/core/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";

const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
})
</script>

<style scoped lang="less">

</style>
