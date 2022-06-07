export interface RootStateTypes extends PyRootStateTypes {
    text: string,
    loading: boolean
}


export interface ThemeTypes {
    size: string,
}

export interface AllStateTypes extends RootStateTypes {
    poppy: PyPoppyTypes,
    theme: ThemeTypes,
    nav: PyNavTypes,
}


export interface PyRootStateTypes {
    loading: boolean,
}


export interface PyPoppyTypes {
    user: object,
    appId: string,
    core: object,
    token: string,
    developToken: string,
    backendToken: string,
    size: string,
    loading: object,
    media: string,
    style: string,
    title: string,
    grid: string,
    menus: object,
}

export interface PyPoppyAction {
    method?: string,       // page, request
    params?: object,       // 附加的参数对象, 用于批量请求
    url?: string,
    title?: string,
    type?: string,         // form
    confirm?: boolean,     // false
}


export interface PyNavTypes {
    menus: [],
    navs: object,
    key: string,
    prefix: string,
    sidebarActive: boolean,
}

interface ImportMetaEnv {
    // 接口请求地址
    VITE_APP_URL: string,
}
