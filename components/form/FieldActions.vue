<template>
    <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)" v-for="item in get(attr, 'actions')" :key="item"
        :type="get(item, 'type', 'default')"
        :circle="get(item, 'circle', false)"
        :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
        :loading="get(trans.loading, base64Encode(get(item, 'url')), false)"
        :disabled="get(item, 'disabled', false)">
        <template #default v-if="!get(item, 'only', false)">
            {{ get(item, 'title', '') }}
        </template>
    </ElButton>
    <slot/>
</template>
<script lang="ts" setup>
import { get } from "lodash-es";
import { icon } from "@/framework/utils/icon";
import { base64Encode, upperCamelCase } from "@/framework/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";

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
    loading: computed(() => store.state.poppy.loading),
    size: computed(() => store.state.poppy.size),
})
const doRequest = (item: any) => {
    store.commit('poppy/SET_REQUEST', item);
}


</script>
<style lang="less" scoped>

</style>
