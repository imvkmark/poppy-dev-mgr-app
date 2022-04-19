import { appRequest } from "../utils/request";

export async function apiMgrDevConfigCheck() {
    return appRequest('/api/mgr-dev/config/check', {}, {}, 'develop');
}
