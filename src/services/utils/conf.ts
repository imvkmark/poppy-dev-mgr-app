/*
|--------------------------------------------------------------------------
| 项目定义文件
|--------------------------------------------------------------------------
|
*/

// 访问接口URL
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


export const pyStorageToken = (type: string) => {
    return `${pyStorageKey.token}-${type}`
}

export const pyStorageCerts = () => {
    return `${pyStorageKey.certs}`
}
