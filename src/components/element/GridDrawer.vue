<template>
    <GridWidget :url="props.url" :interactive="false" v-if="!trans.message" v-model:title="trans.title"/>
    <ElEmpty :description="trans.message" v-else/>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { useStore } from "@/store";
import GridWidget from "@/components/grid/GridWidget.vue";

const props = defineProps({
    title: String,
    url: {
        type: String,
        default: ''
    }
})

const store = useStore();
const trans = reactive({
    message: '',
    title: '',
})

const emits = defineEmits([
    'update:title',
    'success',
])

watch(() => trans.title, (title) => {
    emits('update:title', title)
})

</script>

<style scoped lang="less">
</style>
