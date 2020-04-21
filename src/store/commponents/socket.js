const socket = {
	state:{ //数据
		socketPath:"ws://localhost:8080/websocketServer/",
		socket:null,//websocket连接对象
		newMsg:null, //最新消息
		userInfo:null //用户信息
	},
	getters:{ //获得
		getSocketPath(state){//获得websocket路径
			return state.socketPath + state.userInfo.id
		},
		getSocket(state){//获得websocket对象
			return state.socket
		},
		getNewMsg(state){//获得最新消息
			return state.newMsg
		},
		getUserInfo(state){//获得用户信息
			return state.userInfo
		}
	},
	mutations:{ //变化
		setSocket(state,socket){//设置websocket对象值
			state.socket = socket;
		},
		setNewMsg(state,newMsg){//设置最新消息
			state.newMsg = newMsg
		},
		setUserInfo(state,userInfo){//设置用户信息
			state.userInfo = userInfo;
		}
	},
	actions: { //行为
		websocketInit(context){//创建websocket连接
			if(typeof(WebSocket) === "undefined"){
			    alert("您的浏览器不支持socket")
			}else{
			    // 实例化socket
			    context.commit('setSocket',new WebSocket(context.getters.getSocketPath))
			    // 监听socket连接
			    context.getters.getSocket.onopen = function(){
			    	console.log("连接成功")
			    }
			    // 监听socket错误信息
			    context.getters.getSocket.onerror = function(){
					console.log("连接异常")
				}
			    // 监听socket消息
			    context.getters.getSocket.onmessage = function(msg){
					//console.log(msg)
					context.commit('setNewMsg',JSON.parse(msg.data))
				}
				//context.dispatch('onMessage')
				// 监听socket销毁
				context.getters.getSocket.onclose = function(){
					console.log("连接断开")
				}
			}
		},
		sendMessage(context,data){//发送消息
			try{
				context.getters.getSocket.send(JSON.stringify(data))
			}
			catch(err){
			   
			}
			
		},
		websocketClose(context){//断开连接
			context.getters.getSocket.close()
		}
		
	}
}
export default socket