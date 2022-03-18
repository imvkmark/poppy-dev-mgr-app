
import request from "@/framework/utils/request";

/**
 * Api Tool 转换
 */
export async function apiOpToolApidoc(params: object) {
    return request({
        url: '/api_v1/op/tool/apidoc',
        params
    });
}
