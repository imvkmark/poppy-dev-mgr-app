import { Module } from 'vuex'
import { PyRootStateTypes } from "@/framework/store/types";

export interface GridTypes {
    action: object,
    loading: boolean,
    reload: boolean,
    reset: boolean,
}

const grid: Module<GridTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        action: {},
        loading: false,
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
    },
    actions: {
    }
}

export default grid
