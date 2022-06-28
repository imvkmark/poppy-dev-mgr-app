<template>
    <div v-for="img in value" :key="img" @click="onPreview(img)" :style="{
        background : `url(${ossResizeImage(img)}) center center`,
        'background-size': 'cover',
        width: '40px',
        height:'40px'
    }"/>
</template>
<script lang="ts" setup>
import { ossResizeImage } from "@/utils/oss";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_INNER_IMAGE_VIEW } from "@/bus";

const props = defineProps({
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})

const onPreview = (url: string) => {
    emitter.emit(MGR_APP_INNER_IMAGE_VIEW, {
        urls: props.value,
        url
    })
}


</script>
<style lang="less" scoped>

</style>
