<template>
    <div class="user-chat">
		<!-- 消息右键 -->
			<v-contextmenu ref="msg-contextmenu">
				<v-contextmenu-item @click="copyMessage()" v-show="isCopyMsg">复制消息</v-contextmenu-item>
				<v-contextmenu-item divider v-show="isWithdraw&&isCopyMsg"></v-contextmenu-item>
				<v-contextmenu-item @click="withdrawMessage()" v-show="isWithdraw">撤回消息</v-contextmenu-item>
			</v-contextmenu>
		<!-- 历史消息 start -->
		<el-dialog
		  title="历史记录"
		  :visible.sync="paseRecordsDialog.show"
		  width="600px"
		  top="40px"
		  center>
		  <div style="margin-top: 10px;">
			<template v-for="(msg,index) in paseRecordsDialog.pageInfo.list">
				<div style="color: #0000FF;font-size: 13px;">
					<span v-if="msg.fromUserId==userInfo.id">我</span>
					<span v-else>{{otherName}}</span>
					<span>({{msg.sendTime}})</span>
				</div>
				<div style="font-size: 15px;margin-bottom: 10px; margin-top: 5px;">
					
					<template v-if="msg.isBack == 1">
						<span style="color: #AAAAAA;font-size: 13px;-webkit-user-select: none;
							-moz-user-select: none;
							-ms-user-select: none;
							user-select: none;"
							>
							撤回了一条消息
						</span>
					</template>
					<template v-else>
						<template v-if="msg.fileUrl == '0'">
							<span v-html="msg.content"></span>
						</template>
						<template v-else>
							<template v-if="msg.content == '[文件]'">
								<el-card class="pase_file">
									<i class="el-icon-document"></i><span style="margin-left: 5px;">文件</span>
									<div style="word-break: break-all;width:auto;display:block;word-wrap:break-word;">
											<span style="">{{msg.fileName}}</span>
									</div>
									<el-divider></el-divider>
									<template v-if="msg.fileUrl!=''">
										<a :href="msg.fileUrl" style="float: right;font-size: 14px;margin-top: -15px;margin-right: 10px;">下载</a>
									</template>
								</el-card>
							</template>
							<template v-if="msg.content == '[图片]'">
								<el-image
								style="width: 200px;height: 120px;"
								:src='msg.fileUrl'
								:preview-src-list="[msg.fileUrl]"
								>
									<div slot="placeholder" class="image-slot" style="color: #AAAAAA;">
										<span class="el-icon-loading"></span>加载中<span class="dot">...</span>
									</div>
								</el-image>
							</template>
						</template>
					</template>
				</div>
			</template>
		  </div>
		  <div style="margin-top: 20px;">
			  <el-pagination
			    background
			    layout="prev, pager, next,total"
			    :total="paseRecordsDialog.pageInfo.total"
				@current-change="paseRecordsPageNumChange"
				>
			  </el-pagination>
		  </div>
		</el-dialog>
		<!-- 历史消息 end -->
		
		<!-- 用户信息 start -->
		<el-popover
			ref="userInfoPopover"
		    placement="right-start"
		    width="300"
		    trigger="click">
			<div class="am-dropdown-content">
				<div class="own_head_top">
					<div class="own_head_top_text">
						<p class="own_name">{{otherInfo.userInfo.nickName}}
						<span v-show="otherInfo.userInfo.gender==0" title="男" class="el-icon-user-solid own_gender_0"></span>
						<span v-show="otherInfo.userInfo.gender==1" title="女" class="el-icon-user-solid own_gender_1"></span>
						</p>
						
						<img :src="otherInfo.userInfo.avatar" alt="">
						<p v-if="otherInfo.userInfo.phone!=''&&otherInfo.userInfo.phone!=null" class="own_numb">号码：{{otherInfo.userInfo.phone}}</p>
						<p v-if="otherInfo.userInfo.email!=''&&otherInfo.userInfo.email!=null" class="own_numb">邮箱：{{otherInfo.userInfo.email}}</p>
						<p v-if="otherInfo.userInfo.address!=''&&otherInfo.userInfo.address!=null" class="own_numb">地址：{{otherInfo.userInfo.address}}</p>
						<p v-if="otherInfo.userInfo.description!=''&&otherInfo.userInfo.description!=null" class="own_numb">个人描述：{{otherInfo.userInfo.description}}</p>
					</div>
				</div>
				<div class="own_head_bottom">
					
				</div>
			</div>
		  </el-popover>
		<!-- 用户信息 end -->
		
		<div class="windows_top">
			<div class="windows_top_box">
				<el-tooltip content="查看用户信息" placement="top-end">
					<span v-popover:userInfoPopover>{{otherName}}</span>
				</el-tooltip>
				<ul class="window_icon">
					<!-- <li><a href="#"><img src="../../../assets/images/icon/icon7.png"></a></li> -->
					<!-- <li><a href="#"><img src="../../../assets/images/icon/icon8.png"></a></li> -->
					<!-- <li><a href="#"><img src="../../../assets/images/icon/icon9.png"></a></li> -->
					<li @click="$router.push({name:'friendType'})"><a href="#"><img src="../../../assets/images/icon/icon10.png"></a></li>
				</ul>
			</div>
		</div>
		<div>
			<el-scrollbar id="messages" class="messages" ref="messages">
				<!-- <div style="margin-top: 10px;"></div> -->
				<div class="hint_msg" v-show="messageLoading">
					<span>正在加载...</span><span class="el-icon-loading"></span>
				</div>
				<div :class="{show_message:messageLoading}">
					<ul style="padding: 5px 20px">
					<template v-for="(msg,index) in messages">
						<li class="hint_msg">
							<template>
								<span v-html="generateTimeJint(msg,index)"></span>
							</template>
							<template v-if="msg.friendMessage.isBack == 1">
								<template v-if="ifThisWithdraw(msg)">
									<span>
										你撤回了一条消息<a v-show="isReEdit(msg)" href="javascript:;" @click="reEdit(msg)">重新编辑</a>
									</span>
								</template>
								<template v-else>
									<span>对方撤回了一条消息</span>
								</template>
							</template>
						</li>
						<template v-if="msg.friendMessage.isBack == 0">
							<li v-if="msg.from == userInfo.id" class="me">
								<el-avatar class="my_avatar" shape="square" :size="34" :src="msg.friendMessage.userInfo.avatar"></el-avatar>
								
								<template v-if="msg.friendMessage.fileUrl=='0'"><!-- 正常消息 -->
									<span v-html="msg.friendMessage.content" class="my_msg" v-contextmenu:msg-contextmenu @contextmenu.prevent="setContextmenuMsg(msg.friendMessage,index)"></span>
								</template>
								<template v-else><!-- 文件消息 -->
									<span class="my_msg" v-contextmenu:msg-contextmenu @contextmenu.prevent="setContextmenuMsg(msg.friendMessage,index)">
										<template v-if="msg.friendMessage.content == '[文件]'">
											<el-card class="my_file">
												<i class="el-icon-document"></i><span style="margin-left: 5px;">文件</span>
												<div style="word-break: break-all;width:auto;display:block;word-wrap:break-word;">
														<span style="">{{msg.friendMessage.fileName}}</span>
												</div>
												<template v-if="msg.friendMessage.progressPercent != null">
													
													<el-progress :text-inside="true" :stroke-width="18" :percentage="msg.friendMessage.progressPercent" v-show="msg.friendMessage.progressPercent!=100" style="position: relative;top: 10px;"></el-progress>
												</template>
												<el-divider></el-divider>
												<template v-if="msg.friendMessage.fileUrl!=''">
													<a :href="msg.friendMessage.fileUrl" style="float: right;font-size: 14px;margin-top: -15px;margin-right: 10px;">下载</a>
												</template>
											</el-card>
										</template>
										<template v-if="msg.friendMessage.content == '[图片]'">
											<el-image
											class="my_image"
											:src='msg.friendMessage.fileUrl'
											:preview-src-list="[msg.friendMessage.fileUrl]"
											>	
												<div slot="error" class="image-slot" style="color: #AAAAAA;text-align: center;line-height: 150px;font-size: 15px;">
													<span class="el-icon-loading"></span>加载中<span class="dot">...</span>
												</div>
											</el-image>
										</template>
									</span>
								</template>
							</li>
							<li v-else class="other">
								<el-avatar class="other_avatar" shape="square" :size="34" :src="msg.friendMessage.userInfo.avatar"></el-avatar>
								<div class="other_nick">
									{{otherName}}
								</div>
								<template v-if="msg.friendMessage.fileUrl==0">
									<span v-html="msg.friendMessage.content" class="other_msg" v-contextmenu:msg-contextmenu @contextmenu.prevent="setContextmenuMsg(msg.friendMessage)"></span>
								</template>
								<template v-else><!-- 文件消息 -->
									<span class="other_msg">
										<template v-if="msg.friendMessage.content == '[文件]'">
											<el-card class="my_file">
												<i class="el-icon-document"></i><span style="margin-left: 5px;">文件</span>
												<div style="word-break: break-all;width:auto;display:block;word-wrap:break-word;">
														<span style="">{{msg.friendMessage.fileName}}</span>
												</div>
												<el-divider></el-divider>
												<template v-if="msg.friendMessage.fileUrl!=''">
													<a :href="msg.friendMessage.fileUrl" style="float: right;font-size: 14px;margin-top: -15px;margin-right: 10px;">下载</a>
												</template>
											</el-card>
										</template>
										<template v-if="msg.friendMessage.content == '[图片]'">
											<el-image
											class="my_image"
											:src='msg.friendMessage.fileUrl'
											:preview-src-list="[msg.friendMessage.fileUrl]"
											>
												<div slot="placeholder" class="image-slot" style="color: #AAAAAA;">
													<span class="el-icon-loading"></span>加载中<span class="dot">...</span>
												</div>
											</el-image>
										</template>
									</span>
								</template>
							</li>
						</template>
					</template>
					</ul>
				</div>
			</el-scrollbar>
			<!-- 置底 -->
			<transition name="el-fade-in">
				<div class="to_bottom transition-box" v-show="notMsg.show" @click="scrollTheBottomTime(true)">
					<span v-html="notMsg.notMsgCount<=99?notMsg.notMsgCount:'99+'"></span>
				</div>
			</transition>
		</div>
		<div class="windows_input" id="talkbox">
			
			<div class="input_icon">
				<!-- 表情 -->
				<a id="emoji_img" href="javascript:;" @click="showEmoji()"></a>
				<!-- 上传文件 -->
				<el-upload
					style="width: 0px;height: 0px;display: inline;"
					action="#"
					:show-file-list="false"
					:http-request="handleUploadRequest"
					:before-upload="beforeUpload">
					<a id="upload_show" href="javascript:;"></a>
				</el-upload>
				<a href="javascript:;"></a>
				<!-- 历史消息 -->
				<a href="javascript:;" @click="paseRecordsShow()"></a>
				<a href="javascript:;"></a>
				<a href="javascript:;"></a>
			</div>
			<div class="input_box">
				<!-- <textarea name="" rows="" cols="" id="input_box"></textarea> -->
				<twemoji-textarea style="background-color: #f5f5f5;"
					:emojiData="emojiDataAll" 
					:emojiGroups="emojiGroups" 
					@enterKey="onEnterKey"
					>
				</twemoji-textarea>
				<button id="send" @click="sendMessage()">发送（S）</button>
			</div>
		</div>
		<!-- <div style="padding-top: 16px;border-top: 1px solid #e7e7e7;"></div>
		<el-input
		  type="textarea"
		  :rows="4"
		  placeholder="请输入内容"
		  v-model="message">
		  
		</el-input>
		<el-button  size="small" @click="sendMessage()">发消息</el-button> -->
    </div>
