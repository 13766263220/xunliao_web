<template>
	<div class="msg-all">
		<!-- 好友分组右键菜单 -->
		<v-contextmenu ref="friend-type-contextmenu" >
			<v-contextmenu-item @click="editFriendType()">修改分组名</v-contextmenu-item>
			<v-contextmenu-item divider></v-contextmenu-item>
			<v-contextmenu-item @click="delFriendType()">删除分组</v-contextmenu-item>
		</v-contextmenu>
		<!-- 好友右键菜单 -->
		<v-contextmenu ref="friend-contextmenu" >
			<v-contextmenu-item @click="goToFriendChat()">好友聊天</v-contextmenu-item>
			<v-contextmenu-item divider></v-contextmenu-item>
			<v-contextmenu-item @click="editFriendNoteNameShow()">修改好友备注</v-contextmenu-item>
			<v-contextmenu-item divider></v-contextmenu-item>
			<v-contextmenu-submenu title="移动好友至">
				<v-contextmenu-item v-for="friendType in friendTypeInfo" :key="friendType.id" @click="moveFriendTo(friendType)">{{friendType.typeName}}</v-contextmenu-item>
			</v-contextmenu-submenu>
			<v-contextmenu-item divider></v-contextmenu-item>
			<v-contextmenu-item @click="delFriend()">删除好友</v-contextmenu-item>
		</v-contextmenu>
		
		<!-- 用户信息 start -->
		<el-popover
			ref="userInfoPopover"
		    placement="bottom-end"
		    width="300"
		    trigger="click"
			@show="searchUserInfoPopoverShow"
			@hide="searchUserInfoPopoverHide">
			<div class="am-dropdown-content" v-if="searchUserInfo.userName != null">
				<div class="own_head_top">
					<div class="own_head_top_text">
						<p class="own_name">{{searchUserInfo.nickName}}
						<span v-show="searchUserInfo.gender==0" title="男" class="el-icon-user-solid own_gender_0"></span>
						<span v-show="searchUserInfo.gender==1" title="女" class="el-icon-user-solid own_gender_1"></span>
						</p>
						
						<img :src="searchUserInfo.avatar" alt="">
						<p v-if="searchUserInfo.phone!=''&&searchUserInfo.phone!=null" class="own_numb">号码：{{searchUserInfo.phone}}</p>
						<p v-if="searchUserInfo.email!=''&&searchUserInfo.email!=null" class="own_numb">邮箱：{{searchUserInfo.email}}</p>
						<p v-if="searchUserInfo.address!=''&&searchUserInfo.address!=null" class="own_numb">地址：{{searchUserInfo.address}}</p>
						<p v-if="searchUserInfo.description!=''&&searchUserInfo.description!=null" class="own_numb">个人描述：{{searchUserInfo.description}}</p>
					</div>
				</div>
				<div class="own_head_bottom">
					<el-tooltip content="发送添加请求" placement="top" v-if="!existSearchUser()">
						<i class="el-icon-plus" @click="friendVerifyDialongShow(searchUserInfo.id)"></i>
					</el-tooltip>
				</div>
			</div>
			<div v-else style="text-align-last: center;">
				<span style="-ms-user-select: none;-webkit-user-select: none;color: #AAAAAA;">未搜索到用户</span>
			</div>
		  </el-popover>
		<!-- 用户信息 end -->
		
		<!-- 发送好友请求 模态框 start -->
		<el-dialog
		  title="发送请求"
		  :visible.sync="friendVerifyDialongParam.show"
		  width="400px"
		  center
			@close="friendVerifyDialongClose"
			@opened="friendVerifyDialongOpen"
		  >
		  <el-select
			style="width: 100%;"
			v-model="friendVerifyDialongParam.friendVerify.friendTypeId"
			placeholder="请选择分组">
				
			 <el-option
				v-for="friendType in friendTypeInfo"
				:key="friendType.id"
				:label="friendType.typeName"
				:value="friendType.id">
			</el-option>
		  </el-select>
		  
		  <el-input
		    type="textarea"
		    placeholder="请输入验证消息"
		    v-model="friendVerifyDialongParam.friendVerify.content"
			size="medium"
		    maxlength="50"
			rows="3"
		    show-word-limit
			style="width: 100%;margin-top: 20px;"
		  >
		  </el-input>
		  <span slot="footer" class="dialog-footer">
				<el-button @click="friendVerifyDialongParam.show = false" size="medium">取 消</el-button>
				<el-button type="primary" @click="sendFriendVerify()" size="medium">发送请求</el-button>
		  </span>
		</el-dialog>
		<!-- 发送好友请求 模态框 end -->
		
		<div class="message-navigation">
			<!-- 搜索框 -->
			<div class="wx_search">
				<input type="text" v-model="searchUserName" placeholder="搜索用户/账号" id="search">
				<button v-popover:userInfoPopover>+</button>
			</div>
			<el-scrollbar class="office_text" tabindex="1">
				<!-- accordion -->
				<el-collapse v-model="friendTypeId"   @change="friendTypeChange" >
				  <el-collapse-item :name="friendType.id" v-for="(friendType,index) in friendTypeInfo" :key="friendType.id">
					<template slot="title">
						<!-- 修改分组名 start-->
						<el-popover
							ref="eidtTypeNamePopover"
						    placement="right"
							width="300"
						    trigger="click">
							<div>
								<el-input v-model="eidtTypeNamePopover.typeName" placeholder="修改分组名" size="medium" maxlength="6" show-word-limit style="width: 200px;"></el-input>
								<el-button size="medium" @click="eidtTypeName()">确认</el-button>
							</div>
							<div slot="reference" @click="eidtTypeNamePopoverClose(index)" v-contextmenu:friend-type-contextmenu @contextmenu.prevent="setContextmenuFriendType(friendType,index)" style="width:100%">
								<span style="margin-left: 20px;">{{friendType.typeName}}</span>
							</div>
						</el-popover>
						<!-- 修改分组名 end -->
						
					</template>
				    <ul class="user_list">
				    	<li class="user_active" @click="goTo('friendChatWindow',friend)" v-contextmenu:friend-contextmenu @contextmenu.prevent="setContextmenuFriend(friend,friendIndex,index)" v-for="(friend,friendIndex) in friendType.friends" >
				    		<div class="user_head">
							<el-badge :value="friend.notReadCount==0?null:friend.notReadCount" :max="99" class="item">
								<el-avatar :src="friend.userInfo.avatar" :class="{'user-photo-not-online':userIsOnline(friend.userInfo.id)}" shape="square" :size="35"></el-avatar>
							</el-badge>
							</div>
							<!-- slot="reference" -->
							<div class="user_text" >
								<!-- 修改好友备注 start-->
								<el-popover
									ref="eidtFriendNoteNamePopover"
								    placement="right"
									width="300"
								    trigger="click">
									<div>
										<el-input v-model="eidtFriendNoteNamePopover.noteName" placeholder="修改备注" size="medium" maxlength="6" show-word-limit style="width: 200px;"></el-input>
										<el-button size="medium" @click="editFriendNoteName()">确认</el-button>
									</div>
									<p slot="reference" class="user_name" v-if="friend.noteName == null || friend.noteName == ''" @click="eidtFriendNoteNamePopoverClose()">
										{{friend.userInfo.nickName}}
									</p>
									<p slot="reference" class="user_name" v-else @click="eidtFriendNoteNamePopoverClose()">
										{{friend.noteName}}
									</p>
									
								</el-popover>
								<!-- 修改好友备注 end -->
								
								<p class="user_message" v-if="friend.newFriendMessage != null">
									<template v-if="friend.newFriendMessage.isBack == 1">
										<template v-if="ifThisWithdraw(friend.newFriendMessage)">
											<span>你撤回了一条消息</span>
										</template>
										<template v-else>
											<span>对方撤回了一条消息</span>
										</template>
									</template>
									<template v-else>
										<span v-html="friend.newFriendMessage.content"></span>
									</template>
								</p>
							</div>
							
				    		<div class="user_time" v-if="friend.newFriendMessage != null">
				    			<p>{{friend.newFriendMessage.sendTime|parseDate}}</p>
				    		</div>
				    	</li>
				    </ul>
				  </el-collapse-item>
				</el-collapse>
				<!-- 添加分组 -->
				<div class="add_frien_type">
					<el-popover
						ref="addTypeNamePopover"
					    placement="top"
						width="300"
						:visible-arrow="false"
					    trigger="click"
						@hide="addTypeNamePopoverHide()"
						>
						<div>
							<el-input v-model="addTypeNamePopover.typeName" placeholder="添加分组" size="medium" maxlength="6" show-word-limit style="width: 200px;"></el-input>
							<el-button size="medium" @click="addFriendType()">确认</el-button>
						</div>
						<div slot="reference" style="width:100%">
							<span slot="reference" class="el-icon-plus"></span>
						</div>
					</el-popover>
				</div>
			</el-scrollbar>
		</div>
		<!-- 聊天框 -->
		<div>
			<router-view :key="key"></router-view>
		</div>
	</div>
