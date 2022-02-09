/*
|--------------------------------------------------------------------------
| 全局配置文件
|--------------------------------------------------------------------------
|
*/

// 访问接口URL
export const pyAppUrl: string = String(import.meta.env.VITE_APP_URL);

// App 环境
export const pyAppMode = String(import.meta.env.MODE);

// 是否是生产环境
export const pyAppIsProd = import.meta.env.PROD;

// 存储KEY
export const pyStorageKey = {
    PY_DEVICE_ID: 'x-device-id',
    PY_CORE_INFO: 'x-core',
    PY_TOKEN: 'x-token'
}

export const pyFileExts = {
    images: ['jpg', 'jpeg', 'png', 'gif'],
    audio: ['mp3', 'm4a', 'wav', 'aac'],
    video: ['mp4', 'rm', 'rmvb', 'wmv']
}
