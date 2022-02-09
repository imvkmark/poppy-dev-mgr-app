import { Module } from 'vuex'
import { get } from "lodash-es";
import { toast } from "@/framework/utils/helper";
import { PyRootStateTypes } from "@/framework/store/types";
import { apiPyGrid } from "@/framework/services/poppy";

export interface GridTypes {
    action: object,
    button: string,
    page: string,
    loading: boolean,
    reload: boolean,
    reset: boolean,
}

const grid: Module<GridTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        action: {},
        loading: false,
        page: '',
        button: '',
        reload: false,
        reset: false,
    },
    mutations: {
        LOADING(state: GridTypes) {
            state.loading = true
        },
        LOADED(state: GridTypes) {
            state.loading = false
        },
        RESET_START(state: GridTypes) {
            state.reset = true
        },
        RESET_OVER(state: GridTypes) {
            state.reset = false
        },
        RELOAD_START(state: GridTypes) {
            state.reload = true
        },
        RELOAD_OVER(state: GridTypes) {
            state.reload = false
        },
        BTN_KEY(state: GridTypes, key) {
            state.button = key;
        },
        BTN_EMPTY(state: GridTypes) {
            state.button = '';
        },
        PAGE_SET(state: GridTypes, page) {
            state.page = page;
        },
        PAGE_EMPTY(state: GridTypes) {
            state.page = '';
        },
    },
    actions: {
        // 进行操作
        DoAction({ commit }, { action }) {
            const url = get(action, 'url');
            let method = get(action, 'method');

            switch (method) {
                // 页面请求
                case 'request':
                    commit('BTN_KEY', window.btoa(url))
                    apiPyGrid(url, {}, 'POST').then((resp) => {
                        commit('BTN_EMPTY')
                        toast(resp);
                        const { success } = resp
                        if (success) {
                            commit("RELOAD_START");
                        }
                    })
                    break;
                // 页面
                case 'page':
                    commit('PAGE_SET', url)
                    break;
                default:
                    toast('不正确的操作类型');
                    break;
            }
        },
    }
}

export default grid
