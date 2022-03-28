<template>
  <el-card class="account-container">
      <h3>班级实验室课表</h3>
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
            <el-select v-model="ZyOption" placeholder="Select" @change="changeZy" style="margin-right: 1rem">
              <el-option v-for="(item, index) in ZyList" :key="index" :label="item.zymc" :value="item"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">班级</p>
            <el-select v-model="BjOption" placeholder="Select" @change="changeBj" style="margin-right: 1rem">
              <el-option v-for="(item, index) in BjList" :key="index" :label="item.bj" :value="item"> </el-option>
            </el-select>

              <el-button type="primary" style="display: inline-block" @click="queryBjLabSchedule">查询</el-button>
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

      // 专业列表信息
      ZyList: [],
      ZyOption: "选择专业",
      ZyId: "",



      // 班级选择
      BjList: [],
      BjOption: "选择班级",
      BjId: "",

      


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

    // 获取专业列表
    getZyListByYxsId(id) {
      this.$axios.post("/weixin-zymc/getZyList?YxsId="+id).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.ZyList = data.data
        } 
      })
    },

    // 获取班级列表
    getBjListByZyId(id) {
      this.$axios.post("/weixin-bjmc/getBjList?ZyId=" + id).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.BjList = data.data
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
        
        // 修改专业列表
        this.SysList = []
        this.SysOption = "选择实验室"
        this.SysId = ""

        // 获取专业列表
        this.getZyListByYxsId(item.dwh)
      } else {
        ElMessage.error("请先选择学期")
      }
    },
    // 选择专业列表
    changeZy(item) {
      if (item) {
        this.ZyOption = item.zymc
        this.ZyId = item.zyh

        // 修改班级列表
        this.BjList = []
        this.BjOption = "选择班级"
        this.BjId = ""

        // 根据专业号 获取班级
        this.getBjListByZyId(item.zyh)
      }
    },
    // 选择班级
    changeBj(item) {
      if (item) {
        this.BjOption = item.bj 
        this.BjId = item.bh
      }
    },
    // 查询按钮
    queryBjLabSchedule() {
      if (this.Xnxqh && this.YxsId && this.ZyId && this.BjId) {
        
      } else {
        ElMessage.error("请完成选择")
      }

    }



  }
}
</script>

<style>

.el-select .el-input__inner {
    width: 9rem;
}
</style>