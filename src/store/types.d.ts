import { PyNavTypes, PyPoppyTypes, PyRootStateTypes } from "@/framework/store/types";

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


