<template>
  <el-card class="account-container">
    <h3>实验室管理</h3>
    <el-divider />
        <el-scrollbar>
          <div style="display: flex; align-items: center;">
            <p style="margin-right: 1rem;">学院</p>
            <!-- <label slot="lable" > 学院: </label> -->
              <el-select v-model="YxsOption" placeholder="Select" @change="changeYxs" style="width: 10rem; margin-right: 1rem">
                <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
              </el-select>
              <el-button type="primary" style="display: inline-block" @click="addSysDialog">添加实验室</el-button>
          </div>
        </el-scrollbar>

        <!-- 表格 -->
        <el-table :data="getSysFilter.slice((currentPage - 1)* pagesize, currentPage * pagesize)" style="width: 100%">
            <template #tableHead>
              <h1>hahaha</h1>
            </template>
            
            <el-table-column type="index" ></el-table-column>
            <el-table-column label="实验名称" prop="sysmc" width="220rem" ></el-table-column>
            <el-table-column label="门牌号" prop="sysmph" ></el-table-column>
            <el-table-column label="操作" width="300rem">
                <template #header>
                  <el-input v-model="search" placeholder="输入实验室门牌号、名称搜索" />
                </template>
                <template #default="scope" >
                    <el-button type="primary" @click="changeSysInfo(scope.row)">修改</el-button>
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

   <el-dialog v-model="dialogVisible" title="实验室信息" width="80%" :before-close="handleClose">
      <!-- 实验室表单, 修改实验室信息 -->
       <el-form ref="sysInfoRef" :model="SysInfo" :label-position="'top'" label-width="30rem">
         <el-form-item label="实验室的名称" prop="sysmc" :rules="[{ required: true, message: '非必需填写,例如: 人工智能实验室, 不填写的话默认名称: 机房' },]">
          <el-input v-model="SysInfo.sysmc" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="实验室门牌号" prop="sysmph" :rules="[{ required: true, message: '必需填写,表示实验室位置,例如: 205' },]">
          <el-input v-model="SysInfo.sysmph" type="text" autocomplete="off"></el-input>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="updateSysInfo('sysInfoRef')">更新</el-button>
          <el-button @click="resetForm('sysInfoRef')">重置</el-button>
        </el-form-item>
       </el-form>
  </el-dialog>

  <!--  添加实验室的对话框 -->
  <el-dialog v-model="addDialogVisible" title="添加实验室" width="80%" :before-close="handleClose">
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="单个添加" name="first">

          <el-form ref="addSysInfoRef" :model="addSysInfo" :label-position="'top'" label-width="30rem">
            <el-form-item label="实验室的名称" prop="sysmc" :rules="[{ required: false, message: '非必需填写,例如: 人工智能实验室, 不填写的话默认名称: 机房' },]">
              <el-input v-model="addSysInfo.sysmc" type="text" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="实验室门牌号" prop="sysmph" :rules="[{ required: true, message: '必需填写,表示实验室位置,例如: 205' },]">
              <el-input v-model="addSysInfo.sysmph" type="text" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSys('addSysInfoRef')">添加</el-button>
              <el-button @click="resetForm('addSysInfoRef')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="批量添加" name="second">
         <div style="text-align: center"> 
            <el-upload drag action="" :http-request="uploadCSVFile" :data="{ 'id': YxsId }">
                <el-icon class="el-icon--upload"><i-upload-filled /></el-icon>
                <div class="el-upload__text">拖拽文件到这或者<em>点击上传</em></div>
                <template #tip><div class="el-upload__tip">需要上传指定格式的csv文件,请先下载模版</div></template>
            </el-upload>
            <el-button type="primary" @click="downloadAttachRow">模版下载</el-button>
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
    const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}
    return {
      dialogVisible,
      handleClose,
      addDialogVisible,
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
        yxsh: "",   // 院系所号
        yxmc: "",   // 院系所名称
      },

      // 添加实验室 对话框
      activeName: "first",

      // 添加实验室
      addSysInfo: {
        sysmc: "",  // 实验室名称
        sysmph: "", // 实验室门牌号
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

    clearSysInfo() { this.SysInfo = {sysh: "", sysmc: "", sysmph: "", yxsh: "", yxmc: "", }},
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.clearSysInfo()
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
        this.getSysListById(item.dwh)
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
          this.getSysListById(this.YxsId)
        } else {
          ElMessage.error("删除错误")
        }
      })
    },
    // 修改实验室信息
    changeSysInfo(row) {
      this.SysInfo = null
      this.dialogVisible = true
      this.SysInfo = JSON.parse(JSON.stringify(row))
    },
    // 更新实验室信息接口
    updateSysInfo(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post("/weixin-syszk/updateSysInfo", {
            sysh: this.SysInfo.sysh,
            sysmc: this.SysInfo.sysmc,
            sysmph: this.SysInfo.sysmph,
          }).then(res => {
            const data = res.data
            if (data.code == 200) {
              ElMessage.success("更新数据成功")
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
            yxsh: this.YxsId,
            yxmc: this.YxsMc,
          }).then(res => {
            const data = res.data
            if (data.code == 200) {
              ElMessage.success("添加成功")
              // 刷新实验室 
              this.getSysListById(this.YxsId)
            } else {
              ElMessage.error(data.msg)
            }
          })
        }
      })
    },

    uploadCSVFile(params) {
      console.log(params)
    },

    /** 下载附件 */
    downloadAttachRow() {
      console.log("下载")
    },

  },
  
  // 计算属性
  computed: {
    getSysFilter() {
      return this.SysList.filter( (data) => !this.search || data.sysmc.includes(this.search.toLowerCase()) || data.sysmph.includes(this.search.toLowerCase()))
    },

  },

}
</script>

<style>
.el-upload-dragger {
  height: 10rem;
  width: 16rem;
}
</style>