<template>
  <el-card class="account-container">
      <h3>查询自己的排课课表</h3>
      <el-divider />

       <br/>
      <el-scrollbar :always="true">
          <div style="display: flex; align-items: center;">
            <p style="margin-right: 1rem;">学期</p>
            <el-select v-model="XnxqOption" placeholder="选择学期" @change="changeXnxq" style="margin-right: 1rem">
              <el-option v-for="(item, index) in XnxqList" :key="index" :label="item.qsrq" :value="item"> </el-option>
            </el-select>
            <el-button type="primary" @click="QuerySchedule">查询课表</el-button>
            <el-button type="primary" @click="ExportSchedule">导出课表</el-button>
          </div>
      </el-scrollbar>
      <br/>

      <el-table :data="getXkFilter.slice((currentPage - 1)* pagesize, currentPage * pagesize)" style="width: 100%">
          <el-table-column type="index" ></el-table-column>
          <el-table-column label="课程名称" prop="kcmc"  ></el-table-column>
          <el-table-column label="教师" prop="jgmc" ></el-table-column>
          <el-table-column label="排课时间" prop="time" ></el-table-column>
          <el-table-column label="地点" prop="address" ></el-table-column>
          <el-table-column label="上课班级" prop="bj"></el-table-column>
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

    <el-dialog v-model="dialogVisible" title="排课管理" width="95%" :before-close="handleClose">
      <div style="text-align: center">
        <el-tooltip
          effect="customized"
          content="推荐使用谷歌浏览器,移动端部分浏览器可能不支持下载"
          placement="top"
        >
          <el-button type="primary" style="width: 6rem" @click.native.prevent="ExportPdf">下载课表</el-button>
        </el-tooltip>
      </div>

      <br>
      <el-divider><el-icon><i-star/></el-icon></el-divider>
      <!-- 打印pdf的内容 #197EDC -->
      <div id="pdfDom">
        <br>
        <div style="margin: 8px; border:2px solid #197EDC">
          <br>
          <el-container>
            <el-header>
              <div style="text-align: center; height: 2rem; width:100%" > 
                  <img style="height: 100%;" :src="logo" />
                  <h3 style="color: #197EDC">沈阳工业大学实验室课表</h3>
              </div>
            </el-header>
            <el-main>
              <el-divider></el-divider>
                <el-descriptions border :column="3" class="margin-top">
                <el-descriptions-item>
                  <template #label>
                  <div class="cell-item">
                    <el-icon> <i-user /></el-icon>教师名
                  </div>
                  </template> {{ this.userInfo.userrealname}}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon>
                        <i-tickets />
                      </el-icon>
                      学期
                    </div>
                  </template> {{ this.XnxqOption }}
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                  <div class="cell-item">
                    <el-icon> <i-clock /></el-icon>导出日期
                  </div>
                  </template> {{ this.getdate() }}
                </el-descriptions-item>
              </el-descriptions>

              <el-table :data="getXkFilter" border style="width: 100%">
                <el-table-column type="index" ></el-table-column>
                <el-table-column label="课程名称" prop="kcmc"  ></el-table-column>
                <el-table-column label="教师" prop="jgmc" ></el-table-column>
                <el-table-column label="排课时间" prop="time" ></el-table-column>
                <el-table-column label="地点" prop="address" ></el-table-column>
                <el-table-column label="上课班级" prop="bj"></el-table-column>
              </el-table>

            </el-main>
            <el-footer>
              <div style="margin-top: 20px; text-align: right">
                <el-divider><el-icon><i-star/></el-icon></el-divider>
                <div style="margin-top: 20px; color: #197EDC">沈工大排实验室课管理</div>
              </div>

            </el-footer>
          </el-container>
        </div> 
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { ref } from 'vue'
import { fromCode } from '@/utils/validate'
import jjdx from "@/assets/jjdx.png"
export default {
  setup() {
    const XnxqOption = ref("")
    const dialogVisible = ref(false)
    const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}
    return {
      XnxqOption,
      dialogVisible,
      handleClose,
    }
  },
  data() {
    return {
      
      // 分页
      currentPage: 1,
      pagesize: 10,
      sections: ["周次\\节", "1-2节", "3-4节", "5-6节", "7-8节", "9-10节"],

      userInfo: null,
      XnxqList: [],
      Xnxq: {},

      search: "",

      // 选课的结果
      XkList: [],
      xnxqh: "", //
      logo: jjdx,


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

    // 根据 学期， 教师id 获取 实验室课表
    getXkListByXnxqAndJgId(xnxq, JgId) {
      this.$axios.post("/weixin-sysxk/Jgpklist", {
          "Xnxq": xnxq,
          "JgId": JgId
      }).then(res => {
        const data = res.data
        this.xnxqh = xnxq
        if (data.code == 200) {
          this.XkList = data.data
          if (!this.XkList.length) {
            ElMessage.success("查询无数据")
          }
        }
      })
    },

    // 选择学年
    changeXnxq() {
      this.Xnxq =  JSON.parse(JSON.stringify(this.XnxqOption))
      this.XnxqOption = this.Xnxq.qsrq
    },

    QuerySchedule() {
      // 判断 是否 选择了学期
      if (this.XnxqOption) { 
        if (this.xnxqh != this.Xnxq.xnxqh) {
          Loading.show()
          this.getXkListByXnxqAndJgId(this.Xnxq.xnxqh, this.userInfo.useraccount)
          Loading.hide()
        }
      } else {
        ElMessage.error("请选择查询的学期")
      }  
    },

    ExportSchedule() {
      // 判断 是否有数据
      if (this.XnxqOption) {
        if (this.XkList.length) {
          this.dialogVisible = true
        } else {
          ElMessage.error("无数据导出，点击查询试试")
        }

      } else {
        ElMessage.error("请先选择学期，点击查询")
      }


    },

    ExportPdf() {
      this.$pdf.getPdf('pdfDom', "实验室课程表" + this.getdate().replace(/\s/g,""))
    },
    

    getdate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();

      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = year + " 年 " + month + " 月 " + strDate + " 日 ";
      return currentdate;
    },

  },

  computed: {
    getXkFilter() {
      return  this.XkList.map(t => {
        t['address'] = t.yxsmc + t.sysmph + "教室"
        t['time'] = "第" + t.kkzc + "周,周" + t.kkDay + " 、"+ this.sections[t.kkSection]
        t['bj'] = t.bjmcList.join('、')
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
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
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

.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
  height: 8px;
}
.margin-top {
  margin-top: 20px;
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