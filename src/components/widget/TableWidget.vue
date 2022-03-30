<template>
    <ElTable :data="rows" border stripe :size="trans.size">
        <ElTableColumn v-for="(header, hk) in headers" :prop="hk" :key="hk" :label="header"/>
    </ElTable>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useStore } from '@/store';

const props = defineProps({
    rows: {
        type: Array,
        default: () => {
            return []
        }
    },
    headers: {
        type: Array,
        default: () => {
            return []
        }
    },
})
const store = useStore();
const trans = reactive({
    media: computed(() => store.state.poppy.media),
    size: computed(() => store.state.poppy.size)
})

</script>

<style scoped lang="less">

</style>
