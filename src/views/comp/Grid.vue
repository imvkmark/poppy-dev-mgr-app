<template>
    <GridWidget :url="refUrl" :interactive="true"/>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { base64Decode } from "@popjs/core/utils/helper";
import GridWidget from "@/components/grid/GridWidget.vue";

const router = useRouter();
const refUrl = ref('');

watch(() => router.currentRoute.value.params.type, () => {
    if (router.currentRoute.value.name !== 'py:grid.index') {
        return;
    }
    refUrl.value = base64Decode(String(router.currentRoute.value.params.type));
})

onMounted(() => {
    refUrl.value = base64Decode(String(router.currentRoute.value.params.type));
})
</script>

<style scoped lang="less">


.pagination {
    padding-top: var(--wc-pagination-padding)
}


</style>
