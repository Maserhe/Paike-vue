<template>
    <el-card class="account-container">
    <h4>排课统计管理</h4>
    <el-divider />
    <br/>
    <el-descriptions column=2>
    <el-descriptions-item label="学院">{{ Yxs.dwmc }}</el-descriptions-item>
    <el-descriptions-item label="二级管理员">{{ userInfo.userrealname}} </el-descriptions-item>
    </el-descriptions>

    <el-scrollbar :always="true">

        <div style="display: flex; align-items: center;">
            <p style="margin-right: 1rem;">学期</p>
            <el-select v-model="XnxqOption" placeholder="选择学期" @change="changeXnxq" style="margin-right: 1rem">
              <el-option v-for="(item, index) in XnxqList" :key="index" :label="item.xnxqh" :value="item"> </el-option>
            </el-select>
        </div>
    </el-scrollbar>

    <!-- 弹窗 -->
    <el-table :data="getSysFilter.slice((syscurrentPage - 1)* syspagesize, syscurrentPage * syspagesize)" style="width: 100%">
    <el-table-column type="index" ></el-table-column>
    <el-table-column label="实验名称" prop="sysmc" ></el-table-column>
    <el-table-column label="门牌号" prop="sysmph" ></el-table-column>
    <el-table-column label="容量" prop="capacity" ></el-table-column>
    <el-table-column label="排课总数" prop="sum" ></el-table-column>

    <el-table-column label="状态" prop="state" >
        <template #header>
            <el-input v-model="syssearch" placeholder="输入实验室门牌号、名称、状态过滤" />
        </template>
    </el-table-column>
    <template #append>
        <el-pagination
        @size-change="syshandleSizeChange"
        @current-change="syshandleCurrentChange"
        :current-page="syscurrentPage"
        :page-sizes="[5, 10, 20, 40]" 
        :page-size="syspagesize"         
        layout="total, sizes, prev, pager, next, jumper"
        :total="getSysFilter.length">    
        </el-pagination>
    </template>
    </el-table>

    </el-card>
</template>

<script>
import { ref } from 'vue'
import { fromCode , getdate } from '@/utils/validate'
export default {

    setup() {
        
        const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}
        const XnxqOption = ref([])
        const dialogVisible = ref(false)
        return {
            XnxqOption,
            handleClose,
            dialogVisible,
        }
    },

  data() {
      return {

        // 实验室分页
        syscurrentPage: 1,
        syspagesize: 10,
        syssearch: "",


        // 搜索框
        YxsList: [],
        Yxs: {},

        // 学年学期信息
        XnxqList: [],
        Xnxq: {},

        // 实验室
        SysList: [],


      }
  },    

  created() {
    const user = sessionStorage.getItem("userInfo")
    if(user) {
        this.userInfo = JSON.parse(fromCode(user))      // 根据请求获取用户信息
    } else {
         this.$router.push("/login")
    }
    this.getYxsById(this.userInfo.yxsh)
    this.getXnxqList()
  },

  methods: {
    
    // 获取院系所信息
    getYxsById(value) {
      this.$axios.post("/weixin-yxs/yxsById", {id: value}).then(res => {
        const data = res.data
        if (data.code == 200) {
          this.Yxs = data.data
        }
      })
    },

     // 分页
    syshandleSizeChange: function (size) {
      this.syspagesize = size;
    },
    syshandleCurrentChange: function(currentPage){
      this.syscurrentPage = currentPage;
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
    
    // 获取实验室列表
    getSysListById(xnid, id) {
      this.$axios.post("/weixin-sysxk/syscountcourse", {xnxq: xnid, yxsh: id}).then(res=> {
        const data = res.data
        if (data.code == 200) {
          this.SysList = data.data
        }
      })
    },


    // 选择学年
    changeXnxq() {
      this.Xnxq =  JSON.parse(JSON.stringify(this.XnxqOption))
      this.XnxqOption = this.Xnxq.xnxqh
      Loading.show()

      this.getSysListById(this.Xnxq.xnxqh, this.userInfo.yxsh)

      Loading.hide()
    },


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
    }).filter( (data) => !this.syssearch 
    || data.sysmc.includes(this.syssearch.toLowerCase()) 
    || data.sysmph.includes(this.syssearch.toLowerCase()) 
    || data.state.includes(this.syssearch.toLowerCase()))
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