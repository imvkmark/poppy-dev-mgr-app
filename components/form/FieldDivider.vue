<template>
    <ElDivider content-position="left">{{ label }}</ElDivider>
</template>
<script lang="ts" setup>

const props = defineProps({
    label: String
})
</script>
