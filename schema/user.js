// 用户验证规则模块

// 导入定义验证规则的包
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码的验证规则
const password = joi
    .string()
    .pattern(/^[\S]{6,12}$/)
    .required()

// 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 定义头像的验证规则
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()

// 暴露注册和登录表单的验证规则对象
// 验证规则对象中有三个参数，body query params，分别对应express 中数据的三种，1.表单数据   通过 req.body 获取  2.查询字符串中的数据   通过 req.query 获取 3.url中携带的数据   通过req.params 获取
exports.reg_login_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        password
    }
}

// 为 exports 挂载update_userinfo_schema 属性向外共享如下的 验证规则对象
// 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
    // 需要对req.body 里面的数据进行验证
    body: {
        // 属性名和值的名称一样,在ES6中可简写
        id,
        nickname,
        email
    }
}

// 验证规则对象 - 重置密码
// 核心验证思路：旧密码与新密码，必须符合密码的验证规则，并且新密码不能与旧密码一致！
exports.update_password_schema = {
    body: {
        // 使用 password 这个规则，验证 req.body.oldPwd 的值
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
    body: {
        // 参数名字和验证规则名字重名可简写
        avatar
    }
}
