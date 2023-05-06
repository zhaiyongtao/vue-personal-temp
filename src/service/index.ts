import request from '@/utils/request';

export const getHomeData = () => {
  return request.get({
    url: '/mock/home-article-list',
    params: {
      current: 1,
      pageSize: 200
    }
  });
};
