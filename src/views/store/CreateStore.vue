<!--Lab2新增-创建商店界面-->
<!--你可以选择把创建商店改成一个弹窗或其他界面的一个部分。
这样的话，就不需要有这样一个views下的创建商店文件了，因为views下的文件一般会是一个单独的界面。
但如果你觉得这一个部分的代码较多，合到其他文件里会使那个文件太长，
可以在store文件夹下创建一个components子文件夹，里面存放store模块下产生的组件界面。把这个创建商店子组件放在里面
这个传递数据的过程可能需要用到props-->

<script setup lang="ts">
import {ref, computed} from 'vue'
import {uploadImage} from '../../api/tools'
import {router} from '../../router'
import {storeRegister} from "../../api/store.ts"

const imageFileList = ref([])
const logoUrl = ref('')
const storeName = ref('')
const Description = ref('')

const hasStoreName = computed(() => storeName.value != '')
const hasDescription = computed(() => Description.value != '')
const haslogo = computed(() => imageFileList.value.length > 0)
const registerDisabled = computed(() => {
    return !(hasStoreName.value && hasDescription.value && haslogo.value)
})

function handleChange(file: any, fileList: any) {
    if(file.name.length > 10){
      file.name=file.name.substr(0, 10) + "..." +file.name.substr(file.name.length-4, file.name.length)
    }
    if(fileList.length >= 1){
      imageFileList.value = fileList
      let formData = new FormData()
      formData.append('file', file.raw)
      uploadImage(formData).then(res => {
        logoUrl.value = res.data.result
      })
    }
    else {
      ElMessage.warning('请至少上传1张图片');
    }
}

function handleExceed() {
  ElMessage.warning(`当前限制选择 1 个文件`);
}

function uploadHttpRequest() {
  return new XMLHttpRequest()
}

function handleRegister() {
  storeRegister({
    logoUrl: logoUrl.value,
    storeName: storeName.value,
    description: Description.value,
  }).then(res => {
    if (res.data.code === '000') {  //类型守卫，它检查 res.data 对象中是否存在名为 code 的属性
      ElMessage({
        message: "商店注册成功",
        type: 'success',
        center: true,
      })
      router.push({path: "/dashboard"})
    } else if (res.data.code === '400') {
      ElMessage({
        message: res.data.msg,
        type: 'error',
        center: true,
      })
    }
  })
}
function beforeUpload(file: any) {
    if (file.size / 1024 / 1024 > 1) {
      ElMessage({
        message: "上传文件大小不能超过1M!",
        type: 'error',
        center: true,
      })
      return false;
    }
    return true;
}
</script>


<template>
  <el-main>
    <el-row :gutter="20">
    <el-col :span="8">
    <el-card class="aside-card">
    <el-form>

      <el-form-item label="商店Logo">
        <el-upload
            v-model:file-list="imageFileList"
            :limit="1"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :on-exceed="handleExceed"
            :on-remove="handleChange"
            class="upload-demo"
            list-type="picture"
            :http-request="uploadHttpRequest"
            drag>
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
          <div class="el-upload__text">
            将文件拖到此处或单击此处上传。仅允许上传一份文件。
          </div>
        </el-upload>
      </el-form-item>

    </el-form>
    </el-card>

    </el-col>
    <el-col :span="16">
        <el-card>
          <el-form>
             <el-form-item>
               <label for="name">商店名称</label>
               <el-input type="text" id="name" v-model="storeName"/>
             </el-form-item>
             <el-form-item>
               <label for="description">商店简述</label>
               <el-input id="description" type="textarea"
                    rows="7"
                    v-model="Description"></el-input>
               </el-form-item>
          </el-form>
          <el-button @click.prevent="handleRegister"
                       :disabled="registerDisabled"
                       type="primary">
              创建商店
            </el-button>
        </el-card>
    </el-col>
  </el-row>
  </el-main>
</template>


<style scoped>
</style>
