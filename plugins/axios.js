import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  const axiosInstance = axios.create({
    baseURL: config.public.apiBase,
    withCredentials: true
  })

  // Add request interceptor for auth token
  axiosInstance.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('user-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  // Add helper methods like @nuxtjs/axios
  axiosInstance.$get = (url, config) => axiosInstance.get(url, config).then(res => res.data)
  axiosInstance.$post = (url, data, config) => axiosInstance.post(url, data, config).then(res => res.data)
  axiosInstance.$put = (url, data, config) => axiosInstance.put(url, data, config).then(res => res.data)
  axiosInstance.$delete = (url, config) => axiosInstance.delete(url, config).then(res => res.data)
  axiosInstance.$patch = (url, data, config) => axiosInstance.patch(url, data, config).then(res => res.data)

  return {
    provide: {
      axios: axiosInstance
    }
  }
})
