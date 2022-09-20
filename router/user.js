// 后端里的路由，只负责提供客户端的请求和服务器端处理函数之间的映射关系，真正的处理过程应该定义到对应的处理函数模块中

// 注册登录路由模块

const express = require('express')
// 创建路由实例对象
const router = express.Router()

// 导入用户路由处理函数对应的模块
const user_handler = require('../router_handler/user')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入需要的验证规则对象
// require('../schema/user') 得到的是 exports 对象，但这只需要exports 中的reg_login_schema 属性，所以使用解构赋值
const { reg_login_schema } = require('../schema/user')
// 对象解构允许我们使用变量的名字匹配对象的属性 匹配成功 将对象属性的值赋值给变量

// 注册新用户
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

// 将路由对象共享出去
module.exports = router