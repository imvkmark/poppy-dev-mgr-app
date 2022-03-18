/*
|--------------------------------------------------------------------------
| 帮助函数
|--------------------------------------------------------------------------
|
*/

import { camelCase, get, indexOf, isNull, isObject, map, random, round, set, upperFirst } from "lodash-es";


/**
 * 获取唯一ID
 * @param prefix
 * @returns {string}
 */
export function uniqueId(prefix?: string) {
    let _pre = (typeof prefix == 'undefined') ? '' : prefix;
    return _pre + Math.floor(Math.random() * (new Date()).getTime());
}


/**
 * 返回根据大小所匹配的 class name
 * @param size
 */
export const sizeClass = (size: string) => {
    return {
        xs: size === 'xs',
        sm: size === 'sm',
        md: size === 'md',
        lg: size === 'lg',
        xl: size === 'xl',
        xxl: size === 'xxl'
    }
}

/**
 * 百分比尺寸
 * @param size
 */
export const sizePercent = (size: string) => {
    switch (size) {
        case 'xs':
            return '100%';
        case 'sm':
            return '90%';
        case 'md':
            return '65%';
        case 'lg':
            return '43%';
        case 'xl':
            return '40%';
        case 'xxl':
            return '35%';
        default:
            return '30%';
    }
}

/**
 * alias encode
 * @param data
 */
export const base64Encode = (data: any) => {
    return window.btoa(data);
}

/**
 * alias decode
 * @param data
 */
export const base64Decode = (data: string) => {
    return window.atob(data);
}


export const queryEncode: any = (data: object) => {
    let encode = {};
    map(data, function (val, key) {
        let valEncode;
        if (isObject(val)) {
            valEncode = '--wb--' + base64Encode(JSON.stringify(val));
        } else {
            valEncode = val;
        }
        set(encode, key, valEncode)
    });
    return encode;
}

/**
 * 恢复到查询对象
 * @param data
 */
export const queryDecode: any = (data: object) => {
    let decode = {};
    map(data, function (val, key) {
        let valDecode: any = val;
        if (String(val).indexOf('--wb--') === 0) {
            valDecode = JSON.parse(base64Decode(String(val).substring(6)));
        }
        set(decode, key, valDecode)
    });
    return decode
}


/*
|--------------------------------------------------------------------------
| 尺寸大小 media
|--------------------------------------------------------------------------
|
*/

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * 尺寸大于
 * @param a
 * @param b
 */
export const sizeGt = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia > ib;
}

/**
 * 尺寸小于
 * @param a
 * @param b
 */
export const sizeLt = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia < ib;
}

/**
 * 尺寸大于等于
 * @param a
 * @param b
 */
export const sizeGte = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia >= ib;
}
/**
 * 根据 size 计算宽度
 */
export const sizeWidth = (size: string, width: number) => {
    let ia = indexOf(sizes, size);
    const series = {
        0: 10 / 4,   // xs
        1: 8 / 4,   // sm
        2: 6 / 4,    // md
        3: 4 / 4,    // lg
        4: 3 / 4,    // xl
    }
    const calcWidth = round(get(series, ia, 1) * width);
    if (calcWidth <= 1) {
        return 1;
    } else if (1 < calcWidth && calcWidth <= 2) {
        return 2;
    } else if (2 < calcWidth && calcWidth <= 3) {
        return 3;
    } else if (3 < calcWidth && calcWidth <= 4) {
        return 4;
    } else if (4 < calcWidth && calcWidth <= 6) {
        return 6;
    } else if (6 < calcWidth && calcWidth <= 8) {
        return 8
    } else if (8 < calcWidth && calcWidth <= 12) {
        return 12
    } else {
        return 24
    }
}

/**
 * 尺寸小于等于
 * @param a
 * @param b
 */
export const sizeLte = (a: string, b: string) => {
    let ia = indexOf(sizes, a);
    let ib = indexOf(sizes, b);
    return ia <= ib;
}


/*
|--------------------------------------------------------------------------
| 验证
|--------------------------------------------------------------------------
|
*/

/**
 * 是否是 IPv4
 * @param ip
 */
export const isIpV4 = (ip: string) => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
}


/**
 * 是否是 IpV6
 * @param ip
 */
