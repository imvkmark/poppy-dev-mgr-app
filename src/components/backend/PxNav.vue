<template>
    <div class="search">
        <em @click="onSearchClick" @keydown.meta.k="onSearchClick">
            <span v-if="sizeGt(trans.media, 'xs')">⌘ + K</span>
            <ElIcon class="search-icon">
                <Search/>
            </ElIcon>
        </em>
        <PxSearch v-model="trans.showSearch"/>
    </div>
    <div class="py--nav">
        <ul>
            <li :class="{active:trans.prefix === key}" v-for="(menu, key) in trans.navs" :key="key"
                @click="jumpTo(menu)">
                <XIcon :type="menu.icon"/>
                <span class="side-text" v-if="sizeGt(trans.media, 'xs')">{{ menu.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { icon } from "../../utils/icon";
import { sizeGt, upperCamelCase } from "@popjs/core/utils/helper";
import { first, get } from "lodash-es";
import { Search } from "@element-plus/icons-vue";
import PxSearch from "@/components/backend/PxSearch.vue";
import key from 'keymaster'
import XIcon from "@/components/element/XIcon.vue";

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    media: computed(() => store.state.poppy.media),
    prefix: computed(() => store.state.nav.prefix),
    showSearch: false
});

const onSearchClick = () => {
    trans.showSearch = !trans.showSearch
}

const jumpTo = (nav: any) => {
    let findLast: any = (parent: object) => {
        let children = get(parent, 'children', []);
        if (children.length) {
            return findLast(first(children));
        } else {
            return parent;
        }
    }
    let last = findLast(nav);
    router.push({
        name: get(last, 'name'),
        params: get(last, 'params')
    });
}

onMounted(() => {
    key('⌘+k', onSearchClick);
})
</script>

<style lang="less" scoped>
.search {
    em {
        > span {
            font-size: 0.875rem;
            padding-left: 0.72rem;
        }
        display: flex;
        align-items: center;
        font-style: normal;
        border: 1px solid var(--wc-side-border-color);
        background: var(--wc-bg-color);
        color: var(--wc-text-color);
        border-radius: 2rem;

        height: 2.5rem;
        margin-top: 0.4rem;
        &:hover {
            cursor: pointer;
            border-color: var(--wc-link-color);
        }
    }
    .search-icon {
        cursor: pointer;

        margin-right: 0.72rem;
        margin-left: 0.72rem;
        font-size: 1.2rem;
        &:hover {
            color: var(--wc-link-active-color);
        }
    }
}
</style>
