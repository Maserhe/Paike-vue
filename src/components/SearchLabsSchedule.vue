<template>
  <el-card class="account-container">
      <h3>实验室课表查询</h3>
      <el-divider />
      <br/>
      
      <!-- 搜索框 -->
      <el-scrollbar :always="true">
          <div style="display: flex; align-items: center;">
            <p style="margin-right: 1rem;">学期</p>
            <el-select v-model="XnxqOption" placeholder="选择学期" @change="changeXnxq" style="margin-right: 1rem">
              <el-option v-for="(item, index) in XnxqList" :key="index" :label="item.qsrq" :value="item"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">学院</p>
            <el-select v-model="YxsOption" placeholder="选择学院" @change="changeYxs" style="margin-right: 1rem">
              <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">机房</p>
            <el-select v-model="SysOption" placeholder="选择机房" @change="changeSys" style="margin-right: 1rem">
              <el-option v-for="(item, index) in SysList" :key="index" :label="item.sysmph" :value="item"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">周次</p>
            <el-select v-model="ZcOption" placeholder="选择周次" @change="changeZc" style="margin-right: 1rem">
              <el-option v-for="(item, index) of 20" :key="index" :label="'第' + item + '周'" :value="item"> </el-option>
            </el-select>

            <!-- <el-button type="primary" style="display: inline-block; width: 3rem" @click="queryLabSchedule">查询</el-button> -->
          </div>
      </el-scrollbar>
      <br/>

      <div class="table-wrapper">
        <div class="tabel-container">

            <table >
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
                    教师: {{ courses[index][chindex - 1].jgmc }}
                    <br />
                    课程: {{ courses[index][chindex - 1].kcmc }}
                   <br />
                    班级: {{ courses[index][chindex - 1].bjmcList.join('、')}}
                   <br/>

                   <el-popconfirm v-if="courses[index][chindex - 1].jg0101id == userInfo.useraccount" title="确定要取消排课嘛?" @confirm="canclePaike(index, chindex)">
                      <template #reference>
                        <el-button type="success" >取消排课</el-button>
                      </template>
                    </el-popconfirm>

                    <!-- 备注: {{ courses[index][chindex - 1].bz }} -->
                    <!-- <el-button type="success" v-if="courses[index][chindex - 1].jg0101id == userInfo.useraccount" @click="canclePaike(index, chindex)">取消排课</el-button> -->
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
      <el-descriptions :column="1" border >
        <el-descriptions-item><template #label><el-icon> <i-tickets /></el-icon>学期学年</template>{{ XnxqOption }}</el-descriptions-item>
        <el-descriptions-item><template #label><el-icon> <i-location-information /></el-icon>上课地址</template>{{ Yxs.dwmc }} {{ Sys.sysmph }} 教室</el-descriptions-item>
        <el-descriptions-item><template #label><el-icon> <i-timer /></el-icon>上课时间</template> 第 {{ ZcOption }} 周、 周 {{ thatDay }}、{{ sections[thatSection] }}</el-descriptions-item>
      </el-descriptions>

      <!-- 实验室表单, 修改实验室信息 -->
      <!-- 学期: {{ Xnxq }}
      <br/>
      学院: {{ Yxs }} 
      <br/>
     实验室: {{ Sys }} 
      <br/>
     周次: {{ ZcOption }}
      <br/>
     天: {{ thatDay }}
      <br/>
      节: {{ thatSection  }} -->
    <el-divider />
    <!-- 查询老师的课程
    班级的 年级
    查询教师上课的班级

    学年学期 + 教师 id -->
    <el-divider />
    <br/>
    <div style="display: flex; align-items: center;">
      <p style="margin-right: 1rem;">选择课程</p>
      <el-select v-model="KcOption" placeholder="选择课程" @change="changeKc" style="margin-right: 1rem">
        <el-option v-for="(item, index) in getKcList" :key="index" :label="item" :value="item"> </el-option>
      </el-select>
    </div>
    <br/>
    <div style="display: flex; align-items: center;">
      <p style="margin-right: 1rem;">选择班级</p>
      <el-select  v-model="BjOption" multiple placeholder="选择班级" @change="changeBj" style="margin-right: 1rem">
        <el-option v-for="(item, index) in Bjlist" :key="item.bh" :label="item.bjmc" :value="item.bh"> </el-option>
      </el-select>
    </div>
    <br/>
    <div style="display: flex; align-items: center;">
      <p style="margin-right: 1rem;">备注说明</p>
      <el-input  style="margin-right: 1rem"
        v-model="bz"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="非必需输入"
      />
    </div>
    <br/>
    <div style="text-align: center">
      <el-button size="large" type="primary" style="width: 6rem" @click.native.prevent="addPaikeButton" :disabled="loading" >确定</el-button>
    </div>
  </el-dialog>

  </el-card>