</template>

<script>
	import {
	  TwemojiTextarea
	} from '@kevinfaguiar/vue-twemoji-picker';
	import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/de/emoji-all-groups.json';
	import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
	import $ from "jquery"
	
export default {
    data () {
        return {
			messageLoading:true,//是否正在加载
			userInfo:{},//自己信息
			otherInfo:{userInfo:{}},//对方信息
			otherName:null,
            socket:null, //连接
			messages:[],
			message:"",
			contextmenuMsg:null,//右键获得的消息信息
			isWithdraw:false,//是否能撤回消息
			isCopyMsg:false,//是否能复制消息
			paseRecordsDialog:{//历史消息模态框信息
				show:false,
				pageInfo:{
					pageNum:1,
					pageSize:10,
					total:0,
					list:[],
				}
			},
			notMsg:{//未读消息
				show:false,
				scrollIsBottom:true,//是否显示
				notMsgCount:0,//未读数量
			},
        }
    },
    mounted () {//初始化方法
		//滚动条发生变化
		this.handleScroll()
		
		this.otherInfo = this.$route.params.otherInfo;
		
		if(this.otherInfo == null){//判断如果没有信息则跳转到分组页面
			this.$router.push({name:'friendType'})
			return;
		}
		
		//判断好友是否有备注
		if(this.otherInfo.noteName == null || this.otherInfo.noteName == ''){
			this.otherName = this.otherInfo.userInfo.nickName;
		}else{
			this.otherName = this.otherInfo.noteName;
		}
		
		//获得用户信息
		this.userInfo = this.$store.getters.getUserInfo
		
		//查询所有好友聊天消息
		this.queryFriendMessage()
		
		/* 告诉后端正在和谁聊天 start */
		var data={
			type: 'FRIEND_TO',
			destination:this.otherInfo.userInfo.id
		}
		this.$store.dispatch('sendMessage',data);
		/* 告诉后端正在和谁聊天 end */
		
		//调用父组件查询所有分组
		this.$parent.queryFriendType();
		
    },
    methods: {
		handleScroll(){//滚动条发生变化
			var _this = this
			$('.messages .el-scrollbar__wrap').scroll(function(){
				$("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
				
				/* 监听滚动条是否到底部 */
				var container = $('.messages .el-scrollbar__wrap')
				//容器高度
				var scrollHeight = container[0].scrollHeight
				//可视区高度
				var clientHeight = container[0].clientHeight
				//滚动条高度
				var scrollTop = container[0].scrollTop
				
				_this.notMsg.scrollIsBottom = ((scrollHeight-clientHeight)-scrollTop<1)
			})
			
			
			
		},
		queryFriendMessage(){//查询所有好友聊天消息
			this.$http.get('/friendMessage',{
				params:{
					userId: this.userInfo.id,
					friendId: this.otherInfo.userInfo.id
				}
			})
			.then(response => {
				var result = response.data;
				//console.log(result)
				if(result.code == '200'){
					var msgs = result.data
					//console.log(msgs)
					for(var i in msgs){
						var message = {
							from:msgs[i].fromUserId, //发送人
							destination:msgs[i].toUserId,//接收人
							friendMessage:msgs[i],//消息信息
							type:'FRIEND_MSG'//消息类型
						}
						this.messages.push(message);//消息信息
						
						
					}
					
					//聊天滚动条置底
					var _this=this
					setTimeout(function () {//延迟0.5秒，保证滚动条滚到最低部
						_this.scrollTheBottom();
						_this.messageLoading = false //加载完成
					}, 500);
				}else{
					this.$message({
						type:'error',
						message:result.msg
					})
				}
			})
		},
		/* 表情样式start */
		showEmoji(){//显示表情与去除表情
			$('#btn-emoji-default').trigger('click')
		},
		/* 表情样式 end */
		
        onMessage(data) {//获得消息
			//判断是否是聊天消息并且发消息的人是否当前和自己聊的人
			if(data.type == 'FRIEND_MSG' && (data.from == this.userInfo.id || data.from == this.otherInfo.userInfo.id)){
				//显示消息到消息框
				if(data.friendMessage.isBack == 0){//正常消息
					//自己收到自己发的文件消息
					if(data.friendMessage.fileUrl!='0'&& data.from == this.userInfo.id){
						for (var i = 0; i < this.messages.length; i++) {
							if(this.messages[i].friendMessage.fileUrl == data.friendMessage.fileUrl){
								this.messages[i].friendMessage = data.friendMessage
								break
							}
						}
					}else{
						//正常消息
						this.messages.push(data)
					}
					//聊天滚动条置底
					this.scrollTheBottomTime((data.from == this.userInfo.id));
					
				}
				else{//撤回消息
					for (var i = 0; i < this.messages.length; i++) {
						if(this.messages[i].friendMessage.id == data.friendMessage.id){
							this.messages[i].friendMessage = data.friendMessage
							break
						}
					}
				}
				
			}
			
        },
		scrollTheBottom(){//聊天滚动条置底
			/*
			Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。
			$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 。
			*/
			this.$nextTick(() => {
				//容器高度
				var container = $('.messages .el-scrollbar__wrap')
				var scrollHeight = container[0].scrollHeight
				container.scrollTop(scrollHeight)
				//var scrollHeight = this.$refs['messages'].$refs['wrap'].scrollHeight
				//设定滚动条距离顶部的距离
				//this.$refs['messages'].$refs['wrap'].scrollTop = scrollHeight;
			})
		},
		scrollTheBottomTime(isThis){//聊天滚动条置底又滑动效果
			if(this.notMsg.scrollIsBottom || isThis==true){
				/*
				Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。
				$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 。
				*/
				this.$nextTick(() => {
					var container = $('.messages .el-scrollbar__wrap')
					//容器高度
					var scrollHeight = container[0].scrollHeight
					// console.log(scrollHeight)
					container.animate({
						scrollTop:scrollHeight
					},700)
				})
				
			}
			else{//没有滚动效果
				this.notMsg.notMsgCount++
				this.notMsg.show = true
			}
		},
		
		/* 发送消息 start */
		onEnterKey(e) {//回车发送消息发送消息
			e.preventDefault();
			this.message = this.getInputBoxMessage();
			this.sendMessage()
		},
		sendMessage() {//发送消息
			this.message = this.getInputBoxMessage();
			
			if (this.message == "") {
				this.$message({
					type:"warning",
					message:"请输入消息"
				})
				return ;
			}else if(this.message.length > 5000){
				this.$notify({
				  title: '警告',
				  message: '输入内容过多,请重新输入',
				  type: 'warning'
				});
				return ;
			}
			var data={
				type: 'FRIEND_MSG',
				from:this.userInfo.id,
				destination:this.otherInfo.userInfo.id,
				friendMessage:{
					content:this.message,
					isBack:0,
					fileUrl:'0',
					fileName:'0',
				}
			}
			//发送消息
			this.$store.dispatch('sendMessage',data);
			
			
			//清空文本
			$("#twemoji-textarea").html("")
			
		},
		getInputBoxMessage(){//获得输入框内的消息
			var html = $("#twemoji-textarea").html();
			return html;
		},
		/* 发送消息 end */
		/* 产生提示消息 start*/
		generateTimeJint(msg,index){//产生时间提示
			//遍历到当前时间的字符串
			var strDate = msg.friendMessage.sendTime;
			//遍历到当前时间
			var dateEnd = new Date(strDate.replace(/-/g,"/"))
			if(index == 0){
				return this.timeDifference(strDate)
			}
			//获得遍历到当前的上一消息时间
			var dateBegin = new Date(this.messages[index-1].friendMessage.sendTime.replace(/-/g,"/"))

			//计算出总共相差分钟数
			var totaLminutes = this.computeTotaLminutes(dateBegin,dateEnd)
			//console.log(totaLminutes)
			if(totaLminutes>=10){
				return this.timeDifference(strDate)
			}
			return null
			
		},
		timeDifference(strDate){//与当前时间相差的时间,是给上面方法用的
			//目标时间
			var dateBegin = new Date(strDate.replace(/-/g,"/"))
			//当前时间
			var dateEnd = new Date()
			//今天凌晨
			var today = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate()).getTime(); 
			//昨天凌晨
			var yestday = new Date(today - 24*3600*1000).getTime();
			
			if(dateBegin.getTime()>=today){
				//判断时间是否大于等于今天凌晨
				return strDate.substring(11) //表示今天时间
			}
			else if(dateBegin.getTime() < today && yestday <= dateBegin.getTime()){
				//判断是否是在今天凌晨到昨天凌晨之间
				return '昨天：' +strDate.substring(11) //表示昨天时间
			}
			return strDate //表示昨天凌晨之前
		},
		computeTotaLminutes(dateBegin,dateEnd){//计算总共分钟差
			//时间差的毫秒数
			var dateDiff = dateEnd.getTime() - dateBegin.getTime();
			//计算出相差天数
			var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
			//计算出小时数
			var leave1=dateDiff%(24*3600*1000) //计算天数后剩余的毫秒数
			var hours=Math.floor(leave1/(3600*1000))
			//计算相差分钟数
			var leave2=leave1%(3600*1000) //计算小时数后剩余的毫秒数
			var minutes=Math.floor(leave2/(60*1000))
			//计算出总共相差分钟数
			var totaLminutes = dayDiff*24*60 + hours*60 + minutes
			return totaLminutes
		},
		ifThisWithdraw(msg){//是否是自己撤回的消息
			// console.log(msg);
			return msg.from == this.userInfo.id?true:false
		},
		reEdit(msg){//重新编辑
			$("#twemoji-textarea").html($("#twemoji-textarea").html()+msg.friendMessage.content)
		},
		isReEdit(msg){//判断是否可以重新编辑
			var dateBegin = new Date(msg.friendMessage.sendTime.replace(/-/g,"/"))
			var dateEnd = new Date()
			var totaLminutes = this.computeTotaLminutes(dateBegin,dateEnd)
			return totaLminutes<2&&msg.friendMessage.fileUrl=='0'?true:false
		},
		/* 产生提示消息 end*/
		/* 右键消息 start */
		setContextmenuMsg(friendMessage,index){//右键消息获得消息信息
			$("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
			this.contextmenuMsg = {
				friendMessage:friendMessage,
				index:index
			}
			//判断是否可以撤回消息
			var dateBegin = new Date(friendMessage.sendTime.replace(/-/g,"/"))
			var dateEnd = new Date()
			var totaLminutes = this.computeTotaLminutes(dateBegin,dateEnd)
			this.isWithdraw = totaLminutes<2&&friendMessage.userInfo.id==this.userInfo.id&&friendMessage.id!=null?true:false
			//判断是否可以复制消息
			this.isCopyMsg = friendMessage.fileUrl == '0'
		},
		copyMessage(){//复制消息
			$("#twemoji-textarea").html($("#twemoji-textarea").html()+this.contextmenuMsg.friendMessage.content)
		},
		withdrawMessage(){//点击撤回消息
			// console.log(this.contextmenuMsg.friendMessage)
			var data={
				type: 'FRIEND_MSG',
				from:this.userInfo.id,
				destination:this.otherInfo.userInfo.id,
				friendMessage:{
					content: this.contextmenuMsg.friendMessage.content,
					fromUserId: this.contextmenuMsg.friendMessage.fromUserId,
					id: this.contextmenuMsg.friendMessage.id,
					isBack: 1,
					isRead: this.contextmenuMsg.friendMessage.isRead,
					fileUrl:this.contextmenuMsg.friendMessage.fileUrl,
					fileName:this.contextmenuMsg.friendMessage.fileName,
					sendTime: new Date(this.contextmenuMsg.friendMessage.sendTime),
					toUserId: this.contextmenuMsg.friendMessage.toUserId
				}
			}
			//发送消息
			this.$store.dispatch('sendMessage',data);
			
			
		},
		
		/* 右键消息 end */
		
		
		/* 文件上传处理 start */
		handleUploadRequest(data){//处理上传
			let formdata = new FormData()
			var file = data.file
			formdata.append('file',file)
			  
			//计算文件大小
			var size='';
			var kb = file.size/1024
			if(kb<1024){
				size = "（"+kb.toFixed(2)+"KB）"
			}else{
				var mb = kb/1024
				size = "（"+mb.toFixed(2)+"MB）"
			}
			//判断文件是否是图片
			var isImg = /^image\/(jpeg|png|jpg|gif)$/.test(file.type)
			
			//创建消息对象
			var data={
				type: 'FRIEND_MSG',
				from:this.userInfo.id,
				destination:this.otherInfo.userInfo.id,
				friendMessage:{
					content: isImg?'[图片]':'[文件]',
					fromUserId: this.userInfo.id,
					toUserId: this.otherInfo.userInfo.id,
					isBack: 0,
					isRead: 1,
					fileUrl:'',
					fileName:file.name+size,
					progressPercent:0,//进度条(暂时存储)
					sendTime: this.getTime(new Date()),
					userInfo:this.userInfo,
				}
			}
			//添加进上传文件集合里面
			this.messages.push(data)
			this.scrollTheBottomTime(true)//滚动条跳到底部
			
			//计算上传进度百分比
			const config = {
				onUploadProgress: progressEvent => {
					data.friendMessage.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100 - 1).toFixed(2))
				}
			}
			
			this.$http.post('/file/upload',formdata,config)
			.then(res => {
				//console.log(res)
				if(res.data.code == '200'){
					//给下载地址赋值
					data.friendMessage.fileUrl = res.data.data
					//把进度条填满
					data.friendMessage.progressPercent = 100
					
					//推送消息给后端
					var thisData = {
						type: 'FRIEND_MSG',
						from:this.userInfo.id,
						destination:this.otherInfo.userInfo.id,
						friendMessage:{
							content:data.friendMessage.content,
							isBack:0,
							fileUrl:data.friendMessage.fileUrl,
							fileName:data.friendMessage.fileName,
						}
					}
					this.$store.dispatch('sendMessage',thisData)
					//调用父类的方法
					//this.$parent.queryFriendType()
				}
			}).catch(error=>{
				console.log(error)
			})
			
			
			
		},
		beforeUpload(file){//上传之前
			const isLt2M = file.size / 1024 / 1024 < 50;
			if (!isLt2M) {
			  this.$message.error('上传文件大小不能超过 50MB!');
			  return isLt2M;
			}
		},
		getTime(val){//时间转字符串
			var d = null
		    if (val&val instanceof Date){
		      d = val;
		    }else{
		      d = new Date();
		    };
		    var year = d.getFullYear();
		    var mouth = (d.getMonth() + 1) < 10 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1);
		    var day = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate();
		    var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
		    var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
		    var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
		    var curTime = year + '-' + mouth + '-' + day + ' ' + hour + ':' + minutes + ':' + second;
		    return curTime
		},
		/* 文件上传处理 end */
		/* 历史消息 start */
		paseRecordsShow(){//打开历史消息模态框
			this.paseRecordsDialog.show=true
			this.$http.get('/friendMessage/all',{
				params:{
					pageNum:this.paseRecordsDialog.pageInfo.pageNum,
					pageSize:this.paseRecordsDialog.pageInfo.pageSize,
					userId:this.userInfo.id,
					friendId:this.otherInfo.userInfo.id,
				}
			}).then(res=>{
				if(res.data.code == '200'){
					this.paseRecordsDialog.pageInfo = res.data.data
				}else if(res.data.code == '500'){
					this.$message.error(res.data.msg)
				}
			})
		},
		paseRecordsPageNumChange(pageNum){//改变历史消息当前页
			this.paseRecordsDialog.pageInfo.pageNum = pageNum
			this.paseRecordsShow()
		}
		/* 历史消息 end */
    },
    destroyed () {//vue对象销毁时
		//清空文本
		$("#twemoji-textarea").html("")
		
		/* 告诉后端关闭了和谁聊天 start */
		var data={
			type: 'FRIEND_TO',
			destination:null
		}
		this.$store.dispatch('sendMessage',data);
		/* 告诉后端关闭了和谁聊天 end */
    },
	components: {
	  'twemoji-textarea': TwemojiTextarea
	},
	computed: {
	  emojiDataAll() {
	      return EmojiAllData;
	  },
	  emojiGroups() {
	      return EmojiGroups;
	  }
	},
	watch:{
		'$store.state.socket.newMsg':function(newMsg,oldMsg){//监听最新消息变化
			this.onMessage(newMsg)
		},
		'notMsg.scrollIsBottom':function(newMsg,oldMsg){//监听滚动条是否在最底部
			if(newMsg){
				//到了最底部
				this.notMsg.show = false
				setTimeout(()=>{
					this.notMsg.notMsgCount = 0
				},150)
				
			}
		},
	}
}
</script>

