export const BASE_URL = process.env.NODE_ENV === 'development' ?
    (window.location.origin + "/api/") :
    ("http://xxx.xxx.xxx.xxx:xxxx/api/");
export const HTTP_TIMEOUT = 10000;
