import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/student',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'student',
        component: () => import('@/views/student/index'),
        meta: { title: '学生管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/teacher',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'teacher',
        component: () => import('@/views/teacher/index'),
        meta: { title: '老师管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'article',
        component: () => import('@/views/article/index'),
        meta: { title: '文章管理', icon: 'form', keepAlive: true }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'course',
        component: () => import('@/views/course/index'),
        meta: { title: '课程管理', icon: 'form', keepAlive: true }
      }
    ]
  },
  {
    path: '/operation',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'operation',
        component: () => import('@/views/operation/index'),
        meta: { title: '运营管理', icon: 'form', keepAlive: true }
      }
    ]
  },
  {
    path: '/commodity',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'commodity',
        component: () => import('@/views/commodity/index'),
        meta: { title: '商品管理', icon: 'form', keepAlive: true }
      }
    ]
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'user',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: '系统管理', icon: 'form', keepAlive: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/formatText/',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'formatText',
  //       component: () => import('@/views/formatText/index'),
  //       meta: { title: '富文本编辑器', icon: 'form', keepAlive: false }
  //     }
  //   ]
  // },
  // {
  //   path: '/courseDetail',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'courseDetail',
  //       component: () => import('@/views/courseDetail/index'),
  //       meta: { title: '富文本编辑器', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/recommend',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'recommend',
  //       component: () => import('@/views/recommend/index'),
  //       meta: { title: '富文本编辑器', icon: 'form' }
  //     }
  //   ]
  // },
  {
    path: '/pdf',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'pdf',
        component: () => import('@/views/pdf/index'),
        meta: { title: 'PDF管理', icon: 'form' }
      }
    ]
  },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'NESTED',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form表单', icon: 'form' }
  //     }
  //   ]
  // },
  // {
  //   path: '/table',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '表格', icon: 'form' }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
