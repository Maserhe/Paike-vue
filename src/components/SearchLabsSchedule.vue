<template>
  <el-card class="account-container">
      <h3>实验室课表查询</h3>
      <el-divider />
      <br/>
      
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

            <p style="margin-right: 1rem;">机房</p>
            <el-select v-model="SysOption" placeholder="Select" @change="changeSys" style="margin-right: 1rem">
              <el-option v-for="(item, index) in SysList" :key="index" :label="item.sysmph" :value="item"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">周次</p>
            <el-select v-model="ZcOption" placeholder="Select" @change="changeZc" style="margin-right: 1rem">
              <el-option v-for="(item, index) of 20" :key="index" :label="'第' + item + '周'" :value="item"> </el-option>
            </el-select>

            <el-button type="primary" style="display: inline-block; width: 3rem" @click="queryLabSchedule">查询</el-button>
          </div>
      </el-scrollbar>
      <br/>

      <div class="table-wrapper">
        <div class="tabel-container">
          <table>
            <!-- 第一行  节次-->
            <thead><tr><th v-for="(item,index) in sections" :key="index">{{item}}</th></tr></thead>
            <tbody>
              <tr v-for="(item,index) in weeks" :key="index">
                <!-- 第一个 -->
                <td style="font-size:12px;background:#d4f7fd;word-wrap: break-word; word-break: break-all;">{{item}}</td>
                <!-- 后面五个 -->
                <!-- 学生界面 -->
                <td v-for="chindex of 5" :key="chindex">
                  <div style v-if="courses[index][chindex - 1] &&  Object.keys(courses[index][chindex - 1]).length > 0 " @click="toScanDetail(courses[index][chindex - 1])">
                    {{ courses[index][chindex - 1].lessonsName }} <br />
                    {{ courses[index][chindex - 1].lessonsTeacher }}
                    <br />
                    {{ courses[index][chindex - 1].lessonsAddress }}
                  </div>

                  <div class="paike" v-else-if="userInfo.useraccounttype == 1" @click="paikeButton(index, chindex)">
                    <br />
                    <br />
                    点击排课
                  </div> 
                <div class="paike" v-else ></div> 
                </td>

              </tr> 
            </tbody>
          </table>
        </div>
      </div>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" title="排课管理" width="80%" :before-close="handleClose">
      <!-- 实验室表单, 修改实验室信息 -->
      学期: {{ Xnxqh }}
      <br/>
      学院: {{ YxsMc }}
      <br/>
     实验室: {{ SysId }} 实验室号 {{ Sysmph }}
      <br/>
     周次: {{ ZcId }}
      <br/>
     天: {{ thatDay }}
      <br/>
      节: {{ thatSection  }}

  </el-dialog>


  </el-card>
</template>

<script>
import { ElMessage } from 'element-plus'
import { fromCode } from '@/utils/validate'
import { ref } from 'vue'
export default {

  setup() {
    const dialogVisible = ref(false)
    const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}
    return {
      dialogVisible,
      handleClose,
    }
  },

  name: "SearchLabsSchedule",
  data() {
      return {

        userInfo: null,

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

        // 选择实验室
        SysList: [],
        SysId: "",
        SysOption: "选择实验室",
        Sysmph: "",


        // 选择周次
        ZcId: "",
        ZcOption: "选择周次",


        // 排课的 时间， 周几 ， 第几节
        thatDay: "",
        thatSection: "",
        
        // 备注
        bz: "",

        // 排课
        sections: ["周次\\节", "1-2节", "3-4节", "5-6节", "7-8节", "9-10节"],
        weeks: ["周一", "周二", "周三", "周四", "周五","周六","周日"],
        courses: [
          [{ "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },
          {}, {},  { "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },],
          [],[],[],[],[],
          [{ "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },{ "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },],
        ],

      }
  },


  created() {

    const user = sessionStorage.getItem("userInfo")
    if(user) {
      this.userInfo = JSON.parse(fromCode(user))      // 根据请求获取用户信息
    } else {
      this.$router.push("/login")
    }
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
        // 获取实验室列表
        this.SysList = []
        this.SysOption = "选择实验室"
        this.SysId = ""
        this.Sysmph = ""

        this.getSysListById(this.YxsId)
      } else {
        ElMessage.error("请先选择学期")
      }
    },

    // 选择实验室
    changeSys(item) {
      this.SysOption = item.sysmph
      this.SysId = item.sysh
      this.Sysmph = item.sysmph
    },

    // 选择周次
    changeZc(item) {
      this.ZcId = item
      // 打开 弹窗
    },


    // 根据id获取实验室列表
    getSysListById(id) {
      this.$axios.get("/weixin-syszk/getById?id=" + id).then(res=> {
        const data = res.data
        if (data.code == 200) { 
          this.SysList = data.data
        }
      })
    },


    // 点击查询
    queryLabSchedule() {
      if (this.Xnxqh && this.YxsId && this.SysId) {
        console.log("++++++++++++++")
        console.log(this.Xnxqh, this.XnxqList)
        console.log("++++++++++++++")
        console.log(this.YxsId, this.YxsList)
        console.log("++++++++++++++")
        console.log(this.SysId, this.SysList)
      } else {
        ElMessage.error("请完成选择")
      }
    },
    // 查看该课程的相关详情
    toScanDetail(item, idx) {
      var con = `<div style="width:180px;text-align:left!important;margin:0 auto;color:#999;font-size:16px">课程名称：${item.lessonsName}<br/>上课时间：${item.lessonsTime}<br/>上课地点：${item.lessonsAddress}<br/>授课老师：${item.lessonsTeacher}<br/>课程课时：${item.lessonsRemark}</div>`;
      if (item.lessonsName) {
        ElMessage({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: con,
        })
      }
    },
    // 点击排课
    paikeButton(index, chindex) {
      // 开始选课, 打开弹窗
      // 检测必要参数 是否都存在， 否则打不开对话框
      if(this.Xnxqh && this.Sysmph && this.SysId && this.YxsMc && this.YxsId) {
        console.log(index, chindex)
        this.thatDay = index + 1
        this.thatSection = chindex
        this.bz = ""
        this.dialogVisible = true
        // alert("周" + (index + 1) + "第" + chindex + "节")
      } else {
        ElMessage.error("请完成上面的选择")
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
<style scoped>

/* a5d16d  */
* {
  margin: 0;
  padding: 0;
}
.table-wrapper {
  width: 100%;
  overflow: auto;
  margin-bottom: 60px;
}
table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  color: #677998;
}

thead {
  background: #d4f7fd;
}
th {
  font-weight: normal;
  height: 46px !important;
}
tbody {
  font-size: 12px;
}
th,
td {
  text-align: center;
  height: 80px;
  border-right: 1px solid #fefefe;
  border-bottom: 1px solid #fefefe;
}
tr td div {
  background: #049EFF; 
  width: 100%;
  height: 100%;
  color: #efefef;
  border-radius: 10px;
  padding: 5px;
  box-sizing: border-box;
}

tr td:first-child {
  color: #333;
}
.course {
  background-color: #ebbbbb;
  color: #fff;
  display: inline-block;
  border-radius: 3px;
  width: 47%;
  margin: 1px 1%;
}
.bgColor {
  background-color: #89b2e5;
}
.paike {
  background-color: #f2f7f8;
  color: #049EFF;
}
</style>