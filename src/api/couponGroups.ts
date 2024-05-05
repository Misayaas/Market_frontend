import {axios} from '../utils/request'
import { COUPONGROUPS_MODULE} from './_prefix'

type CouponGroupsInfo = {
    type: string;
    storeId: any;
    isGlobal: boolean;
    threshold: number;
    discount: number;
    discountRate: number;
    totalNum: number;
    startTime: string;
    endTime: string;
}
type StoreId = {
    store_id: any;
}

export const couponGroupsCreate = (couponGroupsInfo: CouponGroupsInfo) => {
    return axios.post(`${COUPONGROUPS_MODULE}/create`, couponGroupsInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res;
        })
}
export const getCouponGroups = () => {
    return axios.get(`${COUPONGROUPS_MODULE}/get`)
        .then(res => {
            return res;
        })
        .catch(err => {
            console.error('获取优惠券失败:', err);
            throw err;
        });
}
export const getStoresCouponGroups = (store_id: StoreId) => {
    return axios.get(`${COUPONGROUPS_MODULE}/getStoreCouponGroup`,{params: store_id})
        .then(res => {
        return res;
        })
        .catch(err => {
            console.error('获取优惠券失败:', err);
            throw err;
        });
}

