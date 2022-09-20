// 用户信息路由处理函数模块

// 导入数据库操作模块
const db = require('../db/index')

// 导入加密包 bcrypt.js 
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // res.send('ok')
    // 定义 SQL 语句
    // 根据用户的 id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?'
    // 调用 db.query() 执行 SQL 语句
    // 注意：只要配置成功了 express-jwt 这个中间件，就可以把解析出来的用户信息，挂载到 req.user 属性上(现版本变成了req.auth)
    // req.user 是token 上的用户数据
    db.query(sql, req.user.id, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        // select 得到的results 是数组
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0]
        })
    })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // res.send('ok')
    // 定义待执行的 SQL 语句
    const sql = 'update ev_users set ? where id=?'
    // 调用 db.query() 执行 SQL 语句并传参
    // req.body 是提交上来的表单上的数据
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但影响行数不为 1
        // insert update delete 执行的结果results，都是一个对象，可以通过 affectedRows 属性判断是否成功
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败')
        // 修改用户信息成功
        res.cc('修改用户基本信息成功!', 0)
    })
}

// 重置密码的处理函数
exports.updatePassword = (req, res) => {
    // 1.根据 id 查询用户是否存在
    // 定义根据 id 查询用户数据的 SQL 语句
    const sql = 'select * from ev_users where id=?'
    // 执行 SQL 语句查询用户是否存在
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 检查指定 id 的用户是否存在
        if (results.length !== 1) return res.cc('用户不存在!')
        // 2.判断提交的旧密码是否正确
        // res.send('ok')
        // 在头部区域导入 bcryptjs 后，
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        // 判断提交的旧密码是否正确
        if (!compareResult) return res.cc('原密码错误!')
        // 3.对新密码进行 bcrypt 加密之后，更新到数据库中
        // res.send('ok')
        // 定义更新用户密码的 SQL 语句
        const sql = 'update ev_users set password=? where id=?'
        // 对新密码进行 bcrypt 加密处理
        // bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理, 返回值是加密之后的密码字符串
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行 SQL 语句，根据 id 更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新密码失败!')
            // 更新密码成功
            res.cc('更新密码成功!', 0)
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // res.send('ok')
    // 定义更新用户头像的 SQL 语句
    const sql = 'update ev_users set user_pic=? where id=?'
    // 调用 db.query() 执行 SQL 语句，更新对应用户的头像
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败!')
        // 更新用户头像成功
        res.cc('更新头像成功!', 0)
    })
}