<template>
    <div class="user-chat">
		<!-- 消息右键 -->
		<v-contextmenu ref="msg-contextmenu">
			<v-contextmenu-item @click="copyMessage()" v-show="isCopyMsg">复制消息</v-contextmenu-item>
			<v-contextmenu-item divider v-show="isWithdraw&&isCopyMsg"></v-contextmenu-item>
			<v-contextmenu-item @click="withdrawMessage()" v-show="isWithdraw">撤回消息</v-contextmenu-item>
		</v-contextmenu>
		<!-- 群用户右键 -->
		<v-contextmenu ref="group-user-contextmenu">
			<v-contextmenu-item @click="lookOverUserInfoPopover()">查看资料</v-contextmenu-item>
			<div v-show="(fromGroupUser.groupRole==0)&&groupUsersDrawer.groupUserContextmenu.groupUser.groupRole == 2">
				<v-contextmenu-item divider></v-contextmenu-item>
				<v-contextmenu-item @click="setAdmin()">设为管理员</v-contextmenu-item>
			</div>
			<div v-show="(fromGroupUser.groupRole==0)&&groupUsersDrawer.groupUserContextmenu.groupUser.groupRole == 1">
				<v-contextmenu-item divider></v-contextmenu-item>
				<v-contextmenu-item @click="delAdmin()">取消管理员资格</v-contextmenu-item>
			</div>
			<div v-show="(fromGroupUser.groupRole==0)&&groupUsersDrawer.groupUserContextmenu.groupUser.id != this.fromGroupUser.id">
				<v-contextmenu-item divider></v-contextmenu-item>
				<v-contextmenu-item @click="groupManagerTransfer()">群主转让</v-contextmenu-item>
			</div>
			<div v-show="groupUsersDrawer.groupUserContextmenu.groupUser.groupRole>fromGroupUser.groupRole||groupUsersDrawer.groupUserContextmenu.groupUser.userInfo.id == userInfo.id">
				<v-contextmenu-item divider></v-contextmenu-item>
				<v-contextmenu-item @click="editGroupNotename()">修改群昵称</v-contextmenu-item>
			</div>
			<div v-show="groupUsersDrawer.groupUserContextmenu.groupUser.id != this.fromGroupUser.id&&groupUsersDrawer.groupUserContextmenu.groupUser.groupRole>fromGroupUser.groupRole&&groupUsersDrawer.groupUserContextmenu.groupUser.isSilent==0">
				<v-contextmenu-item divider></v-contextmenu-item>
				<v-contextmenu-item @click="bannedPost()">禁止此人发言</v-contextmenu-item>
			</div>
			<div v-show="groupUsersDrawer.groupUserContextmenu.groupUser.id != this.fromGroupUser.id&&groupUsersDrawer.groupUserContextmenu.groupUser.groupRole>fromGroupUser.groupRole&&groupUsersDrawer.groupUserContextmenu.groupUser.isSilent==1">
				<v-contextmenu-item divider></v-contextmenu-item>
				<v-contextmenu-item @click="unfastenBannedPost()">解除禁言</v-contextmenu-item>
			</div>
			<div v-show="groupUsersDrawer.groupUserContextmenu.groupUser.id != this.fromGroupUser.id&&groupUsersDrawer.groupUserContextmenu.groupUser.groupRole>fromGroupUser.groupRole">
				<v-contextmenu-item divider></v-contextmenu-item>
				<v-contextmenu-item @click="groupUserRemove()">从本群移除</v-contextmenu-item>
			</div>
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
					<template v-if="msg.fromGroupUser.noteName == null || msg.fromGroupUser.noteName == ''">
						<span>{{msg.fromGroupUser.userInfo.nickName}}</span>
					</template>
					<template v-else>
						<span>{{msg.fromGroupUser.noteName}}</span>
					</template>
					<span>（{{msg.sendTime}}）</span>
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
						<template v-if="msg.fileUrl == '1'">
							<span v-html="msg.content" 
							style="color: #AAAAAA;font-size: 13px;-webkit-user-select: none;
							-moz-user-select: none;
							-ms-user-select: none;
							user-select: none;"></span>
						</template>
						<template v-else-if="msg.fileUrl == '0'">
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
									<div slot="error" class="image-slot" style="color: #AAAAAA;text-align: center;line-height: 150px;font-size: 15px;">
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
		
		<!-- 群成员信息 start -->
		<el-drawer
		  title="群成员"
		  :visible.sync="groupUsersDrawer.show"
		  :with-header="false"
		  @closed="groupUsersDrawerClose"
		  @opened="groupUsersDrawerShowEnd"
		  size="20%"
		>
		  <div class="group_users">
			<div class="group_users_head">
				<span v-html="'当前在线 '+userOnlineCount()"></span><span>/</span><span v-html="groupUsersDrawer.groupUsers.length"></span>
			</div>
			<el-scrollbar class="group_users_body">
				<div class="group_users_item" v-for="(groupUser,index) in groupUsersDrawer.groupUsers" v-contextmenu:group-user-contextmenu @contextmenu.prevent="setGroupUserContextmenu(groupUser,index)">
					<el-popover
						ref="userInfoPopover"
					    placement="left-start"
					    width="300"
						:visible-arrow="false"
					    trigger="click">
						<div class="am-dropdown-content">
							<div class="own_head_top">
								<div class="own_head_top_text">
									<p class="own_name">
									<template v-if="groupUser.noteName==null||groupUser.noteName==''">
										{{groupUser.userInfo.nickName}}
									</template>
									<template v-else>
										{{groupUser.noteName}}
									</template>
									<span v-if="groupUser.userInfo.gender==0" title="男" class="el-icon-user-solid own_gender_0"></span>
									<span v-if="groupUser.userInfo.gender==1" title="女" class="el-icon-user-solid own_gender_1"></span>
									</p>
									<img :src="groupUser.userInfo.avatar" alt="">
									<p v-if="groupUser.userInfo.phone!=''&&groupUser.userInfo.phone!=null" class="own_numb">号码：{{groupUser.userInfo.phone}}</p>
									<p v-if="groupUser.userInfo.email!=''&&groupUser.userInfo.email!=null" class="own_numb">邮箱：{{groupUser.userInfo.email}}</p>
									<p v-if="groupUser.userInfo.address!=''&&groupUser.userInfo.address!=null" class="own_numb">地址：{{groupUser.userInfo.address}}</p>
									<p v-if="groupUser.userInfo.description!=''&&groupUser.userInfo.description!=null" class="own_numb">个人描述：{{groupUser.userInfo.description}}</p>
									<p class="own_numb">入群时间：{{groupUser.joinTime}}</p>
								</div>
							</div>
							<div class="own_head_bottom">
								<el-tooltip content="发送添加请求" placement="top" v-show="!existFriendUser(groupUser.userInfo.id)">
									<i class="el-icon-plus" @click="friendVerifyDialongShow(groupUser.userInfo.id)"></i>
								</el-tooltip>
							</div>
						</div>
						<div slot="reference">
							<el-avatar @click="groupUsersDrawer.groupUserVisible = true" :title="userIsOnline(groupUser.userInfo.id)?'离线':'在线'" :class="{'user-photo-not-online':userIsOnline(groupUser.userInfo.id)}" class="group_user_avatar" :src="groupUser.userInfo.avatar" shape="square" :size="40"></el-avatar>
						</div>
						</el-popover>
					
					<el-popover
						ref="userInfoNoteNamePopover"
					    placement="left-start"
						width="350"
						:visible-arrow="true"
					    trigger="click">
						<div>
							<el-input placeholder="修改群昵称" size="medium" maxlength="10" show-word-limit v-model="groupUsersDrawer.noteName" style="width: 250px;"></el-input>
							<el-button size="medium" @click="affirmEditGroupNotename()">确认</el-button>
						</div>
						<div class="group_user_name" slot="reference" @click="userInfoNoteNamePopoverClick(index)">
							<template v-if="groupUser.noteName == null || groupUser.noteName == ''">
								<span>{{groupUser.userInfo.nickName}}</span>
							</template>
							<template v-else>
								<span>{{groupUser.noteName}}</span>
							</template>
							<span v-if="groupUser.isSilent==1" class="el-icon-circle-close" title="已被禁言" style="color: #f94646;"></span>
						</div>
					</el-popover>
					
					<span v-if="groupUser.groupRole == 0" title="群主" class="iconfont super_admin_icon">&#xe519;</span>
					<span v-else-if="groupUser.groupRole == 1" title="管理员" class="iconfont admin_icon">&#xe519;</span>
					<span v-else-if="groupUser.userInfo.id == userInfo.id" title="我" class="iconfont common_icon">&#xe519;</span>
				</div>
			</el-scrollbar>
		  </div>
		  <!-- 发送好友请求 模态框 start -->
		  <el-dialog
		    title="发送请求"
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
		  		v-for="friendType in groupUsersDrawer.friendTypeInfo"
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
		</el-drawer>
		<!-- 群成员信息 end -->
		
		<!-- 群信息 start -->
		<el-popover
		    ref="groupInfoPopover"
		    placement="right-start"
		    width="300"
		    trigger="click">
			<div class="am-dropdown-content">
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
					<template v-if="fromGroupUser.groupRole == 0 || fromGroupUser.groupRole == 1">
						<el-tooltip content="编辑群信息" placement="top">
							<i class="el-icon-edit" @click="editGroupInfoDialogShow()"></i>
						</el-tooltip>
						<el-tooltip content="查看群验证消息" placement="top">
							<i class="el-icon-bell" @click="groupVerifyDialogShow()"></i>
						</el-tooltip>
						<template v-if="fromGroupUser.groupRole == 0">
							<el-tooltip content="解散群聊" placement="top">
								<i class="iconfont" @click="dissolveGroup()">&#xe626;</i>
							</el-tooltip>
						</template>
					</template>
					<!-- <p><span>地区</span>{{groupInfo.buildTime}}</p> -->
				</div>
			</div>
		  </el-popover>
		<!-- 群信息 start -->
		
		<!-- 编辑群信息 start -->
		<el-dialog
		  title="编辑群信息"
		  :visible.sync="editGroupInfoDialog.show"
		  top="40px"
		  width="500px"
		  center
		  @close="editGroupInfoDialogClose"
		  >
		  <el-form
		  		:inline="true"
		  		:model="editGroupInfoDialog.editGroupInfo"
		  		ref="editGroupFrom"
		  		class="demo-form-inline"
		  		:rules="editGroupInfoDialog.editGroupInfoRules"
				label-position="right"
				label-width="80px"
		  	>
		  		<el-form-item label="群名称" prop="groupName">
		  			<el-input v-model="editGroupInfoDialog.editGroupInfo.groupName" size="small" style="width: 250px;"></el-input>
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
					  :file-list="editGroupInfoDialog.avatarList"
					  accept="image/jpeg,image/jpg,image/png"
					  >
					  <i class="el-icon-plus"></i>
					</el-upload>
					<!-- 大图查看 -->
					<el-dialog :visible.sync="editGroupInfoDialog.dialogVisible" append-to-body top="20px">
					  <img width="100%" height="550px" :src="editGroupInfoDialog.editGroupInfo.avatar" alt="">
					</el-dialog>
				</el-form-item>
				<br />
				<el-form-item label="描述" prop="description" class="my-el-form-item">
					<el-input maxlength="100" show-word-limit :autosize="{ minRows: 4, maxRows: 8}" type="textarea" v-model="editGroupInfoDialog.editGroupInfo.description" style="width: 250px;"></el-input>
				</el-form-item>
		  		
		  		
		  	</el-form>
		  	
		  	<span slot="footer" class="dialog-footer">
		  		<el-button @click="editGroupInfoDialog.show = false" size="small">取 消</el-button>
		  		<el-button type="primary" @click="editGroupInfo()" size="small">编 辑</el-button>
		  	</span>
		  </el-dialog>
		</el-dialog>
		<!-- 编辑群信息 end -->
		
		<!-- 查看群验证消息 start -->
		<el-dialog
		  :visible.sync="groupVerifyDialog.show"
		  top="40px"
		  width="800px"
		  center
		  @close="groupVerifyDialogClose"
		  >
		  <el-card>
		  <el-table
			:data="groupVerifyDialog.groupVerifyPageInfo.list"
			style="width: 100%">
			<el-table-column
			  prop="sendTime"
			  label="时间"
			  width="170">
			</el-table-column>
			<el-table-column
			  prop="name"
			  label="用户信息"
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
			</el-table-column>
			<el-table-column
			  label="验证消息"
			  prop="content"
			  width="180">
			  <template slot-scope="scope">
				<template>
					<span>请求添加群</span>
				</template>
			  </template>
			</el-table-column>
			<el-table-column
			  label="状态"
			  width="180">
			  <template slot-scope="scope">
				<template v-if="scope.row.status==0">
					<el-button @click="consentGroupVerify(scope.row)" size="mini" type="success">同意</el-button>
					<el-button @click="refuseGroupVerify(scope.row)" size="mini" type="danger">拒绝</el-button>
				</template>
				<el-link v-else-if="scope.row.status==1" type="success">已同意</el-link>
				<el-link v-else-if="scope.row.status==2" type="danger">已拒绝</el-link>
				<el-link v-else-if="scope.row.status==3" type="warning">已被移出该群</el-link>
			  </template>
			</el-table-column>
		  </el-table>
		  <!-- 分页 -->
		  <div style="margin-top: 20px;margin-bottom: 10px ;float: right;">
		  	<el-pagination
		  	background
		  	layout="total, prev, pager, next"
		  	:current-page="groupVerifyDialog.groupVerifyPageInfo.pageNum"
		  	:page-size="groupVerifyDialog.groupVerifyPageInfo.pageSize"
		  	:total="groupVerifyDialog.groupVerifyPageInfo.total"
		  	@current-change="groupVerifyPageNumChange"
		  	>
		  	</el-pagination>
		  </div>
		  </el-card>
		</el-dialog>
		<!-- 查看群验证消息 end -->
		
		<div class="windows_top">
			<div class="windows_top_box">
				<el-tooltip content="查看群信息" placement="top-end">
					<span v-popover:groupInfoPopover>{{groupInfo.groupName}}</span>
				</el-tooltip>
				
				<el-tooltip content="查看群成员" placement="top" v-model="groupUserTooltip">
				  <div class="extend" @click="groupUsersDrawerShow()"></div>
				</el-tooltip>
				
				<ul class="window_icon">
					<!-- <li><a href="#"><img src="../../../assets/images/icon/icon7.png"></a></li> -->
					<!-- <li><a href="#"><img src="../../../assets/images/icon/icon8.png"></a></li> -->
					<!-- <li><a href="#"><img src="../../../assets/images/icon/icon9.png"></a></li> -->
					<li @click="$router.push({name:'groupInfo'})"><a href="#"><img src="../../../assets/images/icon/icon10.png"></a></li>
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
							<template v-if="msg.groupMessage.isBack == 1">
								<template v-if="ifThisWithdraw(msg)">
									<span>
										你撤回了一条消息<a v-show="isReEdit(msg)" href="javascript:;" @click="reEdit(msg)">重新编辑</a>
									</span>
								</template>
								<template v-else>
									<template v-if="msg.groupMessage.fromGroupUser.noteName==null||msg.groupMessage.fromGroupUser.noteName==''">
										<span>{{msg.groupMessage.fromGroupUser.userInfo.nickName}}撤回了一条消息</span>
									</template>
									<template v-else>
										<span>{{msg.groupMessage.fromGroupUser.noteName}}撤回了一条消息</span>
									</template>
								</template>
							</template>
							<template v-if="msg.groupMessage.fileUrl=='1'"><!-- 系统消息 -->
								<span v-html="msg.groupMessage.content"></span>
							</template>
						</li>
						<template v-if="msg.groupMessage.isBack == 0 && msg.groupMessage.fileUrl!='1'">
						<li class="me" v-if="msg.from == userInfo.id">
							<el-avatar class="my_avatar" shape="square" :size="34" :src="msg.groupMessage.fromGroupUser.userInfo.avatar"></el-avatar>
							<template v-if="msg.groupMessage.fileUrl=='0'"><!-- 正常消息 -->
								<span class="my_msg" v-html="msg.groupMessage.content" v-contextmenu:msg-contextmenu @contextmenu.prevent="setContextmenuMsg(msg.groupMessage)"></span>
							</template>
							<template v-else><!-- 文件消息 -->
								<span class="my_msg" v-contextmenu:msg-contextmenu @contextmenu.prevent="setContextmenuMsg(msg.groupMessage)">
									<template v-if="msg.groupMessage.content == '[文件]'">
										<el-card class="my_file">
											<i class="el-icon-document"></i><span style="margin-left: 5px;">文件</span>
											<div style="word-break: break-all;width:auto;display:block;word-wrap:break-word;">
													<span style="">{{msg.groupMessage.fileName}}</span>
											</div>
											<template v-if="msg.groupMessage.progressPercent != null">
												<el-progress :text-inside="true" :stroke-width="18" :percentage="msg.groupMessage.progressPercent" v-show="msg.groupMessage.progressPercent!=100" style="position: relative;top: 10px;"></el-progress>
											</template>
											<el-divider></el-divider>
											<template v-if="msg.groupMessage.fileUrl!=''">
												<a :href="msg.groupMessage.fileUrl" style="float: right;font-size: 14px;margin-top: -15px;margin-right: 10px;">下载</a>
											</template>
										</el-card>
									</template>
									<template v-if="msg.groupMessage.content == '[图片]'">
										<el-image
										class="my_image"
										:src='msg.groupMessage.fileUrl'
										:preview-src-list="[msg.groupMessage.fileUrl]"
										>
											<div slot="placeholder" class="image-slot" style="color: #AAAAAA;">
												<span class="el-icon-loading"></span>加载中<span class="dot">...</span>
											</div>
										</el-image>
									</template>
								</span>
							</template>
						</li>
						
						<li class="other" v-else>
							<el-avatar class="other_avatar" shape="square" :size="34" :src="msg.groupMessage.fromGroupUser.userInfo.avatar"></el-avatar>
							<div v-if="msg.groupMessage.fromGroupUser.noteName==null||msg.groupMessage.fromGroupUser.noteName==''" class="other_nick">
								<span v-if="msg.groupMessage.fromGroupUser.groupRole == 0">[群主]</span>
								<span v-if="msg.groupMessage.fromGroupUser.groupRole == 1">[管理员]</span>
								{{msg.groupMessage.fromGroupUser.userInfo.nickName}}
							</div>
							<div v-else class="other_nick">
								<span v-if="msg.groupMessage.fromGroupUser.groupRole == 0">[群主]</span>
								<span v-if="msg.groupMessage.fromGroupUser.groupRole == 1">[管理员]</span>
								{{msg.groupMessage.fromGroupUser.noteName}}
							</div>
							<template v-if="msg.groupMessage.fileUrl==0">
								<span class="other_msg" v-html="msg.groupMessage.content" v-contextmenu:msg-contextmenu @contextmenu.prevent="setContextmenuMsg(msg.groupMessage)"></span>
							</template>
							<template v-else><!-- 文件消息 -->
								<span class="other_msg" v-contextmenu:msg-contextmenu @contextmenu.prevent="setContextmenuMsg(msg.groupMessage)">
									<template v-if="msg.groupMessage.content == '[文件]'">
										<el-card class="my_file">
											<i class="el-icon-document"></i><span style="margin-left: 5px;">文件</span>
											<div style="word-break: break-all;width:auto;display:block;word-wrap:break-word;">
													<span style="">{{msg.groupMessage.fileName}}</span>
											</div>
											<el-divider></el-divider>
											<template v-if="msg.groupMessage.fileUrl!=''">
												<a :href="msg.groupMessage.fileUrl" style="float: right;font-size: 14px;margin-top: -15px;margin-right: 10px;">下载</a>
											</template>
										</el-card>
									</template>
									<template v-if="msg.groupMessage.content == '[图片]'">
										<el-image
										class="my_image"
										:src='msg.groupMessage.fileUrl'
										:preview-src-list="[msg.groupMessage.fileUrl]"
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
					:before-upload="beforeUploadFile">
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
				<div class="input_box_isSilent" v-show="this.fromGroupUser.isSilent==1">
					<span>您已被禁言</span>
				</div>
				<twemoji-textarea style="background-color: #f5f5f5;"
					v-show="this.fromGroupUser.isSilent==0"
					:emojiData="emojiDataAll" 
					:emojiGroups="emojiGroups" 
					@enterKey="onEnterKey"
					>
				</twemoji-textarea>
				<button id="send" @click="sendMessage()" :disabled="this.fromGroupUser.isSilent==1">发送（S）</button>
			</div>
		</div>
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
			fromGroupUser:{},//自己的群成员信息
			groupInfo:{},//群信息
			groupUsersDrawer:{//群成员信息抽屉
				show:false,
				groupUsers:[],//所有群成员信息
				onlineUsers:[],//所有在线用户
				friendTypeInfo:[],//好友信息
				groupUserContextmenu:{groupUser:{userInfo:{}}},//右键得到的群用户信息
				noteName:'',//备注名称
			},
			groupUserTooltip:false,//是否显示群成员的title
			messages:[],//所有群聊天消息
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
			editGroupInfoDialog:{//编辑群信息模态框
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
			groupVerifyDialog:{//群验证消息模态框
				show:false,
				groupVerifyPageInfo:{//群分页消息
					list:[],
					pageNum:1,
					pageSize:7,
					total:0,
				},
			},
			notMsg:{//未读消息
				show:false,
				scrollIsBottom:true,
				notMsgCount:0,//未读数量
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
    mounted () {//初始化方法
		//判断是否有从父组件传来的数据
		var groupUser = this.$route.params.groupUser
		if(groupUser == null){
			this.$router.push({name:'groupInfo'})
			return;
		}
		//获得群信息
		this.groupInfo = groupUser.groupInfo
		
		
		//滚动条发生变化
		this.handleScroll()
		
		//获得用户信息
		this.userInfo = this.$store.getters.getUserInfo
		
		//设置自己的群成员信息
		this.fromGroupUser = groupUser
		this.fromGroupUser.userInfo = this.userInfo
		// console.log(this.fromGroupUser)
		
		
		/* 告诉后端正在哪个群里聊天 start */
		var data={
			type: 'GROUP_TO',
			from: this.userInfo.id,
			destination:this.groupInfo.id,
		}
		this.$store.dispatch('sendMessage',data);
		/* 告诉后端正在哪个群里聊天 end */
		
		//查询群消息
		this.queryGroupMessage()
		
		//调用父组件 查询所有群，群最新信息
		this.$parent.queryGroupUsers();
		
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
				//是否到最底部
				_this.notMsg.scrollIsBottom = ((scrollHeight-clientHeight)-scrollTop<1)
			})
		},
		queryGroupMessage(){//查询群消息
			this.$http.get('/groupMessage',{
				params:{
					groupId:this.groupInfo.id
				}
			}).then(res=>{
				// console.log(res.data)
				if(res.data.code == '200'){
					var msgs = res.data.data
					for(var i in msgs){
						var message = {
							from:msgs[i].fromUserId, //发送人
							destination:this.groupInfo.id,//接收群
							groupMessage:msgs[i],//消息信息
							type:'GROUP_MSG'//消息类型
						}
						this.messages.push(message);//消息信息
					}
					//加载完成
					setTimeout(()=>{
						this.scrollTheBottom();
						this.messageLoading = false
					},500)
					
				}else if(res.data.code == '500'){
					this.$message.error(res.data.msg)
				}
			})
		},
		queryThisGroupUser(){//查询自己的用户信息
			this.$http.get('/groupUser/getById',{
				params:{
					id:this.fromGroupUser.id
				}
			}).then(res=>{
				if(res.data.code == '200'){
					if(res.data.data.isRemove == 1){
						//跳转到父组件
						this.$router.push({ name: 'groupInfo' })
						this.$notify.info({
							  title: '消息',
							  message: '您已被移出该群'
							});
						return
					}
					this.fromGroupUser.groupRole = res.data.data.groupRole
					this.fromGroupUser.isSilent = res.data.data.isSilent
				}else if(res.data.code == '500'){
					this.$message.error(res.data.msg)
				}
			})
		},
		showEmoji(){//显示表情与去除表情
			$('#btn-emoji-default').trigger('click')
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
			}else{//没有滚动效果
				this.notMsg.notMsgCount++
				this.notMsg.show = true
			}
		},
		onMessage(data) {//获得消息
			//判断是否是聊天消息并且消息是当前群
			if(data.type == 'GROUP_MSG' && data.destination == this.groupInfo.id){
				//显示消息到消息框
				if(data.groupMessage.isBack == 0){//正常消息
					
					//自己收到自己发的文件消息
					if(data.groupMessage.fileUrl=='1'){
						//系统提示消息
						this.messages.push(data)
						//重新查询一下自己的群用户信息
						this.queryThisGroupUser()
					}
					else if(data.groupMessage.fileUrl!='0'&& data.from == this.userInfo.id){
						for (var i = 0; i < this.messages.length; i++) {
							if(this.messages[i].groupMessage.fileUrl == data.groupMessage.fileUrl){
								this.messages[i].groupMessage = data.groupMessage
								break
							}
						}
					}else{
						//正常消息
						this.messages.push(data)
					}
					
					//聊天滚动条置底
					this.scrollTheBottomTime(data.from == this.userInfo.id);
				}
				else{//撤回消息
					for (var i = 0; i < this.messages.length; i++) {
						if(this.messages[i].groupMessage.id == data.groupMessage.id){
							this.messages[i].groupMessage = data.groupMessage
							break
						}
					}
				}
				
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
				type: 'GROUP_MSG',
				from:this.userInfo.id,
				destination:this.groupInfo.id,
				groupMessage:{
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
			// console.log(msg)
			//遍历到当前时间的字符串
			var strDate = msg.groupMessage.sendTime;
			//遍历到当前时间
			var dateEnd = new Date(strDate.replace(/-/g,"/"))
			if(index == 0){
				return this.timeDifference(strDate)
			}
			//获得遍历到当前的上一消息时间
			var dateBegin = new Date(this.messages[index-1].groupMessage.sendTime.replace(/-/g,"/"))

			//计算出总共相差分钟数
			var totaLminutes = this.computeTotaLminutes(dateBegin,dateEnd)
			//console.log(totaLminutes)
			if(totaLminutes>=5){
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
			return msg.from == this.userInfo.id?true:false
		},
		reEdit(msg){//重新编辑
			$("#twemoji-textarea").html($("#twemoji-textarea").html()+msg.groupMessage.content)
		},
		isReEdit(msg){//判断是否可以重新编辑
			var dateBegin = new Date(msg.groupMessage.sendTime.replace(/-/g,"/"))
			var dateEnd = new Date()
			var totaLminutes = this.computeTotaLminutes(dateBegin,dateEnd)
			return totaLminutes<2&&msg.groupMessage.fileUrl=='0'?true:false
		},
		/* 产生提示消息 end*/
		/* 右键消息 start */
		setContextmenuMsg(groupMessage){//右键消息获得消息信息
			$("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
			this.contextmenuMsg = groupMessage
			//判断是否可以撤回消息
			var dateBegin = new Date(groupMessage.sendTime.replace(/-/g,"/"))
			var dateEnd = new Date()
			var totaLminutes = this.computeTotaLminutes(dateBegin,dateEnd)
			if(this.fromGroupUser.groupRole == 0){//群主
				this.isWithdraw = groupMessage.id!=null?true:false
			}else if(this.fromGroupUser.groupRole == 1){//管理员
				this.isWithdraw = totaLminutes<10&&groupMessage.fromGroupUser.groupRole!=0&&groupMessage.id!=null?true:false
			}else {//群成员
				this.isWithdraw = totaLminutes<2&&groupMessage.fromGroupUser.userInfo.id==this.userInfo.id&&groupMessage.id!=null?true:false
			}
			
			//判断是否可以复制消息
			this.isCopyMsg = groupMessage.fileUrl == '0'
		},
		copyMessage(){//复制消息
			$("#twemoji-textarea").html($("#twemoji-textarea").html()+this.contextmenuMsg.content)
		},
		withdrawMessage(){//点击撤回消息
			var data={
				type: 'GROUP_MSG',
				from:this.contextmenuMsg.fromUserId,
				destination:this.groupInfo.id,
				groupMessage:{
					content: this.contextmenuMsg.content,
					id: this.contextmenuMsg.id,
					isBack: 1,
					fileUrl:this.contextmenuMsg.fileUrl,
					fileName:this.contextmenuMsg.fileName,
					sendTime: new Date(this.contextmenuMsg.sendTime)
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
				type: 'GROUP_MSG',
				from:this.userInfo.id,
				destination:this.groupInfo.id,
				groupMessage:{
					content: isImg?'[图片]':'[文件]',
					fromUserId: this.userInfo.id,
					toGroupId: this.groupInfo.id,
					isBack: 0,
					fileUrl:'',
					fileName:file.name+size,
					progressPercent:0,//进度条(暂时存储)
					sendTime: this.getTime(new Date()),
					fromGroupUser:this.fromGroupUser
				}
			}
			
			//添加进上传文件集合里面
			this.messages.push(data)
			this.scrollTheBottomTime(true)//滚动条跳到底部
			
			
			//计算上传进度百分比
			const config = {
				onUploadProgress: progressEvent => {
					data.groupMessage.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100 - 1).toFixed(2))
				}
			}
			
			this.$http.post('/file/upload',formdata,config)
			.then(res => {
				//console.log(res)
				if(res.data.code == '200'){
					//给下载地址赋值
					data.groupMessage.fileUrl = res.data.data
					//把进度条填满
					data.groupMessage.progressPercent = 100
					
					//推送消息给后端
					var thisData = {
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:data.groupMessage.content,
							isBack:0,
							fileUrl:data.groupMessage.fileUrl,
							fileName:data.groupMessage.fileName,
						}
					}
					this.$store.dispatch('sendMessage',thisData)
				}
			}).catch(error=>{
				console.log(error)
			})
		},
		beforeUploadFile(file){//上传之前
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
			this.$http.get('/groupMessage/all',{
				params:{
					pageNum:this.paseRecordsDialog.pageInfo.pageNum,
					pageSize:this.paseRecordsDialog.pageInfo.pageSize,
					groupId:this.groupInfo.id
				}
			}).then(res=>{
				if(res.data.code == '200'){
					this.paseRecordsDialog.pageInfo = res.data.data
					// console.log(this.paseRecordsDialog.pageInfo)
				}else if(res.data.code == '500'){
					this.$message.error(res.data.msg)
				}
			})
		},
		paseRecordsPageNumChange(pageNum){//改变历史消息当前页
			this.paseRecordsDialog.pageInfo.pageNum = pageNum
			this.paseRecordsShow()
		},
		/* 历史消息 end */
		
		/* 编辑群信息 start*/
		editGroupInfoDialogShow(){//打开群编辑模态框
			this.editGroupInfoDialog.show = true
		 	this.editGroupInfoDialog.editGroupInfo = JSON.parse(JSON.stringify(this.groupInfo))
			this.editGroupInfoDialog.avatarList=[{url:this.editGroupInfoDialog.editGroupInfo.avatar}]
		},
		editGroupInfoDialogClose(){//关闭群编辑模态框
			this.editGroupInfoDialog.avatarList=[]
			this.$refs["editGroupFrom"].resetFields();//清空对话框里面的值
		},
		handleRemove(file, fileList) {//删除图片回调
			this.editGroupInfoDialog.editGroupInfo.avatar = ''
			this.editGroupInfoDialog.avatarList=fileList //可能有误
			//newGroupMessage
		},
		handlePictureCardPreview(file) {//点击查看图片
		  this.editGroupInfoDialog.dialogVisible = true;
		},
		handleSuccess(response, file, fileList){//上传成功回调
		  if(response.code == 200){
				this.editGroupInfoDialog.avatarList=fileList //可能有误
				this.editGroupInfoDialog.editGroupInfo.avatar = response.data
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
		editGroupInfo(){//确认编辑群信息
			this.$refs["editGroupFrom"].validate(valid => {
			  if (valid) {//校验通过
				if(this.editGroupInfoDialog.avatarList.length == 0){
					this.$message.warning('请选择图片')
					return
				}
				var data = {
					id:this.editGroupInfoDialog.editGroupInfo.id,//群id
					groupName:this.editGroupInfoDialog.editGroupInfo.groupName,//群名称
					avatar:this.editGroupInfoDialog.editGroupInfo.avatar,//群头像
					description:this.editGroupInfoDialog.editGroupInfo.description,//群描述
				}
				//修改操作
				this.$http.post('/groupInfo/edit',data)
				.then(res=>{
					//console.log(res.data)
					if(res.data.code == '200'){
						this.$message.success('修改成功')
						//重新赋值群信息
						this.groupInfo = JSON.parse(JSON.stringify(this.editGroupInfoDialog.editGroupInfo))
						this.editGroupInfoDialog.show = false
						//重新查询群信息
						this.$parent.queryGroupUsers()
					}
					else if(res.data.code == '500'){
						this.$message.error(res.data.msg)
					}
				})
			  }
			})
		},
		/* 编辑群信息 end*/
		
		/* 群验证消息 start*/
		groupVerifyDialogShow(){//打开群验证信息模态框
			this.groupVerifyDialog.show=true
			this.$http.get('/groupVerifyMessage/getByToGroupId',{
				params:{
					pageNum:this.groupVerifyDialog.groupVerifyPageInfo.pageNum,
					pageSize:this.groupVerifyDialog.groupVerifyPageInfo.pageSize,
					toGroupId:this.groupInfo.id,
				}
			}).then(res=>{
				if(res.data.code == '200'){
					this.groupVerifyDialog.groupVerifyPageInfo = res.data.data
				}else if(res.data.code == '500'){
					this.$message.error(res.data.msg)
				}
			})
		},
		groupVerifyDialogClose(){//关闭群验证信息模态框
			
		},
		groupVerifyPageNumChange(pageNum){//群验证消息当前页发送改变
			this.groupVerifyDialog.groupVerifyPageInfo.pageNum = pageNum
			this.groupVerifyDialogShow()
		},
		consentGroupVerify(groupVerify){//同意群请求
			groupVerify.status = 1
			this.$http.post('/groupVerifyMessage/editStatus',groupVerify)
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('已同意')
					//发送群系统消息
					var name = groupVerify.fromUserInfo.nickName
					var data={
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:name+'已加入该群',
							isBack: 0,
							fileUrl:'1',
							fileName:'1',
						}
					}
					//发送消息
					this.$store.dispatch('sendMessage',data);
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
		},
		refuseGroupVerify(groupVerify){//拒绝群请求
			groupVerify.status = 2
			this.$http.post('/groupVerifyMessage/editStatus',groupVerify)
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('已拒绝')
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
		},
		/* 群验证消息 end*/
		
		/* 群解散 start */
		dissolveGroup(){//hhh
			this.$confirm('将解散该群,将同时删除该群内所有的聊天记录, 是否继续?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning',
					  center: true
				}).then(() => {
					//群系统消息 告诉群用户该群解散
					var data2={
						type: 'GROUP_NOTIFICATION',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
					}
					//发送群系统消息
					this.$store.dispatch('sendMessage',data2);
					
					var data={
						groupId:this.groupInfo.id
					}
					this.$http.post('/groupInfo/del',this.$qs.stringify(data))
					.then(res=>{
						if(res.data.code == '200'){
							this.$notify.info({
							  title: '消息',
							  message: '已将该群解散'
							});
						}else if(res.data.code == '500'){
							this.$message.success(res.data.msg)
						}
					})
					
				}).catch(()=>{})
		},
		/* 群解散 end */
		
		/* 群用户列表 start*/
		queryGroupUsers(){//查询群内所有用户信息
			this.$http('/groupUser/all',{
				params:{
					groupId:this.groupInfo.id
				}
			}).then(res=>{
				// console.log(res.data)
				if(res.data.code == '200'){
					this.groupUsersDrawer.groupUsers = res.data.data
					//找出管理员并置顶
					this.groupUsersDrawer.groupUsers.forEach((item,index)=>{
						if(item.groupRole == 1){
							this.groupUsersDrawer.groupUsers.splice(index,1)
							this.groupUsersDrawer.groupUsers.unshift(item)
						}
					})
					//找出群主并置顶
					this.groupUsersDrawer.groupUsers.forEach((item,index)=>{
						if(item.groupRole == 0){
							this.groupUsersDrawer.groupUsers.splice(index,1)
							this.groupUsersDrawer.groupUsers.unshift(item)
							return
						}
					})
					
					
				}else if(res.data.code == '500'){
					this.$message.error(res.data.msg)
				}
			})
		},
		userIsOnline(userId){//判断用户是否在线
			return !this.groupUsersDrawer.onlineUsers.includes(userId.toString())
		},
		userOnlineCount(){//在线用户数量
			var count = 0
			this.groupUsersDrawer.groupUsers.forEach(item=>{
				if(!this.userIsOnline(item.userInfo.id)){
					count++
				}
			})
			return count
		},
		groupUsersDrawerShow(){//打开抽屉
			this.groupUsersDrawer.show =true
			//查询群内所有用户信息
			this.queryGroupUsers()
			/* 获得所有在线用户 start */
			var data={type: 'ALL_USER_ONLINE'}
			this.$store.dispatch('sendMessage',data);
			/* 获得所有在线用户 end */
			//查询所有好友信息
			this.queryFriendType()
			
		},
		groupUsersDrawerShowEnd(){//打开抽屉完成
			//添加滚动条监听事件
			$('.group_users_body .el-scrollbar__wrap').scroll(function(){
				$("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
			})
		},
		groupUsersDrawerClose(){//关闭抽屉
			this.groupUserTooltip = false
			//移除滚动条监听事件
			$('.group_users_body .el-scrollbar__wrap').unbind("scroll");
		},
		existFriendUser(userId){//判断是否是好友
			var res = false
			if(this.userInfo.id == userId){
				return true
			}
			this.groupUsersDrawer.friendTypeInfo.forEach(item=>{
				item.friends.forEach(friend=>{
					if(friend.userInfo.id == userId){
						res = true
						return
					}
				})
			})
			
			return res
		},
		queryFriendType(){//查询分组信息
			var userId = this.userInfo.id;
			this.$http.get('/friendType',{params:{userId:userId}})
			.then(response => {
				var result = response.data;
				//console.log(result)
				if(result.code == '200'){
					//获得分组所有信息
					this.groupUsersDrawer.friendTypeInfo = result.data
				}else if (res.code == '500'){
					this.$message({
						type:'error',
						message:result.msg
					})
				}
				
			})
		},
		setGroupUserContextmenu(groupUser,index){//右键设置群成员信息
			this.groupUsersDrawer.groupUserContextmenu={
				groupUser:groupUser,
				index:index,
			}
			
		},
		lookOverUserInfoPopover(){//查看用户信息
			var index = this.groupUsersDrawer.groupUserContextmenu.index
			setTimeout(()=>{
				this.$refs.userInfoPopover[index].doShow()
			},0)
		},
		setAdmin(){//设为管理员
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			if(groupUser.groupRole == 0){
				this.$message.warning('无法将群主设为管理员')
				return
			}
			if(groupUser.groupRole == 1){
				this.$message.warning('该成员已是管理员')
				return
			}
			groupUser.groupRole=1
			this.$http.post('/groupUser/edit',groupUser)
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('设置成功')
					//发送群系统消息
					var name = groupUser.noteName==null||groupUser.noteName==''?groupUser.userInfo.nickName:groupUser.noteName
					var data={
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:'已将'+name+'设为管理员',
							isBack: 0,
							fileUrl:'1',
							fileName:'1',
						}
					}
					//发送消息
					this.$store.dispatch('sendMessage',data);
					//关闭群成员列表
					this.groupUsersDrawer.show = false
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
		},
		delAdmin(){//取消管理员
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			if(groupUser.groupRole == 0){
				this.$message.warning('无法将群主取消管理员')
				return
			}
			if(groupUser.groupRole == 2){
				this.$message.warning('该成员不是管理员')
				return
			}
			
			groupUser.groupRole=2
			this.$http.post('/groupUser/edit',groupUser)
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('取消成功')
					//发送群系统消息
					var name = groupUser.noteName==null||groupUser.noteName==''?groupUser.userInfo.nickName:groupUser.noteName
					var data={
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:'已取消'+name+'管理员资格',
							isBack: 0,
							fileUrl:'1',
							fileName:'1',
						}
					}
					//发送消息
					this.$store.dispatch('sendMessage',data);
					//关闭群成员列表
					this.groupUsersDrawer.show = false
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
			
		},
		groupManagerTransfer(){//群主转让
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			if(groupUser.id == this.fromGroupUser.id){
				this.$message.warning('已经是群主')
				return
			}
			var datas={
				groupUserIdMaster:this.fromGroupUser.id,
				groupUserIdServant:this.groupUsersDrawer.groupUserContextmenu.groupUser.id
			}
			
			this.$http.post('/groupUser/editRoleTransfer',this.$qs.stringify(datas))
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('转让成功')
					//把自己的职位改变
					this.fromGroupUser.groupRole=1
					//发送群系统消息
					var name = groupUser.noteName==null||groupUser.noteName==''?groupUser.userInfo.nickName:groupUser.noteName
					var data={
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:'已将'+name+'设为群主',
							isBack: 0,
							fileUrl:'1',
							fileName:'1',
						}
					}
					//发送消息
					this.$store.dispatch('sendMessage',data);
					//关闭群成员列表
					this.groupUsersDrawer.show = false
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
			
		},
		editGroupNotename(){//修改群昵称
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			var index = this.groupUsersDrawer.groupUserContextmenu.index
			this.groupUsersDrawer.noteName = groupUser.noteName
			setTimeout(()=>{
				this.$refs.userInfoNoteNamePopover[index].doShow()
			},0)
		},
		userInfoNoteNamePopoverClick(index){//点击名字
			setTimeout(()=>{
				this.$refs.userInfoNoteNamePopover[index].doClose()
			},0)
		},
		affirmEditGroupNotename(){//确认修改群昵称
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			//获得原本的名称
			var name = groupUser.noteName==null||groupUser.noteName==''?groupUser.userInfo.nickName:groupUser.noteName
			//设置新名称
			groupUser.noteName = this.groupUsersDrawer.noteName
			
			//修改操作
			this.$http.post('/groupUser/edit',groupUser)
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('修改成功')
					$("body").trigger('click');//相当于点击屏幕一下(可清空所有悬浮的菜单)
					//发送群系统消息
					var data={
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:name+'已将群昵称改为'+groupUser.noteName,
							isBack: 0,
							fileUrl:'1',
							fileName:'1',
						}
					}
					//发送消息
					this.$store.dispatch('sendMessage',data);
					//关闭群成员列表
					this.groupUsersDrawer.show = false
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
		},
		bannedPost(){//禁止成员发言
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			groupUser.isSilent=1
			this.$http.post('/groupUser/edit',groupUser)
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('禁言成功')
					//发送群系统消息
					var name = groupUser.noteName==null||groupUser.noteName==''?groupUser.userInfo.nickName:groupUser.noteName
					var data={
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:'已禁止'+name+'发言',
							isBack: 0,
							fileUrl:'1',
							fileName:'1',
						}
					}
					//发送消息
					this.$store.dispatch('sendMessage',data);
					//关闭群成员列表
					this.groupUsersDrawer.show = false
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
		},
		unfastenBannedPost(){//解除禁言
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			groupUser.isSilent=0
			this.$http.post('/groupUser/edit',groupUser)
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('解除禁言成功')
					//发送群系统消息
					var name = groupUser.noteName==null||groupUser.noteName==''?groupUser.userInfo.nickName:groupUser.noteName
					var data={
						type: 'GROUP_MSG',
						from:this.userInfo.id,
						destination:this.groupInfo.id,
						groupMessage:{
							content:'已解除'+name+'的禁言',
							isBack: 0,
							fileUrl:'1',
							fileName:'1',
						}
					}
					//发送消息
					this.$store.dispatch('sendMessage',data);
					//关闭群成员列表
					this.groupUsersDrawer.show = false
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
		},
		groupUserRemove(){//从本群移除
			var groupUser = this.groupUsersDrawer.groupUserContextmenu.groupUser
			//发送群系统消息
			var name = groupUser.noteName==null||groupUser.noteName==''?groupUser.userInfo.nickName:groupUser.noteName
			var data={
				type: 'GROUP_MSG',
				from:this.userInfo.id,
				destination:this.groupInfo.id,
				groupMessage:{
					content:name+'已从本群移除',
					isBack: 0,
					fileUrl:'1',
					fileName:'1',
				}
			}
			//发送消息
			this.$store.dispatch('sendMessage',data);
			//移除群用户
			this.$http.post('/groupUser/del',this.$qs.stringify({groupUserId:groupUser.id}))
			.then(res=>{
				if(res.data.code == '200'){
					this.$message.success('移除成功')
					
					//添加群验证消息
					var data2={
						fromUserId:groupUser.userInfo.id,
						toGroupId:this.groupInfo.id,
						content:'已被该群移除',
						status:3,//已被该群移除
					}
					this.$http.post('/groupVerifyMessage/add',data2)
					.then(res=>{
						if(res.data.code == '200'){
							
						}else if(res.data.code == '500'){
							this.$message.error(res.data.msg)
						}
					})
					
					//关闭群成员列表
					this.groupUsersDrawer.show = false
				}else if (res.data.code == '500'){
					this.$message.error(res.msg)
				}
			})
		},
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
		/* 群用户列表 end */
    },
    destroyed () {//vue对象销毁时
		//清空文本
		$("#twemoji-textarea").html("")
		
		/* 告诉后端正在哪个群里聊天 start */
		var data={
			type: 'GROUP_TO',
			from: this.userInfo.id,
			destination:null
		}
		this.$store.dispatch('sendMessage',data);
		/* 告诉后端正在哪个群里聊天 end */
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
			if(newMsg.type == 'GROUP_MSG'){//群消息
				this.onMessage(newMsg)
			}
			else if(newMsg.type == 'ALL_USER_ONLINE'){//在线人数
				this.groupUsersDrawer.onlineUsers = newMsg.onlineUsers.split(",");
			}
			else if(newMsg.type == 'GROUP_NOTIFICATION'){
				if(newMsg.destination == this.groupInfo.id){//表示窗口在当前群
					//跳转到父组件
					this.$router.push({ name: 'groupInfo' })
					this.$parent.queryGroupUsers()
					this.$notify.info({
						title: '消息',
						message: '该群已解散'
					});
				}else{//表示窗口不在当前群
					this.$parent.queryGroupUsers()
				}
			}
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
	.windows_top_box .el-icon-notebook-2{
		cursor: pointer;
		margin-left: 20px;
	}
	.extend{
		position: absolute;
		right: 20px;
		top: 20px;
		width: 18px;
		height: 16px;
		background: url(../../../assets/images/icon/icon11.png) center center no-repeat;
		cursor: pointer;
		outline: 0;
	}
	.extend:hover{
		background: url(../../../assets/images/icon/icon12.png) center center no-repeat;
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
	.input_box_isSilent{
		height: 40px;
		border: none;
		padding: 5px; 
		margin: 0px 28px 0px 28px;
		outline:0;
		background-color: #F5F5F5;
		cursor: no-drop;
		text-align: center;
	}
	.input_box_isSilent span{
		font-size: 14px;
		color: #AAAAAA;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		line-height: 30px;
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
	/* 群成员start */
	.group_users{
		width: 100%;
		height: 100%;
		background-color: #333;
		color: #ccc;
		font-size: 14px;
	}
	.group_users_head{
		padding: 15px 0px 0px 13px;
	}
	.group_users_body{
		height: 600px;
		width: 100%;
		margin-top: 10px;
	}
	.group_users_item{
		width: 100%;
		height: 70px;
		padding: 13px 20px 0px 20px;
		cursor: pointer;
	}
	.group_users_item:hover{
		background-color: #3b3c3e;
	}
	.group_user_avatar{
		float: left;
	}
	.user-photo-not-online{
		filter: grayscale(100%);
	}
	.group_user_name{
		float: left;
		width: 130px;
		height: 100%;
		display: inline;
		position: relative;
		left: 10px;
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		
	}
	.group_user_name span{
		line-height: 40px;
	}
	.super_admin_icon{/* 群主 */
		float: right;
		font-size: 25px;
		color: #c38119;
	}
	.admin_icon{/* 管理员 */
		float: right;
		font-size: 25px;
		color: #7caf3a;
	}
	.common_icon{/* 普通成员 */
		float: right;
		font-size: 25px;
	}
	/* 群成员end */
	
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
