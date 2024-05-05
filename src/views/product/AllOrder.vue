<script setup lang="ts">
import {ref} from 'vue';
import {userInfo} from '../../api/user.ts'
import {parsePay,parseStatus,parseTime} from "../../utils"
import {getAllOrder, getUserOrder, getStoreOrder, orderUpdate} from "../../api/order.ts"
import {getthisStore} from "../../api/store.ts"
import {getThisProduct} from '../../api/product.ts'

const userId = ref()//用户id
const storeId = ref()//商家id
const productname=ref('') //商品名称
const username=ref('') //顾客名称
const storename=ref('') //商家名称
const createTimerange=ref('') //订单创建时间
const phone=ref('') //手机号
const activeName=ref('ALL') //tab选中的内容
const tab_name=ref('ALL')
const role = sessionStorage.getItem("role")//用户角色
let dialogVisible = ref(false);
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
    comment: string;
}
const orders=ref<Order[]>([]) //订单数据
handleOrderData()
function handleOrderData(){
    if(role === 'MANAGER' || role === 'CEO'){
        getAllOrder().then(res => {
            orders.value=res
            for(const order of orders.value){
                order.createTime=parseTime(order.createTime)
                gettheproduct(order.productId)
                getthestore(order.storeId)
                //gettheuser(order.userId)
            }
            filteredOrders.value = orders.value;
        })
    }else if(role === 'CUSTOMER'){
        userInfo().then(res => {
            userId.value = res.data.result.id
            getUserOrder(userId.value).then(res => {
                orders.value=res
                for(const order of orders.value){
                    order.createTime=parseTime(order.createTime);
                    gettheproduct(order.productId)
                    getthestore(order.storeId)
                    //gettheuser(order.userId)
                }
                filteredOrders.value = orders.value;
            })
        })
    }else if(role === 'STAFF'){
        userInfo().then(res => {
        storeId.value = res.data.result.storeId
        getStoreOrder(storeId.value).then(res => {
                orders.value=res
                for(const order of orders.value){
                    order.createTime=parseTime(order.createTime)
                    gettheproduct(order.productId)
                    getthestore(order.storeId)
                    //gettheuser(order.userId)
                }
                filteredOrders.value = orders.value;
            })
        })
    }
}
function gettheproduct(productId: any){
    getThisProduct(productId).then(res => {
        for(const order of orders.value){
            if(order.productId === productId)
                order.productname = res.name
        }
    })   
}
function getthestore(storeId: any){
    getthisStore(storeId).then(res => {
        for(const order of orders.value){
            if(order.storeId === storeId)
                order.storename = res.storeName
        } 
    })   
}

// const pageNum=ref(1) //当前页数
//const dataTotal=ref(0) //数据总数
// let pageSize = window.innerHeight > 800 ? 12 : 6;
// function handlePageChange(val) {
//     console.log(val);
// }

const filteredOrders=ref<Order[]>([]); // 这将存储筛选后的订单

function handleClick(tab: any){
    tab_name.value = tab.props.name;
    filterOrders();
    //location.reload();//使页面刷新
}
function compareTime(time: any){
    let time1 = new Date(time);
    let time2 = new Date(createTimerange.value[0]);
    let time3 = new Date(createTimerange.value[1]);
    time3.setDate(time3.getDate() + 1);
    return time1 >= time2 && time1 <= time3;
}

function filterOrders(){
    // 根据输入框的内容筛选订单
    filteredOrders.value = orders.value.filter(order => {
        return (order.productname==productname.value||productname.value=='') &&
        (order.username==username.value||username.value=='') &&
        (order.storename==storename.value||storename.value=='') &&
        (createTimerange.value==''||compareTime(order.createTime))
        &&(order.orderStatus == tab_name.value||tab_name.value=='ALL')
    });
}
function clearfilter(){
    productname.value = '';
    username.value = '';
    storename.value = '';
    createTimerange.value = '';
    phone.value = '';
    filteredOrders.value = orders.value;
}
function Delete(status: any,name: any){
    if(role === 'STAFF'){
        ElMessage({
            //customClass: 'customMessage',
            type: 'error',
            message: '您没有权限删除订单！',
       })
    }
    else if(role === 'MANAGER'||role === 'CEO'||role === 'CUSTOMER'){
        if(status === 'UNPAID'||status === 'UNDELIVERED'||status === 'UNRECEIVED'
        ||status === 'UNCOMMENTED'||status === 'COMPLETED'){
            ElMessage({
                //customClass: 'customMessage',
                type: 'error',
                message: '您没有权限删除正常订单！',
           })
        }else{
            //delete实现
            ElMessage({
                //customClass: 'customMessage',
                type: 'success',
                message: '删除成功！',
           })
        }
    }
}

