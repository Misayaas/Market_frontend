import {axios} from '../utils/request'
import {ORDER_MODULE} from './_prefix'

type OrderInfo = {
    quantity: number;
    payMethod: string;
    coupon: number;
    pickUpMethod: string;
    productId: any;
    storeId: string;
    perPrice: number;
    totalPrice: number;
    orderStatus: string;
}
type OrderInfo2 = {
    id: number;
    comment: string;
    orderStatus: string;
}
type Payinfo = {
    id: any;
    couponId: number;
    totalPrice: number;
}
export const getThisOrder = (orderId:number) => {
    return axios.get(`${ORDER_MODULE}/${orderId}`)
      .then(res => {
        return res.data.result;
      })
      .catch(error => {
        console.error('获取订单数据失败', error);
        throw error;
      });
}
export const getAllOrder = () => {
    return axios.get(`${ORDER_MODULE}/all`)
      .then(res => {
        return res.data.result;
      })
      .catch(error => {
        console.error('获取订单数据失败', error);
        throw error;
      });
}
export const getUserOrder = (userId:any) => {
    return axios.get(`${ORDER_MODULE}/user/${userId}`)
      .then(res => {
        return res.data.result;
      })
      .catch(error => {
        console.error('获取订单数据失败', error);
        throw error;
      });
}
export const getStoreOrder = (storeId: any) =>{
    return axios.get(`${ORDER_MODULE}/store/${storeId}`)
    .then(res => {
        return res.data.result;
    })
    .catch(error=>{
        console.error('获取订单数据失败', error);
        throw error;
    });
}
export const orderCreate = (orderInfo: OrderInfo) => {
  return axios.post(`${ORDER_MODULE }/create`, orderInfo,
      {headers: {'Content-Type': 'application/json'}})
      .then(res => {
          return res.data;
      })
}
export const orderUpdate = (orderInfo2: OrderInfo2) => {
  return axios.post(`${ORDER_MODULE }/update`, orderInfo2,
      {headers: {'Content-Type': 'application/json'}})
      .then(res => {
          return res
      })
}

export const orderPay = (payinfo: Payinfo) => {
  return axios.post(`${ORDER_MODULE }/pay`, payinfo,
      {headers: {'Content-Type': 'application/json'}})
      .then(res => {
          return res
      })
}
export const orderDeliver = (orderId: any) => {
  return axios.post(`${ORDER_MODULE }/deliver`, orderId,
      {headers: {'Content-Type': 'application/json'}})
      .then(res => {
          return res
      })
}
export const orderReceive = (orderId: any) => {
  return axios.post(`${ORDER_MODULE }/receive`, orderId,
      {headers: {'Content-Type': 'application/json'}})
      .then(res => {
          return res
      })
}

