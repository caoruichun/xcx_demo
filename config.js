/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la
//var host = "hezhihao.zhengan001.com";
var host = "http://v.juhe.cn/dream/category";
var config = {
  // 下面的地址配合云端 Server 工作
  host,
  // 登录地址，用于建立会话
  loginUrl: `${host}?key=1763de4de5d45554e9a7177763a8e196`,
};

module.exports = config