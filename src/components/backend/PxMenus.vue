<template>
    <div class="sidebar">
        <div v-for="(item, key) in trans.menus" :key="key">
            <h3>{{ item.title }}</h3>
            <ul>
                <li v-for="rt in get(item, 'children', [])" :key="rt"
                    :class="{active : routerNameKey(rt.name , get(rt, 'params', {})) === trans.key}">
                    <span @click="onLinkClick(rt.name, get(rt, 'params', {}))">{{ rt.title }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from '@/services/store';
import { get } from 'lodash-es';
import { routerNameKey } from "@/services/utils/util";

const router = useRouter();
const store = useStore();
const trans = reactive({
    menus: computed(() => store.state.nav.menus),
    key: computed(() => store.state.nav.key)
})
const onLinkClick = (name: string, params: any) => {
    router.push({
        name,
        params
    });
    store.dispatch('nav/CloseSidebar')
}
</script>

<style lang="less" scoped>
.sidebar {
    background: #FFF;
    min-width: 240px;
    box-sizing: border-box;
    transition: left 0.3s;
    padding: 1rem 0;
    h3 {
        font-size: 12px;
        font-weight: normal;
        padding: 0 0 0 1rem;
        margin: 0;
        color: var(--wc-color-dark-blue);
    }
    ul {
        list-style: none;
        padding-left: 0.8rem;
        li {
            height: 18px;
            line-height: 18px;
            margin-bottom: 8px;
            font-size: 14px;
            border-left: 2px solid transparent;
            cursor: pointer;
            &.active {
                span {
                    border-left: 2px solid var(--wc-color-primary);
                }
            }
            span {
                padding-left: 1rem;
                border-left: 2px solid transparent;
                color: var(--wc-color-dark-blue);
                text-decoration: none;
                display: block;
            }
        }
    }
}
</style>
