<template>
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
import { sizePercent } from "@/utils/helper";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: () => {
            return false
        }
    }
})

const emit = defineEmits([
    'update:modelValue'
])

let router = useRouter();
let store = useStore();
const inputRef: any = ref<InstanceType<typeof ElInput>>();
const trans = reactive({
    navs: computed(() => store.state.nav.navs),
    media: computed(() => store.state.poppy.media),
    visible: false,
    kw: '',
});

const searched = computed(() => {
    let formatValues = toPlainNavs()
    let filtered = filter(formatValues, (item) => {
        return trans.kw ? String(get(item, 'titleCi')).indexOf(lowerCase(trans.kw)) >= 0 : true;
    });
    return groupBy(filtered, function (item) {
        return get(item, 'navTitle')
    });
})

watch(() => trans.visible, (val) => {
    emit('update:modelValue', val)
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

watch(() => props.modelValue, (newVal) => {
    trans.visible = newVal;
    nextTick(()=>{
        if (inputRef.value) {
            inputRef.value.focus();
        }
    })
})

onMounted(() => {
    trans.visible = props.modelValue;
})
</script>

<style lang="less" scoped>
.search {
    .search-icon {
        cursor: pointer;
        height: 3.5rem;
        margin-right: 1rem;
        margin-left: 1rem;
        font-size: 1.2rem;
        &:hover {
            color: var(--wc-link-active-color);
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
