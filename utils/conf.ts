/*
|--------------------------------------------------------------------------
| 框架定义文件
|--------------------------------------------------------------------------
|
*/

// 访问接口URL
export const pyAppUrl: string = String(import.meta.env.VITE_APP_URL);

// App 环境
export const pyAppMode = String(import.meta.env.MODE);

// App 版本号
export const pyAppVersion = String(import.meta.env.PY_APP_VERSION);

// 是否是生产环境
export const pyAppIsProd = import.meta.env.PROD;

// 存储KEY
export const pyStorageKey = {
    DEVICE_ID: 'x-device-id',
    CORE_INFO: 'x-core',
    TOKEN: 'x-token'
}

export const pyFileExtensions = {
    images: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'm4a', 'wav', 'aac'],
    video: ['mp4', 'rm', 'rmvb', 'wmv']
}
