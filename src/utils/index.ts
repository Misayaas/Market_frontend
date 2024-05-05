//将身份转化为中文显示
export function parseRole(role: string | null) {
    if (role === 'MANAGER') {
        return "管理员"
    } else if (role === 'CUSTOMER') {
        return "顾客"
    } else if (role === 'STAFF') {
        return "商家"
    } else if (role === 'CEO') {
        return "CEO"
    }
}
//将商品类型转化为中文显示
export function parseType(type?: string | null) {
    if (type === 'FOOD') {
        return "食品"
    } else if (type === 'CLOTHES') {
        return "服饰"
    } else if (type === 'FURNITURE') {
        return "家具"
    } else if (type === 'ELECTRONICS') {
        return "电子产品"
    } else if (type === 'ENTERTAINMENT') {
        return "娱乐"
    } else if (type === 'SPORTS') {
        return "体育产品"
    } else if (type === 'LUXURY') {
        return "奢侈品"
    } else if (type === 'OTHERS') {
        return "其他"
    }
}
//将支付方式转化为中文显示
export function parsePay(type?: string | null) {
    if (type === 'wechat') {
        return "微信"
    } else if (type === 'zhifubao') {
        return "支付宝" 
    } else if (type === 'OTHERS') {
        return "其他"
    } else {
        return "NONE"
    }
}
//将订单状态转化为中文显示
export function parseStatus(status?: string | null) {
    if (status === 'UNPAID') {
        return "未支付"
    } else if (status === 'UNDELIVERED') {
        return "待发货"
    } else if (status === 'UNRECEIVED') {
        return "待收货"
    } else if (status === 'UNCOMMENTED') {
        return "待评价"
    }else if (status === 'COMPLETED') {
        return "已完成"
    }else if (status === 'CANCELED') {
        return "已取消"
    }else if (status === 'RETURNED') {
        return "支付超时"
    }
}
//将订单收获方式转化为中文显示
export function parseReceiveMethod(type?: string | null) {
    if (type === 'PICKUP') {
        return "到店自提"
    } else if (type === 'DELIVERY') {
        return "快递送达"
    }
}
//将时间转化为日常方式
export function parseTime(time: string) {
    let times = time.split(/T|\./)
    return times[0] + " " + times[1]
}

//将优惠券类型转化为中文显示
export function parseCouponType(type: string) {
    if (type === 'FULL_REDUCTION') {
        return "满减券"
    } else if (type === 'DISCOUNT') {
        return "折扣券"
    } else if (type === 'BLUE_WHALE') {
        return "蓝鲸券"
    }
}


