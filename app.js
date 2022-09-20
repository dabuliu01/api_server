// 入口文件

// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// 导入定义验证规则的包
const joi = require('joi')

// 导入并配置 cors 跨域
// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 使用 express.static() 中间件，将 uploads 目录中的图片托管为静态资源
app.use('/uploads', express.static('./uploads'))

// 在处理函数中，需要多次调用 res.send() 向客户端响应 处理失败 的结果，为了简化代码，可以手动封装一个 res.cc() 函数
// 所有路由之前，声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数 (上游中间件挂载自定义的属性或方法，供下游中间件或路由共享)
app.use((req, res, next) => {
    // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
    res.cc = (err, status = 1) => {
        res.send({
            // 状态
            status,
            // 状态描述，判断 err 是 错误对象 还是 字符串
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 一定要在注册路由之前，配置解析 Token 的中间件
// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
// const { expressjwt: expressJWT } = require('express-jwt')  新版express-jwt 包 使用这种导入方式
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证   以 /api/ 开头的不需要进行 Token 的身份认证
// app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))   新版express-jwt 包 使用这种使用方式
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入并使用用户路由模块
const userRouter = require('./router/user')
// 使用app.use() 将userRouter 注册为路由模块，并添加访问前缀
app.use('/api', userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)

// 导入并使用文章管理路由模块
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)

// 定义错误级别的中间件
// 注意：错误级别的中间件，必须注册在所有路由之后！
app.use((err, req, res, next) => {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 上行代码一定要加return, 不然就会连续调用两次res.cc, 也就是连续两次调用了res.send，但在express 中不能连续调用两次res.send
    // 捕获身份认证失败的错误
    if (err.name === 'UnanthorizedError') return res.cc('身份认证失败！')
    // 未知错误
    res.cc(err)
})

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007')
})