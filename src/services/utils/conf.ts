/*
|--------------------------------------------------------------------------
| 项目定义文件
|--------------------------------------------------------------------------
|
*/

// 访问接口URL
import { base64Encode } from "@popjs/core/utils/helper";
import { appLocalStore } from "@/services/utils/util";

export const appUrl: string = String(import.meta.env.VITE_APP_URL);

// App 环境
export const appMode = String(import.meta.env.MODE);

// App 版本号
export const appVersion = String(import.meta.env.PY_APP_VERSION);

// 是否是生产环境
export const appIsProd = Boolean(import.meta.env.PROD);

// 存储KEY
export const pyStorageKey = {
    localCache: 'x-local-cache',
    theme: 'x-theme',
    navs: 'x-navs',
}

export const pyFileExtensions = {
    images: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'm4a', 'wav', 'aac'],
    video: ['mp4', 'rm', 'rmvb', 'wmv']
}


export const storageTokenKey = (type: string) => {
    return `token-${type}`
}

export const storageCoreKey = () => {
    return `core`
}

export const sessionSettingKey = (url: string) => {
    let type = base64Encode(url);
    return `setting-${type}`
}

export const sessionFormKey = (url: string) => {
    let type = base64Encode(url);
    return `form-${type}`
}

export const sessionGridKey = (url: string) => {
    let type = base64Encode(url);
    return `form-${type}`
}

export const enableSkeleton = () => {
    return Boolean(appLocalStore(pyStorageKey.localCache))
}


//region emitter
export const USER_LOGOUT = 'user:logout';
export const USER_LOGIN = 'user:login';
//endregion
