<template>
    <template  v-for="item in get(attr, 'actions')" :key="item">
        <Action :item="item"/>
    </template>
    <slot/>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";
import { computed, reactive } from "vue";
import { useStore } from "@/services/store";
import Action from "@/components/element/Action.vue";

const props = defineProps({
    attr: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const store = useStore();

const trans = reactive({
    size: computed(() => store.state.poppy.size),
})


</script>
<style lang="less" scoped>

</style>
