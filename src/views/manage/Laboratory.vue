<template>
  <el-card class="account-container">
    <h4>实验室管理</h4>
    <el-divider />
    <br/>
        <el-scrollbar>
          <div style="display: flex; align-items: center;">
            <p style="margin-right: 1rem;">学院</p>
              <el-select v-model="YxsOption" placeholder="Select" @change="changeYxs" style="margin-right: 1rem">
                <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
              </el-select>
              <el-button type="primary" style="display: inline-block" @click="addSysDialog">添加实验室</el-button>
          </div>
        </el-scrollbar>

        <!-- 表格 -->
        <el-table :data="getSysFilter.slice((currentPage - 1)* pagesize, currentPage * pagesize)" style="width: 100%">

            <el-table-column type="index" ></el-table-column>
            <el-table-column label="实验名称" prop="sysmc" width="220rem" ></el-table-column>
            <el-table-column label="门牌号" prop="sysmph" ></el-table-column>
            <el-table-column label="容量" prop="capacity" ></el-table-column>
            <el-table-column label="状态" prop="state" ></el-table-column>

            <el-table-column label="操作" width="300rem">
                <template #header>
                  <el-input v-model="search" placeholder="输入实验室门牌号、名称、状态过滤" />
                </template>
                <template #default="scope" >
                    <el-button type="primary" @click="changeSysInfo(scope.row)">管理</el-button>
                    <el-popconfirm title="确定要删除该实验室?" @confirm="deleteSysById(scope.row.sysh)">
                      <template #reference>
                        <el-button type="danger" >删除</el-button>
                      </template>
                    </el-popconfirm>
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
              :total="getSysFilter.length">    
              </el-pagination>
          </template>
        </el-table>

   <el-dialog v-model="dialogVisible" title="实验室管理" width="60%" :before-close="handleClose">
      <!-- 实验室表单, 修改实验室信息 -->
    <el-tabs @tab-click="tabsClick" v-model="manageActiveName">
      <el-tab-pane label="修改实验室信息" name="first">
        <el-form ref="sysInfoRef" :model="SysInfo" :label-position="'left'" class="sys-form">
         <el-form-item label="实验室的名称" prop="sysmc" :rules="[{ required: true, message: '必需填写,例如: 人工智能实验室, 例如: 机房' },]">
          <el-input v-model="SysInfo.sysmc" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实验室门牌号" prop="sysmph" :rules="[{ required: true, message: '必需填写,表示实验室位置,例如: 205' },]">
          <el-input v-model="SysInfo.sysmph" type="text" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="实验室的容量" prop="capacity" :rules="[{ required: true, message: '必需填写,实验室的人数,例如: 40' },]">
          <el-input v-model="SysInfo.capacity" type="number" min="0" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="实验室的类型" :rules="[{ required: true, message: '必需选择，默认开放'},]">
          <el-radio-group v-model="SysInfo.systype">
            <el-radio :label="'0'">开放</el-radio>
            <el-radio :label="'1'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <div style="margin: 0 auto;">
            <el-button type="primary" @click="updateSysInfo('sysInfoRef')">更新</el-button>
            <el-button @click="resetForm('sysInfoRef')">重置</el-button>
        </div>
        </el-form-item>
       </el-form>
      </el-tab-pane>
      <el-tab-pane label="设备管理" name="second">
        <el-table :data="sbTableInfo" style="width: 100%">

            <el-table-column type="index" ></el-table-column>
            <el-table-column label="设备名称" prop="sbmc" width="220rem" ></el-table-column>
            <el-table-column label="设备状态" prop="state" width="220rem" ></el-table-column>
            <el-table-column label="操作" width="300rem">
               
                <template #default="scope" >
                    <!-- <el-button type="primary" @click="deleteDevice(scope.row.sbh)">管理</el-button> -->
                    <el-popconfirm title="确定要删除该实验室?" @confirm="deleteDevice(scope.row.sbh)">
                      <template #reference>
                        <el-button type="danger" >删除</el-button>
                      </template>
                    </el-popconfirm>
                </template>
            </el-table-column>

        </el-table>


      </el-tab-pane>
      <el-tab-pane label="添加设备" name="third">
        <el-form ref="addSbInfoRef" :model="addSbInfo" :label-position="'left'" class="sys-form" >
            <el-form-item label="设备的名称" prop="sysmc" :rules="[{ required: true, message: '必需填写,例如: 投影仪' },]">
              <el-input v-model="addSbInfo.sbmc" type="text" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="设备的状态" :rules="[{ required: true, message: '必需选择，默认开放'},]">
            <el-radio-group v-model="addSbInfo.sbzt">
              <el-radio :label="'0'">正常</el-radio>
              <el-radio :label="'1'">故障</el-radio>
            </el-radio-group>
          </el-form-item>

            <el-form-item>
              <div style="margin: 0 auto;">
                <el-button type="primary" @click="addSb()">添加</el-button>
                <el-button @click="resetForm('addSbInfoRef')">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
      </el-tab-pane>
    </el-tabs>


  </el-dialog>

  <!--  添加实验室的对话框 -->
  <el-dialog v-model="addDialogVisible" title="添加实验室" width="60%" :before-close="handleClose">
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="单个添加" name="first">

          <el-form ref="addSysInfoRef" :model="addSysInfo" :label-position="'left'" class="sys-form" >
            <el-form-item label="实验室的名称" prop="sysmc" :rules="[{ required: true, message: '非必需填写,例如: 人工智能实验室, 不填写的话默认名称: 机房' },]">
              <el-input v-model="addSysInfo.sysmc" type="text" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实验室门牌号" prop="sysmph" :rules="[{ required: true, message: '必需填写,表示实验室位置,例如: 205' },]">
              <el-input v-model="addSysInfo.sysmph" type="text" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="实验室的容量" prop="capacity" :rules="[{ required: true, message: '必需填写,实验室的人数,例如: 40' },]">
              <el-input v-model="addSysInfo.capacity" type="number" min="0" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="实验室的类型" :rules="[{ required: true, message: '必需选择，默认开放'},]">
            <el-radio-group v-model="addSysInfo.systype">
              <el-radio :label="'0'">开放</el-radio>
              <el-radio :label="'1'">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

            <el-form-item>
              <div style="margin: 0 auto;">
                <el-button type="primary" @click="addSys('addSysInfoRef')">添加</el-button>
                <el-button @click="resetForm('addSysInfoRef')">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="批量添加" name="second">
         <div style="text-align: center"> 
            <el-upload drag action="" :http-request="uploadCSVFile" :limit="1"  accept=".csv">
                <el-icon class="el-icon--upload"><i-upload-filled /></el-icon>
                <div class="el-upload__text">拖拽文件到这或者<em>点击上传</em></div>
                <template #tip><div class="el-upload__tip">需要上传指定格式的csv文件,请先下载模版,仿照着写</div></template>
            </el-upload>
            <el-button type="primary">
            <a href="/addLabs.csv" download="addLabs.csv">模版下载</a>
            </el-button>
        </div>
        </el-tab-pane>
      </el-tabs>
  </el-dialog>

  </el-card>
