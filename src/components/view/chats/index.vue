<template>
	<div class="main_chat">
		<!-- 个人信息 start -->
		<el-popover
			ref="userInfoPopover"
		    placement="right-start"
		    width="300"
		    trigger="click">
			<div class="am-dropdown-content">
				<div class="own_head_top">
					<div class="own_head_top_text">
						<p class="own_name">{{userInfo.nickName}}
						<span v-show="userInfo.gender==0" title="男" class="el-icon-user-solid own_gender_0"></span>
						<span v-show="userInfo.gender==1" title="女" class="el-icon-user-solid own_gender_1"></span>
						</p>
						
						<img :src="userInfo.avatar" alt="">
						<p v-if="userInfo.phone!=''&&userInfo.phone!=null" class="own_numb">号码：{{userInfo.phone}}</p>
						<p v-if="userInfo.email!=''&&userInfo.email!=null" class="own_numb">邮箱：{{userInfo.email}}</p>
						<p v-if="userInfo.address!=''&&userInfo.address!=null" class="own_numb">地址：{{userInfo.address}}</p>
						<p v-if="userInfo.description!=''&&userInfo.description!=null" class="own_numb">个人描述：{{userInfo.description}}</p>
					</div>
				</div>
				<div class="own_head_bottom">
					<el-tooltip content="编辑个人信息" placement="top">
						<i class="el-icon-edit" @click="editUserInfoDialogShow()"></i>
					</el-tooltip>
					<el-tooltip content="修改密码" placement="top">
						<i class="el-icon-unlock"></i>
					</el-tooltip>
				</div>
			</div>
		  </el-popover>
		<!-- 个人信息 end -->
		<!-- 编辑个人信息 start -->
		<el-dialog
		  :visible.sync="editUserInfoDialog.show"
		  top="40px"
		  width="500px"
		  center
		  @close="editUserInfoDialogClose"
		  >
		  <el-form
		  		:inline="true"
		  		:model="editUserInfoDialog.editUserInfo"
		  		ref="editUserFrom"
		  		class="demo-form-inline"
		  		:rules="editUserInfoDialog.editUserInfoRules"
				label-position="right"
				label-width="80px"
		  	>
		  		<el-form-item label="昵称" prop="nickName">
		  			<el-input v-model="editUserInfoDialog.editUserInfo.nickName" size="small" style="width: 250px;"></el-input>
		  		</el-form-item>
				<br />
				<el-form-item label="性别" prop="gender">
					<el-radio-group v-model="editUserInfoDialog.editUserInfo.gender">
					    <el-radio :label="0">男</el-radio>
					    <el-radio :label="1">女</el-radio>
					  </el-radio-group>
				</el-form-item>
				<br />
				<el-form-item label="头像" class="my-el-form-item">
					<el-upload
					  action="http://localhost:8080/api/file/upload"
					  list-type="picture-card"
					  :limit='1'
					  :on-preview="handlePictureCardPreview"
					  :on-remove="handleRemove"
					  :on-success="handleSuccess"
					  :before-upload="beforeUpload"
					  :file-list="editUserInfoDialog.avatarList"
					  accept="image/jpeg,image/jpg,image/png"
					  >
					  <i class="el-icon-plus"></i>
					</el-upload>
					<!-- 大图查看 -->
					<el-dialog :visible.sync="editUserInfoDialog.dialogVisible" append-to-body top="20px">
					  <img width="100%" height="550px" :src="editUserInfoDialog.editUserInfo.avatar" alt="">
					</el-dialog>
				</el-form-item>
				<br />
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editUserInfoDialog.editUserInfo.email" size="small" style="width: 250px;"></el-input>
				</el-form-item>
				<br />
				<el-form-item label="地址" prop="address">
					<el-input v-model="editUserInfoDialog.editUserInfo.address" size="small" style="width: 250px;"></el-input>
				</el-form-item>
				<br />
				<el-form-item label="描述" prop="description" class="my-el-form-item">
					<el-input maxlength="100" show-word-limit :autosize="{ minRows: 4, maxRows: 8}" type="textarea" v-model="editUserInfoDialog.editUserInfo.description" style="width: 250px;"></el-input>
				</el-form-item>
		  		
		  		
		  	</el-form>
		  	
		  	<span slot="footer" class="dialog-footer">
		  		<el-button @click="editUserInfoDialog.show = false" size="small">取 消</el-button>
		  		<el-button type="primary" @click="editUserInfo()" size="small">编 辑</el-button>
		  	</span>
		  </el-dialog>
		</el-dialog>
		<!-- 编辑个人信息 end -->
		
		<!-- 编辑个人信息 start -->
		<el-dialog
		  :visible.sync="verifyDialog.show"
		  top="40px"
		  width="800px"
		  center
		  @close="verifyDialogClose"
		  >
			<div>
				<el-tabs v-model="verifyDialog.activeName" type="border-card" style="width: 100%;height: 100%;">
				    <el-tab-pane label="好友验证消息" name="first">
						<el-table
							:data="verifyDialog.friendVerifyPageInfo.list"
							style="width: 100%">
							<el-table-column
							  prop="sendTime"
							  label="时间"
							  width="170">
							</el-table-column>
							<el-table-column
							  label="对方信息"
							  width="160">
								<template slot-scope="scope">
									<!-- 对方信息 start -->
									<template v-if="userInfo.id != scope.row.fromUserInfo.id">
										<el-popover
											ref="otherUserInfoPopover"
											placement="left-start"
											width="300"
											trigger="click">
											<div class="am-dropdown-content">
												<div class="own_head_top">
													<div class="own_head_top_text">
														<p class="own_name">{{scope.row.fromUserInfo.nickName}}
														<span v-show="scope.row.fromUserInfo.gender==0" title="男" class="el-icon-user-solid own_gender_0"></span>
														<span v-show="scope.row.fromUserInfo.gender==1" title="女" class="el-icon-user-solid own_gender_1"></span>
														</p>
														
														<img :src="scope.row.fromUserInfo.avatar" alt="">
														<p v-if="scope.row.fromUserInfo.phone!=''&&scope.row.fromUserInfo.phone!=null" class="own_numb">号码：{{scope.row.fromUserInfo.phone}}</p>
														<p v-if="scope.row.fromUserInfo.email!=''&&scope.row.fromUserInfo.email!=null" class="own_numb">邮箱：{{scope.row.fromUserInfo.email}}</p>
														<p v-if="scope.row.fromUserInfo.address!=''&&scope.row.fromUserInfo.address!=null" class="own_numb">地址：{{scope.row.fromUserInfo.address}}</p>
														<p v-if="scope.row.fromUserInfo.description!=''&&scope.row.fromUserInfo.description!=null" class="own_numb">个人描述：{{scope.row.fromUserInfo.description}}</p>
													</div>
												</div>
											</div>
											<el-tag slot="reference" style="cursor: pointer;">{{scope.row.fromUserInfo.nickName}}</el-tag>
										  </el-popover>
									  </template>
									  <template v-else>
										  <el-popover
										  	ref="otherUserInfoPopover"
										      placement="left-start"
										      width="300"
										      trigger="click">
										  	<div class="am-dropdown-content">
										  		<div class="own_head_top">
										  			<div class="own_head_top_text">
										  				<p class="own_name">{{scope.row.toUserInfo.nickName}}
										  				<span v-show="scope.row.toUserInfo.gender==0" title="男" class="el-icon-user-solid own_gender_0"></span>
										  				<span v-show="scope.row.toUserInfo.gender==1" title="女" class="el-icon-user-solid own_gender_1"></span>
										  				</p>
										  				<img :src="scope.row.toUserInfo.avatar" alt="">
										  				<p v-if="scope.row.toUserInfo.phone!=''&&scope.row.toUserInfo.phone!=null" class="own_numb">号码：{{scope.row.toUserInfo.phone}}</p>
										  				<p v-if="scope.row.toUserInfo.email!=''&&scope.row.toUserInfo.email!=null" class="own_numb">邮箱：{{scope.row.toUserInfo.email}}</p>
										  				<p v-if="scope.row.toUserInfo.address!=''&&scope.row.toUserInfo.address!=null" class="own_numb">地址：{{scope.row.toUserInfo.address}}</p>
										  				<p v-if="scope.row.toUserInfo.description!=''&&scope.row.toUserInfo.description!=null" class="own_numb">个人描述：{{scope.row.toUserInfo.description}}</p>
										  			</div>
										  		</div>
										  	</div>
										  	<el-tag slot="reference" style="cursor: pointer;">{{scope.row.toUserInfo.nickName}}</el-tag>
										    </el-popover>
									  </template>
									<!-- 对方信息 end -->
								</template>
							</el-table-column>
							<el-table-column
							  label="验证消息"
							  prop="content"
							  width="180">
							</el-table-column>
							<el-table-column
							  label="状态"
							  width="180">
							  <template slot-scope="scope">
								<template v-if="userInfo.id == scope.row.fromUserInfo.id">
									<el-link v-if="scope.row.status==0" type="info">等待对方验证</el-link>
									<el-link v-else-if="scope.row.status==1" type="success">对方已同意</el-link>
									<el-link v-else-if="scope.row.status==2" type="danger">对方已拒绝</el-link>
									<el-link v-else-if="scope.row.status==3" type="warning">已解除好友关系</el-link>
								</template>
								<template v-else>
									<template v-if="scope.row.status==0">
										<el-button @click="consentFriendVerify(scope.row)" size="mini" type="success">同意</el-button>
										<el-button @click="refuseFriendVerify(scope.row)" size="mini" type="danger">拒绝</el-button>
									</template>
									<el-link v-else-if="scope.row.status==1" type="success">已同意</el-link>
									<el-link v-else-if="scope.row.status==2" type="danger">已拒绝</el-link>
									<el-link v-else-if="scope.row.status==3" type="warning">对方已和你解除好友关系</el-link>
								</template>
							  </template>
							</el-table-column>
						</el-table>
						<!-- 分页 -->
						<div style="margin-top: 20px;float: right;">
							<el-pagination
							background
							layout="total, prev, pager, next"
							:current-page="verifyDialog.friendVerifyPageInfo.pageNum"
							:page-size="verifyDialog.friendVerifyPageInfo.pageSize"
							:total="verifyDialog.friendVerifyPageInfo.total"
							@current-change="friendVerifyPageNumChange"
							>
							</el-pagination>
						</div>
					</el-tab-pane>
				    <el-tab-pane label="群验证消息" name="second">
						<el-table
							:data="verifyDialog.groupVerifyPageInfo.list"
							style="width: 100%">
							<el-table-column
							  prop="sendTime"
							  label="时间"
							  width="170">
							</el-table-column>
							<el-table-column
							  label="群信息"
							  width="160">
								<template slot-scope="scope">
									<el-popover
										placement="left-start"
										width="300"
										trigger="click"
										>
										<div class="am-dropdown-content">
											<div class="own_head_top">
												<div class="own_head_top_text">
													<p class="own_name">{{scope.row.toGroupInfo.groupName}}</p>
													<img :src="scope.row.toGroupInfo.avatar" alt="">
													<p class="own_numb">群号：{{scope.row.toGroupInfo.groupNum}}</p>
													<p class="own_numb">创群时间：{{scope.row.toGroupInfo.buildTime}}</p>
													<p class="own_numb">描述：{{scope.row.toGroupInfo.description}}</p>
												</div>
											</div>
										</div>
										<el-tag slot="reference" style="cursor: pointer;">{{scope.row.toGroupInfo.groupName}}</el-tag>
									</el-popover>
									
								</template>
							</el-table-column>
							<el-table-column
							  label="验证消息"
							  prop="content"
							  width="180">
							</el-table-column>
							<el-table-column
							  label="状态"
							  width="180">
							  <template slot-scope="scope">
								<el-link v-if="scope.row.status==0" type="info">等待验证</el-link>
								<el-link v-else-if="scope.row.status==1" type="success">已同意</el-link>
								<el-link v-else-if="scope.row.status==2" type="danger">已拒绝</el-link>
								<el-link v-else-if="scope.row.status==3" type="warning">已被移出该群</el-link>
							  </template>
							</el-table-column>
						</el-table>
						<!-- 分页 -->
						<div style="margin-top: 20px;float: right;">
							<el-pagination
							background
							layout="total, prev, pager, next"
							:current-page="verifyDialog.groupVerifyPageInfo.pageNum"
							:page-size="verifyDialog.groupVerifyPageInfo.pageSize"
							:total="verifyDialog.groupVerifyPageInfo.total"
							@current-change="groupVerifyPageNumChange"
							>
							</el-pagination>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
			<!-- 发送好友请求 模态框 start -->
			<el-dialog
			  title="选择分组"
			  :visible.sync="friendVerifyDialongParam.show"
			  width="400px"
			  center
			  append-to-body
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
			  
			  <span slot="footer" class="dialog-footer">
					<el-button @click="friendVerifyDialongParam.show = false" size="medium">取 消</el-button>
					<el-button type="primary" @click="doConsentFriendVerify()" size="medium">确认</el-button>
			  </span>
			</el-dialog>
		  </el-dialog>
		
		<div class="center-in-center">
			<!-- 左侧导航 -->
			<div class="sidestrip">
				<div class="am-dropdown" data-am-dropdown="">
					<!-- 头像 -->
					<!-- <div class="own_head am-dropdown-toggle"></div> -->
					<el-avatar v-popover:userInfoPopover class="own_head" shape="square" :size="34" :src="userInfo.avatar"></el-avatar>
				</div>
				<!-- 左侧三图标导航 -->
				<div class="sidestrip_icon">
					<a id="si_1" class="si_1_show" @click="goTo('groupInfo')"></a>
					<a id="si_2" class="si_2" @click="goTo('friendType')"></a>
					<a id="si_2" class="si_3" @click="verifyDialogShow()"></a>
				</div>
			</div>
			<!-- 消息导航 -->
			<router-view></router-view>
		</div>
		
	</div>
