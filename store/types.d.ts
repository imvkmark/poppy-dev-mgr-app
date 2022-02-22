export interface PyRootStateTypes {
    loading: boolean,
}


export interface PyPoppyTypes {
    user: object,
    appId: string,
    core: object,
    token: string,
    size: string,
    loading: boolean,
    action : string,
    message: object
}


export interface PyGridTypes {
    action: object,
    button: string,
    page: string,
    loading: boolean,
    reload: boolean,
    reset: boolean,
}


export interface PyNavTypes {
    menus: [],
    navs: object,
    key: string,
    prefix: string,
    sidebarActive: boolean,
}
