import { Module } from 'vuex'
import { PyNavTypes, PyRootStateTypes } from "@/framework/store/types";
import { get } from "lodash-es";
import { navs } from "@/utils/navs";
import { apiMgrAppUserInfo } from "@/framework/services/poppy";

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
        /**
         * 初始化
         * @constructor
         */
        Init({ commit }) {
            const defaultNavs = navs;
            // 设备ID
            commit('SET_NAVS', defaultNavs);
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
        AppendUserPerms({ state }) {
            // todo  等待追加
            apiMgrAppUserInfo().then(({ data }) => {
                console.log(data);
            })
        }
    }
}

export default nav
