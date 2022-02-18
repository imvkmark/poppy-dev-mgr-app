<template>
    <div v-for="img in value" :key="img" :style="{
        background : `url(${get(img, 'thumb')})`,
        'background-size': 'cover',
        width: `${get(img, 'width')}px`,
        height: `${get(img, 'height')}px`,
    }"/>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";

const props = defineProps({
    value: {
        type: Array,
        default: () => {
            return []
        }
    }
})


</script>
<style lang="less" scoped>

</style>