//comment



function comment(orderId: any,productId: any) {
  let rating = 5; // 默认评分为5
  let review = 'Great service!'; // 默认评论内容

  ElMessageBox.prompt('请给订单打分并留下您的评论:', '评价', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputPattern: /^\d+$/, // 只允许输入数字
    inputErrorMessage: '评分只能为数字',
    inputPlaceholder: '请输入评分(1-5)',
    inputValue: rating.toString(), // 默认评分
  }).then(({ value }) => {
    rating = parseInt(value);
    return ElMessageBox.prompt('请留下您的评论:', '评论', {
      confirmButtonText: '提交',
      cancelButtonText: '取消',
      inputValue: review, // 默认评论内容
    });
  }).then(({ value }) => {
    review = value;
    commentCreate({
      orderId:orderId,
      productId:productId,
      content:review,
      score:rating,
    })
  }).then(() => orderUpdate({
    id:orderId,
    comment:'',
    orderStatus: 'COMPLETED',
  })).then(() => {
    ElMessage({
      customClass: 'customMessage',
      type: 'success',
      message: '评论成功!',
    })
    dialogVisible.value = false; // 关闭弹窗
  });
}



function handleSelectionChange(val: any) {
    console.log(val);
}
function getTagType(status: any) {
    switch (status) {
        case 'UNPAID':
        case 'UNDELIVERED':
        case 'UNRECEIVED':
        case 'UNCOMMENTED':
          return 'warning';
        case 'COMPLETED':
          return 'success';
        case 'CANCELLED':
        case 'RETURNED':
          return 'danger';
        default:
          return '';
    }
}
import OrderForm from './OrderForm.vue';
import {commentCreate} from "../../api/comments.ts";
const orderFormRef = ref();
const open= (id: any) => {
    orderFormRef.value.showDialog(id);
};
const submit = () => {
  console.log('Form submitted');
};

</script>

