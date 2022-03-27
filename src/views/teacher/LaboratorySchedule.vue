<template>
  <el-card class="account-container">
      <h3>实验室课表</h3>
      <el-divider />
      <!-- 搜索框 -->
      <el-scrollbar :always="true">
          <div style="display: flex; align-items: center;">
            <p style="margin-right: 1rem;">学期</p>
            <el-select v-model="XnxqOption" placeholder="Select" @change="changeXnxq" style="margin-right: 1rem">
              <el-option v-for="(item, index) in XnxqList" :key="index" :label="item.qsrq" :value="item.xnxqh"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">学院</p>
            <el-select v-model="YxsOption" placeholder="Select" @change="changeYxs" style="margin-right: 1rem">
              <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
            </el-select>


            <p style="margin-right: 1rem;">专业</p>
            <el-select v-model="YxsOption" placeholder="Select" @change="changeYxs" style="margin-right: 1rem">
              <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
            </el-select>


            <p style="margin-right: 1rem;">班级</p>
            <el-select v-model="YxsOption" placeholder="Select" @change="changeYxs" style="margin-right: 1rem">
              <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
            </el-select>


              <el-button type="primary" style="display: inline-block">查询</el-button>
          </div>
      </el-scrollbar>



    
  </el-card>
</template>

<script>import { ElMessage } from "element-plus"

export default {

  data() {
    return {
      // 学年学期信息
      XnxqList: [],
      XnxqOption: "选择学期",
      Xnxqh: "",

      // 院系所信息
      YxsList: [],
      YxsOption: "选择学院",
      // 选择的院系所id
      YxsId: "", 
      YxsMc: "",
    }
  },


  created() {
    this.getXnxqList()
  },

  methods: {

    // 获取 学期学年列表
    getXnxqList() {
      this.$axios.get("/weixin-ggjxzl/getXnxqList").then(res => {
        const data = res.data
        if (data.code == 200) {
          this.XnxqList = data.data
        } else {
          ElMessage.error("获取学年数据错误")
        }
      })
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

    // 选择学年
    changeXnxq(item) {
      this.Xnxqh = item
      if (!this.YxsList.length) {
        this.getYxsList()
      }
    },

    // 选择院系所
    changeYxs(item) {
      if (item.dwh) {
        this.YxsOption = item.dwmc
        this.YxsId = item.dwh
        this.YxsMc = item.dwmc
      } else {
        ElMessage.error("请先选择学期")
      }
    },



  }
}
</script>

<style>

.el-select .el-input__inner {
    width: 9rem;
}
</style>