</template>

<script>
import { fromCode } from '@/utils/validate'
import { ref } from 'vue'

export default {

  setup() {
    const dialogVisible = ref(false)
    const KcOption = ref("")
    const BjOption = ref("")
    const XnxqOption = ref("")
    const YxsOption = ref("")
    const SysOption = ref("")
    const ZcOption = ref("")
    const loading = ref(false)

    const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}
    return {
      dialogVisible,
      handleClose,
      XnxqOption,
      YxsOption,
      SysOption,
      ZcOption,
      KcOption,
      BjOption,

      loading,
    }
  },

  name: "SearchLabsSchedule",
  data() {
      return {

        userInfo: null,

        // 学年学期信息
        XnxqList: [],
        Xnxq: {},

        // 院系所信息
        YxsList: [],
        Yxs: {}, 

        // 选择实验室
        SysList: [],
        Sys: {},

        // 排课的 时间， 周几 ， 第几节
        thatDay: "",
        thatSection: "",
        
        // 备注
        bz: "",

        // 排课
        sections: ["周次\\节", "1-2节", "3-4节", "5-6节", "7-8节", "9-10节"],
        weeks: ["周一", "周二", "周三", "周四", "周五","周六","周日"],

        courses: [
          [],[],[],[],[],[],[]
        ],

        // 班级列表
        Bjlist: [], 

        // 课程和 班级 列表
        KcAndBjList: [],

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
    initcourse() {
      this.courses = [ [],[],[],[],[],[],[] ]
    },
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
    
    // 选择学年
    changeXnxq() {
      this.Xnxq = JSON.parse(JSON.stringify(this.XnxqOption))
      this.XnxqOption = this.Xnxq.qsrq
      this.initcourse()
      
      this.ZcOption = ""
      // 获取 这个教师 当前学年 的课程
      Loading.show()
      this.getKcAndBjList(this.Xnxq.xnxqh, this.userInfo.useraccount)
      Loading.hide()

      if (!this.YxsList.length) {
        this.getYxsList()
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
    changeYxs() {
      this.initcourse()
      this.Yxs = JSON.parse(JSON.stringify(this.YxsOption))
      this.YxsOption = this.Yxs.dwmc
      this.SysOption = ""
      this.ZcOption = ""
      Loading.show()
      this.getSysListById(this.Yxs.dwh)
      Loading.hide()
    },

    // 选择实验室
    changeSys() {
      this.initcourse()
      this.Sys = JSON.parse(JSON.stringify(this.SysOption))
      this.SysOption = this.Sys.sysmph
      this.ZcOption = ""
      // 查询老师的 课程
      if (!this.KcAndBjList.length) {
        Loading.show()
        this.getKcAndBjList(this.Xnxq.xnxqh, this.userInfo.useraccount)
        Loading.hide()
      }
    },

    // 选择周次
    changeZc() {
      // 查询 这一周的 课程
      if (this.XnxqOption && this.YxsOption && this.SysOption) {
        Loading.show()
        this.getSysPaikeTable(this.Xnxq.xnxqh, this.ZcOption, this.Sys.sysh)
        Loading.hide()

      } else {
        ElMessage.error("请完成前面的选项")
        this.ZcOption = ""
      }
      
    },

    // 选择课程
    changeKc() {
      const arr = this.KcAndBjList.filter(i => {return i.kcmc == this.KcOption})
      if (arr.length == 1) {
        this.Bjlist = arr[0].classList
      }
    },

    // 选择班级
    changeBj(item) {
      console.log(this.BjOption)
      console.log(item)
    },

    // 根据学期号 和 教师号 获取课程 以及班级
    getKcAndBjList(Xnxqh, Jgh) {
      this.$axios.post("/weixin-jskb/getjskb", {
        "Xnxqh": Xnxqh,
        "Jgh": Jgh
      }).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.KcAndBjList = data.data
        }
      })
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

    // 获取 课程表
    getSysPaikeTable(xnxq, kkzc, sysh) {
      this.$axios.post("/weixin-sysxk/sysxkTable", {
        "xnxq01id": this.Xnxq.xnxqh,
        "kkzc": kkzc,
        "sysh": sysh
      }).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.courses = data.data
        }
      })
    },   

    // 查看该课程的相关详情
    toScanDetail(item, idx) {
      var con = `<div style="width:200px;text-align:left!important;margin:0 auto;color:#999;font-size:14px">学院：${this.Yxs.dwmc}<br/>地点：${item.sysmph}<br/>课程：${item.kcmc}<br/>教师：${item.jgmc}<br/>班级：${item.bjmcList.join('、')}<br/>备注：${item.bz}<br/></div>`;
      if (this.Yxs.dwmc) {
        ElMessage({
          type: 'success',
          dangerouslyUseHTMLString: true,
          message: con,
        })
      }
    },

    // 取消排课
    canclePaike(x, y) {
      // 取消课程
      this.$axios.post("/weixin-sysxk/cancleXk", {
        "xnxq01ID": this.Xnxq.xnxqh,
        "kkzc": this.ZcOption,
        "kksjmx": (x+1) + "-" + y,
        "jg0101ID": this.userInfo.useraccount,
        "sysh": this.Sys.sysh
      }).then(res=> {
        const data = res.data
        if (data.code == 200) {
          // 刷新 课程表 删除缓存
          this.getSysPaikeTable(this.Xnxq.xnxqh, this.ZcOption, this.Sys.sysh)
        } else {
          ElMessage.error("删除失败，系统错误！")
        }
      })


    },

    // 点击排课
    paikeButton(index, chindex) {
      if(this.XnxqOption && this.YxsOption && this.SysOption && this.ZcOption && this.KcAndBjList) {
        this.thatDay = index + 1
        this.thatSection = chindex
        this.bz = ""
        this.KcOption = ""
        this.BjOption  =  ""
        this.Bjlist = []

        this.dialogVisible = true
      } else {
        ElMessage.error("请完成上面的选择,并点击查询")
      }
    },

    // 提交排课按钮
    addPaikeButton() {

      // 检测必要参数 是否都存在， 否则打不开对话框
      // 检验参数
      if (this.KcOption && this.BjOption && this.BjOption.length != 0) {
        this.loading = true
        Loading.show()
        this.$axios.post("/weixin-sysxk/addSysxk", {
          "xnxq01id": this.Xnxq.xnxqh,
          "kkzc": this.ZcOption,
          "kksjmx": this.thatDay + "-" + this.thatSection,
          "kcmc": this.KcOption,
          "jgmc": this.userInfo.userrealname,
          "sysh": this.Sys.sysh,
          "sysmph": this.Sys.sysmph,
          "yxsh": this.Yxs.dwh,
          "bz": this.bz,
          "jg0101id": this.userInfo.useraccount,
          "classList": this.getBjOptionList
        }).then(res=> {
          const data = res.data
          if (data.code == 200) {
            ElMessage.success("添加成功")
            // 刷新课程表
            this.getSysPaikeTable(this.Xnxq.xnxqh, this.ZcOption, this.Sys.sysh)
            this.dialogVisible = false
            this.loading = false
            Loading.hide()
          }
        }).catch(error=>{
          this.loading = false
          Loading.hide()
        })

        // console.log(this.getBjOptionList)
      } else {
        ElMessage.error("完成课程、班级选择")
      }
    },

  },

  computed: {
    getKcList() {
      return this.KcAndBjList.map(item => {return item.kcmc})
    },
    getBjOptionList() {
      return this.Bjlist.filter(i => { return this.BjOption.some(t=> { return t == i.bh }) })
    }
  }
}
</script>

<style>
/* .el-select .el-input__inner {
    width: 9rem;
} */
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