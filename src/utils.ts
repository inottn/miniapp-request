import buildFullPath from './buildFullPath';
import type { Config } from './types';

declare const wx: any; // 微信小程序
declare const my: any; // 支付宝小程序
declare const dd: any; // 钉钉小程序
declare const tt: any; // 字节小程序
declare const qq: any; // QQ小程序
declare const swan: any; // 百度小程序

export const isAlipay = typeof my === 'object' && my.request;

export const isDingDing = typeof dd === 'object' && dd.httpRequest;

/**
 * 获取跨平台的 SDK
 */
const getSDK = () => {
  let currentSdk;

  if (typeof wx === 'object') {
    currentSdk = wx;
  } else if (isDingDing) {
    currentSdk = dd;
  } else if (isAlipay) {
    currentSdk = my;
  } else if (typeof tt === 'object') {
    currentSdk = tt;
  } else if (typeof qq === 'object') {
    currentSdk = qq;
  } else if (typeof swan === 'object') {
    currentSdk = swan;
  }

  return currentSdk;
};

export const sdk = getSDK();

export function getRequest() {
  if (isDingDing) {
    return sdk.httpRequest.bind(sdk);
  }

  return sdk.request.bind(sdk);
}

export const sdkRequest = getRequest();

export const sdkUpload = sdk.uploadFile.bind(sdk);

export const sdkDownload = sdk.downloadFile.bind(sdk);

export function transformConfig(config: Config) {
  const { baseURL, url } = config;
  config = Object.assign({}, config, { url: buildFullPath(baseURL, url!) });

  if (!isAlipay && !isDingDing) {
    config.header = config.headers;
    delete config.headers;
  }

  return config;
}