export const isIpV6 = (ip: string) => {
    return /^([0-9A-Fa-f]{0,4}:){2,7}([0-9A-Fa-f]{1,4}$|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4})$/gm.test(ip);
}

/**
 * 是否是中文身份证号
 * @param chId
 */
export const isChid = (chId: string) => {
    let iW = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
    let iSum = 0;
    let iC, iVal;
    for (let i = 0; i < 17; i++) {
        iC = chId.charAt(i);
        iVal = parseInt(iC, 10);
        iSum += iVal * iW[i];
    }
    let iJYM = iSum % 11;
    let sJYM = '';
    if (iJYM === 0) sJYM = '1';
    else if (iJYM === 1) sJYM = '0';
    else if (iJYM === 2) sJYM = 'x';
    else if (iJYM === 3) sJYM = '9';
    else if (iJYM === 4) sJYM = '8';
    else if (iJYM === 5) sJYM = '7';
    else if (iJYM === 6) sJYM = '6';
    else if (iJYM === 7) sJYM = '5';
    else if (iJYM === 8) sJYM = '4';
    else if (iJYM === 9) sJYM = '3';
    else if (iJYM === 10) sJYM = '2';
    let cCheck = chId.charAt(17).toLowerCase().toString();
    return sJYM && cCheck === sJYM;
}

/**
 * 是否是邮箱
 * @param val
 */
export const isEmail = (val: string) => {
    return regexTest(val, /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,8}$/i)
}

/**
 * 是否是匹配的用户名
 * normal : 正常
 * sub : 子用户
 * @param val
 * @param type
 */
