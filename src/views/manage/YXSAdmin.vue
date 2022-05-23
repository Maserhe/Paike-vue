<template>
    <el-card class="account-container">
      <h4>二级管理员管理</h4>
      <el-divider />
      <br/>
      <el-scrollbar>
        <div style="display: flex; align-items: center;">
        <p style="margin-right: 1rem;">学院</p>
            <el-select v-model="YxsOption" placeholder="选择学院" @change="changeYxs" style="margin-right: 1rem">
                <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
            </el-select>
            <el-button type="primary" style="display: inline-block" @click="addAdminDialog">添加管理员</el-button>

        </div>
      </el-scrollbar>
      <br/>
      
      <el-table :data="getAdminFilter" style="width: 100%">
        <el-table-column prop="userrealname" label="真实姓名" width="180" />
        <el-table-column prop="useraccount" label="账号" width="180" />
        <el-table-column prop="state" label="状态" width="180" />
        <el-table-column label="操作" width="300rem">
            <template #header>
            <el-input v-model="search" placeholder="输入二级管理员姓名、状态过滤" />
            </template>
            <template #default="scope" >
                <el-button type="danger" @click="deleteAdminButton(scope.row)">删除</el-button>
                <el-button v-if="scope.row.userenable == '1' " type="danger" @click="doAdminPowerButton(scope.row)">禁用</el-button>
                <el-button v-else type="primary" @click="undoAdminPowerButton(scope.row)">解封</el-button>
            </template>
        </el-table-column>
      </el-table>
    
      <!-- 添加 二级管理员 页面 -->
      <el-dialog v-model="adminDialogVisible" title="添加二级管理员" width="60%" :before-close="handleClose">
         <el-form ref="adminInfoRef" :model="addAdminInfo" :label-position="'left'" class="sys-form">
            <el-form-item label="管理员姓名" prop="userrealname" :rules="[{ required: true, message: '必需填写,例如: 张三' },]">
                <el-input v-model="addAdminInfo.userrealname" type="text" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员账号" prop="useraccount" :rules="[{ required: true, message: '必需填写,登陆账号' },]">
              <el-input v-model="addAdminInfo.useraccount" type="text" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="管理员密码" prop="userpasswd" :rules="[{ required: true, message: '必需填写,登陆密码' },]">
              <el-input v-model="addAdminInfo.userpasswd" type="password" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item>
                <div style="margin: 0 auto;">
                    <el-button type="primary" @click="addAdminButton('adminInfoRef')">添加</el-button>
                    <el-button @click="resetForm('adminInfoRef')">重置</el-button>
                </div>
            </el-form-item>
        </el-form>

      </el-dialog>

    </el-card>

</template>

<script>
import { ref } from 'vue'
export default {

    setup() {
        const YxsOption = ref("")
        const adminDialogVisible = ref(false)
        const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}

        return{
            YxsOption,
            handleClose,
            adminDialogVisible,
        }
    },

    data() {
        return {
            // 院系所信息
            YxsList: [],
            Yxs: {}, 

            // 二级管理员列表
            AdminList: [],

            // 添加二级管理员
            addAdminInfo: {
                yxsh: "",  // 院系所号
                useraccount: "", // 账号
                userpasswd: "", // 密码
                userrealname: "", // 用户的真实姓名
            },

            search: "",

        }
    },

    created() {
        this.getYxsList()
    },

    methods: {
        
        clearAdminInfo() { this.addAdminInfo = { yxsh: "", useraccount: "", userpasswd: "", userrealname: ""} },
        // 重置表单
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.clearAdminInfo()
        },

        // 选择院系所
        changeYxs() {
            this.Yxs = JSON.parse(JSON.stringify(this.YxsOption))
            this.YxsOption = this.Yxs.dwmc
            Loading.show()
            this.getYxsAdminListById(this.Yxs.dwh)
            Loading.hide()
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

        // 根据学院号 获取 二级管理员 列表
        getYxsAdminListById(id) {
            this.$axios.post("/weixin-yxsadmin/yxsAdminlist", {yxsh: id}).then(res=> {
                const data = res.data
                if (data.code == 200) {
                    this.AdminList = data.data
                }
            })
        },

        // 添加管理员 弹窗
        addAdminDialog() {
            if (Object.keys(this.Yxs).length == 0) {
                ElMessage.error("请选择学院,如果旁边选择框没有选项,请刷新页面")
                return false
            }
            this.clearAdminInfo()
            this.adminDialogVisible = true
        },

        // 添加管理员
        addAdminButton(formName) {
            this.addAdminInfo.yxsh = this.Yxs.dwh
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.post("/weixin-yxsadmin/addAdmin", this.addAdminInfo).then(res => {
                        const data = res.data
                        if (data.code == 200) {
                            ElMessage.success("添加二级管理员成功")
                        this.adminDialogVisible = false
                        this.getYxsAdminListById(this.Yxs.dwh)
                        }
                    })
                    } else {
                    ElMessage.error("表单不合法！！")
                }
            })

        },

        // 修改管理员状态
        changeAdminState(id, s) {
           this.$axios.post("/weixin-yxsadmin/changeState", { account: id, state: s}).then(res => {
               const data = res.data
               if (data.code == 200) {
                   ElMessage.success("状态修改成功")
                   Loading.show()
                   this.getYxsAdminListById(this.Yxs.dwh)
                   Loading.hide()
               }
           })
        },

        // 删除管理员
        deleteAdminButton(value) {
            this.$axios.post("/weixin-yxsadmin/delAdmin", { account: value.useraccount }).then(res => {
               const data = res.data
               if (data.code == 200) {
                   ElMessage.success("删除成功")
                   Loading.show()
                   this.getYxsAdminListById(this.Yxs.dwh)
                   Loading.hide()
               }
           })
        },

        // 禁用管理员
        doAdminPowerButton(value) {
            this.changeAdminState(value.useraccount, "0")
        },

        // 解封管理员
        undoAdminPowerButton(value) {
             this.changeAdminState(value.useraccount, "1")
        },
        

    },
    computed: {
        getAdminFilter() {
            return this.AdminList.map(t=> {
                t['state'] = t.userenable == "1" ? "正常": "禁用"
                return t
            }).filter( (data) => !this.search 
            || data.userrealname.includes(this.search.toLowerCase()) 
            || data.state.includes(this.search.toLowerCase()) 
            || data.useraccount.includes(this.search.toLowerCase()))  
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