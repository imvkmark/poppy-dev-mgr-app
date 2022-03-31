import { computed, onMounted, onUnmounted, reactive, watch } from 'vue'
import { useStore } from '@/services/store';
import { each, get, map } from "lodash-es";
import { useRouter } from "vue-router";
import { emitter, PY_USER_LOGIN, PY_USER_LOGOUT } from "@/services/bus/mitt";
import { routerNameKey } from "@/services/utils/util";

/**
 * 初始化
 */
export default function useNav() {
    const store = useStore();
    let router = useRouter();
    const trans = reactive({
        navs: computed(() => store.state.nav.navs),
    });

    const findPrefix = (key: string) => {
        let matched = '';
        each(trans.navs, (nav, menu_key) => {
            if (matched) {
                return;
            }
            let navChildren = get(nav, 'children', []);
            if (navChildren.length) {
                each(navChildren, (menu) => {
                    if (matched) {
                        return;
                    }
                    const submenus = get(menu, 'children', []);
                    if (submenus.length) {
                        map(submenus, (submenu) => {
                            if (key === get(submenu, 'key', '')) {
                                matched = menu_key;
                            }
                        })
                    } else {
                        if (key === get(menu, 'key', '')) {
                            matched = menu_key;
                        }
                    }
                })
            } else {
                if (key === get(nav, 'key', '')) {
                    matched = menu_key;
                }
            }
        })
        return matched;
    }

    const setPrefix = function () {
        let name = String(router.currentRoute.value.name);
        let params = get(router.currentRoute.value, 'params', {});
        let key = routerNameKey(name, params)
        let prefix = findPrefix(key);
        store.dispatch('nav/SetPrefix', {
            prefix, key
        }).then()
    }

    // 用户(登录|退出)重新获取菜单
    onMounted(() => {
        const menus = store.state.poppy.menus;
        store.dispatch('nav/Init', menus).then()
    })

    // Nav Init 之后触发
    watch(() => store.state.poppy.menus, (menus) => {
        store.dispatch('nav/Init', menus).then()
    })

    watch([() => store.state.nav.navs, () => router.currentRoute.value.fullPath], () => {
        setPrefix();
    })

    onUnmounted(() => {
        emitter.off(PY_USER_LOGIN);
    })
}
