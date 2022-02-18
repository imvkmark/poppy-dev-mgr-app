import { Module } from 'vuex'
import { PyNavTypes, PyRootStateTypes } from "@/framework/store/types";
import { clone, each, get, map, merge, set } from "lodash-es";
import { navConvertItem, navs as defaultNavs } from "@/utils/navs";
import { apiMgrAppUserInfo } from "@/framework/services/poppy";
import { pyStorageKey } from "@/framework/utils/conf";
import { localStore } from "@/framework/utils/helper";

// Create a new store Modules.
const nav: Module<PyNavTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        navs: {},
        prefix: '',
        key: '',
        menus: [],
        sidebarActive: false,
    },
    mutations: {
        SET_NAVS(state: PyNavTypes, navs) {
            state.navs = navs
        },
    },
    actions: {
        // 初始化导航以及菜单
        Init({ commit }) {
            const token = localStore(pyStorageKey.token);
            if (token) {
                const menus = localStore(pyStorageKey.navs);
                if (menus) {
                    commit('SET_NAVS', menus);
                    return;
                }
                apiMgrAppUserInfo().then(({ data }) => {
                    const navs = get(data, 'menus', {});
                    let totalNavs = merge(clone(defaultNavs), navs);
                    let newTotalNavs = {};
                    each(totalNavs, (nav, nav_key) => {
                        const menus = get(nav, 'children', []);
                        let newNav = clone(nav);
                        if (menus.length) {
                            const newChildren = map(menus, (menu) => {
                                const submenus = get(menu, 'children', []);
                                let newMenu = clone(menu);
                                if (submenus.length) {
                                    const newChildren = map(submenus, (submenu) => {
                                        return navConvertItem(submenu);
                                    })
                                    set(newMenu, 'children', newChildren)
                                    return newMenu;
                                } else {
                                    return navConvertItem(newMenu);
                                }
                            })
                            set(newNav, 'children', newChildren)
                            // add menus to nav
                            set(newTotalNavs, nav_key.replace('.', '-'), newNav)
                        } else {
                            set(newTotalNavs, nav_key.replace('.', '-'), navConvertItem(newNav))
                        }
                    })
                    localStore(pyStorageKey.navs, newTotalNavs);
                    commit('SET_NAVS', newTotalNavs)
                })
            } else {
                commit('SET_NAVS', defaultNavs);
            }
        },
        SetPrefix({ state }, { prefix, key }) {
            state.prefix = prefix;
            state.key = key;
            state.menus = get(state.navs, `${prefix}.children`, []);
        },
        CloseSidebar({ state }) {
            state.sidebarActive = false
        },
        OpenSidebar({ state }) {
            state.sidebarActive = true
        },
    }
}

export default nav