<style scoped="scoped">
	/* @import url("../../../../static/jquery-emoji/lib/css/jquery.mCustomScrollbar.min.css"); */
	
	
	/* 用户信息栏 */
	.windows_top {
	    padding-top: 10px;
	    height: 62px;
	    border-bottom: 1px solid #e7e7e7;
	}
	.windows_top_box {
	    width: 100%;
	    height: 100%;
	    position: relative;
	}
	.windows_top_box>span {
	    font-size: 18px;
	    color: #333;
	    line-height: 52px;
	    padding-left: 30px;
	    /* display: inline-block; */
		cursor: pointer;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	.window_icon {
	    position: absolute;
	    top: -10px;
	    right: 0;
	}
	.window_icon li {
	    float: left;
	    width: 34px;
	    height: 26px;
	    position: relative;
		cursor: pointer;
	}
	.window_icon li:hover {
		background: #e3e3e3;
	}
	.window_icon li a img {
	    position: absolute;
	    left: 50%;
	    top: 50%;
	    transform: translate(-50%, -50%);
	}

	
	/* 用户聊天 */
	.user-chat{
		float: left;
		width: 550px;
		height: 100%;
		background-color: #f5f5f5;
		border-radius: 5px;
		
	}
	/* 消息框 */
	.messages{
		width: 550px;
		height: 393px;
		border-bottom: #e7e7e7;
		background-color: #fbfbfb;
	}
	.show_message{/* 隐藏消息 */
		opacity: 0
	}
	.hint_msg{/* 提示消息 */
		text-align: center;
	}
	.hint_msg>span{/* 提示消息 */
		font-size: 12px;
		display: block;
		margin: 10px 0px 10px 0px;
		color: #aaaaaa;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.hint_msg a{
		margin-left: 5px;
	}
	
	
	/* 我的聊天记录 */
	.me {
		width: 100%;
		margin-top: 10px;
		/* padding-left: 10px; */
		/* padding-right: 20px; */
		padding-bottom: 10px;
		display: block;
		clear: both;
		overflow: hidden;
		margin-bottom: 5px;
	}
	.me .my_msg {
	    position: relative;
	    max-width: 83%;
	    background: #9eea6a;
	    padding: 7px;
	    border-radius: 4px;
	    margin: 0 10px;
	    border: 1px solid #9eea6a;
	    float: right;
		font-size: 14px;
		word-break: break-all;/* 字不换行断开 */
		
		/* 超过宽度自动换行 */
		width:auto; 
		display:block; 
		word-wrap : break-word ;
	}
	.me .my_msg:before {
	    content: " ";
	    position: absolute;
	    top: 9px;
	    right: 100%;
	    border: 6px solid transparent;
	    border-left-color: #9eea6a;
	    right: inherit;
	    left: 100%;
	}
	.me .my_avatar{
		float: right;
	}
	.my_file{/* 文件 */
		width: 280px;
		margin: -6px;
	}
	.my_file span,.my_file i{/* 文件内字体 */
		font-size: 13px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.my_image{/* 图片文件 */
		width: 240px;
		height: 150px;
		margin: -6px;
		margin-bottom: -12px;
	}
	.my_image img{/* 图片文件 */
		max-width: 240px;
		max-height: 200px;
	}
	.pase_file{
		width: 240px;
	}
	.pase_file span,.pase_file i{/* 文件内字体 */
		font-size: 13px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
	
	/* 对方消息记录 */
	.other {
		padding-top: 10px;
	    padding-bottom: 0px;
		/* padding-left: 20px; */
	    width: 100%;
	    display: block;
	    clear: both;
	    overflow: hidden;
	    float: left;
	    margin-bottom: 5px;
	}
	.other .other_avatar{
		float: left;
	}
	.other .other_nick {
	    position: relative;
	    top: -10px;
	    left: 15px;
	    font-size: 12px;
	    color: #AAAAAA;
	}
	.other .other_msg {
	    background: #fff;
	    padding: 7px;
	    border-radius: 4px;
	    float: left;
	    margin: 0 10px;
	    max-width: 83%;
	    border: 1px solid #ededed;
	    position: relative;
	    top: -10px;
		font-size: 14px;
		background-color: #e2e2e2;
		word-break: break-all;/* 字不换行断开 */
		
		/* 超过宽度自动换行 */
		width:auto; 
		display:block; 
		word-wrap : break-word ;
	}
	.other .other_msg:before {
		content: " ";
		position: absolute;
		right: 100%;
		border: 6px solid transparent;
		right: inherit;
		border-right-color: #e2e2e2;
		right: 100%;
	}
	

	
	/* 输入栏 */
	.windows_input {
	    border-top: 1px solid #ececec;
	    height: 125px;
	    width: 100%;
	}
	
	/* 输入栏图标 */
	.input_icon {
	    height: 42px;
	    padding: 0 28px;
	}
	.input_icon a {
	    position: relative;
	    display: inline-block;
	    height: 20px;
	    width: 24px;
	    margin-top: 11px;
	    margin-right: 8px;
	}
	/* 输入栏图标及样式 */
	.input_icon a:nth-child(1) {/* 表情 */
		background: url(../../../assets/images/icon/icon13.png) no-repeat center center;
	}
	
	.input_icon a:nth-child(1):hover {
		background: url(../../../assets/images/icon/icon13_1.png) no-repeat center center;
	}
	
	.input_icon #upload_show{/* 文件 */
		background: url(../../../assets/images/icon/icon14.png) no-repeat center center;
	}
	
	.input_icon #upload_show:hover {
		background: url(../../../assets/images/icon/icon14_1.png) no-repeat center center;
	}
	
	.input_icon a:nth-child(3) {
		background: url(../../../assets/images/icon/icon15.png) no-repeat center center;
	}
	
	.input_icon a:nth-child(3):hover {
		background: url(../../../assets/images/icon/icon15_1.png) no-repeat center center;
	}
	
	.input_icon a:nth-child(4) {
		background: url(../../../assets/images/icon/icon16.png) no-repeat center center;
	}
	
	.input_icon a:nth-child(4):hover {
		background: url(../../../assets/images/icon/icon16_1.png) no-repeat center center;
	}
	
	.input_icon a:nth-child(6) {
		background: url(../../../assets/images/icon/icon17.png) no-repeat center center;
		float: right;
	}
	
	.input_icon a:nth-child(6):hover {
		background: url(../../../assets/images/icon/icon17_1.png) no-repeat center center;
	}
	
	.input_icon a:nth-child(5) {
		background: url(../../../assets/images/icon/icon18.png) no-repeat center center;
		float: right;
	}
	
	.input_icon a:nth-child(5):hover {
		background: url(../../../assets/images/icon/icon18_1.png) no-repeat center center;
	}
	
	/* 输入栏输入框 */
	.input_box {
	    height: calc(100% - 42px);
	}
	/* 发送按钮 */
	#send {
	    border: 1px solid #e5e5e5;
	    background: #f5f5f5;
	    color: #666;
	    padding: 0 8px;
	    outline: 0;
	    height: 26px;
	    float: right;
	    margin-top: 8px;
	    margin-right: 28px;
		cursor: pointer;
	}
	#send:hover {
		background: #09bb07;
		color: #fff;
		border: 1px solid #09bb07;
	}
	
	/* 置底 start*/
	.to_bottom{
		position: absolute;
		text-align: center;
		cursor: pointer;
		background-color: rgb(94, 165, 243);
		padding: 5px 10px 5px 10px;
		border-radius: 10px;
		width: 40px;
		height: 35px;
		top: 413px;
		left: 700px;
	}
	.to_bottom>span{
		color: white;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		
	}
	.to_bottom:before{
		content: " ";
		position: absolute;
		top: 35px;
		left: 15px;
		border: 6px solid transparent;
		border-top-color: rgb(94, 165, 243);
	}
	/* 置底 end */
</style>
