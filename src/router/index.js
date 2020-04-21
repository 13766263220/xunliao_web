import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决重复点击导航路由报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
	{
	  path: '/index', //主页导航栏
	  name: 'index',
	  component: resolve => require(['@/components/view/home/index'], resolve),
	  children:[
		{
			path: '/chatIndex', //聊天主页
			name: 'chatIndex',
			component: resolve => require(['@/components/view/chats/index'], resolve),
			children:[
			{
				path: '/friendType', //好友聊天分组
				name: 'friendType',
				component: resolve => require(['@/components/view/chats/friendType'], resolve),
				children:[{
					path: '/friendChatWindow',  //群聊页面
					name: 'friendChatWindow',
					component: resolve => require(['@/components/view/chats/friendChatWindow'], resolve)
				}]
			},
			{
				path: '/groupInfo', //好友聊天分组
				name: 'groupInfo',
				component: resolve => require(['@/components/view/chats/groupInfo'], resolve),
				children:[{
					path: '/groupChatWindow',  //群聊页面
					name: 'groupChatWindow',
					component: resolve => require(['@/components/view/chats/groupChatWindow'], resolve)
				}]
			}],
			
		},
		{
			path: '/friendCircleIndex', //朋友圈主页
			name: 'friendCircleIndex',
			component: resolve => require(['@/components/view/friend_circle/index'], resolve),
			children:[
				{
					path: '/friendTrends',  //好友动态
					name: 'friendTrends',
					component: resolve => require(['@/components/view/friend_circle/friendTrends'], resolve)
				},
				{
					path: '/pushTrends',  //好友动态
					name: 'pushTrends',
					component: resolve => require(['@/components/view/friend_circle/pushTrends'], resolve)
				}
			],
		}
		
	  ],
	},
	{
		path: '/login',  //登录
		name: 'login',
		component: resolve => require(['@/components/view/login/login'], resolve)
	},
	{
		path: '/test',  //登录
		name: 'test',
		component: resolve => require(['@/components/view/login/test'], resolve)
	},
	
	{
	  name: '404',
	  path: '/404',
	  component: resolve => require(['@/components/view/404'], resolve),
	  meta: { title: '路由不存在' }
	},
	{
	  name: '403',
	  path: '/403',
	  component: resolve => require(['@/components/view/403'], resolve),
	  meta: { title: '资源不可访问' }
	},
	{
	  path: '*',
	  redirect: '/404'
	}
  ],
  mode: 'history'//url地址不显示#号
  
})
