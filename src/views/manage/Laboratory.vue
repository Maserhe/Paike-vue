<template>
  <el-card class="account-container">
    <h1>实验室管理</h1>
    <el-divider />
    <el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="查看" name="first">
        <label slot="lable"> &nbsp; &nbsp;学院:&nbsp; &nbsp; </label>
        <el-select v-model="YxsOption" placeholder="Select" @change="changeYxs" >
          <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item.dwh"> </el-option>
        </el-select>
        
    </el-tab-pane>
    <el-tab-pane label="管理" name="second">
      管理实验室
    </el-tab-pane>
  </el-tabs>


    
  </el-card>
</template>

<script>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

export default {

  data() {
    return {
      activeName: 'first',

      // 院系所信息
      YxsList: [],
      YxsOption: "选择学院",

      // 实验室信息
      SysList: [],

    }
  },
  created() {
    this.getYxsList()

  },

  methods: {
    // 切换 页面
    handleClick(tab) {
        if (tab.props.name == "first") {
          // this.init()
          console.log("初始化数据")
        } else {
          // this.getCourseList()
          console.log("初始化数据2")
        }
    },

    // 获取所有院系所信息
    getYxsList() {
      this.$axios.get("/weixin-yxs/getAllYxs").then(res => {
        const data = res.data
        if (data.code == 200) {
          this.YxsList = data.data
        }
      })
    },
    // 选择院系所
    changeYxs(id) {
      if (id) {
        this.getXyxListById(id)
      } else {
        ElMessage.error("请选择课程")
      }
    },
    // 根据id获取实验室列表
    getXyxListById(id) {
      this.$axios.get("/weixin-syszk/getById?id=" + id).then(res=> {
        const data = res.data
        if (data.code == 200) {
          this.SysList = data.data
        }
      })
    },

  }
}
</script>

<style>

</style>