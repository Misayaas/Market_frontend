// Lab2新增
// 开发时请解除3-4行的注释
import {axios} from '../utils/request'
import {PRODUCT_MODULE} from './_prefix'

type RegisterInfo = {
    imageUrl: string[],
    name: string,
    type: string,
    price?: number,
    description: string,
}
type UpdateInfo = {
    id: number;
    name: string;
    type: string;
    price: number;
    storeId: string;
    description: string;
    stock: number;
}

export const productRegister = (registerInfo: RegisterInfo) => {
    return axios.post(`${PRODUCT_MODULE }/register`, registerInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}
export const getThisProduct = (productId:any) => {
    return axios.get(`${PRODUCT_MODULE}/${productId}`)
      .then(res => {
        return res.data.result;
      })
      .catch(error => {
        console.error('获取商品数据失败', error);
        throw error;
      });
}
export const getProductData = (storeId:number) => {
    return axios.get(`${PRODUCT_MODULE}/storeAll/${storeId}`)
      .then(res => {
        return res.data.result;
      })
      .catch(error => {
        console.error('获取商品数据失败', error);
        throw error;
      });
}

export const getProductById = (ProductId: number) =>{
    return axios .get(`${PRODUCT_MODULE}/productDetail/${ProductId}`)
    .then(res => {
        return res.data.result;
    })
    .catch(error=>{
        console.error('获取商品数据失败', error);
        throw error;
    });
}
export const productUpdate = (updateInfo: UpdateInfo) => {
    return axios.post(`${PRODUCT_MODULE }/update`, updateInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}
