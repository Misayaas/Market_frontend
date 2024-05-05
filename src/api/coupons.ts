import {axios} from '../utils/request'
import { COUPONS_MODULE} from './_prefix'
type CouponInfo = {
    groupId: number;
}
type GroupId = {
    group_id: any;
}
type Deleteinfo = {
    id: any;
}
type Getinfo = {
    coupon_id: any;
}
export const couponsCreate = (couponInfo: CouponInfo) => {
    return axios.post(`${COUPONS_MODULE}/create`, couponInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res;
        })
}

export const getCoupons = () => {
    return axios.get(`${COUPONS_MODULE}/get`)
        .then(res => {
        return res;
        })
        .catch(err => {
            console.error('获取优惠券失败:', err);
            throw err;
        });
}

export const getThisCoupon = (getinfo: Getinfo) => {
    return axios.get(`${COUPONS_MODULE}/getInfo`,{params: getinfo})
        .then(res => {
        return res.data.result;
        
        })
        .catch(err => {
            console.error('获取优惠券失败:', err);
            throw err;
        });
}

export const deleteCoupons = (deleteinfo: Deleteinfo) => {
    return axios.post(`${COUPONS_MODULE}/delete`, deleteinfo,
    {headers: {'Content-Type': 'application/json'}})
        .then(res => {
        return res;
        })
        .catch(err => {
            console.error('删除优惠券失败:', err);
            throw err;
        });
}

export const group_check = (group_id: GroupId) => {
    return axios.get(`${COUPONS_MODULE}/isCollected`,{params: group_id})
        .then(res => {
        return res;
        })
        .catch(err => {
            console.error('获取失败:', err);
            throw err;
        });
}