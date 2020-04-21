<template>
	<div class="msg-all">
		<!-- 群信息 start -->
		<el-popover
		    ref="groupInfoPopover"
		    placement="bottom-end"
		    width="300"
		    trigger="click"
			@show="groupInfoPopoverShow"
			@hide="groupInfoPopoverHide">
			<div class="am-dropdown-content" v-if="groupInfo.groupNum != null">
				<div class="own_head_top">
					<div class="own_head_top_text">
						<p class="own_name">{{groupInfo.groupName}}</p>
						<img :src="groupInfo.avatar" alt="">
						<p class="own_numb">群号：{{groupInfo.groupNum}}</p>
						<p class="own_numb">创群时间：{{groupInfo.buildTime}}</p>
						<p class="own_numb">描述：{{groupInfo.description}}</p>
					</div>
				</div>
				<div class="own_head_bottom">
					<el-tooltip content="发送添加请求" placement="top" v-if="!existGroup()">
						<i class="el-icon-plus" @click="sendGroupVerifyMessage()"></i>
					</el-tooltip>
				</div>
			</div>
			<div v-else style="text-align-last: center;">
				<span style="-ms-user-select: none;-webkit-user-select: none;color: #AAAAAA;">未搜索到群</span>
			</div>
		  </el-popover>
		<!-- 群信息 start -->
		<!-- 创建群模态框 start -->
		<el-dialog
		  title="创建群聊"
		  :visible.sync="addGroupInfoDialog.show"
		  top="40px"
		  width="500px"
		  center
		  @close="addGroupInfoDialogClose"
		  >
		  <el-form
		  		:inline="true"
		  		:model="addGroupInfoDialog.editGroupInfo"
		  		ref="addGroupFrom"
		  		class="demo-form-inline"
		  		:rules="addGroupInfoDialog.editGroupInfoRules"
				label-position="right"
				label-width="80px"
		  	>
		  		<el-form-item label="群名称" prop="groupName">
		  			<el-input placeholder="请输入名称" v-model="addGroupInfoDialog.editGroupInfo.groupName" size="small" style="width: 250px;"></el-input>
		  		</el-form-item>
				<br />
				<el-form-item label="群头像" class="my-el-form-item">
					<el-upload
					  action="http://localhost:8080/api/file/upload"
					  list-type="picture-card"
					  :limit='1'
					  :on-preview="handlePictureCardPreview"
					  :on-remove="handleRemove"
					  :on-success="handleSuccess"
					  :before-upload="beforeUpload"
					  :file-list="addGroupInfoDialog.avatarList"
					  accept="image/jpeg,image/jpg,image/png"
					  >
					  <i class="el-icon-plus"></i>
					</el-upload>
					<!-- 大图查看 -->
					<el-dialog :visible.sync="addGroupInfoDialog.dialogVisible" append-to-body top="20px">
					  <img width="100%" height="550px" :src="addGroupInfoDialog.editGroupInfo.avatar" alt="">
					</el-dialog>
				</el-form-item>
				<br />
				<el-form-item label="描述" prop="description" class="my-el-form-item">
					<el-input placeholder="请输入描述" maxlength="100" show-word-limit :autosize="{ minRows: 4, maxRows: 8}" type="textarea" v-model="addGroupInfoDialog.editGroupInfo.description" style="width: 250px;"></el-input>
				</el-form-item>
		  		
		  		
		  	</el-form>
		  	
		  	<span slot="footer" class="dialog-footer">
		  		<el-button @click="addGroupInfoDialog.show = false" size="small">取 消</el-button>
		  		<el-button type="primary" @click="editGroupInfo()" size="small">创建群聊</el-button>
		  	</span>
		  </el-dialog>
		</el-dialog>
		<!-- 创建群模态框 end -->
		
		<div class="message-navigation">
			<!-- 搜索框 -->
			<div class="wx_search">
				<input v-model="groupNum" type="text" placeholder="搜索群/群号" id="search">
				<button v-popover:groupInfoPopover>+</button>
			</div>
			<el-scrollbar class="office_text_group" tabindex="1">
				<ul class="user_list">
					<li class="user_active" @click="goTo('groupChatWindow',groupUser)" v-for="groupUser in groupUsers">
						<div class="user_head">
						<el-badge :value="groupUser.notReadCount==0?null:groupUser.notReadCount" :max="99" class="item" >
							<el-avatar :src="groupUser.groupInfo.avatar" shape="square" :size="35"></el-avatar>
						</el-badge>
						</div>
						<div class="user_text">
							<p class="user_name">
								{{groupUser.groupInfo.groupName}}
							</p>
							<template v-if="groupUser.groupInfo.newGroupMessage!=null">
								<template v-if="groupUser.groupInfo.newGroupMessage.isBack == 0">
									<template v-if="groupUser.groupInfo.newGroupMessage.fromGroupUser.noteName == null || groupUser.groupInfo.newGroupMessage.fromGroupUser.noteName == ''">
										<p class="user_message" v-html="groupUser.groupInfo.newGroupMessage.fromGroupUser.userInfo.nickName+': '+groupUser.groupInfo.newGroupMessage.content"></p>
									</template>
									<template v-else>
										<p class="user_message" v-html="groupUser.groupInfo.newGroupMessage.fromGroupUser.noteName+': '+groupUser.groupInfo.newGroupMessage.content"></p>
									</template>
								</template>
								<template v-else>
									<template v-if="groupUser.groupInfo.newGroupMessage.fromGroupUser.noteName == null || groupUser.groupInfo.newGroupMessage.fromGroupUser.noteName == ''">
										<p class="user_message" v-html="groupUser.groupInfo.newGroupMessage.fromGroupUser.userInfo.nickName+': 撤回了一条消息'"></p>
									</template>
									<template v-else>
										<p class="user_message" v-html="groupUser.groupInfo.newGroupMessage.fromGroupUser.noteName+': 撤回了一条消息'"></p>
									</template>
								</template>
							</template>
						</div>
						<div class="user_time">
							<template v-if="groupUser.groupInfo.newGroupMessage!=null">
								<p>{{groupUser.groupInfo.newGroupMessage.sendTime|parseDate}}</p>
							</template>
						</div>
					</li>
				</ul>
				<!-- 添加群 -->
				<div class="add_group" @click="addGroupInfoDialogShow()">
					<span class="el-icon-plus"></span>
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
	import $ from 'jquery'
	export default{
		data(){
			return{
				userInfo:{},//自己的信息
				groupUsers:[],//群，群用户信息
				groupInfo:{},//搜索的群信息
				groupNum:'',//群号
				addGroupInfoDialog:{//创建群模态框
					show:false,
					dialogVisible:false,//编辑图片大图查看
					avatarList:[],//图片集合
					editGroupInfo:{
						groupName:'',//群名称
						avatar:'',//群头像
						description:'',//群描述
					},
					editGroupInfoRules:{
						groupName: [
						  { required: true, message: "请输入群名称", trigger: "blur" },
						  { max: 12, message: '长度在12个字符以内' }
						],
					}
				},
			}
		},
		mounted() {
			//获得用户信息
			this.userInfo = this.$store.getters.getUserInfo
			//查询所有群，群最新信息
			this.queryGroupUsers()
		},
		methods:{
			goTo(name,groupUser){//跳转路由
				this.$router.push({ name: 'groupInfo' })
				this.$router.push({ name: name ,params:{groupUser:groupUser}})
			},
			queryGroupUsers(){//查询所有群，群最新信息
				this.$http.get('/groupUser',{
					params:{
						userId:this.userInfo.id
					}
				}).then(res=>{
					//console.log(res.data)
					if(res.data.code == '200'){
						this.groupUsers = res.data.data
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			groupInfoPopoverShow(){//显示搜索群信息触发
				this.$http.get('/groupInfo/getByNum',{
					params:{
						groupNum:this.groupNum
					}
				}).then(res=>{
					if(res.data.code == '200'){
						this.groupInfo = res.data.data
						if(this.groupInfo==null){
							this.groupInfo={}
						}
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			groupInfoPopoverHide(){//隐藏搜索群信息触发
				this.groupInfo={}
				this.groupNum=''
			},
			existGroup(){//群列表是否存在该群
				var res = false
				this.groupUsers.forEach(item=>{
					if(item.groupInfo.id == this.groupInfo.id){
						res = true
						return
					}
				})
				return res
			},
			sendGroupVerifyMessage(){//发送添加群请求
				var data={
					fromUserId:this.userInfo.id,
					toGroupId:this.groupInfo.id,
					content:'请求添加群',
					status:0,//状态未处理
				}
				this.$http.post('/groupVerifyMessage/add',data)
				.then(res=>{
					if(res.data.code == '200'){
						if(res.data.data){
							this.$message.success('请求发送成功')
						}else{
							this.$message.warning('已发送请求')
						}
						
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
				
			},
			/* 创建群 start */
			addGroupInfoDialogShow(){//打开群编辑模态框
				this.addGroupInfoDialog.show = true
			 	this.addGroupInfoDialog.editGroupInfo = JSON.parse(JSON.stringify(this.groupInfo))
				this.addGroupInfoDialog.avatarList=[]
			},
			addGroupInfoDialogClose(){//关闭群编辑模态框
				this.addGroupInfoDialog.avatarList=[]
				this.$refs["addGroupFrom"].resetFields();//清空对话框里面的值
			},
			handleRemove(file, fileList) {//删除图片回调
				this.addGroupInfoDialog.editGroupInfo.avatar = ''
				this.addGroupInfoDialog.avatarList=fileList //可能有误
			},
			handlePictureCardPreview(file) {//点击查看图片
			  this.addGroupInfoDialog.dialogVisible = true;
			},
			handleSuccess(response, file, fileList){//上传成功回调
			  if(response.code == 200){
					this.addGroupInfoDialog.avatarList=fileList //可能有误
					this.addGroupInfoDialog.editGroupInfo.avatar = response.data
				}
			},
			beforeUpload(file){//上传之前调用
				var testmsg = /^image\/(jpeg|png|jpg|gif)$/.test(file.type)
				const isLt5M = file.size / 1024 / 1024 < 5
				if (!testmsg) {
				  this.$message.error('上传图片格式不对!')
				}
				if (!isLt5M) {
				  this.$message.error('上传头像图片大小不能超过 2MB!')
				}
					
			  return testmsg && isLt5M
			},
			getTimeToString(val){//时间转字符串
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
			    var curTime = year  + mouth + day + hour + minutes + second;
			    return curTime
			},
			editGroupInfo(){//确认创建群信息
				this.$refs["addGroupFrom"].validate(valid => {
				  if (valid) {//校验通过
					if(this.addGroupInfoDialog.avatarList.length == 0){
						this.$message.warning('请选择图片')
						return
					}
					
					var data = {
						groupInfo:{
							groupNum:this.getTimeToString(new Date()),//群号码
							groupName:this.addGroupInfoDialog.editGroupInfo.groupName,//群名称
							avatar:this.addGroupInfoDialog.editGroupInfo.avatar,//群头像
							description:this.addGroupInfoDialog.editGroupInfo.description,//群描述
						},
						userId:this.userInfo.id,
					}
					
					//添加操作
					this.$http.post('/groupInfo/add',data)
					.then(res=>{
						//console.log(res.data)
						if(res.data.code == '200'){
							this.$message.success('创建成功')
							this.addGroupInfoDialog.show = false
							//重新查群
							this.queryGroupUsers()
							//聊天滚动条置底又滑动效果
							this.scrollTheBottomTime()
						}
						else if(res.data.code == '500'){
							this.$message.error(res.data.msg)
						}
					})
				  }
				})
			},
			scrollTheBottomTime(){//聊天滚动条置底又滑动效果
				/*
				Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。
				$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 。
				*/
				this.$nextTick(() => {
					var container = $('.office_text_group .el-scrollbar__wrap')
					//容器高度
					var scrollHeight = container[0].scrollHeight
					container.animate({
						scrollTop:scrollHeight
					},700)
				})
			},
			/* 创建群 end */
			
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
				
			}
		},
		computed: {
		    key() {
		        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
		    }
		 },
		watch:{
			'$store.state.socket.newMsg':function(newMsg,oldMsg){//监听最新消息变化
				if(newMsg.type == 'GROUP_MSG'){
					this.queryGroupUsers()
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
	    font-size: 20px;
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
	.office_text_group {
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
	
	/* 添加群 start */
	.add_group{
		text-align: center;
		background-color: white;
		padding: 6px;
		border-bottom: 1px solid #EBEEF5;
		cursor: pointer;
	}
	.add_group:hover{
		background-color: #e5fcfd;
		
	}
	
	.add_group>span{
		
		font-size: 12px;
		display: block;
		color: #aaaaaa;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	/* 添加群 start */
	
</style>

