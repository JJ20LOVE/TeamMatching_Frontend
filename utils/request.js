const baseUrl = 'http://'; 

// 封装uniapp的request方法
export const request = (options) => {
  options.url = baseUrl + options.url;
  
  // 请求头
  options.header = {
    'Content-Type': 'application/json', 
    ...options.header 
  };

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => {
        // 处理Java后端返回的状态码
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          uni.showToast({ title: '接口请求失败', icon: 'none' });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      }
    });
  });
};