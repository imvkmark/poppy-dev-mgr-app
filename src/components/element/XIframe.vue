<template>
    <ElDialog :title="title" v-model="show" @close="onClose" custom-class="py--dialog" :width="width">
        <ElEmpty description="未传入Url 地址, 无法预览" v-if="!url"></ElEmpty>
        <iframe :src="url" v-else></iframe>
    </ElDialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
    title: String,
    visible: Boolean,
    url: String,
    width: {
        type: Number,
        default: 400
    }
})

const show = ref(false);
const emit = defineEmits([
    'update:visible'
])

watch(() => props.visible, (val) => {
    show.value = val
})

const onClose = () => {
    emit('update:visible', false)
}
</script>

<style scoped lang="less">
</style>
