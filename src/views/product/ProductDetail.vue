<script setup lang="ts">
import {ref,h,createApp} from 'vue'
import {getThisProduct} from '../../api/product.ts'
import {parseType} from "../../utils"
import {UserFilled} from "@element-plus/icons-vue"
import {Action, ElCarousel, ElCarouselItem} from 'element-plus'

interface Product{
  id: number;
  name: string;
  type: string;
  price: number;
  storeId: string;
  description: string;
  imageUrl: string[];
  stock: number;
  score:number;
}

const product = ref<Product>();
function handleProductData(id: any){
    getThisProduct(id).then(res => {
        product.value=res
    })
    getComments(id).then(res => {
    comments.value=res.result
  })
    /*getthisStore(id).then(res => {
        storeName.value=res.storeName
        storedesciption.value=res.description
        logoUrl.value=res.logoUrl
    })*/
    //
}
//评论接口
interface Comment{
  id: number;
  productId:number;
  userId:number;
  userName:string;
  userAvatarUrl:string;
  orderId:number;
  content:string;
  score:number;
  time :string;
}

function timeFormate(time: string){
  return time.split('T')[0]
}
const comments = ref<Comment[]>([]);

function handleCommentData(id: any){
  getComments(id).then(res => {
    comments.value=res
  })
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


import ElementPlus from 'element-plus';
import MyForm from './MyForm.vue';
import {getComments} from "../../api/comments.ts";

function myMsgBox(text: any, title: any, storeId: any, productId: any) {
    return new Promise((resolve, reject) => {
        // 保存组件实例
        let myFormRef = ref();
        // 创建容器
        const mountNode = document.createElement('div');
        // 将容器插入到body内
        document.body.appendChild(mountNode);
        // 创建节点
        const app = createApp({
            render() {
                // 这里使用了h()函数,等价于<myForm :title="title" :text="text" :options="options" @submit="..." @onClosed="..."></myForm>
                return h(MyForm, {
                    ref: myFormRef,
                    // 参数
                    title: title,
                    text: text,
                    productId: productId,
                    // 事件
                    onSubmit: (data: any) => {
                        resolve(data);
                    },
                    onClosed: () => {
                        // 这里将容器给清除掉( 至于是否还存在其他内存泄漏，就不太清楚了 )
                        setTimeout(() => {
                            mountNode.remove();
                        }, 500);
                        reject();

                    }
                })
            }
        });
        // 由于内部使用了el-dialog所以必须挂载否则解析错误
        app.use(ElementPlus);
        // 挂载容器，instance就是容器的实例
        let instance = app.mount(mountNode);
        // 打开弹窗
        myFormRef.value.showDialog();
    })
}
const myFormRef = ref();
const open= () => {
    myFormRef.value.showDialog();
};

</script>


<template>
  <div>
     <h1>商品展示
        <el-button id="parentIframe"  @click.prevent="handleProductData($route.query.productId)" 
              type="primary" style="display: none">
       </el-button>
       <el-button id="parentIframe"  @click.prevent="handleCommentData($route.query.productId)"
                  type="primary" style="display: none">
       </el-button>
     </h1>
  </div>
  <el-container>
    <el-aside width="80%" class="page-aside">
      <el-row>
    <el-aside width="50%" class="page-aside">
        <h1 style="font-size: 24px;text-align: center;">商品图片</h1>
        <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="(imageUrl,index) in product?.imageUrl" :key = "index">
                <div class="image-wrapper">
                    <img :src="imageUrl" alt="carousel-image" class="product-image" />
                </div>
            </el-carousel-item>
        </el-carousel>
    </el-aside>
    <el-aside width="50%" class="page-aside">
        <h2 style="font-size: 24px; margin: 40px 20px 20px;">{{product?.name}}/{{parseType(product?.type)}}</h2>
        <h2 style="font-size: 12px; margin-left: 20px;word-wrap: break-word">{{product?.description}}</h2>
        <div style="display: flex; align-items: center;">
          <h2 style="font-size: 24px; margin: 20px 20px; ">价格: {{ product?.price }} 元</h2>
          <h2 style="font-size: 24px; margin-left: auto; margin-right: 60px;">库存: {{ product?.stock }} 件</h2>
        </div>
        <div style="display: flex; align-items: center;">
          <h2 style="font-size: 24px; margin: 0px 20px; ">评分: {{ product?.score }}</h2>
          <h2 style="font-size: 24px; margin-left: auto; margin-right: 60px;">评论个数: {{ comments?.length}}</h2>
        </div>
        <div>
          <el-button type="primary" style="margin: 20px 0px 20px 20px;" @click="open" >购买</el-button>

          <MyForm ref="myFormRef" title="订单" :productId=$route.query.productId @submit="submit">
          </MyForm>
        </div>
    </el-aside>
  </el-row>
      <el-main  class="page-aside">
      <div>
        <el-card v-for="(comment, index) in comments" :key="index" class="message-card">
          <div class="flex-container">
          <el-avatar :icon="UserFilled" :size="30" v-if="comment.userAvatarUrl==null"></el-avatar>
          <el-avatar :src="comment.userAvatarUrl" :size="30" v-else></el-avatar> 
          <span class="userName">{{ comment.userName }}</span>
          <el-rate v-model="comment.score" disabled></el-rate>
          <div style="margin-left: auto;">{{ timeFormate(comment.time) }}</div>
          </div>
          <div>{{ comment.content }}</div>
        </el-card>
      </div>
    </el-main>
  </el-aside>
    <el-main>
      
    </el-main>
  </el-container>
</template>



<style scoped>
.flex-container {
  display: flex;
  gap: 10px;
}
.username {
  margin-left: 0;  /* 左边距 */
}
.page-aside {
  border-right: lightgrey solid 1px;
}
.product-image{
  width:360px; /* 设置固定宽度 */
  height: auto; /* 自适应高度 */
}
.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.message-card {
  margin-bottom: 10px;}
</style>
