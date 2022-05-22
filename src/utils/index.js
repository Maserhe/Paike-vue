export function localGet (key) {
    const value = window.localStorage.getItem(key)
    try {
      return JSON.parse(window.localStorage.getItem(key))
    } catch (error) {
      return value
    }
  }
  
  export function localSet (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  
  export function localRemove (key) {
    window.localStorage.removeItem(key)
  }
  
  // 判断内容是否含有表情字符，现有数据库不支持。
  export function hasEmoji (str = '') {
    const reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
    return str.match(reg) && str.match(reg).length
  }
  


export const pathMap = {
    login: '登录',
    home: '首页',
    introduce: '系统介绍',
    student_manage: '学生管理',
    teacher_manage: '教师管理',
    laboratory_manage: '实验室管理',
    class_schedule: '班级课表管理',
    export_schedule: '导出课表',
    laboratory_schedule: '实验室课表',
    repair_labs: '实验室报修',
    repair_info: '实验室报修管理'
}
  