import { Module } from 'vuex'
import { PyGridTypes, PyRootStateTypes } from "@/framework/store/types";


const grid: Module<PyGridTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        action: {},
        button: '',
        page: '',
        loading: false,
        reload: false,
        reset: false,
    },
    mutations: {
        LOADING(state: PyGridTypes) {
            state.loading = true
        },
        LOADED(state: PyGridTypes) {
            state.loading = false
        },
        RESET_START(state: PyGridTypes) {
            state.reset = true
        },
        RESET_OVER(state: PyGridTypes) {
            state.reset = false
        },
        RELOAD_START(state: PyGridTypes) {
            state.reload = true
        },
        RELOAD_OVER(state: PyGridTypes) {
            state.reload = false
        },
    },
    actions: {

    }
}

export default grid
