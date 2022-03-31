import request from "@/services/utils/request";

export async function apiMgrAppHomeClearCache() {
    return request({
        url: '/api/mgr-app/default/home/clear-cache'
    });
}


export async function apiMgrAppUserInfo() {
    return request({
        url: '/api/mgr-app/default/user/info'
    });
}
