<script setup lang="ts">
import {ref,defineProps,defineExpose,defineEmits} from 'vue';
import {ElMessageBox} from 'element-plus';
import {getThisOrder, orderDeliver,orderUpdate, orderReceive} from '../../api/order.ts'
import {getthisStore} from "../../api/store.ts"
import {getThisProduct, productUpdate} from '../../api/product.ts'
import {parsePay,parseStatus,parseReceiveMethod,parseTime} from "../../utils"
import MyPay from './MyPay.vue'
import {getThisCoupon} from '../../api/coupons.ts'
// 定义props
const role = sessionStorage.getItem("role")
const {title}=defineProps({
    title: {
        type: String,
        default: '标题',
    },
    /*text: {,text,productId
        type: String,
        default: '文本',
    },
    options: {
        type: Object,
        default:{
            type:'success',
            showIcon:true,
        }
    },*/
});

interface Order{
    id: number;
    productId: string;
    productname: string;
    perPrice: number;
    totalPrice: number;
    quantity: number;
    userId: string;
    username: string;
    storeId: string;
    storename: string;
    createTime: string;
    orderStatus: string;//状态
    payMethod: string;
    pickUpMethod: string;
    couponId: number;//优惠券
    coupon: string;
    comment: string;
}
const order = ref<Order>();
function handleOrderData(id: any){
    getThisOrder(id).then(res => {
        order.value=res
        getThisProduct(order.value.productId).then(res => {
                order.value.productname = res.name
        })
        getthisStore(order.value.storeId).then(res => {  
                order.value.storename = res.storeName
        }) 
        getThisCoupon({coupon_id: order.value.couponId}).then(res => {
            console.log(res)
            if(res.type ==="BLUE_WHALE") order.value.coupon="蓝鲸券"
            else if(res.type ==="FULL_REDUCTION"){
                order.value.coupon = "满减券: 满 "+res.threshold+" 减 "+res.discount;
            }
            else {
                order.value.coupon = "满折券: 满 "+res.threshold+" 打 "+res.discountRate*10+"折";
            } 
        })
    })
}
// 定义emits
const emit = defineEmits(['submit','closed']);
// 定义表单数据
let dialogVisible = ref(false);
// 取消订单
function cancel_warning(){
    ElMessageBox.confirm('确定取消订单吗?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: "warning",
        showClose: false,
        roundButton: true,
        center: true
    }).then(() => orderUpdate({
            id: order.value.id,
            comment:'',
            orderStatus: 'CANCELED',
        })).then(() => {
            ElMessage({
                customClass: 'customMessage',
                type: 'success',
                message: '取消成功！',
            })
            dialogVisible.value = false;
        })
}
// 发货
function Delivery(){
    //如果对应商品存货不足，应该提示
    getThisProduct(order.value.productId).then(res => {
    if(res.stock>=order.value.quantity){
        ElMessageBox.confirm('确定发货吗?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: "warning",
            showClose: false,
            roundButton: true,
            center: true
        }).then(() => productUpdate({
            id: parseInt(order.value.productId),
            name: res.name,
            type: res.type,
            price: res.price,
            storeId: res.storeId,
            description: res.description,
            stock: res.stock-order.value.quantity,
        })).then(() => orderDeliver({
            id: order.value.id,
        })).then(() => {
            ElMessage({
                customClass: 'customMessage',
                type: 'success',
                message: '发货成功！',
            })
            dialogVisible.value = false;
        })
    }
    })
}
// 确认收货
function confirm_receive(){
    ElMessageBox.confirm('确定收货吗?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: "warning",
        showClose: false,
        roundButton: true,
        center: true
    }).then(() => orderReceive({
            id: order.value.id,
        })).then(() => {
            ElMessage({
                customClass: 'customMessage',
                type: 'success',
                message: '收货成功!',
            })
            dialogVisible.value = false;
        })
}
//评价


// 支付
function Paynow(){
    dialogVisible.value = false;
    open(order.value.id);
}
const myPayRef = ref();
const open= (id: any) => {
    myPayRef.value.showDialog(id);
};
const submit = () => {
  console.log('Form submitted');
};

