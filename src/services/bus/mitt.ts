import mitt from 'mitt'

export const emitter = mitt();

export const PY_USER_LOGIN = 'user:login'
export const PY_USER_LOGOUT = 'user:logout'
export const PY_CORE_EXCEPTION = 'core:exception'
export const PY_CORE_LOADED = 'core:loaded'
export const PY_CORE_LOADING = 'core:loading'
