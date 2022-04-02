/*
|--------------------------------------------------------------------------
| 项目定义文件
|--------------------------------------------------------------------------
|
*/

// 访问接口URL
import { base64Encode } from "@/services/utils/helper";
import { localStore } from "@/services/utils/util";

export const pyAppUrl: string = String(import.meta.env.VITE_APP_URL);

// App 环境
export const pyAppMode = String(import.meta.env.MODE);

// App 版本号
export const pyAppVersion = import.meta.env.PY_APP_VERSION;

// 是否是生产环境
export const pyAppIsProd = import.meta.env.PROD;

// 存储KEY
export const pyStorageKey = {
    deviceId: 'x-device-id',
    localCache: 'x-local-cache',
    certs: 'x-headers',
    certCurrent: 'x-header-current',
    core: 'x-core',
    token: 'x-token',
    theme: 'x-theme',
    navs: 'x-navs',
}

export const pyFileExtensions = {
    images: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'm4a', 'wav', 'aac'],
    video: ['mp4', 'rm', 'rmvb', 'wmv']
}


export const pyStorageTokenKey = (type: string) => {
    return `${pyStorageKey.token}-${type}`
}


export const pySessionSettingKey = (url: string) => {
    let type = base64Encode(url);
    return `setting-${type}`
}

export const pySessionFormKey = (url: string) => {
    let type = base64Encode(url);
    return `form-${type}`
}

export const pySessionGridKey = (url: string) => {
    let type = base64Encode(url);
    return `form-${type}`
}

export const pyStorageDevApidocSourcesKey = () => {
    return `x-dev-apidoc-sources`
}

export const pyStorageDevApidocCertsKey = () => {
    return `x-dev-apidoc-certs`
}
export const pyEnableSkeleton = () => {
    return Boolean(localStore(pyStorageKey.localCache))
}