</template>


<script>
import { ref } from 'vue'
export default {

  setup() {
    const dialogVisible = ref(false)
    const addDialogVisible = ref(false)
    const manageActiveName = ref("first")
    const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}
    return {
      dialogVisible,
      handleClose,
      addDialogVisible,
      manageActiveName,
    }
  },

  data() {
    return {
      // 分页
      currentPage: 1,
      pagesize: 10,

      // 搜索框
      search: "",

      // 院系所信息
      YxsList: [],
      YxsOption: "选择学院",
      // 选择的院系所id
      YxsId: "", 
      YxsMc: "",

      // 实验室信息
      SysList: [],

      // 实验室信息 修改实验室信息使用
      SysInfo: {
        sysh: "",   // 实验室号
        sysmc: "",  // 实验室名称
        sysmph: "", // 实验室门牌号
        systype: "",

        yxsh: "",   // 院系所号
        yxmc: "",   // 院系所名称
      },

      // 添加实验室 对话框
      activeName: "first",

      // 添加实验室
      addSysInfo: {
        sysmc: "",  // 实验室名称
        sysmph: "", // 实验室门牌号
        capacity: "", // 实验室的人数
        systype: '0', // 实验室的状态
      },
      
      // 设备列表
      sbList: [],

      // 添加设备
      addSbInfo: {
        sysh: "", // 实验室号
        sbmc: "", // 设备名称
        sbzt: '0', // 设备 状态
      }

    }
  },
  created() {
    this.getYxsList()
  },

  methods: {

    handleClick(tab, event){
      console.log(tab, event)
    },

    clearSysInfo() { this.SysInfo = {sysh: "", sysmc: "", sysmph: "", yxsh: "", yxmc: "", capacity: "", systype: 0}},
    claearAddSbInfo() { this.addSbInfo = { sysh: "", sbmc: "", sbzt: "0"}},
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.clearSysInfo()
      this.claearAddSbInfo()
    },
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
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
    changeYxs(item) {
      if (item.dwh) {
        this.YxsOption = item.dwmc
        this.YxsId = item.dwh
        this.YxsMc = item.dwmc
        Loading.show()
        this.getSysListById(item.dwh)
        Loading.hide()
      } else {
        ElMessage.error("请选择学院")
      }
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
    // 删除实验室
    deleteSysById(id) {
      this.$axios.post("/weixin-syszk/deleteById?id=" + id).then(res=> {
        const data = res.data
        if (data.code == 200) {
          ElMessage.success("删除成功")
          Loading.show()
          this.getSysListById(this.YxsId)
          Loading.hide()
        } else {
          ElMessage.error("删除错误")
        }
      })
    },
    // 修改实验室信息
    changeSysInfo(row) {
      this.SysInfo = null
      this.dialogVisible = true
      console.log(JSON.parse(JSON.stringify(row)))
      this.SysInfo = JSON.parse(JSON.stringify(row))

      // 刷新 设备列表
      Loading.show()
      this.devicelist(this.SysInfo.sysh)
      Loading.hide()
    },


    // 更新实验室信息接口
    updateSysInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/weixin-syszk/updateSysInfo", {
            sysh: this.SysInfo.sysh,
            sysmc: this.SysInfo.sysmc,
            sysmph: this.SysInfo.sysmph,
            capacity: this.SysInfo.capacity,
            systype: this.SysInfo.systype,

          }).then(res => {
            const data = res.data
            if (data.code == 200) {
              ElMessage.success("更新数据成功")
              this.dialogVisible = false
              this.getSysListById(this.YxsId)
            }
          })
        } else {
          ElMessage.error("表单不合法！！")
        }
      }) 
    }, 
    // 添加实验室 对话框
    addSysDialog() {
      if (!this.YxsId) {
        ElMessage.error("请选择学院,如果旁边选择框没有选项,请刷新页面")
        return false
      }
      this.addDialogVisible = true
    },

    // 单个添加 实验室
    addSys(formName) {
      // 参数校验
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/weixin-syszk/addSys", {
            sysmc: this.addSysInfo.sysmc,
            sysmph: this.addSysInfo.sysmph,
            capacity: this.addSysInfo.capacity,
            systype: this.addSysInfo.systype,
            yxsh: this.YxsId,
            yxmc: this.YxsMc,
          }).then(res => {
            const data = res.data
            if (data.code == 200) {
              ElMessage.success("添加成功")
              // 刷新实验室 
              Loading.show()
              this.getSysListById(this.YxsId)
              Loading.hide()
              this.addDialogVisible = false
            } else {
              ElMessage.error(data.msg)
            }
          })
        }
      })
    },

    // 上传csv文件批量上传 文件
    uploadCSVFile(params) {
      const file = params.file
      
      let formData = new FormData()
      formData.append("file", file)
      formData.append("YxsId", this.YxsId)
      formData.append("YxsMc", this.YxsMc)

      console.log(formData)
      this.$axios({url: "/weixin-syszk/addSYSList", method: "post", data: formData, headers: { 'Content-Type': 'multipart/form-data'}}).then(res=> {
        const data = res.data
        if (data.code == 200) {
          ElMessage.success("添加成功")
          location.reload()
        } else {
          ElMessage.error(data.msg)
        }
      })
    },

    // 添加设备
    addSb() {
      if (this.SysInfo.sysh != "") {
        this.addSbInfo.sysh = this.SysInfo.sysh
        Loading.show()
        this.addDevice()
        Loading.hide()
        this.claearAddSbInfo()
      }
    },

    // 获取 设备列表
    devicelist(id) {
      this.$axios.post("/weixin-sbzk/deviceList", {sysh: id}).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.sbList = data.data
        } else {
          ElMessage.error("获取设备列表失败")
        }
      })
    },
    // 删除设备
    deleteDevice(id) {
      this.$axios.post("/weixin-sbzk/deleteDevice", {sbh: id}).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.devicelist(this.SysInfo.sysh)
          ElMessage.success("删除成功")
        }
      })
    },

    // 添加设备
    addDevice() {
      if (this.addSbInfo.sbmc !="" && this.addSbInfo.sysh !="" && this.addSbInfo.sbzt != "") {
        this.$axios.post("/weixin-sbzk/addDevice", this.addSbInfo).then(res=> {
          const data = res.data
          if (data.code == 200) {
            ElMessage.success("添加成功")
            this.devicelist(this.SysInfo.sysh)
          }
        })
      } else {
        ElMessage.error("请填写设备信息")
      }
    },

    tabsClick(tab) {
    }
  },
  

  // 计算属性
  computed: {
    getSysFilter() {

      return this.SysList.map(t => {
        if(t.systype == 0) {
          t['state'] = "开放"
        } else if (t.systype == 1){
          t['state'] = "禁用"
        } else {
          t['state'] = "报修"
        }
        return t
      }).filter( (data) => !this.search 
      || data.sysmc.includes(this.search.toLowerCase()) 
      || data.sysmph.includes(this.search.toLowerCase()) 
      || data.state.includes(this.search.toLowerCase()))
    },
    sbTableInfo() {
      return this.sbList.map(t=> {
        t['state'] = t.sbzt == "0" ? "正常": "故障"
        return t
      })
    }
  },

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
.el-form-item {
  margin-bottom: 18px !important;
}
</style>
<style scoped>

* {
  margin: 0;
  padding: 0;
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


.sys-form {
  position: relative;
  width: 800px;
  max-width: 100%;
  padding: 35px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}
</style>