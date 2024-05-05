// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {STORE_MODULE} from './_prefix'

type RegisterInfo = {
    logoUrl: string,
    storeName: string,
    description: string,
}


export const storeRegister = (registerInfo: RegisterInfo) => {
    return axios.post(`${STORE_MODULE }/register`, registerInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}
export const getStoreData = () => {
    return axios.get(`${STORE_MODULE}/all`)
      .then(res => {
        return res.data;
      })
      .catch(error => {
        console.error('获取商店数据失败', error);
        throw error;
      });
}
// 用户信息中的商店名称
export const userInfo_storename = (idInfo: any) => {
  return axios.get(`${STORE_MODULE}/findName/${idInfo}`)
      .then(res => {
          return res
      })
}
export const getthisStore = (idInfo: any) => {
  return axios.get(`${STORE_MODULE}/findStore/${idInfo}`)
      .then(res => {
          return res.data
      })
}
export const getStoreScore = (storeId: any) => {
    return axios.get(`${STORE_MODULE}/score/${storeId}`)
        .then(res => {
            return res.data
        })
}