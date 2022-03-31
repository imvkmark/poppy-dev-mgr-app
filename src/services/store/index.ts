import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { AllStateTypes, RootStateTypes } from './types'

import poppy from '@/services/store/poppy'
import nav from '@/services/store/nav'

export const store = createStore<RootStateTypes>({
    state: {
        text: 'This is Vuex Root.state.text',
        loading: false
    },
    getters: {
        loading(state: any) {
            return state.loading;
        }
    },
    mutations: {},
    actions: {
        Loading({ state }) {
            state.loading = true
        },
        Loaded({ state }) {
            state.loading = false
        }
    },
    modules: {
        poppy, nav
    }
})

export const key: InjectionKey<Store<RootStateTypes>> = Symbol('vue-store')

export function useStore<T = AllStateTypes>() {
    return baseUseStore<T>(key)
}
