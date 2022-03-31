import { Module } from 'vuex'
import { get, set } from 'lodash-es';
import { base64Encode } from '@/services/utils/helper';
import { apiPySystemCoreInfo } from '@/services/poppy';
import { emitter, PY_USER_LOGIN } from '@/services/bus/mitt'
import { apiMgrAppHomeClearCache } from "@/services/mgr-app";
import { PyRequestOptions } from "@/services/utils/types";
import { deviceId, localStore, sessionStore, toast } from "@/services/utils/util";
import request from "@/services/utils/request";
import { PyPoppyTypes, PyRootStateTypes } from "@/services/store/types";
import { pyStorageKey, pyStorageToken } from "@/services/utils/conf";

const poppy: Module<PyPoppyTypes, PyRootStateTypes> = {
    namespaced: true,
    state: {
        appId: '',
        token: '',
        backendToken: '',
        developToken: '',
        core: {},
        user: {},

        // theme
        media: '',         // 媒体响应尺寸
        size: 'default',
        style: 'light',

        // request
        loading: {},

        motion: {
            type: '',
            action: '',
            addition: {},
        },
        action: {},

        // 标题
        title: '',

        menus: [],

        grid: '',
    },
    getters: {
        isLoading: (state) => (url: string = '') => {
            if (url === '') {
                // 全局的加载, 只要是有请求, 便是触发全局Loading
                return get(state.loading, 'global', false)
            }
            // 获取当前 Url 的加载
            return get(state.loading, base64Encode(url), false)
        }
    },
    actions: {
        /**
         * 系统初始化
         * @constructor
         */
        Init({ state }) {
            // 设备ID
            state.appId = deviceId();

            // 系统信息
            let info: any = sessionStore(pyStorageKey.core);
            if (info) {
                state.core = info;
            } else {
                apiPySystemCoreInfo().then(({ success, data }) => {
                    if (!success) {
                        return;
                    }
                    sessionStore(pyStorageKey.core, data);
                    state.core = data;
                })
            }
        },

        /**
         * 获取用户信息
         * @param commit
         * @param state
         * @constructor
         */
        Fetch({ commit, state }) {
            let userUrl = get(state.core, 'py-mgr-app.info_url')
            request({
                url: userUrl
            }).then(({ success, data }) => {
                if (!success) {
                    return;
                }
                state.user = get(data, 'user', {});
                state.menus = get(data, 'menus', []);
            })
        },

        /**
         * 登录, 有 token 则认定为登录
         * @constructor
         */
        Login({ commit, state, dispatch }, { token, type }) {
            // 保存用户的Token
            localStore(pyStorageToken(type), token);
            // token 变化在监听中触发获取信息
            if (type === 'backend') {
                state.backendToken = token;
            } else if (type === 'develop') {
                state.developToken = token;
            }
            // 另一种方式触发事件
            emitter.emit(PY_USER_LOGIN, { token, type });
        },

        /**
         * 退出登录
         */
        Logout({ commit, state}, { type }) {
            localStore(pyStorageToken(type), null);
            if (type === 'backend'){
                state.backendToken = '';
                state.user = {};
                state.menus = [];
            } else if (type === 'develop') {
                state.developToken = '';
            }
        },

        /**
         * 加载中
         */
        Loading({ state }, options: PyRequestOptions) {
            set(state.loading, 'global', true);
            set(state.loading, base64Encode(options.url), true)
        },

        /**
         * 加载完毕
         */
        Loaded({ state }, options: PyRequestOptions) {
            set(state.loading, 'global', false);
            set(state.loading, base64Encode(options.url), false)
        },

        /**
         * 设定组件规格大小
         */
        SetSize({ state }, size) {
            let theme: any = localStore(pyStorageKey.theme) ? localStore(pyStorageKey.theme) : {};
            set(theme, 'size', size);
            localStore(pyStorageKey.theme, theme)
            state.size = size;
        },

        /**
         * 设置页面主题风格
         */
        SetStyle({ state }, val) {
            let theme: any = localStore(pyStorageKey.theme) ? localStore(pyStorageKey.theme) : {};
            set(theme, 'style', val);
            localStore(pyStorageKey.theme, theme);
            document.documentElement.setAttribute('theme', val);
            state.style = val;
        },

        /**
         * 设置 Media 尺寸
         */
        SetMedia({ commit, state }, media) {
            state.media = media;
        },

        /**
         * 设置页面的标题
         */
        SetTitle({ commit, state }, title) {
            document.title = `${title} - ${get(state.core, 'py-system.title')}`
            state.title = title;
        },

        /**
         * 设置页面的标题
         */
        ClearCache({ dispatch }) {
            localStore(pyStorageKey.navs, null);
            sessionStore(pyStorageKey.core, null);
            apiMgrAppHomeClearCache().then(() => {
                toast('已清空缓存, 稍后会进行页面刷新');
                setTimeout(() => {
                    dispatch('SetMotion', {
                        type: 'window',
                        action: 'reload',
                    })
                }, 1000);
            })
        },

        /**
         * 设置全局动作
         */
        SetMotion({ state }, motion) {
            const { type, action } = motion;
            const addition = get(motion, 'addition', {});
            state.motion = { type, action, addition }
        },
        /**
         * 清除全局的动作
         */
        ClearMotion({ state }) {
            state.motion = { type: '', action: '', addition: {} }
        },

        SetAction({ state }, action) {
            state.action = action;
        },
        ClearAction({ state }) {
            state.action = {};
        },

        /**
         * 列表的操作
         */
        SetGrid({ state }, grid) {
            state.grid = grid;
        },

        /**
         * 清空列表
         */
        ClearGrid({ state }) {
            state.grid = '';
        },
    }
}

export default poppy
