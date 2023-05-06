import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

interface HData<T> {
  data: T;
  resultCode: string;
  success: boolean;
  code: number;
  message: string;
  displayMessage: string;

  [key: string]: any;
}

interface InterceptorHooks {
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (response: AxiosResponse) => Promise<AxiosResponse>;
  responseInterceptorCatch?: (error: any) => any;
}

export interface HRequestConfig extends AxiosRequestConfig {
  interceptorHooks?: InterceptorHooks;
}

class HRequest {
  // axios 配置信息
  config: AxiosRequestConfig | InternalAxiosRequestConfig;
  // axios 实例
  instance: AxiosInstance;
  // axios拦截器
  interceptorHooks?: InterceptorHooks;

  constructor(options: HRequestConfig) {
    this.config = options;
    this.instance = axios.create(options);
    this.interceptorHooks = options.interceptorHooks;
    this.setupInterceptor();
  }

  setupInterceptor(): void {
    this.instance.interceptors.request.use(
      this.interceptorHooks?.requestInterceptor,
      this.interceptorHooks?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptorHooks?.responseInterceptor,
      this.interceptorHooks?.responseInterceptorCatch
    );
  }

  // 类型参数的作用，T决定AxiosResponse实例中data的类型
  request<T = any>(config: HRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, HData<T>>(config)
        .then((res) => {
          console.log('2 ==> ', res);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get<T = any>(config: HRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }

  post<T = any>(config: HRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' });
  }

  delete<T = any>(config: HRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' });
  }

  patch<T = any>(config: HRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' });
  }
}

export default HRequest;
