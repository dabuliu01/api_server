/**
 * 在这里定义和用户注册登录相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')

// 导入加密包bcrypt.js
const bcrypt = require('bcryptjs')

// 导入jsonwebtoken 包   用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')

// 导入全局的配置文件
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
    // 接收客户端提交到服务器的表单数据
    const userinfo = req.body
    // 对表单中的数据，进行合法性校验
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({ status: 1, message: '用户名或密码不能为空！' })
    //     return res.cc('用户名或密码不能为空！')
    // }

    // 定义SQL 语句，查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username=?'

    // 执行SQL 语句，并根据结果判断用户名是否被占用
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行 SQL语句失败
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        // 注意：如果执行的是 select 查询语句，则执行的结果是数组，可以通过results.length 判断是否查到对应用户
        // 插入、更新、删除执行的结果，都是一个对象，可以通过 results.affectedRows 属性判断是否更新成功
        // 用户名被占用
        if (results.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
            return res.cc('用户名被占用，请更换其他用户名！')
        }

        // 在注册用户的处理函数中，确认用户名可用之后，调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理
        // 对用户的密码,进行 bcrypt 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        // 定义插入用户的SQL语句
        const sql = 'insert into ev_users set ?'
        // 调用 db.query() 执行 SQL 语句，插入新用户
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            // 执行 SQL 语句失败
            if (err) {
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            }
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
                return res.cc('注册用户失败，请稍后再试！')
            }
            // 注册成功
            // res.send({ status: 0, message: '注册成功！' })
            res.cc('注册成功！', 0)
        })
    })
    // res.send('reguser OK')
}

// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 定义 SQL 语句
    const sql = 'select * from ev_users where username=?'
    // 执行 SQL 语句，根据用户名查询用户的数据
    db.query(sql, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc(err)
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致
        // res.send('login OK')
        // 核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致   返回值是布尔值（true 一致、false 不一致）
        // results 返回的是数组，第一项就是用户的信息对象
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登陆失败！')
        }
        // TODO：登录成功，生成 Token 字符串
        // 核心注意点：在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
        // 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值
        const user = { ...results[0], password: '', user_pic: '' }
        // 对用户的信息进行加密，生成token 字符串
        // 参数1：用户的信息对象
        // 参数2：加密的秘钥
        // 参数3：配置对象，可以配置当前 token 的有效期
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h'  // token 有效期为10小时
        })
        // 调用 res.send() 将token 响应给客户端
        res.send({
            status: 0,
            message: '登陆成功',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr
        })
    })
}