</template>

<script>
	
	export default{
		mounted() {//初始化
			//获得用户信息
			this.userInfo = this.$store.getters.getUserInfo
		},
		destroyed() {//销毁
			
		},
		methods:{
			goTo(name){
				this.$router.push({name:name})
			},
			/* 编辑个人信息 start*/
			editUserInfoDialogShow(){//打开群编辑模态框
				this.editUserInfoDialog.show = true
			 	this.editUserInfoDialog.editUserInfo = JSON.parse(JSON.stringify(this.userInfo))
				this.editUserInfoDialog.avatarList=[{url:this.editUserInfoDialog.editUserInfo.avatar}]
			},
			editUserInfoDialogClose(){//关闭群编辑模态框
				this.editUserInfoDialog.avatarList=[]
				this.$refs["editUserFrom"].resetFields();//清空对话框里面的值
			},
			handleRemove(file, fileList) {//删除图片回调
				this.editUserInfoDialog.editUserInfo.avatar = ''
				this.editUserInfoDialog.avatarList=fileList //可能有误
			},
			handlePictureCardPreview(file) {//点击查看图片
			  this.editUserInfoDialog.dialogVisible = true;
			},
			handleSuccess(response, file, fileList){//上传成功回调
			  if(response.code == 200){
					this.editUserInfoDialog.avatarList=fileList //可能有误
					this.editUserInfoDialog.editUserInfo.avatar = response.data
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
			editUserInfo(){//确认个人信息
				this.$refs["editUserFrom"].validate(valid => {
				  if (valid) {//校验通过
					if(this.editUserInfoDialog.avatarList.length == 0){
						this.$message.warning('请选择图片')
						return
					}
					//修改操作
					// console.log(this.editUserInfoDialog.editUserInfo)
					this.$http.post('/userInfo/edit',this.editUserInfoDialog.editUserInfo)
					.then(res=>{
						// console.log(res.data)
						if(res.data.code == '200'){
							this.$message.success('修改成功')
							//重新赋值群信息
							this.userInfo = JSON.parse(JSON.stringify(this.editUserInfoDialog.editUserInfo))
							this.$store.commit('setUserInfo',this.userInfo)
							this.editUserInfoDialog.show = false
						}
						else if(res.data.code == '500'){
							this.$message.error(res.data.msg)
						}
					})
				  }
				})
			},
			/* 编辑个人信息 end*/
			
			/* 验证消息 start */
			verifyDialogShow(){//打开验证消息
				this.verifyDialog.show = true
				//查询分组信息
				this.queryFriendType()
				/* 查询群所有群验证消息 */
				this.queryGroupVerifyMessage()
				/* 查询群所有好友验证消息 */
				this.queryFriendVerifyMessage()
				
			},
			verifyDialogClose(){//关闭验证消息
				
			},
			groupVerifyPageNumChange(pageNum){//群验证消息当前页发送改变
				this.verifyDialog.groupVerifyPageInfo.pageNum = pageNum
				this.queryGroupVerifyMessage()
			},
			friendVerifyPageNumChange(pageNum){//好友验证消息当前页发送改变
				this.verifyDialog.friendVerifyPageInfo.pageNum = pageNum
				this.queryFriendVerifyMessage()
			},
			consentFriendVerify(friendVerify){//同意好友请求
				//查询分组信息
				this.queryFriendType()
				this.friendVerifyDialongParam.show=true
				this.friendVerifyDialongParam.friendVerify.id = friendVerify.id
				this.friendVerifyDialongParam.friendVerify.otherFriendTypeId = friendVerify.friendTypeId
				this.friendVerifyDialongParam.friendVerify.fromUserInfo = friendVerify.fromUserInfo
			},
			friendVerifyDialongOpen(){//打开同意模态框完成回掉
				this.$jquery(".el-select-dropdown__wrap").css("margin-bottom","0px")
			},
			friendVerifyDialongClose(){//关闭同意回调
				this.friendVerifyDialongParam.friendVerify={
					id:null,
					friendTypeId:null,
					otherFriendTypeId:null,
					fromUserInfo:{},
				}
			},
			doConsentFriendVerify(){//确认同意
				var friendVerify = this.friendVerifyDialongParam.friendVerify
				if(friendVerify.friendTypeId==null){
					this.$message.warning('请选择分组')
					return
				}
				var data={
					id:friendVerify.id,
					toUserId:this.userInfo.id,
					fromUserId:friendVerify.fromUserInfo.id,
					status:1,
					friendTypeId:friendVerify.friendTypeId,
					otherFriendTypeId:friendVerify.otherFriendTypeId
				}
				this.$http.post('/friendVerifyMessage/editStatus',data)
				.then(res=>{
					if(res.data.code == '200'){
						this.$message.success('成功添加好友')
						//关闭添加好友模态框
						this.friendVerifyDialongParam.show=false
						//查询群所有好友验证消息
						this.queryFriendVerifyMessage()
						//发送好友消息
						var data2={
							type: 'FRIEND_MSG',
							from:this.userInfo.id,
							destination:friendVerify.fromUserInfo.id,
							friendMessage:{
								content:'我们已经是好友了,一起来聊天吧',
								isBack:0,
								fileUrl:'0',
								fileName:'0',
							}
						}
						//发送消息
						this.$store.dispatch('sendMessage',data2);
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			refuseFriendVerify(friendVerify){//拒绝好友请求
				friendVerify.status = 2
				this.$http.post('/friendVerifyMessage/editStatus',friendVerify)
				.then(res=>{
					if(res.data.code == '200'){
						
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			queryGroupVerifyMessage(){//查询群所有群验证消息
				this.$http.get('/groupVerifyMessage/getByToUserId',{
					params:{
						pageNum:this.verifyDialog.groupVerifyPageInfo.pageNum,
						pageSize:this.verifyDialog.groupVerifyPageInfo.pageSize,
						fromUserId:this.userInfo.id,
					}
				}).then(res=>{
					if(res.data.code == '200'){
						this.verifyDialog.groupVerifyPageInfo = res.data.data
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			},
			queryFriendVerifyMessage(){ //查询群所有好友验证消息 
				this.$http.get('/friendVerifyMessage/getToUserId',{
					params:{
						pageNum:this.verifyDialog.friendVerifyPageInfo.pageNum,
						pageSize:this.verifyDialog.friendVerifyPageInfo.pageSize,
						toUserId:this.userInfo.id,
					}
				}).then(res=>{
					if(res.data.code == '200'){
						this.verifyDialog.friendVerifyPageInfo = res.data.data
					}else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
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
					}else{
						this.$message({
							type:'error',
							message:result.msg
						})
					}
					
				})
				
			},
			/* 验证消息 end */
			
		},
		data(){
			return {
				userInfo:{},//个人信息
				editUserInfoDialog:{//编辑个人信息模态框
					show:false,
					dialogVisible:false,//编辑图片大图查看
					avatarList:[],//图片集合
					editUserInfo:{
						nickName:'',//昵称
						avatar:'',//头像
						gender:'',//性别
						email:'',//邮箱
						phone:'',//号码
						address:'',//地址
						description:'',//群描述
					},
					editUserInfoRules:{
						nickName: [
						  { required: true, message: "请输入群名称", trigger: "blur" },
						  { max: 12, message: '长度在12个字符以内' }
						],
						address: [
						  { required: false, trigger: "blur" },
						  { max: 20, message: '长度在20个字符以内' }
						],
						email:[
							{ required: true, message: '请输入邮箱', trigger: 'blur' },
							{ type: 'email', message: '请输入正确的邮箱', trigger: ['blur', 'change'] }
						],
					},
				},
				verifyDialog:{//验证消息模态框
					show:false,
					activeName: 'first',
					groupVerifyPageInfo:{//群分页消息
						list:[],
						pageNum:1,
						pageSize:7,
						total:0,
					},
					friendVerifyPageInfo:{//好友验证分页消息
						list:[],
						pageNum:1,
						pageSize:7,
						total:0,
					},
				},
				friendTypeInfo:{},//所有分组信息
				friendVerifyDialongParam:{//好友同意模态框
					show:false,
					friendVerify:{
						id:null,
						friendTypeId:null,
						otherFriendTypeId:null,
						fromUserInfo:{},//对方用户信息
					}
				},
			}
		},
		computed:{
			count(){
				return this.$store.state.socket.newMsg
			}
		},
		watch:{
			'$store.state.socket.newMsg':function(newMsg,oldMsg){
				
			},
			$route(to,from){//监听当前路由变化
				if(to.path == '/groupInfo'){
					this.$jquery('#si_1').attr('class','si_1_show')
					this.$jquery('#si_2').attr('class','si_2')
					this.$jquery('#si_3').attr('class','si_3')
				}else if(to.path == '/friendType'){
					this.$jquery('#si_1').attr('class','si_1')
					this.$jquery('#si_2').attr('class','si_2_show')
					this.$jquery('#si_3').attr('class','si_3')
				}
			}
		}
	}
</script>

<style scoped="scoped">
	.main_chat{
		width: 100%;
		height: calc(100% - 50px);
		margin-top: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	/* 主居中模块 */
	.center-in-center {
		position: absolute;
		width: 860px;
		height: 580px;
	}
	
	.sidestrip {
	    width: 60px;
	    background: #1c4671;
		border-radius: 5px;
	    float: left;
	    height: 100%;
	    /* border-radius: 4px 0 0 4px; */
	    padding-top: 20px;
	    position: relative;
	}
	.am-dropdown {
	    position: relative;
	    display: inline-block;
	}
	.own_head {
	    margin-left: 13px;
	}
	
	
	/* 左侧3图标导航 */
	.sidestrip_icon {
	    margin-top: 30px;
	    padding: 0 18px;
	    width: 60px;
	}
	.sidestrip_icon a {
	    width: 100%;
	    height: 24px;
	    display: block;
	    margin-bottom: 30px;
	}
	.si_1 {
		background: url(../../../assets/images/icon/head_2.png) no-repeat;
		cursor: pointer;
	}
	.si_1_show{
		background: url(../../../assets/images/icon/head_2_1.png) no-repeat;
	}
	
	.si_2 {
		background: url(../../../assets/images/icon/head_3.png) no-repeat;
		cursor: pointer;
	}
	.si_2_show {
		background: url(../../../assets/images/icon/head_3_1.png) no-repeat;
	}
	
	.si_3 {
		background: url(../../../assets/images/icon/head_4.png) no-repeat;
		cursor: pointer;
	}
	.si_3_show {
		background: url(../../../assets/images/icon/head_4_1.png) no-repeat;
	}
	
</style>

