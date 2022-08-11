<template>
    <div class="menu">
        <ul>
            <li :class="{active:trans.prefix === key}" v-for="(menu, key) in trans.navs" :key="key"
                @click="jumpTo(menu)">
                <XIcon :type="menu.icon" class-name="menu-icon"/>
                <span class="menu-text">{{ menu.title }}</span>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { first, get } from "lodash-es";
import XIcon from "@/components/element/XIcon.vue";

// 监听路由前缀的变化
let router = useRouter();
let store = useStore();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    prefix: computed(() => store.state.nav.prefix),
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
.menu {
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
            .menu-icon {
                color: var(--wc-menu-color);
                font-size: 24px;
                margin-right: 8px;
                font-weight: bold;
            }
            &:hover, &.active {
                color: var(--wc-menu-active-color);
                .menu-icon {
                    color: var(--wc-menu-active-color);
                }
            }

        }
    }
    .menu-text {
        text-align: center;
    }
}


@media screen and (max-width: 768px) {
    .menu {
        margin-top: 0;
        display: flex;
        align-items: center;
        ul {
            display: flex;
            li {
                .menu-icon {
                    font-size: 28px;
                }

            }
        }
        .menu-text {
            display: none;
        }
    }
}
</style>
