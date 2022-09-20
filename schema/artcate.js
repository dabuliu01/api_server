// 文章分类数据验证规则模块

// 导入定义验证规则的模块
const joi = require('joi')

// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required()
// alphanum()只能包含字母和数字，不能是中文
const alias = joi.string().alphanum().required()

// 定义分类id 的校验规则
// min(1) 最小值为1
const id = joi.number().integer().min(1).required()

// 向外共享校验规则对象 - 添加分类
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// 向外共享校验规则对象 - 根据id 删除分类
exports.delete_cate_schema = {
    // 要对req.params 中的数据进行验证
    params: {
        id
    }
}

// 向外共享校验规则对象 - 根据id 获取文章分类
exports.get_cate_schema = {
    // 要对req.params 中的数据进行验证
    params: {
        id
    }
}

// 向外共享校验规则对象 - 根据id 更新文章分类
exports.update_cate_schema = {
    // 要对req.body 中的数据进行验证
    body: {
        // 请求体参数：校验规则     如果两者相同，则可简写
        Id: id,
        name,
        alias
    }
}

