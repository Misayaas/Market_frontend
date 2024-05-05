<script setup lang="ts">
import {ref} from "vue"
import {getThisProduct} from "../api/product.ts"
import {parseType} from "../utils"

// 使用props接收父界面传来的数据
const props = defineProps({
  productId: {
    type: Number,
    required: true
  }
})
interface Product{
  id: number;
  name: string;
  type: string;
  price: number;
  storeId: string;
  description: string;
  imageUrl: string[];
  stock: number;
  score: number;
}
const product = ref<Product>();
getThisProduct(props.productId).then(res => {
    product.value=res
})
</script>


<template>
  <el-card class="product-item-card" shadow="hover">
    <img  :src="product?.imageUrl[0]" alt="图片" class="product-image">
    <div >
      <h1> {{ product?.name }} </h1>
      <el-descriptions :column="1">
        <el-descriptions-item style="font-size: 10px " label="品类">
          {{ parseType(product?.type) }}
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="价格">
          {{ product?.price }} 元
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="库存">
          {{ product?.stock }} 件
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="评分" v-if="product?.score==null">
          未评分 
        </el-descriptions-item>
        <el-descriptions-item style="font-size: 10px" label="评分" v-if="product?.score!=null">
          {{ product?.score }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-card>
</template>


<style scoped>
.product-item-card{
  border-style: solid;
  border-width: 1px;
  border-color: #E4E4E4;
  width: calc(33% - 14px);/*14px极限宽度*/
  padding: 10px 0px 0px 0px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #fff;
}
.store-item-card:nth-child(3n) {
  margin-right: 0;
}
.product-image {
  width:auto; /* 自适应宽度 */
  height: 100px; /* 设置固定高度 */
  /*居中
  display: block;*/
}

h1 {
  margin-top: 10px;
  text-align: center; 
}

.photo-div {
  display: flex;
  justify-content: center;
}
</style>
