
export function transElIconName(iconName){
  return 'i'+iconName.replace(/[A-Z]/g,(match)=>'-'+match.toLowerCase())
}


/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  if (str.trim() && str.trim().length > 0) {
    return true
  } 
  return false
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * 对字符串进行加密
 * @param {String} str 
 * @returns 
 */
export function toCode(str) {
   //定义密钥，36个字母和数字
   var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var l = key.length;  //获取密钥的长度
   var a = key.split("");  //把密钥字符串转换为字符数组
   var s = "",b, b1, b2, b3;  //定义临时变量
   for (var i = 0; i <str.length; i ++) {  //遍历字符串
       b = str.charCodeAt(i);  //逐个提取每个字符，并获取Unicode编码值
       b1 = b % l;  //求Unicode编码值得余数
       b = (b - b1) / l;  //求最大倍数
       b2 = b % l;  //求最大倍数的于是
       b = (b - b2) / l;  //求最大倍数
       b3 = b % l;  //求最大倍数的余数
       s += a[b3] + a[b2] + a[b1];  //根据余数值映射到密钥中对应下标位置的字符
   }
   return s;  //返回这些映射的字符
}

/**
 * 对字符串进行解密
 * @param {String} str 
 * @returns 
 */
export function fromCode(str) {

  //定义密钥，36个字母和数字
  var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var l = key.length;  //获取密钥的长度
  var b, b1, b2, b3, d = 0, s;  //定义临时变量
  s = new Array(Math.floor(str.length / 3));  //计算加密字符串包含的字符数，并定义数组
  b = s.length;  //获取数组的长度
  for (var i = 0; i < b; i ++) {  //以数组的长度循环次数，遍历加密字符串
      b1 = key.indexOf(str.charAt(d));  //截取周期内第一个字符串，计算在密钥中的下标值
      d ++;
      b2 = key.indexOf(str.charAt(d));  //截取周期内第二个字符串，计算在密钥中的下标值
      d ++;
      b3 = key.indexOf(str.charAt(d));  //截取周期内第三个字符串，计算在密钥中的下标值
      d ++;
      s[i] = b1 * l * l + b2 * l + b3  //利用下标值，反推被加密字符的Unicode编码值
  }
  b = eval("String.fromCharCode(" + s.join(',') + ")");
  return b ;  //返回被解密的字符串

}

export function  getdate() {
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
}