<template>
    <el-container class="content-container" direction="vertical">
        <div class="top">
            <!--表单输入框开始-->
            <el-form ref="ruleFormRef" label-width="120px" class="input-form" status-icon>
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="productname"/>
                </el-form-item>
                <el-form-item label="商家" prop="storename">
                    <el-input v-model="storename"/>
                </el-form-item>
                <el-form-item label="订单创建时间" prop="createTime">
                    <el-date-picker v-model="createTimerange" type="daterange" 
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>
                </el-form-item>
                <el-form-item label="顾客名称" prop="username">
                    <el-input v-model="username"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="phone"/>
                </el-form-item>
                
            </el-form>
            <!--表单输入框结束-->
            <!--表单按钮组开始-->
            <div class="btns">
                <el-button type="primary" @click="filterOrders"> 筛选 </el-button>
                <el-button type="primary" @click="clearfilter"> 清空筛选 </el-button>
                <el-button type="primary"> 导出 </el-button><!--暂不必实现-->
                <el-button type="primary" v-if="role!='CUSTOMER'"> 批量发货 </el-button><!--待实现-->
                <el-button type="primary" v-if="role!='CUSTOMER'"> 下载批量发货样单 </el-button><!--暂不必实现-->
            </div>
        </div>
            <!--表单按钮组结束-->
            <!--表格开始-->
        <div class="table"> <!--tab栏-->
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="全部" name="ALL"> </el-tab-pane>
                <el-tab-pane label="待支付" name="UNPAID"> </el-tab-pane>
                <el-tab-pane label="待发货" name="UNDELIVERED"> </el-tab-pane>
                <el-tab-pane label="待收货" name="UNRECEIVED"> </el-tab-pane>
                <el-tab-pane label="待评价" name="UNCOMMENTED"> </el-tab-pane>
                <el-tab-pane label="已完成" name="COMPLETED"> </el-tab-pane>
                <el-tab-pane label="已取消" name="CANCELLED"> </el-tab-pane>
                <el-tab-pane label="支付超时" name="RETURNED"> </el-tab-pane>
            </el-tabs> <!--表格-->
            <el-table ref="multipleTableRef" :data="filteredOrders" style="width:100%" @selection-change="handleSelectionChange" tooltip-effect="dark"> <!--多选框--> 
                <el-table-column type="selection" width="55"/> <!--商品-->
                <el-table-column label="商品" width="90" prop="productname"> </el-table-column>
                <el-table-column label="单价" width="85" prop="perPrice"> </el-table-column>
                <el-table-column label="总价" width="90" prop="totalPrice"> </el-table-column>
                <el-table-column label="购买量" width="85" prop="quantity"> </el-table-column>
                <el-table-column label="买家" width="90" prop="userId"> </el-table-column>
                <el-table-column label="商家" width="90" prop="storename"> </el-table-column>
                <el-table-column label="订单创建时间" width="115" prop="createTime"> </el-table-column>
                <el-table-column label="状态" width="90">
                    <template #default="scope">
                        <el-tag size="small" :type="getTagType(scope.row.orderStatus)">
                            {{ parseStatus(scope.row.orderStatus) }}
                        </el-tag> 
                    </template>
                </el-table-column>
                <el-table-column label="支付方式" width="85">
                    <template #default="scope">
                        <el-tag size="small" :type="''">{{parsePay(scope.row.payMethod)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="330">
                    <template #default="scope">
                        <el-button size="small" type="danger" @click="Delete(scope.row.orderStatus,scope.row.storename)"> 删除 </el-button>
                        <el-button size="small" type="primary" @click="open(scope.row.id)"> 查看详情 </el-button>
                        <OrderForm ref="orderFormRef" title="订单"  @submit="submit"></OrderForm>
                        <el-button size="small" type="primary" @click="comment(scope.row.id,scope.row.productId)"
                            v-if="role === 'CUSTOMER'&&scope.row.orderStatus ==='UNCOMMENTED'">
                            评价 
                        </el-button>
                        <el-button size="small" type="primary" v-if="role === 'STAFF'||role === 'MANAGER' || role === 'CEO'"> 
                            联系客户 
                        </el-button><!--暂不必实现-->
                        <el-button size="small" type="primary" v-if="role === 'CUSTOMER'||role === 'MANAGER' || role === 'CEO'"> 
                            联系商家
                        </el-button><!--暂不必实现-->
                        
                    </template>
                </el-table-column>
            </el-table> <!--分页-->
            <!-- <div class="pagination">//分页失败
            <el-pagination
            background
            layout="prev,pager,next"
            :total="dataTotal"
            :current-page="pageNum"
            :page-size="pageSize"
            @current-change="handlePageChange"
            hide-on-single-page/>
            </div> -->
        </div>
        <!--表格结束-->
        <!--<div class="v-modal" tabindex="0" style="z-index:2000;"></div>-->
    </el-container>
</template>
                           
<style scoped> 
.el-button {
    margin-right: 10px;  /* 右边距 */
    margin-left: 0px; /* 左边距 */
}
.content-container{ 
    /*与上端保持一定距离*/
    margin-top:10px;
    width:100%; 
    .top{ 
        width:100%; 
        border:1px solid#ccc; 
        box-shadow:3px 1px rgb(223,217,217); 
        padding:10px 0; 
        flex:2; 
        display:flex; 
        flex-direction:column; 
        justify-content:space-between; 
        /*输入表单*/
        .input-form{ 
            display:flex; 
            flex-wrap:wrap; 
            justify-content:flex-start; 
            vertical-align:middle; 
        } 
        /*按钮组*/
        .btns{ 
            display:flex; 
            padding:0 10px; 
            margin-left:40px; 
        } 
    } 
    /*表格*/
    .table{ 
        width:100%; 
        flex:8; 
        border:1px solid#ccc; 
        box-shadow:3px 1px rgb(223,217,217);
        padding:10px 0; 
        margin-top:10px; 
        /*tab */
        .demo-tabs{ 
            margin-left:10px;
            .el-tabs__content{ 
                padding:32px; 
                color:#6b778c; 
                font-size:32px; 
                font-weight:600; 
            } 
        } 
        /*表格*/
        .el-table{ 
            padding:5px; 
        } 
        /*分页*/
        .el-pagination{ 
            margin-top:20px; 
        } 
    } 
} 
</style>