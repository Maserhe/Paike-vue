<template>
  <el-card class="account-container">
      <h3>班级实验室课表</h3>
      <el-divider />
      <!-- 搜索框 -->
      <br/>
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

            <p style="margin-right: 1rem;">专业</p>
            <el-select v-model="ZyOption" placeholder="选择专业" @change="changeZy" style="margin-right: 1rem">
              <el-option v-for="(item, index) in ZyList" :key="index" :label="item.zymc" :value="item"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">年级</p>
            <el-select v-model="RxnfOption" placeholder="选择年级" @change="changeRxnf" style="margin-right: 1rem">
              <el-option v-for="(item, index) in RxnfList" :key="index" :label="item + '级'" :value="item"> </el-option>
            </el-select>

            <p style="margin-right: 1rem;">班级</p>
            <el-select v-model="BjOption" placeholder="选择班级" @change="changeBj" style="margin-right: 1rem">
              <el-option v-for="(item, index) in BjList" :key="index" :label="item.bj" :value="item"> </el-option>
            </el-select>
              <el-button type="primary" @click="queryBjLabSchedule">查询</el-button>
          </div>

      </el-scrollbar>
      <br/>

        <el-table :data="getXkFilter.slice((currentPage - 1)* pagesize, currentPage * pagesize)" style="width: 100%">
            <el-table-column type="index" ></el-table-column>
            <el-table-column label="课程" prop="kcmc"  ></el-table-column>
            <el-table-column label="教师" prop="jgmc" ></el-table-column>
            <el-table-column label="时间" prop="time" ></el-table-column>
            <el-table-column label="地点" prop="address" ></el-table-column>

            <el-table-column label="操作" width="300rem">
                <template #header>
                    <el-input v-model="search" placeholder="输入课程、教师、地点搜索" />
                </template>
            </el-table-column>
            <template #append>
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20, 40]" 
                :page-size="pagesize"         
                layout="total, sizes, prev, pager, next, jumper"
                :total="getXkFilter.length">    
                </el-pagination>
            </template>
        </el-table>

  </el-card>
</template>

<script>
import { ElMessage } from "element-plus"
import { ref } from 'vue'

export default {

  name: "SearchClassSchedule",
  
  setup() {

    const XnxqOption = ref([])
    const YxsOption = ref([])
    const ZyOption = ref([])
    const RxnfOption = ref([])
    const BjOption = ref([])
    return {
      XnxqOption,
      YxsOption,
      ZyOption,
      RxnfOption,
      BjOption
    }
  },

  data() {
    return {
      // 分页
      currentPage: 1,
      pagesize: 10,
      sections: ["周次\\节", "1-2节", "3-4节", "5-6节", "7-8节", "9-10节"],

      // 搜索框
      search: "",

      // 选课的结果
      XkList: [],

      // 学年学期信息
      XnxqList: [],
      Xnxq: {},

      // 院系所信息
      YxsList: [],
      // 选择的院系所id
      Yxs: {},

      // 专业列表信息
      ZyList: [],
      Zy: {},

      // 年级选择 根据班级的 入学年份
      RxnfList: [],

      // 班级选择
      BjList: [],
      Bj: {},

    }
  },


  created() {
    this.getXnxqList()
  },

  methods: {

    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
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

    // 获取入学年份 列表
    getRxnfListByZyId(id) {
      this.$axios.post("/weixin-bjmc/getRxnfList?ZyId=" + id).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.RxnfList = data.data
        }
      })
    },

    // 获取班级列表
    getBjListByZyId(id, rxnf) {
      this.$axios.post("/weixin-bjmc/getBjList?ZyId=" + id + "&Rxnf=" + rxnf).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.BjList = data.data
        }
      })

    },

    // 选择学年
    changeXnxq() {
      this.Xnxq =  JSON.parse(JSON.stringify(this.XnxqOption))
      this.XnxqOption = this.Xnxq.qsrq
      if (!this.YxsList.length) {
        this.getYxsList()
      }
    },

    // 选择院系所
    changeYxs() {
      this.Yxs = JSON.parse(JSON.stringify(this.YxsOption))
      this.YxsOption = this.Yxs.dwmc
      
      // 清空专业列表
      this.ZyList = []
      this.ZyOption = ""
      this.RxnfOption = ""
      this.BjOption = ""
      this.XkList = []
      this.getZyListByYxsId(this.Yxs.dwh)
    },

    // 选择专业列表
    changeZy() {
      this.Zy = JSON.parse(JSON.stringify(this.ZyOption))
      this.ZyOption = this.Zy.zymc
      // 修改入学年份
      this.RxnfList = []
      this.RxnfOption = ""
      this.BjOption = ""
      this.XkList = []
      this.getRxnfListByZyId(this.Zy.zyh)
    },

    // 选择入学年份
    changeRxnf() {

      this.BjList = []
      this.BjOption = ""
      this.XkList = []

      // 根据专业号 获取班级
      this.getBjListByZyId(this.Zy.zyh, this.RxnfOption)
    },

    // 选择班级
    changeBj() {
      this.Bj = JSON.parse(JSON.stringify(this.BjOption))
      this.BjOption = this.Bj.bj

    },

    // 根据 学期， 班级号， 获取 实验室课表
    getXkListByXnxqAndBjId(xnxq, bjId) {
      this.$axios.post("/weixin-sysxk/xklist", {
          "Xnxq": xnxq,
          "BjId": bjId
      }).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.XkList = data.data
        }
      })
    },


    // 查询按钮
    queryBjLabSchedule() {
      console.log(this.Xnxq, this.Yxs, this.Zy, this.RxnfOption, this.Bj)
      if (this.XnxqOption && this.YxsOption && this.ZyOption && this.ZyOption && this.BjOption) {
        this.getXkListByXnxqAndBjId(this.Xnxq.xnxqh, this.Bj.bh)
      } else {
        ElMessage.error("请完成选择再查询")
      }
    },


  },

  computed: {
      getXkFilter() {
        return  this.XkList.map(t => {
          t['address'] = t.yxsmc + t.sysmph + "教室"
          t['time'] = "第" + t.kkzc + "周,周" + t.kkDay + " 、"+ this.sections[t.kkSection]
          return t
        }).filter( (data) => !this.search 
        || data.kcmc.includes(this.search.toLowerCase()) 
        || data.yxsmc.includes(this.search.toLowerCase())
        || data.sysmph.includes(this.search.toLowerCase())
        || data.jgmc.includes(this.search.toLowerCase()))
    },
  }
}
</script>

<style>


.el-button {
    /* display: inline-flex; */
  width: 6rem !important;
}

.el-select .el-input__inner {
    width: 8rem;
}
</style>
<style scoped>

/* a5d16d  */
* {
  margin: 0;
  padding: 0;
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