// 关闭弹窗
function dialogClose(){
    emit('closed');
}
defineExpose({
    showDialog: (orderId: any) => {
        handleOrderData(orderId);
        dialogVisible.value = true;
    },
    hideDialog: () => {
        dialogVisible.value = false;
    },
});
</script>

<template>
    <el-dialog v-model="dialogVisible" class="customer-container" :modal-append-to-body='false'
    append-to-body :title="title" width="30%" @close="dialogClose">
        <!-- <el-alert style="margin-bottom: 10px" :show-icon="options.showIcon" 
        :type="options.type" :closable="false"></el-alert> -->
        <el-form label-width="100px" ref="formRef" >
            <el-form-item >
                <!--<img  :src="order?.imageUrl[0]" alt="图片" class="product-image">
                    id: number;
    productname: string;
    price: number;
    tot_price: number;
    productnumber: number;
    username: string;
    storename: string;
    createtime: string;
    status: string;//状态
    phone: string;
    payType: string;
                -->
            </el-form-item>
            <el-form-item label="商品" prop="productname">
                <el-tag class="order-tag"> : {{ order?.productname }}</el-tag>
            </el-form-item>
            <el-form-item label="单价" prop="perPrice">
                <el-tag class="order-tag"> ￥{{ order?.perPrice }}</el-tag>
            </el-form-item>
            <el-form-item label="总价" prop="totalPrice">
                <el-tag class="order-tag"> ￥{{ order?.totalPrice }}</el-tag>
            </el-form-item>
            <el-form-item label="购买数量" prop="productnumber">
                <el-tag class="order-tag"> : {{ order?.quantity }}</el-tag>
            </el-form-item>
            <el-form-item label="购买方式" prop="payMethod">
                <el-tag class="order-tag"> : {{ parsePay(order?.payMethod) }}</el-tag>
            </el-form-item>
            <el-form-item label="买家" prop="userId">
                <el-tag class="order-tag"> : {{ order?.userId }}</el-tag>
            </el-form-item>
            <el-form-item label="卖家" prop="storename">
                <el-tag class="order-tag"> : {{ order?.storename }}</el-tag>
            </el-form-item>
            <el-form-item label="创建时间" prop="createtime">
                <el-tag class="order-tag"> : {{ order && parseTime(order.createTime) }}</el-tag>
            </el-form-item>
            <el-form-item label="优惠券使用" prop="coupon">
                <el-tag class="order-tag"> : {{ order?.coupon }}</el-tag>
            </el-form-item>
            <el-form-item label="提货方式" prop="receiveMethod">
                <el-tag class="order-tag"> : {{ parseReceiveMethod(order?.pickUpMethod) }}</el-tag>
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
                <el-tag class="order-tag"> : {{ parseStatus(order?.orderStatus) }}</el-tag>
            </el-form-item>
        </el-form>
        <template #footer>
            <span>
                <el-button type="danger" @click="cancel_warning" 
                v-if="role=='CUSTOMER'&&order?.orderStatus=='UNPAID'">
                    取消订单
                </el-button>
                <el-button type="success" @click="" 
                v-if="role=='CUSTOMER'&&order?.orderStatus=='RETURNED'">
                    恢复订单
                </el-button><!--暂时未实现-->
                <el-button type="primary" @click="Paynow" 
                v-if="role=='CUSTOMER'&&order?.orderStatus=='UNPAID'"> 
                    支付
                </el-button>
                <el-button type="primary" @click="confirm_receive"
                v-if="role=='CUSTOMER'&&order?.orderStatus=='UNRECEIVED'">
                    确认收货
                </el-button>
                <el-button type="primary" @click="Delivery" 
                v-if="role=='STAFF'&&order?.orderStatus=='UNDELIVERED'"> 
                    发货
                </el-button>
            </span>
        </template>
    </el-dialog>
    <MyPay ref="myPayRef" title="支付"  @submit="submit"></MyPay>
</template>
<style scoped>
.order-tag {
  font-size: 12px;
  font-weight: bold;
  background-color: transparent;
  border: none;
}
</style>