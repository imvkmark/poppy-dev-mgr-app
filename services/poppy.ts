import request from '@/framework/utils/request';
import { deviceId } from "@/framework/utils/helper";

/**
 * 发送验证码
 */
export async function apiPySystemCaptchaSend(params: object) {
    return request({
        url: '/api_v1/system/captcha/send',
        params
    });
}


export async function apiPySystemAuthLogin(params: object) {
    return request({
        url: '/api_v1/system/auth/login',
        params: {
            guard: 'web',
            device_type: 'h5',
            device_id: deviceId(),
            ...params
        }
    });
}


/**
 *上传图片
 */
export function apiPySystemUploadImage(image: any) {
    const data = new FormData()
    data.set('image', image, image.name)
    return request({
        url: 'api_v1/system/upload/image',
        headers: {
            'Content-Type': 'multipart/tar-data'
        },
        params: data
    });
}

/**
 *上传图片
 */
export function apiPySystemUploadFile(image: any, type: string) {
    const data = new FormData()
    data.set('file', image, image.name);
    data.set('type', type);
    return request({
        url: 'api_v1/system/upload/file',
        headers: {
            'Content-Type': 'multipart/tar-data'
        },
        params: data
    });
}

/**
 * 登录访问
 */
export async function apiPySystemAuthAccess(params = {}) {
    return request({
        url: '/api_v1/system/auth/access',
        params
    });
}

/**
 * 退出登录
 */
export async function apiPySystemAuthLogout() {
    return request({
        url: '/api_v1/system/auth/logout'
    });
}

/**
 * Core Info
 */
export async function apiPySystemCoreInfo() {
    return request({
        url: '/api_v1/system/core/info'
    });
}

export async function apiPyGrid(url: string, params: object, method: string) {
    return request({
        url: url,
        params,
        method
    });
}
