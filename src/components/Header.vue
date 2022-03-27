<template>
  <div class="header">
    <div class="left">
      <div style="display: flex; align-items: center;">
        <el-icon  v-if="hasBack"  :size="30"  class="el-icon-back" @click="back"><i-caret-left /></el-icon>
        <a style="font-size: 1rem">沈工大实验室管理</a>
      </div>
    </div>
    <div class="right">
      <el-popover
        placement="bottom"
        :width="320"
        trigger="click"
        popper-class="popper-user-box"
      >
        <template #reference>
          <div class="author">
            <!-- <i class="icon el-icon-s-custom" /> -->
              <el-icon><i-user-filled /></el-icon>
            {{ userInfo.userrealname }}
            <el-icon><i-caret-bottom /></el-icon>
          </div>
        </template>
        <div class="nickname">
          <p>登录名：{{ userInfo.useraccount }}</p>
          <el-tag size="small" effect="dark" class="logout" @click="logout()">退出</el-tag>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>

import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { pathMap } from '@/utils'
import { localRemove } from '../utils'
import { fromCode } from '@/utils/validate'
export default {
  name: 'Header',
  setup() {
    const router = useRouter()
    const state = reactive({
      name: '首页',
      hasBack: false,
      userInfo: {
        userrealname: '测试员',
        useraccount: '测试'
      }
    })
    const back = () => {
      router.back()
    }
    router.afterEach((to) => {
      state.name = pathMap[to.name]
      state.hasBack = true
    })
    return {
      ...toRefs(state),
      back
    }
  },

  created() {
    const user = sessionStorage.getItem("userInfo")
    const token = localStorage.getItem("token")
    if(user && token) {
      this.userInfo = JSON.parse(fromCode(user))      // 根据请求获取用户信息
    } else {
      this.$router.push("/login")
    }
  },

  methods: {
    logout(){
      this.$axios.get("/logout").then((res)=> {
          const data = res.data          
         if (data.code == 200) {
            ElMessage.success("成功退出登陆!")
         }
      })
      // 删除token
      localRemove("token")
      // 删除用户信息
      this.$store.commit("REMOVE_INFO")
      // 删除header
      window.location.reload()
      
    }
  }
}
</script>

<style scoped>
  .header {
    height: 50px;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  .el-icon-back {
    border: 1px solid #e9e9e9;
    padding: 1px;
    border-radius: 50px;
    margin-right: 1rem;
  }
  .right > div > .icon{
    font-size: 18px;
    margin-right: 6px;
  }
  .author {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
<style>
  .popper-user-box {
    background: url('../assets/account-banner-bg.png') 50% 50% no-repeat!important;
    background-size: cover!important;
    border-radius: 0!important;
  }
  .popper-user-box .nickname {
    position: relative;
    color: #ffffff;
  }
  .popper-user-box .nickname .logout {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
</style>