</template>

<script>
	import $ from "jquery"
	export default{
		mounted() {
			//获得用户信息
			this.userInfo = this.$store.getters.getUserInfo
			
			//查询所有分组
			this.queryFriendType();
			/* 获得所有在线用户 start */
			var data={type: 'ALL_USER_ONLINE'}
			this.$store.dispatch('sendMessage',data);
			/* 获得所有在线用户 end */
			
			/* 滚动条发生变化 */
			this.handleScroll()
		},
		methods:{
			handleScroll(){//滚动条发生变化
				$('.office_text .el-scrollbar__wrap').scroll(function(){
					$("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
				})
			},
			scrollTheBottomTime(){//聊天滚动条置底又滑动效果
				/*
				Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。
				$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 。
				*/
				this.$nextTick(() => {
					var container = $('.office_text .el-scrollbar__wrap')
					//容器高度
					var scrollHeight = container[0].scrollHeight
					container.animate({
						scrollTop:scrollHeight
					},700)
				})
			},
			queryFriendType(){//查询分组信息
				var userId = this.$store.getters.getUserInfo.id;
				this.$http.get('/friendType',{params:{userId:userId}})
				.then(response => {
					var result = response.data;
					//console.log(result)
					if(result.code == '200'){
						//获得分组所有信息
						this.friendTypeInfo = result.data
						var _this = this
						//展开所有分组
						_this.friendTypeId = []
						this.friendTypeInfo.forEach(item=>{
							if(item.friends.length!=0){
								_this.friendTypeId.push(item.id)
							}
						})
					}else{
						this.$message({
							type:'error',
							message:result.msg
						})
					}
					
				})
				
			},
			goTo(name,otherInfo){//跳转路由
				this.$router.push({ name: 'friendType' })
				this.$router.push({ name: name, params: { otherInfo: otherInfo } })
			},
			friendTypeChange(val){//点击不同分组
				// if(val != ''){
				// 	console.log(val)
				// }
			},
			/* 分组菜单 start */
			setContextmenuFriendType(friendType,index){//设置分组右键菜单数据
				this.$jquery("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
				this.contextmenuFriendType = {
					friendType:friendType,
					index:index
				}
			},
			addFriendType(){//添加分组
				if(this.addTypeNamePopover.typeName.replace(/^\s+|\s+$/g,"").length==0){
					this.$message.warning('分组名称不能为空')
					return
				}
				for(var i in this.friendTypeInfo){
					if(this.friendTypeInfo[i].typeName==this.addTypeNamePopover.typeName){
						this.$message.warning('分组不能重名')
						return;
					}
				}
				var data={
					typeName:this.addTypeNamePopover.typeName,
					userId:this.userInfo.id,
				}
				this.$http.post('/friendType/add',this.$qs.stringify(data))
				.then(res=>{
					if(res.data.code == '200'){
						if(res.data.data){
							this.$message.success('添加成功')
							/* 重新查询 */
							this.queryFriendType()
							/* 关闭添加悬浮窗 */
							setTimeout(()=>{
								this.$refs.addTypeNamePopover.doClose()
							})
							/* 滚动条置底 */
							this.scrollTheBottomTime()
						}
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			addTypeNamePopoverHide(){//关闭好友分组悬浮窗
				this.addTypeNamePopover.typeName=''
			},
			editFriendType(){//修改分组
				var index = this.contextmenuFriendType.index
				var friendType = this.contextmenuFriendType.friendType
				setTimeout(()=>{
					this.$refs.eidtTypeNamePopover[index].doShow()
				})
				this.eidtTypeNamePopover.typeName = friendType.typeName
			},
			eidtTypeNamePopoverClose(index){//关闭分组悬浮窗
				setTimeout(()=>{
					this.$refs.eidtTypeNamePopover[index].doClose()
				})
			},
			eidtTypeName(){//确认修改分组名称
				if(this.eidtTypeNamePopover.typeName.replace(/^\s+|\s+$/g,"").length==0){
					this.$message.warning('分组名称不能为空')
					return
				}
				var data={
					typeName:this.eidtTypeNamePopover.typeName,
					typeId:this.contextmenuFriendType.friendType.id
				}
				this.$http.post('/friendType/edit',this.$qs.stringify(data))
				.then(res=>{
					if(res.data.code == '200'){
						if(res.data.data){
							this.$message.success('修改成功')
							/* 重新查询 */
							this.queryFriendType()
							/* 关闭悬浮窗 */
							setTimeout(()=>{
								this.$refs.eidtTypeNamePopover[this.contextmenuFriendType.index].doClose()
							})
						}
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			delFriendType(){//删除分组
				var friendType = this.contextmenuFriendType.friendType
				if(friendType.friends.length>0){
					this.$message.warning('该分组不可被删除')
					return
				}
				this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
						  confirmButtonText: '确定',
						  cancelButtonText: '取消',
						  type: 'warning',
						  center: true
					}).then(() => {
						var data={
							typeId:friendType.id
						}
						this.$http.post('/friendType/del',this.$qs.stringify(data))
						.then(res=>{
							if(res.data.code == '200'){
								if(res.data.data){
									this.$message.success('删除成功')
									/* 重新查询 */
									this.queryFriendType()
								}
							}else if(res.data.code == '500'){
								this.$message.error(res.data.msg)
							}
						})
					}).catch(() => {});
			},
			/* 分组菜单 end */
			
			/* 好友菜单 start */
			setContextmenuFriend(friend,index,typeIndex){//设置好友菜单数据
				this.$jquery("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
				this.contextmenuFriend={
					friend:friend,
					index:index,
					typeIndex:typeIndex
				};
			},
			goToFriendChat(){//好友聊天
				this.goTo('friendChatWindow',this.contextmenuFriend)
			},
			editFriendNoteNameShow(){//打开修改好友备注悬浮窗
				var index = this.contextmenuFriend.index
				var typeIndex = this.contextmenuFriend.typeIndex
				var resIndex = 0
				for (var i = 0; i < typeIndex; i++) {
					resIndex+=this.friendTypeInfo[i].friends.length
				}
				resIndex+=index
				
				var friend = this.contextmenuFriend.friend
				this.eidtFriendNoteNamePopover.noteName = friend.noteName
				setTimeout(()=>{
					this.$refs.eidtFriendNoteNamePopover[resIndex].doShow()
				})
			},
			editFriendNoteName(){//修改好友备注
				var friend = this.contextmenuFriend.friend
				var data={
					id:friend.id,
					userId:friend.userId,
					friendId:friend.friendId,
					buildTime:friend.buildTime,
					typeId:friend.typeId,
					noteName:this.eidtFriendNoteNamePopover.noteName.replace(/^\s+|\s+$/g,"")
				}
				this.$http.post('/friend/edit',data)
				.then(res=>{
					if(res.data.code == '200'){
						if(res.data.data){
							this.$message.success('修改成功')
							/* 重新查询 */
							this.queryFriendType()
							/* 跳转路由 */
							this.$router.push({ name: 'friendType' })
							/* 关闭悬浮窗 */
							this.eidtFriendNoteNamePopoverClose()
						}
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			eidtFriendNoteNamePopoverClose(){//关闭修改好友备注悬浮窗
				setTimeout(()=>{
					this.$refs.eidtFriendNoteNamePopover.forEach(item=>{
						item.doClose()
					})
				})
			},
			moveFriendTo(friendType){//移动好友至
				var friend = this.contextmenuFriend.friend
				var data={
					id:friend.id,
					userId:friend.userId,
					friendId:friend.friendId,
					buildTime:friend.buildTime,
					typeId:friendType.id,
					noteName:friend.noteName
				}
				this.$http.post('/friend/edit',data)
				.then(res=>{
					if(res.data.code == '200'){
						if(res.data.data){
							this.$message.success('移动成功')
							/* 重新查询 */
							this.queryFriendType()
						}
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			delFriend(){//删除好友
				this.$confirm('将删除该联系人,将同时删除与该联系人的聊天记录, 是否继续?', '提示', {
						  confirmButtonText: '确定',
						  cancelButtonText: '取消',
						  type: 'warning',
						  center: true
					}).then(() => {
						var friend = this.contextmenuFriend.friend
						var data={
							userId:this.userInfo.id,
							friendId:friend.userInfo.id
						}
						this.$http.post('/friend/del',this.$qs.stringify(data))
						.then(res=>{
							if(res.data.code == '200'){
								this.$message.success('删除成功')
								//发送好友验证消息
								var data3={
									type: 'FRIEND_VERIFY',
									from:this.userInfo.id,
									destination:friend.userInfo.id,
								}
								//发送消息
								this.$store.dispatch('sendMessage',data3);
								
								/* 发送消息给对方 */
								var data2={
									fromUserId:this.userInfo.id,
									toUserId:friend.userInfo.id,
									content:'已解除好友关系',
									status:3,
								}
								this.$http.post('/friendVerifyMessage/add',data2)
								.then(res2=>{})
								
							}else if(res.data.code == '500'){
								this.$message.error(res.data.msg)
							}
						})
					}).catch(() => {});
			},
			/* 好友菜单 end */
			
			userIsOnline(userId){//判断用户是否在线
				return !this.onlineUsers.includes(userId.toString())
			},
			ifThisWithdraw(msg){//是否是自己撤回的消息
				return msg.fromUserId == this.userInfo.id?true:false
			},
			/* 搜索用户信息 start */
			searchUserInfoPopoverShow(){//打开用户搜索
				this.$http.get('/userInfo/getByUsername',{
					params:{
						userName:this.searchUserName
					}
				}).then(res=>{
					if(res.data.code == '200'){
						this.searchUserInfo = res.data.data
						if(this.searchUserInfo==null){
							this.searchUserInfo={}
						}
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			searchUserInfoPopoverHide(){//关闭用户搜索
				this.searchUserInfo={}
				this.searchUserName=''
			},
			existSearchUser(){//好友列表是否存在该用户
				var res = false
				if(this.userInfo.id == this.searchUserInfo.id){
					return true
				}
				this.friendTypeInfo.forEach(item=>{
					item.friends.forEach(friend=>{
						if(friend.userInfo.id == this.searchUserInfo.id){
							res = true
							return
						}
					})
				})
				
				return res
			},
			/* 搜索用户信息 end */
			
			/* 发送好友验证消息 start */
			friendVerifyDialongShow(toUserId){//打开模态框
				this.friendVerifyDialongParam.show = true
				this.friendVerifyDialongParam.friendVerify.toUserId = toUserId
			},
			friendVerifyDialongOpen(){//打开模态框完成回掉
				this.$jquery(".el-select-dropdown__wrap").css("margin-bottom","0px")
			},
			friendVerifyDialongClose(){//关闭回调
				this.friendVerifyDialongParam.friendVerify={
					friendTypeId:null,
					content:'',
					toUserId:null
				}
			},
			sendFriendVerify(){//发送请求
				var friendVerify = this.friendVerifyDialongParam.friendVerify
				if(friendVerify.friendTypeId==null){
					this.$message.warning('请选择分组')
					return
				}
				var data={
					fromUserId:this.userInfo.id,
					toUserId:friendVerify.toUserId,
					content:friendVerify.content,
					friendTypeId:friendVerify.friendTypeId,
					status:0,
				}
				this.$http.post('/friendVerifyMessage/add',data)
				.then(res=>{
					if(res.data.code == '200'){
						if(res.data.data){
							this.$message.success('发送成功')
							this.friendVerifyDialongParam.show = false
						}else{
							this.$message.warning('已发送')
						}
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			/* 发送好友验证消息 end */
		},
		filters:{
			parseDate: function(strDate){//字符串转日期
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
					return strDate.substring(11,16)
				}
				else if(dateBegin.getTime() < today && yestday <= dateBegin.getTime()){
					//判断是否是在今天凌晨到昨天凌晨之间
					return '昨天：' +strDate.substring(11,16)
				}
				return strDate.substring(0,10)
				
				// var dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
				// var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
				
				// if(dayDiff == 0){//未超过一天 返回具体时间
				// 	return strDate.substring(11,16)
				// }
				// else if(dayDiff == 1){//超过一天 昨天时间
				// 	return '昨天：' +strDate.substring(11,16)
				// }
				// else{//超过两天 返回日期
				// 	return strDate.substring(0,10)
				// }
				
			}
		},
		data(){
			return{
				userInfo:{},
				friendTypeId:[], //点击的好友分组id
				friendTypeInfo:[],//好友分组所有信息
				/* 右键菜单数据 start */
				contextmenuFriendType:{},//右好友分组
				contextmenuFriend:{},//右好友信息
				/* 右键菜单数据 end */
				onlineUsers:[],//在线用户
				searchUserInfo:{},//搜索用户信息
				searchUserName:'',//搜索用户账号
				eidtTypeNamePopover:{//修改分组名悬浮窗
					typeName:'',
				},
				addTypeNamePopover:{//添加分组名悬浮窗
					typeName:'',
				},
				eidtFriendNoteNamePopover:{//修改好友备注悬浮窗
					noteName:'',
				},
				friendVerifyDialongParam:{//发送好友验证消息模态框
					show:false,
					friendVerify:{
						friendTypeId:null,
						content:'',
						toUserId:null
					}
				},
			}
		},
		computed: {
		    key() {
		        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
		    }
		 },
		watch:{
			'$store.state.socket.newMsg':function(newMsg,oldMsg){//监听最新消息变化
				if(newMsg.type == 'ALL_USER_ONLINE'){//在线人数
					this.onlineUsers = newMsg.onlineUsers.split(",");
				}else if(newMsg.type == 'FRIEND_MSG' && (newMsg.from == this.userInfo.id || newMsg.destination == this.userInfo.id)){//有新消息
					this.queryFriendType()
				}
				else if(newMsg.type == 'FRIEND_VERIFY'){//好友验证消息
					this.queryFriendType()
					/* 跳转路由 */
					this.$router.push({ name: 'friendType' })
				}
				
			}
		}
		
	}
</script>

<style scoped="scoped">
	
	/* 消息总导航 */
	.msg-all{
		float: left;
		width: 800px;
		height: 100%;
	}
	/* 消息导航 */
	.message-navigation{
		/* 文字不可选中 */
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		
		border-radius: 5px;
		width: 250px;
		height: 100%;
		float: left;
		background-color: #f5f5f5;
		overflow: hidden;
		border-right: 1px solid #e7e7e7;
	}
	/* 搜索 */
	.wx_search {
	    padding: 20px 12px 18px 12px;
	    display: inline-block;
	    width: 100%;
	    float: inherit;
	}
	.wx_search input {
		font-size: 13px;
	    width: 190px;
	    height: 25px;
	    background: #e5e2e2;
	    border: 1px solid #d9d7d6;
	    padding-left: 5px;
	    outline: 0;
	    float: left;
	}
	.wx_search button {
	    font-size: 14px;
	    font: initial;
	    background: #e5e2e2;
	    border: 1px solid #d9d7d6;
	    float: right;
	    color: #585858;
	    outline: 0;
	    height: 25px;
	    width: 25px;
	}
	/* 发消息的对象 */
	.office_text {
		width: 100%;
		height: calc(100% - 62px);
		position: relative;
		display: inline-block;
		outline: 0;
	}
	.user_list, .friends_list, .icon_list {
	    width: 100%;
		cursor: pointer;
		background-color: #f9f9f9;
	}
	.user_list li:hover{
	    background-color: #e5fcfd;
	}
	.user_list li {
	    width: 100%;
	    height: 64px;
	    padding: 12px;
	}
	.user_head {
	    height: 40px;
	    width: 40px;
	    float: left;
	}
	.user-photo-not-online{
		filter: grayscale(100%);
	}
	
	.user_text {
	    float: left;
	    height: 40px;
	    width: 120px;
	    padding-left: 8px;
	}
	.user_text p {
	    line-height: 20px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	}
	.user_name {
	    color: #333;
	    font-size: 14px;
	}
	.user_message {
	    color: #999;
	    font-size: 12px;
	}
	.user_message img{ /* 最新消息中的表情(此处私有没用,见App.vue) */
		margin-bottom: 5px;
		max-width: 15px;
		max-height: 15px;
	}
	.user_time {
		margin-right: 0px;
	    float: right;
	    color: #999;
	    font-size: 12px;
		width: 65px;
	}
	.user_time p{
		float: right;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* 添加分组 */
	.add_frien_type{
		text-align: center;
		background-color: white;
		padding: 6px;
		border-bottom: 1px solid #EBEEF5;
		cursor: pointer;
	}
	.add_frien_type:hover{
		background-color: #e5fcfd;
		
	}
	
	.add_frien_type>span{
		
		font-size: 12px;
		display: block;
		color: #aaaaaa;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	
</style>
