<template>
  <el-card class="account-container">
      <h4>申请实验室报修</h4>
      <el-divider />
     <!-- 学院， 实验室， 设备 -->
    <br/>
      <el-scrollbar :always="true">
          <div style="display: flex; align-items: center;">
            <p style="margin-right: 1rem;">学院</p>
            <el-select v-model="YxsOption" placeholder="选择学院" @change="changeYxs" style="margin-right: 1rem">
              <el-option v-for="(item, index) in YxsList" :key="index" :label="item.dwmc" :value="item"> </el-option>
            </el-select>
            <p style="margin-right: 1rem;">实验室</p>
            <el-cascader placeholder="选择实验室" v-model="SysCascaderOption" :options="getSysCascader" @change="changeCascader"  style="margin-right: 1rem" filterable />
            <el-button type="danger" @click="applySysRepair">其他报修</el-button>
          </div>
    </el-scrollbar>

    <el-table :data="sbTableInfo.slice((currentPage - 1)* pagesize, currentPage * pagesize)" style="width: 100%">

        <el-table-column type="index" ></el-table-column>
          <el-table-column label="设备名称" prop="sbmc" width="220rem" ></el-table-column>
          <el-table-column label="设备状态" prop="state" width="220rem" ></el-table-column>
          <el-table-column label="故障信息" prop="info" width="220rem" ></el-table-column>


          <el-table-column label="操作" width="300rem">
            <template #header>
              <el-input v-model="search" placeholder="输入设备名称搜索" />
            </template>

            <template #default="scope">
              <el-button type="danger" v-if="scope.row.sbzt == 0" @click="applyRepair(scope.row)" text >报修</el-button>
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
            :total="sbTableInfo.length">    
            </el-pagination>
        </template>
      </el-table>


      <el-dialog v-model="repairDialogVisible" title="申请设备报修" width="40%" :before-close="handleClose">
        <el-descriptions :column="1" border >
        <el-descriptions-item><template #label><el-icon> <i-tickets /></el-icon>学院</template>{{ Yxs.dwmc }}</el-descriptions-item>
        <el-descriptions-item><template #label><el-icon> <i-location-information /></el-icon>实验室</template>{{ Sys.sysmph }} {{ Sys.sysmc }}</el-descriptions-item>
        <el-descriptions-item><template #label><el-icon> <i-timer /></el-icon>设备</template> {{ Sb.sbmc }}</el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <br/>
      <div style="display: flex; align-items: center;">
      <span>故障信息</span>
      <el-input  style="margin-right: 1rem"
        v-model="SbgzInfo"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="必需输入"
      />
    </div>
    <br/>
    <div style="text-align: center">
      <el-button size="large" type="primary" style="width: 6rem" @click.native.prevent="applyRepairButton()" >确定</el-button>
    </div>

      </el-dialog>

    <el-dialog v-model="repairSysDialogVisible" title="申请实验室报修" width="40%" :before-close="handleClose">
        <el-descriptions :column="1" border >
        <el-descriptions-item><template #label><el-icon> <i-tickets /></el-icon>学院</template>{{ Yxs.dwmc }}</el-descriptions-item>
        <el-descriptions-item><template #label><el-icon> <i-location-information /></el-icon>实验室门牌号</template>{{ Sys.sysmph }}</el-descriptions-item>
        <el-descriptions-item><template #label><el-icon> <i-timer /></el-icon>实验室类型</template> {{ Sys.sysmc }}</el-descriptions-item>
      </el-descriptions>
      <br/>
      <div style="display: flex; align-items: center;">
      <span>故障信息</span>
      <el-input  style="margin-right: 1rem"
        v-model="SysgzInfo"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="textarea"
        placeholder="必需输入"
      />
    </div>
    <br/>
    <div style="text-align: center">
      <el-button size="large" type="primary" style="width: 6rem" @click.native.prevent="sysRepairButton()" >确定</el-button>
    </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const YxsOption = ref("")
    const SysCascaderOption = ref([])

    const repairDialogVisible = ref(false)
    const repairSysDialogVisible = ref(false)
    const handleClose = (done) => { ElMessageBox.confirm('确定关闭对话框?', '温馨提示', {type: 'info',center: true}).then(() => { done() })}


    return {
      YxsOption,
      SysCascaderOption,
      repairDialogVisible,
      handleClose,
      repairSysDialogVisible,
    }
  },  

  data() {
    return {
      // 分页
      currentPage: 1,
      pagesize: 10,

      // 搜索框
      search: "",

      // 院系所
      YxsList: [],
      Yxs: {}, 
      
      // 选择实验室
      SysList: [],
      Sys: {},

      // 设备列表
      sbList: [],

      // 选择的 设备
      Sb: {},
      // 设备故障信息
      SbgzInfo: "",
      //  实验室故障信息
      SysgzInfo: "",

    }
  },
  created() {
    this.getYxsList()
  },
  methods: {

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

    // 根据id获取实验室列表
    getSysListById(id) {
      this.$axios.get("/weixin-syszk/getById?id=" + id).then(res=> {
        const data = res.data
        if (data.code == 200) { 
          this.SysList = data.data
        }
      })
    },
    
    // 选择院系所
    changeYxs() {
      this.Yxs = JSON.parse(JSON.stringify(this.YxsOption))
      this.YxsOption = this.Yxs.dwmc
      this.SysCascaderOption = ""
      Loading.show()
      this.getSysListById(this.Yxs.dwh)
      Loading.hide()
    },
    
    // 选择实验室
    changeCascader(value) {
      // 获取实验室的信息 
      this.Sys = JSON.parse(JSON.stringify( this.SysList.find(t=> t.sysh == value[1]) ))
      Loading.show()
      this.devicelist(this.Sys.sysh)
      Loading.hide()
    },
    // 修理设备弹窗
    applyRepair(vlaue) {
     this.Sb = JSON.parse(JSON.stringify(vlaue))
     this.repairDialogVisible = true
    },

    // 修理设备 按钮 
    applyRepairButton() {
      if (this.SbgzInfo != "") {
        this.$axios.post("/weixin-sbzk/repairSb", { sbh: this.Sb.sbh, info: this.SbgzInfo, sbzt: "2", sysh: this.Sys.sysh }).then(res=> {
          const data = res.data
          if (data.code == 200) {
            ElMessage.success("申请成功")
            // 更新设备列表
            this.devicelist(this.Sys.sysh)
            this.SbgzInfo = ""
            this.repairDialogVisible = false
          }
        })
      } else {
        ElMessage.error("填写故障信息")
      }
    },


    applySysRepair() {
      if (Object.keys(this.Sys).length == 0) {
        ElMessage.error("请先选择实验室")
      } else {
        console.log(this.Sys)

        if (this.Sys.systype == "1"){
          ElMessage.error("该实验室已经被禁用")
        } else if (this.Sys.info != null && this.Sys.info != ""){
          ElMessage.error("该实验室已经申请过了报修")
        } else {
          this.repairSysDialogVisible = true
        }
      }
    },

    // 实验室 设备报修按钮
    sysRepairButton() {
      if (this.SysgzInfo != "") {
        this.$axios.post("/weixin-syszk/repairSys", { sysh: this.Sys.sysh, systype: "2", info: this.SysgzInfo }).then(res => {
          const data = res.data
          if (data.code == 200) {
            ElMessage.success("报修申请提交成功")
            this.repairSysDialogVisible = false

      
            this.SysCascaderOption = []
            // 获取实验室的 列表
            Loading.show()
            this.getSysListById(this.Yxs.dwh)
            Loading.hide()

          }
        }).catch((error) => {
          ElMessage.error(error)
        })
      } else {
        ElMessage.error("填写故障信息")
      }
    }


  },
  computed: {
    getSysCascader() {
      let ans = []
      var mp = new Map()
      this.SysList.map(t => {
        if(mp.has(t.sysmc)) {
          var temp = mp.get(t.sysmc)
          temp.children.push({value: t.sysh, label: t.sysmph})
        } else {
          var temp = {}
          temp.value = t.yxsh
          temp.label = t.sysmc
          temp.children = [{ value: t.sysh, label: t.sysmph }]
          mp.set(t.sysmc, temp)
          ans.push(temp)
        }
      })
      return ans
    },

    sbTableInfo() {
      return this.sbList.map(t=> {
        if(t.sbzt == 0) {
          t['state'] = "开放"
        } else if (t.sbzt == 1){
          t['state'] = "禁用"
        } else {
          t['state'] = "报修"
        }
        return t
      }).filter( (data) => !this.search 
        || data.sbmc.includes(this.search.toLowerCase()) 
      )
    }
  }
}
</script>

<style>
.el-button {
    /* display: inline-flex; */
  width: 6rem !important;
}
</style>
<style scoped>

/* a5d16d  */
* {
  margin: 0;
  padding: 0;
}

</style>