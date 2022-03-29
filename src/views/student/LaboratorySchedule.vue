<template>
  <el-card class="account-container">
    <h3>实验室课表查询</h3>
    <el-divider />
      <!-- 搜索框 -->
      <el-scrollbar :always="true" >
          <div style="display: flex; align-items: center;">

            <p style="margin-right: 1rem;">学期</p>
           
            <p style="margin-right: 1rem;">学院</p>
           
            <p style="margin-right: 1rem;">实验室</p>
           
            <el-button type="primary"  size="large">查询</el-button>
          </div>
      </el-scrollbar>

    <br>
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
              <td v-for="chindex of 5" :key="chindex">
                 <div style v-if="courses[index][chindex - 1] &&  Object.keys(courses[index][chindex - 1]).length > 0 " @click="toScanDetail(courses[index][chindex - 1])">
                  {{ courses[index][chindex - 1].lessonsName }} <br />
                  {{ courses[index][chindex - 1].lessonsTeacher }}
                  <br />
                  {{ courses[index][chindex - 1].lessonsAddress }}
                </div>
                <div class="paike" v-else @click="paikeButton(index, chindex)">
                  <br />
                  <br />
                  点击排课
                </div>
              </td>
            </tr> 
          </tbody>
        </table>
      </div>
    </div>
    
  </el-card>
</template>

<script>
import { ElMessage } from 'element-plus';
export default {

  data() {
    return {

      sections: ["周次\\节", "1-2节", "3-4节", "5-6节", "7-8节", "9-10节"],
      weeks: ["周一", "周二", "周三", "周四", "周五","周六","周日"],
      courses: [
        [{ "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },
         {}, {},  { "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },],
        [],
        [],
        [],
        [],
        [],
        [{ "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },{ "id": 19, "classId": 2, "lessonsTime": "8:00-9:40", "lessonsName": "编译原理","lessonsAddress": "二教302", "lessonsTeacher": "吴老师", "lessonsRemark": "1-5,8-12周", "lessonsNumber": "一","weekday": "星期四" },],
      ],
    }
  },

  methods: {
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
      console.log(index, chindex)
    }
  },



}
</script>

<style>

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