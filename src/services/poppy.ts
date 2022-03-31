import request from '@/services/utils/request';

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
        params: params
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

export async function apiPyRequest(url: string, params: object, method: string = 'post') {
    return request({
        url: url,
        params,
        method
    });
}
