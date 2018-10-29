import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log(getToken())
  if (getToken()) {
    if (to.path === '/login') {
      console.log('登录')
      next({ path: '/student/index' })
      next()
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      console.log(!store.getters.name)
      if (!store.getters.name) {
        store.dispatch('GetInfo')
        next()
      } else {
        console.log('进入')
        next()
      }
    }
  } else {
    console.log(whiteList.indexOf(to.path))
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
