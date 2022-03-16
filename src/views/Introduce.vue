<template>
  <el-card class="account-container">
    <h1>系统简介</h1>
<p>确定需要的数据库表：</p>

<p>1， 院系所表 YXS</p>

<p>2,   专业名称表 ZYMC. </p>

<p>3，课程总库表 KCZK</p>

<p>4,   班级名称表 BJMC</p>

<p>// 5，学生课表表 XSKB  课程教学班号 -》 学生号</p>

<p>// 6,   教师课表 JSKB.  课程教学班号 -》 教工号</p>

<p>7，用户表 USER</p>

<p>8,   学期周次表 GGJXZL</p>

<p>9， 学生名单表 XSMD</p>

<p>10,  学生选课 XSXK</p>

<p>学生 - 》 所选课程 -〉老师</p>

<p>自己创建的表</p>

<p>9， 实验室总库表 SYSZK</p>

<p>10,  实验室选课表 SYSXK</p>

<p>院系表、专业表、课程信息表、班级表、学生选课表、</p>

<p>专业 = &gt; 院系</p>

<p>班级 = &gt; 院系、专业</p>

<p>学号(学生选课表) = &gt;  上课的班级 、 课程号、 班级名 、（课程名称、教师姓名 区别？？？）、学期</p>

<p>Jskb. 老师号 = &gt; 上课的班级、</p>

<p>实验室信息表</p>

<p>实验室号，实验室门牌号，YXSH所属院系的编号,  yxmc院系名称， 就行了。</p>

<p>学生功能： 查表， 各种查询</p>

<p>老师功能： 选择实验室， 选定日期。</p>

<p>管理员功能： 1, 导入实验室的信息， 对实验室的信息 增删改查</p>

<p>​						2,  </p>

<p></p>

<p>YXS院系表</p>

<p><img alt="截屏2022-03-15 上午11.12.56" src="https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202203151113110.png"/></p>

<p>ZYMC专业表</p>

<p><img alt="截屏2022-03-15 上午11.14.36" src="https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202203151114708.png"/></p>

<p>KCZK课程表</p>

<p><img alt="截屏2022-03-15 上午11.15.23" src="https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202203151115845.png"/></p>

<p>BJMC 班级表</p>

<p><img alt="截屏2022-03-15 上午11.15.52" src="https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202203151115909.png"/></p>

<p>学生选课  xskb</p>

<p><img alt="截屏2022-03-15 下午12.21.49" src="https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202203151221763.png"/></p>

<p>学期周次表 GGjxzl</p>

<p><img alt="截屏2022-03-15 上午11.28.01" src="https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202203151128282.png"/></p>

<p>老师选课 jskb</p>

<p><img alt="截屏2022-03-15 上午11.29.47" src="https://ghproxy.com/https://github.com/Maserhe/PIc-Bed/blob/master/typora/202203151129859.png"/></p>
    
  </el-card>
</template>

<script>
export default {
  name: 'Introduce',
  setup() {
  }
}
</script>
<style scoped>

</style>