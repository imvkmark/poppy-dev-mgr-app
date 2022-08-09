<template>
    <div class="nav">
        <ul>
            <li :class="{active:trans.prefix === key}" v-for="(menu, key) in trans.navs" :key="key"
                @click="jumpTo(menu)">
                <XIcon :type="menu.icon" class-name="nav-icon"/>
                <span class="side-text" v-if="sizeGt(trans.media, 'xs')">{{ menu.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { sizeGt } from "@popjs/core/utils/helper";
import { first, get } from "lodash-es";
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


</script>

<style lang="less" scoped>
.nav {
    z-index: 8;
    box-sizing: border-box;
    font-size: 15px;
    padding: 0 16px;
    margin-top: 12px;
    ul {
        color: #FFF;
        padding-left: 0;
        margin: 0;
        li {
            list-style: none;
            display: flex;
            align-items: center;
            cursor: pointer;
            height: 34px;
            position: relative;
            color: var(--wc-menu-color);
            text-decoration: none;
            .nav-icon {
                color: var(--wc-menu-color);
                font-size: 22px;
                margin-right: 8px;
                font-weight: bold;
            }
            &:hover, &.active {
                color: var(--wc-menu-active-color);
                .nav-icon {
                    color: var(--wc-menu-active-color);
                }
            }

        }
    }
    .side-text {
        text-align: center;
    }
}
</style>
