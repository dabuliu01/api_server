// 文章分类路由模块

// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 导入文章分类的路由处理函数模块
// const { getArticleCates } = require('../router_handler/artcate')
const artcate_handler = require('../router_handler/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

// 获取文章分类的列表数据的路由
// router.get('/cates', getArticleCates)
router.get('/cates', artcate_handler.getArticleCates)

// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)

// 根据Id 删除文章分类的路由
// :id 是个在url 中的动态参数，我们可以使用req.params 获取到它的值
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)

// 根据Id 获取文章分类数据的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById)

// 根据Id 更新文章分类数据的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)

// 向外共享路由对象
module.exports = router