import HRequest, { type HRequestConfig } from '@/utils/request/request';
import { ResultCode, showMessage } from '@/utils/request/axiosStaus';

import axios from 'axios';
import qs from 'qs';

import config from '../../../config';

const NODE_ENV = import.meta.env.VITE_NODE_ENV as any;
let BASE_URL = config.dev.baseUrl;
if (NODE_ENV) {
  BASE_URL = (config as any)[NODE_ENV].baseURL;
}

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map();
/**
 * 添加请求
 * @param {Object} config
 */
const addPending = (config: HRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&');
  if (pending.has(url)) {
    // 如果 pending 中不存在当前请求，则添加进去
    config.cancelToken = new axios.CancelToken((c) =>
      c(`重复的请求被主动拦截: ${config.url} + ${config.data} + ${config.params}`)
    );
  } else {
    let c: any = null;
    config.cancelToken = new axios.CancelToken((cancel) => {
      c = cancel;
    });
    pending.set(url, c);
  }
};
/**
 * 移除请求
 * @param {Object} config
 */
const removePending = (config: HRequestConfig) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&');
  if (pending.has(url)) {
    // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pending.get(url);
    cancel(url);
    pending.delete(url);
  }
};

/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url);
  }
  pending.clear();
};

const request = new HRequest({
  baseURL: BASE_URL,
  timeout: 10000,
  // 跨域时允许携带凭证
  withCredentials: true,

  interceptorHooks: {
    requestInterceptor: (config) => {
      removePending(config); // 在请求开始前，对之前的请求做检查取消操作
      addPending(config);
      const token = localStorage.getItem('token');
      config.headers = {
        ...(config.headers as any),
        'Content-Type': 'application/json;charset=UTF-8' // 传参方式json
      };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    requestInterceptorCatch: (err) => {
      console.log('err ==>!!! ', err);
      return Promise.reject(err);
    },
    responseInterceptor: (res) => {
      const { data, config, status } = res; // 解构
      if (status === 200 && data.code === 200) {
        // 判断登陆信息是否失效
        if (data.returnCode === ResultCode.OVERDUE) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token
          localStorage.setItem('token', '');
          // router.replace({
          // path: '/login'
          // })
          return Promise.reject(res);
        }
        // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.resultCode && data.resultCode !== ResultCode.SUCCESS) {
          alert(data.displayMessage); // 此处也可以使用组件提示报错信息
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      } else {
        alert(showMessage(data.code ?? status));
        return Promise.reject(data);
      }
    },
    responseInterceptorCatch: (err) => {
      const { response } = err;
      if (response) {
        alert(showMessage(response.status));
      }
      if (!window.navigator.onLine) {
        alert('网络连接失败');
        // 可以跳转到错误页面，也可以不做操作
        // return router.replace({
        //   path: '/404'
        // });
      }
    }
  }
});

export default request;
