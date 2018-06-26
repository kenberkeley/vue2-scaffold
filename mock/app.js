import 'babel-polyfill'
import express from 'express'
import router from './controllers/'
import simpleLogger from './middlewares/simpleLogger'

const app = express()

app.use(simpleLogger)
app.use(router)

export default app
