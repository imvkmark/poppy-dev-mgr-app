<template>
    <!--  下拉  -->
    <template v-if="get(value, 'style') === 'dropdown'">
        <template v-for="item in trans.dropdownBefore" :key="item">
            <Action :item="item"/>
        </template>
        <template v-if="trans.dropdownAfter.length">
            <ElDropdown trigger="click" :hide-on-click="false" @command="doAction" :size="trans.size"
                style="margin-left: 12px;">
                <ElButton plain v-if="!get(value, 'dropdown-icon', false)">
                    更多
                    <ElIcon class="el-icon--right">
                        <ArrowDown/>
                    </ElIcon>
                </ElButton>
                <ElButton plain v-else :icon="MoreFilled" circle/>
                <template #dropdown>
                    <ElDropdownMenu>
                        <ElDropdownItem v-for="item in trans.dropdownAfter" :key="item" :command="item"
                            :loading="trans.button === base64Encode(String(get(item, 'url')))"
                            :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(String(get(item, 'icon')))) : null"
                            :disabled="get(item, 'disabled', false)">
                            {{ get(item, 'title', '') }}
                        </ElDropdownItem>
                    </ElDropdownMenu>
                </template>
            </ElDropdown>
        </template>
    </template>
    <template v-else>
        <template v-for="item in get(value, 'items')" :key="item">
            <Action :item="item"/>
        </template>
    </template>
</template>
<script lang="ts" setup>
import { get, slice } from "lodash-es";
import { icon } from "@/utils/icon";
import { base64Encode, upperCamelCase } from "@popjs/core/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import { ArrowDown, MoreFilled } from "@element-plus/icons-vue";
import Action from "@/components/element/Action.vue";
import { emitter } from "@popjs/core/bus/mitt";
import { MGR_APP_ACTION } from "@/bus";

const props = defineProps({
    value: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const store = useStore();

const trans = reactive({
    size: computed(() => store.state.poppy.size),
    dropdownBefore: computed(() => {
        const items = get(props.value, 'items');
        const length = get(props.value, 'length');
        if (get(props.value, 'style') === 'dropdown') {
            // 相等 返回全部; 例如允许 5个, 一共有 5 个, 则返回全部
            if (items.length === length) {
                return items;
            }
            // 大于 ; 例如允许5个, 一共有 6 个, 则返回前四个, 后两个进行更多分组
            if (items.length > length) {
                return slice(items, 0, length - 1)
            } else {
                return items;
            }
        }
        return [];
    }),
    dropdownAfter: computed(() => {
        const items = get(props.value, 'items');
        const length = get(props.value, 'length');
        if (get(props.value, 'style') === 'dropdown') {
            if (items.length > length) {
                return slice(items, length - 1)
            }
        }
        return [];
    })
})
const doAction = (item: any) => {
    emitter.emit(MGR_APP_ACTION, item)
}


</script>
<style lang="less" scoped>

</style>
