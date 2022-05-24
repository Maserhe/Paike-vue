<template>
    <el-card class="account-container">
      <h4>报修信息管理</h4>
      <br/>
      <el-descriptions column="2">
    <el-descriptions-item label="学院">{{ Yxs.dwmc }}</el-descriptions-item>
    <el-descriptions-item label="二级管理员">{{ userInfo.userrealname}} </el-descriptions-item>
  </el-descriptions>
      <el-divider />
        <br>
         <!-- 表格 -->
        <el-table :data="getSysFilter.slice((currentPage - 1)* pagesize, currentPage * pagesize)" style="width: 100%">

            <el-table-column type="index" ></el-table-column>
            <el-table-column label="实验名称" prop="sysmc" width="220rem" ></el-table-column>
            <el-table-column label="门牌号" prop="sysmph" ></el-table-column>
            <el-table-column label="容量" prop="capacity" ></el-table-column>
            <el-table-column label="状态" prop="state" ></el-table-column>

            <el-table-column label="操作" width="300rem">
                <template #header>
                  <el-input v-model="search" placeholder="输入实验室门牌号、名称过滤" />
                </template>
                <template #default="scope" >
                    <el-button type="primary" @click="repairSysDialog(scope.row)">维修管理</el-button>
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
        
         <!-- 弹出框 -->
        <el-dialog v-model="sysDialogVisible" title="报修信息管理" width="60%" :before-close="handleClose">
            
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="非设备维修" name="first">
                    <el-descriptions :column="1" border >
                        <el-descriptions-item><template #label><el-icon> <i-tickets /></el-icon>学院</template>{{ Yxs.dwmc }}</el-descriptions-item>
                        <el-descriptions-item><template #label><el-icon> <i-location-information /></el-icon>实验室门牌号</template>{{ Sys.sysmph }}</el-descriptions-item>
                        <el-descriptions-item><template #label><el-icon> <i-timer /></el-icon>实验室类型</template> {{ Sys.sysmc }}</el-descriptions-item>
                        
                        <el-descriptions-item v-if="Sys.info ==undefined"><template #label><el-icon> <i-remove-filled /></el-icon>故障描述</template> 无需维修 </el-descriptions-item>
                        <el-descriptions-item v-else><template #label><el-icon> <i-remove-filled /></el-icon>故障描述</template> {{ Sys.info }}</el-descriptions-item>
                    </el-descriptions>
                    <br/>
                    <div style="text-align: center" v-if="Sys.info !=undefined">
                        <el-button size="large" type="primary" style="width: 6rem" @click.native.prevent="sysRepairButton()" >维修</el-button>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="设备维修" name="second">
                    <el-table :data="sbTableInfo" style="width: 100%">
                        <el-table-column type="index" ></el-table-column>
                        <el-table-column label="设备名称" prop="sbmc" ></el-table-column>
                        <el-table-column label="设备状态" prop="state" ></el-table-column>
                        <el-table-column label="故障信息" prop="info" ></el-table-column>

                        <el-table-column label="操作">
                            <template #default="scope" >
                                <el-button type="primary" @click="sbRepairButton(scope.row.sbh)">维修</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>        
        </el-dialog>

    </el-card>
</template>

<script>
import { ref } from 'vue'
import { fromCode , getdate } from '@/utils/validate'
export default {

  setup() {
    const YxsOption = ref("")
    const sysDialogVisible = ref(false)
    const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}

    return{
        YxsOption,
        handleClose,
        sysDialogVisible,
    }
  },
  created() {
        const user = sessionStorage.getItem("userInfo")
        if(user) {
        this.userInfo = JSON.parse(fromCode(user))      // 根据请求获取用户信息
        } else {
        this.$router.push("/login")
        }
        this.getSysListById(this.userInfo.yxsh)
        this.getYxsById(this.userInfo.yxsh)
  },
  data() {
    
      return {
        
        userInfo: null,

        // 分页
        currentPage: 1,
        pagesize: 10,
        // 搜索框
        search: "",

        // 院系所信息
        Yxs: {}, 
        // 实验室列表
        SysList: [],
        Sys: {},

        activeName: "first",

        // 设备
        SbList: [],
        Sb: {},


      }
  },
  methods: {
    
    // 分页
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
    },

    // 选择院系所
    changeYxs() {
      this.Yxs = JSON.parse(JSON.stringify(this.YxsOption))
      this.YxsOption = this.Yxs.dwmc
      
      Loading.show()
      this.getSysListById(this.Yxs.dwh)
      Loading.hide()

    },
    
    // 获取院系所信息
    getYxsById(value) {
      this.$axios.post("/weixin-yxs/yxsById", {id: value}).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.Yxs = data.data
        }
      })
    },
    // 根据id获取实验室列表
    getSysListById(id) {
      this.$axios.post("/weixin-syszk/yxsFaultSysList", {id: id}).then(res=> {
        const data = res.data
        if (data.code == 200) {
          this.SysList = data.data
        }
      })
    },

    // 根据实验室id 获取 需要维修设备的列表
    getSbFaultList(id) {
        this.$axios.post("/weixin-sbzk/sbFaultSbList", {sysh: id}).then(res=> {
        const data = res.data
        if (data.code == 200) {
          this.SbList = data.data
        }
      })
    },

    // 打开实验室维修管理的对话框
    repairSysDialog(vaule) {
        this.Sys = JSON.parse(JSON.stringify(vaule))
        this.sysDialogVisible = true
        Loading.show()
        this.getSbFaultList(this.Sys.sysh)
        Loading.hide()
    },

    // 选择 维修设备类型
    handleClick(value) {
        if (value.props.name == "second") {
            // 获取 设备
            if (this.SbList.length == 0) {
                Loading.show()
                this.getSbFaultList(this.Sys.sysh)
                Loading.hide()
            }
        }
    },

    // 维修实验室
    sysRepairButton() {
        Loading.show()
        this.$axios.post("/weixin-syszk/repairSys", {sysh: this.Sys.sysh, info: "", systype: "0" }).then(res=> {
            const data = res.data
            if (data.code == 200) {
                ElMessage.success("维修成功")
                Loading.hide()
                // 刷新实验室列表
                this.sysDialogVisible = false
                Loading.show()
                this.getSysListById(this.Yxs.dwh)
                Loading.hide()
            }
        }).catch(error=> {
            Loading.hide()
        })
    },

    // 维修实验室的设备
    sbRepairButton(value) {
        Loading.show()
        this.$axios.post("/weixin-sbzk/repairSb", {sysh: this.Sys.sysh, info: "", sbzt: "0", sbh: value}).then(res=> {
            const data = res.data
            if (data.code == 200) {
                ElMessage.success("维修成功")
                Loading.hide()
                this.sysDialogVisible = false

                Loading.show()
                this.getSysListById(this.Yxs.dwh)
                Loading.hide()
            }
        }).catch(error=> {
            Loading.hide()
        })
    }

  },
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

      return this.SbList.map(t => {
        if(t.sbzt == 0) {
            t['state'] = "开放"
        } else if (t.sbzt == 1){
            t['state'] = "禁用"
        } else {
            t['state'] = "报修"
        }
        return t
      })
    }
  }
}
</script>

<style>
.el-button {
    /* display: inline-flex; */
  width: 6rem !important;
}
.el-select .el-input__inner {
    width: 10rem;
}
.el-form-item {
  margin-bottom: 18px !important;
}
</style>
<style scoped>

/* a5d16d  */
* {
  margin: 0;
  padding: 0;
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