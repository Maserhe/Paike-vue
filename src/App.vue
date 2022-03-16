
<template>
  <div class="layout">
    <el-container v-if="state.showMenu" class="container">
      <el-aside  class="aside" width="collapse"> 
        <div @click="closeAllMenu()"><el-icon :size="25" class="icon-operation"> <i-operation /></el-icon></div>
        <div class="line" />


      <!-- :default-openeds="state.defaultOpen" -->
        <el-menu
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
          background-color="#222832"
          text-color="#fff"
          :router="true"
          :default-active='state.currentPath'
        >
          <el-sub-menu index="1" v-if="userInfo.useraccounttype == 0">
            <template #title>
              <el-icon><i-setting /></el-icon>
              <span>系统设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/student_manage"><el-icon><i-platform /></el-icon>学生管理</el-menu-item>
              <el-menu-item index="/teacher_manage"><el-icon><i-user /></el-icon>教师管理</el-menu-item>
              <el-menu-item index="/laboratory_manage"><el-icon><i-school /></el-icon>实验室管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><i-data-line /></el-icon>
              <span>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/swiper"><i class="el-icon-picture" />轮播图配置</el-menu-item>
              <el-menu-item index="/hot"><i class="el-icon-star-on" />热销商品配置</el-menu-item>
              <el-menu-item index="/new"><i class="el-icon-sell" />新品上线配置</el-menu-item>
              <el-menu-item index="/recommend"><i class="el-icon-thumb" />为你推荐配置</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><i-view /></el-icon>
              <span>模块管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/category"><i class="el-icon-menu" />分类管理</el-menu-item>
              <el-menu-item index="/good"><i class="el-icon-s-goods" />商品管理</el-menu-item>
              <el-menu-item index="/guest"><i class="el-icon-user-solid" />会员管理</el-menu-item>
              <el-menu-item index="/order"><i class="el-icon-s-order" />订单管理</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <el-sub-menu index="4">
            <template #title>
              <el-icon><i-menu /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/account"><i class="el-icon-lock" />修改密码</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container class="content">
        <Header />
        <div class="main">
          <router-view />
        </div>
        <Footer />
      </el-container>
    </el-container>
    <el-container v-else class="container">
      <router-view />
    </el-container>
  </div>
</template>

<script>
import { onUnmounted, reactive } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { pathMap, localGet } from '@/utils'
import { fromCode } from '@/utils/validate'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    const noMenu = ['/login']
    const router = useRouter()
    const state = reactive({
      defaultOpen: ['1'],
      showMenu: true,
      currentPath: '/student_manage',
      count: {
        number: 1
      },
      userInfo: null,
    })
    // 监听浏览器原生回退事件
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', () => {
        if (!localGet('token')) {
          state.showMenu = false
        }
      }, false);
    }



    const unwatch = router.beforeEach((to, from, next) => {
      if (to.path == '/login') {
        // 如果路径是 /login 则正常执行
        next()
      } else {
        // 如果不是 /login，判断是否有 token
        if (!localGet('token') && !sessionStorage.getItem("userInfo")) {
          // 如果没有，则跳至登录页面
          next({ path: '/login' })
        } else {
          // 否则继续执行
          next()
        }
      }
      state.showMenu = !noMenu.includes(to.path)
      state.currentPath = to.path
      document.title = pathMap[to.name]
    })
    onUnmounted(() => {
      unwatch()
    })
    return {
      state
    }
  },

  created() {
    const user = sessionStorage.getItem("userInfo")
    if(user) {
      this.userInfo = JSON.parse(fromCode(user))      // 根据请求获取用户信息
    } else {
      this.$router.push("/login")
    }
  },

  data() {
    return {
      isCollapse: true,
      identity: null,
    }
  },
  methods: {
    handleOpen(key , keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath){
      console.log(key, keyPath)
    },
    closeAllMenu() {
      this.isCollapse = !this.isCollapse
    },
    // 身份查找:
    getIdentity() {
      // 从localstorage 中获取用户信息

    },


  }
}
</script>

<style scoped>
  .layout {
    min-height: 100vh;
    background-color: #ffffff;
  }
  .container {
    height: 100vh;
  }
  .aside {
    /* width: 80px!important; */
    background-color: #222832;
    overflow: hidden;
    overflow-y: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    padding: 0%;
  }
  .aside::-webkit-scrollbar {
    display: none;
  }

  .line {
    border-top: 1px solid hsla(0,0%,100%,.05);
    border-bottom: 1px solid rgba(0,0,0,.2);
  }
  .content {
    display: flex;
    flex-direction: column;
    max-height: 100vh;
    overflow: hidden;
  }
  .main {
    height: calc(100vh - 100px);
    overflow: auto;
    padding: 10px;
  }
  .icon-operation {
    height: 2em;
    width: 2em;
    vertical-align: middle;
  }

</style>
<style>

  body {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .el-menu {
    border-right: none!important;
  }
  .el-sub-menu {
    border-top: 1px solid hsla(0, 0%, 100%, .05);
    border-bottom: 1px solid rgba(0, 0, 0, .2);
  }
  .el-sub-menu:first-child {
    border-top: none;
  }
  .el-sub-menu [class^="el-icon-"] {
    vertical-align: -1px!important;
  }
  a {
    color: #409eff;
    text-decoration: none;
  }
  .el-pagination {
    text-align: center;
    margin-top: 20px;
  }
  .el-popper__arrow {
    display: none;
  }
</style>