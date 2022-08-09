<template>
    <div class="search">
        <div class="search-input" @click="onSearchClick" @keydown.meta.k="onSearchClick">
                <span v-if="sizeGt(trans.media, 'xs')" class="search-text">⌘ + K</span>
                <XIcon type="mu:search"/>
        </div>
    </div>
    <ElDialog v-model="trans.visible" :width="sizePercent(trans.media)">
        <div class="search">
            <ElInput ref="inputRef" v-model="trans.kw" size="large" :prefix-icon="Search" clearable/>
            <ElScrollbar height="60vh">
                <ul>
                    <li v-for="(nav, title) in searched" :key="nav">
                        <h3>{{ title }}</h3>
                        <p v-for="(menu, key) in nav" :key="key" @click="goNav(menu)">
                            {{ get(menu, 'titleAll') }}
                        </p>
                    </li>
                </ul>
            </ElScrollbar>
        </div>
    </ElDialog>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { each, filter, get, groupBy, lowerCase } from "lodash-es";
import { ElInput } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { sizeGt, sizePercent } from "@popjs/core/utils/helper";
import key from 'keymaster'
import XIcon from "@/components/element/XIcon.vue";


let router = useRouter();
let store = useStore();
const inputRef: any = ref<InstanceType<typeof ElInput>>();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    media: computed(() => store.state.poppy.media),
    visible: false,
    kw: '',
});

const onSearchClick = () => {
    trans.visible = !trans.visible
}

onMounted(() => {
    key('⌘+k', onSearchClick);
})

const searched = computed(() => {
    let formatValues = toPlainNavs()
    let filtered = filter(formatValues, (item) => {
        return trans.kw ? String(get(item, 'titleCi')).indexOf(lowerCase(trans.kw)) >= 0 : true;
    });
    return groupBy(filtered, function (item) {
        return get(item, 'navTitle')
    });
})

const goNav = (nav: any) => {
    router.push(get(nav, 'route'));
    trans.visible = false;
}

const convertToSearch = (nav: any, menu: any, submenu: any, level: number) => {
    let from;
    if (level === 1) {
        from = nav;
    } else if (level === 2) {
        from = menu;
    } else {
        from = submenu
    }

    const navTitle = level >= 1 ? get(nav, 'title') : '';
    const menuTitle = level >= 2 ? get(menu, 'title') : '';
    const subMenuTitle = level >= 3 ? get(submenu, 'title') : '';
    const titleAll = `${navTitle ? navTitle : ''} ${menuTitle ? '-' + menuTitle : ''} ${subMenuTitle ? '-' + subMenuTitle : ''}`;
    const titleCi = lowerCase(titleAll);
    return {
        navTitle,
        menuTitle,
        subMenuTitle,
        titleAll,
        titleCi,
        route: {
            name: get(from, 'name'),
            params: get(from, 'params'),
            query: get(from, 'query'),
        }
    }
}

const toPlainNavs = () => {
    let allPlainNavs = <any>[];
    each(trans.navs, (nav) => {
        const menus = get(nav, 'children', []);
        if (menus.length) {
            each(menus, (menu) => {
                const submenus = get(menu, 'children', []);
                if (submenus.length) {
                    each(submenus, (submenu) => {
                        allPlainNavs.push(convertToSearch(nav, menu, submenu, 3))
                    })
                } else {
                    allPlainNavs.push(convertToSearch(nav, menu, menu, 2))
                }
            })
        } else {
            allPlainNavs.push(convertToSearch(nav, nav, nav, 1))
        }
    })
    return allPlainNavs;
}

watch(() => trans.visible, (newVal) => {
    trans.visible = newVal;
    nextTick(() => {
        if (inputRef.value) {
            inputRef.value.focus();
        }
    })
})

</script>

<style lang="less" scoped>
.search {
    padding: 0 16px;
    margin: 12px 0 0;
    .search-input {
        color: var(--wc-menu-color);
        border: 1px solid var(--wc-menu-color);
        border-radius: 4px;
        transition: all 0.5s;
        cursor: pointer;
        height: 36px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
            color: var(--wc-menu-active-color);
            border: 1px solid var(--wc-menu-active-color);
        }
        .search-text{
            font-size: 14px;
            padding-right: 8px;
        }
    }
    ul {
        padding-left: 0;
        li {
            list-style: none;
            p {
                border: 1px solid var(--wc-color-light-cyan);
                padding: 0.4rem;
                border-radius: .3rem;
                margin: 0.5rem 0;
                cursor: pointer;
                &:hover {
                    background: var(--wc-bg-color);
                }
            }
        }
    }
}
</style>
