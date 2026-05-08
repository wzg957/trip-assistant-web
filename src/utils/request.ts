import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
  baseURL: '', // 因为配置了 proxy 代理，这里直接留空即可
  timeout: 60000, // 后端调用 AI 可能有点慢，超时设长一点：60秒
});

// 请求拦截器：发送请求前，自动把本地存的 token 塞进去
request.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('trip_token');
  if (token && config.headers) {
    config.headers['Authorization'] = token;
  }
  return config;
});

// 响应拦截器：统一处理后端返回的数据和报错
request.interceptors.response.use((response) => {
  const res = response.data;
  // 后端规定 code === 0 才是成功
  if (res.code === 0) {
    return res;
  } else {
    ElMessage.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || 'Error'));
  }
}, (error) => {
  ElMessage.error('网络连接异常，请检查后端服务是否启动');
  return Promise.reject(error);
});

export default request;
