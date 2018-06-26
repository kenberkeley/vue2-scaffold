import express from 'express'
import { Random } from 'mockjs'

const router = express.Router()
export default router

// 使用全局变量方便开发
Object.assign(global, {
  ROUTER: router,
  Random
})

// 自动遍历引入本目录下所有控制器
require('require-directory')(module)
