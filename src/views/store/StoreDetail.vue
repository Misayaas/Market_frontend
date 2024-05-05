<!--Lab2新增-商店详情界面-->
<script setup lang="ts">
import {ref} from 'vue'
import {getProductData,productUpdate} from "../../api/product.ts"
import {getStoreScore, getthisStore} from "../../api/store.ts"
import {userInfo} from "../../api/user.ts"
import {router} from '../../router'
import ProductItem from '../../components/ProductItem.vue'
const storeName = ref('')
const storedesciption = ref('')
const logoUrl = ref('')
const storeId = ref()
const role = sessionStorage.getItem("role")
const displayInfoMain = ref(false)
const storeScore = ref('')
interface Product{
  id: number;
  name: string;
  type: string;
  price: number;
  storeId: string;
  description: string;
  imageUrl: string[];
  //logoUrl:string;
  stock: number;
  score:number;
}
const products = ref<Product[]>([]);
const past_products = ref<Product[]>([]);
getUserInfo()
function getUserInfo() {
  userInfo().then(res => {
    storeId.value = res.data.result.storeId
  })
}

function handleProductData(id: any){
    getProductData(id).then(res => {
        products.value=res
        past_products.value=res
    })
    getthisStore(id).then(res => {
        storeName.value=res.storeName
        storedesciption.value=res.description
        logoUrl.value=res.logoUrl
    })
    getStoreScore(id).then(res => {
        storeScore.value=res.result
    })
    //
}

setTimeout(function() {
		// IE
		if(document) {
			document.getElementById("parentIframe").click();
		}
		/* 其它浏览器
		else {
			var e = document.createEvent("MouseEvents");
			e.initEvent("click", true, true);
			document.getElementById("parentIframe").dispatchEvent(e);
		}*/
	}, 10);
function gocreateproduct(){
    router.push({path:'/createProduct'})
}
function toProductDetailPage(productId: any) {
  router.push({
      path:'/ProductDetail',
      query:{
        productId:productId
   }})
}
function updatestock() {
  let flag=0;
  for (const product of products.value){
    productUpdate({
      id: product.id,
      name: product.name,
      type: product.type,
      price: product.price,
      storeId: product.storeId,
      description: product.description,
      stock: product.stock,
    }).then(res => {
     if (res.data.code === '000') {
       flag++;
       if(flag==products.value.length)
       ElMessage({
         customClass: 'customMessage',
         type: 'success',
         message: '更新成功！',
       })
     } else if (res.data.code === '400') {
       ElMessage({
         customClass: 'customMessage',
         type: 'error',
         message: res.data.msg,
       })
     }
    })
  }
  handleProductData(storeId.value)
  displayInfoMain.value=false;
}
</script>


<template>
  <el-container>
    <!--希望把商店详情的一部分内容放在这个侧边栏里，你要真不想放也没事-->
    <el-aside width="25%" class="page-aside">

      <h3>{{storeName}}</h3>
      <img  :src="logoUrl" alt="图片" class="logo-image">
      <h2 v-if="storeScore!=''">商店评分: {{storeScore}}</h2>
      <h2 v-else>商店评分: 未评分</h2>
      <h2>{{storedesciption}}</h2>

    </el-aside>
    
    <el-main v-if="!displayInfoMain">
      <div>
       <h2>商品列表     
       <el-button id="parentIframe" @click.prevent="handleProductData($route.query.storeId)"
                       type="primary" style="display: none">
              刷新列表
       </el-button>
       <el-button @click="displayInfoMain = displayInfoMain === false;" type="primary"  class="product-button"
                 v-if="role === 'STAFF' && storeId == $route.query.storeId ">
              更新商品信息
       </el-button>
       <el-button @click.prevent="gocreateproduct()" type="primary"  class="product-button"
                 v-if="role === 'STAFF' && storeId == $route.query.storeId ">
              创建商品
       </el-button>
      </h2>
    </div>
    <div class="all-product-main">
        <ProductItem class="product-item-list"
                     v-for="productVO in products" :productId="productVO.id"
                     @click="toProductDetailPage(productVO.id)"/>
    </div>
    </el-main>


    <el-main v-if="displayInfoMain">
      <div>
       <h2>商品列表     
       <el-button id="parentIframe" @click.prevent="handleProductData($route.query.storeId)"
                       type="primary" style="display: none">
              刷新列表
       </el-button>
       <el-button @click.prevent="updatestock" type="primary"  class="product-button"
                 v-if="role === 'STAFF' && storeId == $route.query.storeId ">
              保存更新
       </el-button>
      </h2>
    </div>
    
    <div class="home-card">
      <div class="home-item" v-for="product in products" :product = "product.id">
        <img  :src="product.imageUrl[0]" alt="图片" class="product-image">
          <h1 >价格:<el-input type="price" id="price" v-model.lazy="product.price" required/></h1>
          <h1 >库存:<el-input type="stock" id="stock" v-model.lazy="product.stock" required/></h1>
          <h1> {{product.name}}</h1>
      </div>
    </div>
    </el-main>
  </el-container>
  
</template>


<style scoped>
.product-item-list {
  display: flex;
  padding: 2px;
  flex-flow: wrap;
  justify-content: center;
  align-content: start;
}
.all-product-main {
  display: flex;
  flex-direction: row;
  padding: 20px;
  flex-flow: wrap;
  align-content: start;
  justify-content: start;
}
.page-aside {
  border-right: lightgrey solid 1px;
}
.logo-image {
  width:100%; /* 设置固定宽度 */
  height: auto; /* 自适应高度 */
}
.product-image{
  width:auto; /* 设置固定宽度 */
  height: 100px; /* 自适应高度 */
}
.home-card {
  width: 90%;
  overflow: hidden;
  padding: 20px 40px;
  display: flex;
  flex-wrap: wrap;
}

.home-item {
  border-style: solid;
  border-width: 1px;
  border-color: #E4E4E4;
  width: calc(33% - 30px);
  padding: 10px 0px 0px 0px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
}

.home-item:nth-child(3n) {
  margin-right: 0;
}

h1 {
  font-family: Arial, sans-serif; /* 设置字体类型 */
  font-size: 18px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体粗细 */
  color: #333333; /* 设置字体颜色 */
  margin: 1px 0; /* 设置上下外边距 */
}
h2 {
  font-size: 24px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体粗细 */
  color: #333333; /* 设置字体颜色 */
  word-wrap: break-word;
  margin: 10px 0; /* 设置上下外边距 */
}
h3 {
  font-size: 48px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体粗细 */
  color: #333333; /* 设置字体颜色 */
  margin: 5px 0; /* 设置上下外边距 */
  word-wrap: break-word;
  text-align: center; 
}
.product-button{
  float: right;
  margin-top: 5px; /* 按钮与上边的距离 */
}
</style>
