<template>
    <!--  下拉  -->
    <template v-if="get(value, 'style') === 'dropdown'">
        <template v-for="item in trans.dropdownBefore" :key="item">
            <ElButton @click="doRequest(item)"
                :loading="trans.button === base64Encode(String(get(item, 'url', '')))"
                :plain="get(item, 'plain', false)"
                :type="get(item, 'type', 'default')"
                :size="trans.elementSize"
                :circle="get(item, 'circle', false)"
                :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                :disabled="get(item, 'disabled', false)">
                <template #default v-if="!get(item, 'only', false)">
                    {{ get(item, 'title', '') }}
                </template>
            </ElButton>
        </template>
        <template v-if="trans.dropdownAfter.length">
            <ElDropdown trigger="click" :hide-on-click="false" @command="doRequest"
                style="margin-left: 12px;">
                <ElButton plain>
                    更多
                    <ElIcon class="el-icon--right">
                        <ArrowDown/>
                    </ElIcon>
                </ElButton>
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
            <ElButton @click="doRequest(item)" :plain="get(item, 'plain', false)"
                :type="get(item, 'type', 'default')"
                :size="trans.elementSize"
                :circle="get(item, 'circle', false)"
                :icon="get(item, 'icon', '') ? get(icon, upperCamelCase(get(item, 'icon'))) : null"
                :loading="trans.button === base64Encode(get(item, 'url'))"
                :disabled="get(item, 'disabled', false)">
                <template #default v-if="!get(item, 'only', false)">
                    {{ get(item, 'title', '') }}
                </template>
            </ElButton>
        </template>
    </template>
</template>
<script lang="ts" setup>
import { get, slice } from "lodash-es";
import { icon } from "@/framework/utils/icon";
import { base64Encode, upperCamelCase } from "@/framework/utils/helper";
import { computed, reactive } from "vue";
import { useStore } from "@/store";
import { ArrowDown } from "@element-plus/icons-vue";

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
    button: computed(() => store.state.poppy.requestBtnKey),
    elementSize: computed(() => store.state.poppy.elementSize),
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
const doRequest = (item: any) => {
    store.commit('poppy/SET_REQUEST', item);
}


</script>
<style lang="less" scoped>

</style>
