const APP_CONFIG: Record<
  'dev' | 'test' | 'prod',
  {
    apiHost: string;
    baseApi: string;
    baseUrl: string;
  }
> = {
  dev: {
    apiHost: 'http://127.0.0.1:4523/m1/2005353-0-default',
    baseApi: '/mock',
    baseUrl: 'http://127.0.0.1:8899'
  },
  test: {
    apiHost: 'http://baidu.com',
    baseApi: '/mock',
    baseUrl: 'http://127.0.0.1:8899'
  },
  prod: {
    apiHost: 'http://127.0.0.1:4523/m1/2005353-0-default',
    baseApi: '/mock',
    baseUrl: 'http://127.0.0.1:8899'
  }
};

export default APP_CONFIG;