export const isUsername = (val: string, type = 'normal') => {
    let regex;
    if (type === 'normal') {
        regex = /(?<username>[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{5,15})/u
    } else {
        regex = /(?<username>[a-zA-Z\u4e00-\u9fa5]:[a-zA-Z0-9_\u4e00-\u9fa5]{4,14})/u
    }
    let m = regex.exec(val);
    if (isNull(m)) {
        return false;
    }
    return get(m, 'groups.username', '') === val;
}


/**
 * 密码校验规则
 * @param val
 */
export const isSimplePwd = (val: string) => {
    return regexTest(val, /^[0-9a-zA-Z_*.\[\]\-!@#$%^&()~]{6,16}$/i)
}

/**
 * 是否是英文字符
 * @param val
 */
export const isAlpha = (val: string) => {
    return regexTest(val, /^([a-z])+$/i)
}

/**
 * 验证字段可能包含字母、数字，以及破折号 (-) 和下划线 ( _ )。
 * @param val
 */
export const isAlphaDash = (val: string) => {
    return regexTest(val, /^([a-z0-9-_])+$/i)
}

/**
 * 验证字段必须是完全是字母、数字
 * @param val
 */
export const isAlphaNum = (val: string) => {
    return regexTest(val, /^([a-z0-9])+$/i)
}


export const sprintf = (...args: string[] | any[]) => {
    let replace = Array.prototype.slice.call(args, 1);
    let format = args[0];
    return format.replace(/{(\d+)}/g, function (match: string, number: number) {
        return typeof replace[number] != 'undefined'
            ? replace[number]
            : match
            ;
    });
}

/**
 * 是否是数字
 * @param n
 */
export const isNumeric = (n: any) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * 是否是Url
 * @param n
 */
export const isUrl = (n: any) => {
    return regexTest(n, /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i);
}

/**
 * 是否是 Int 类型的数据
 * @param n
 */
export const isInteger = (n: any) => {
    if (isNaN(Math.round(n))) {
        return false;
    }
    return Math.round(n).toString() === n.toString();
}

/**
 * RegexTest / 正则匹配
 * @param value
 * @param params
 */
export const regexTest = (value: string[] | string, params: string[] | string | any) => {
    let args = !(params instanceof Array) ? [params] : params;
    let val = !(value instanceof Array) ? [value] : value;

    let re = args[0];

    if (!(re instanceof RegExp)) {
        re = re.split('/');
        re = new RegExp(re[1], re[2]);
    }
    return re.test(val);
}

/**
 * 是否是空对象
 * @param obj
 */
export const isEmptyObject = (obj: object) => {
    return Object.getOwnPropertyNames(obj).length === 0;
}

export const isDate = (value: any) => {
    if (value instanceof Date) {
        return true;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
        return false;
    }

    return !isNaN(Date.parse(String(value)));
}

/**
 * php 格式化转换为 dayjs 格式
 * @param str
 */
export const toDayjsFormat = (str: string) => {
    const replacements = {
        'D': 'ddd',
        'l': 'dddd',
        'z': 'DDD',
        'd': 'DD',
        'j': 'D',
        'o': 'YYYY',
        'Y': 'YYYY',
        'F': 'MMMM',
        'M': 'MMM',
        'm': 'MM',
        'n': 'M',
        'y': 'YY',
        'N': 'E',
        'S': 'o',
        'w': 'e',
        'W': 'W',
        't': '', // no equivalent
        'L': '', // no equivalent
        'a': 'a',
        'A': 'A',
        'B': '', // no equivalent
        'h': 'hh',
        'g': 'h',
        'G': 'H',
        'H': 'HH',
        'i': 'mm',
        's': 'ss',
        'u': 'SSS',
        'e': 'zz', // deprecated since version 1.6.0 of moment.js
        'I': '', // no equivalent
        'O': '', // no equivalent
        'P': '', // no equivalent
        'T': '', // no equivalent
        'Z': '', // no equivalent
        'c': '', // no equivalent
        'r': '', // no equivalent
        'U': 'X'
    };
    return str.split('').map(chr => chr in replacements ? get(replacements, chr) : chr).join('');
}

/**
 * 字串之前
 * @param str
 * @param needle
 */
export const strBefore = (str: string, needle: string) => {
    return str.substring(0, str.indexOf(needle));
}


/**
 * 字串之后
 * @param str
 * @param needle
 */
export const strAfter = (str: string, needle: string) => {
    return str.substring(str.indexOf(needle) + needle.length);
}


export const urlExtension = (url: string) => {
    let ext = url.substring(url.lastIndexOf('.') + 1);
    if (ext.indexOf('?') > -1) {
        return strBefore(ext, '?')
    }
    return ext;
}

/**
 * return a promise that resolves with a File instance
 * https://stackoverflow.com/questions/35940290/how-to-convert-base64-string-to-javascript-file-object-like-as-from-file-input-f
 * @param url
 */
export const urlToFile = (url: string) => {
    // data:image/png;base64,iVBO
    let extension = strAfter(strBefore(url, ';base64'), '/');
    if (!extension) {
        extension = 'png';
    }
    let filename = random() + '.' + extension
    let mimeType = 'image/' + extension;

    return (fetch(url)
            .then(function (res) {
                return res.arrayBuffer();
            })
            .then(function (buf) {
                return new File([buf], filename, { type: mimeType });
            })
    );
}


/**
 * 是否是微信浏览器
 */
export const isWechat = () => {
    let userAgent = navigator.userAgent.toLowerCase();
    return !!userAgent.match(/micromessenger/);
};


/**
 * 判定是否为手机号码
 * @param str
 * @returns {boolean|Array|{index: number, input: string}}
 */
export const isMobile = function (str: string) {
    let phone_number = str.replace(/\(|\)|\s+|/g, '');
    return phone_number.length > 10 && phone_number.match(/^(\d{1,5}-)?1[3|4|5|6|8|7|9][0-9]\d{4,8}$/);
};


/**
 * 首字母大写的KEY
 * @param str
 */
export const upperCamelCase = (str: string) => {
    return upperFirst(camelCase(str))
}


/**
 * 去掉标签
 * @param str
 */
export const stripTags = (str: string) => {
    return str.replace(/(<([^>]+)>)/gi, "");
}


/**
 * 组合请求Url
 * @param url
 * @param params
 */
export const httpBuildQuery = (url: string, params: any) => {
    let urlComp = ''
    if (url.indexOf('?') === -1) {
        urlComp = `${url}?`;
    }
    let queryStr = (new URLSearchParams(params)).toString();
    return `${urlComp}${queryStr}`;
}

/**
 * 进行浏览器警告, 便于项目寻找错误
 */
export const pyWarning = (...args: any[]) => {
    const debugTime = () => {
        const d = new Date();
        return '🕊 🕊 🕊 [' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ' ' + d.getMilliseconds() + '] ';
    }
    console.warn(debugTime(), ...args);
}
