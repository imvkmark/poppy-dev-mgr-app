import { Module } from 'vuex'
import { PyNavTypes, PyRootStateTypes } from "@/framework/store/types";
import { clone, get, merge } from "lodash-es";
import { navConvertNav, navs as defaultNavs } from "@/utils/navs";
import { apiMgrAppUserInfo } from "@/framework/services/mgr-app";
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
        CLEAR_NAVS(state: PyNavTypes) {
            state.navs = {}
        },
    },
    actions: {
        // 初始化导航以及菜单
        Init({ commit }) {
            const token = localStore(pyStorageKey.token);
            if (token) {
                const menus = localStore(pyStorageKey.navs);
                if (menus) {
                    let totalNavs = merge(clone(defaultNavs), menus);
                    commit('SET_NAVS', navConvertNav(totalNavs));
                    return;
                }
                apiMgrAppUserInfo().then(({ data }) => {
                    const navs = get(data, 'menus', {});
                    localStore(pyStorageKey.navs, navs);
                    let totalNavs = merge(clone(defaultNavs), navs);
                    commit('SET_NAVS', navConvertNav(totalNavs));
                })
            } else {
                commit('SET_NAVS', navConvertNav(defaultNavs));
            }
        },
        SetPrefix({ state }, { prefix, key }) {
            state.prefix = prefix;
            state.key = key;
            state.menus = get(state.navs, `${prefix}.children`, []);
        },
        Destruct({ commit, dispatch }) {
            localStore(pyStorageKey.navs, null);
            commit('CLEAR_NAVS');
            dispatch('Init');
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
