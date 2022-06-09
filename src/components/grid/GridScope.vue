<template>
    <ElTabs :model-value="scope" v-if="scopes.length" @update:model-value="onUpdateScope">
        <ElTabPane :label="get(item, 'label')" :name="get(item, 'value')" v-for="item in scopes" :key="get(item, 'value')"/>
    </ElTabs>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_MOTION_GRID_SCOPE } from "@/bus";
import { get } from "lodash-es";

const props = defineProps({
    scope: {
        type: String,
        default: ''
    },
    scopes: {
        type: Array,
        default: () => {
            return []
        }
    }
})
const disabled = ref(false);
const onUpdateScope = (val: string) => {
    emitter.emit(MGR_APP_MOTION_GRID_SCOPE, val)
}

</script>
<style lang="less" scoped>
.text-ellipsis {
    cursor: pointer;
}

</style>
