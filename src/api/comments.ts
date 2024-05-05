import {axios} from '../utils/request'
import {COMMENT_MODULE} from './_prefix'
type CommentsInfo = {
    productId: number;
    orderId:number;
    storeId: number;
    content: string;
    score:number;
}
export const CommentUpdate = (commentsInfo: CommentsInfo) => {
    return axios.post(`${COMMENT_MODULE }/update`, commentsInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}
export const commentCreate = (commentsInfo: { productId: any; orderId: any; score: number; content: string }) => {
    return axios.post(`${COMMENT_MODULE }/create`, commentsInfo,
        {headers: {'Content-Type': 'application/json'}})
        .then(res => {
            return res
        })
}


export const getComments = (productId: number) => {
    return axios.get(`${COMMENT_MODULE}/${productId}/get`, {
    }).then(res => {
            return res.data;
        })
        .catch(err => {
            console.error('获取评论失败:', err);
            throw err;
        });
};
export const getRatingCount = (productId: number) => {
    return axios.get(`${COMMENT_MODULE}/ratingCount`, {
        params: {
            productId: productId
        }
    })
        .then(res => {
            return res.data.count;
        })
        .catch(err => {
            console.error('获取评分数量失败:', err);
            throw err;
        });
};



