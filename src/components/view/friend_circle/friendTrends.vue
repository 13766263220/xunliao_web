<template>
	<div>
		<!-- 置顶按钮 -->
		<!-- <el-backtop target=".el-scrollbar__wrap"></el-backtop> -->
		<!-- 时间线 -->
		<el-scrollbar id="time-line-all">
			<el-timeline>
				<el-timeline-item :timestamp="$options.filters.cutoutDate(postingInfo.sendTime)" placement="top" v-for="postingInfo in postingInfos" :key="postingInfo.id">
					<el-link @click="toLook($options.filters.dateToStr(postingInfo.sendTime))" type="primary" >查看<i class="el-icon-view el-icon--right"></i></el-link>
				</el-timeline-item>
			</el-timeline>
		</el-scrollbar>
		<div class="median">
			
			<!-- 评论区域 -->
			<div>
				<el-dialog
					top="230px"
				  :title="cfDialongParam.title"
				  :visible.sync="cfDialongParam.show"
				  width="500px"
				  center
				  @close="cfDialongClose"
				  >
				  <twemoji-textarea
					:emojiData="emojiDataAll" 
					:emojiGroups="emojiGroups" 
					@enterKey="onEnterKey"
					>
				  </twemoji-textarea>
				  <span slot="footer" class="dialog-footer">
					<el-button @click="cfDialongParam.show = false" size="medium">取 消</el-button>
					
					<el-button v-show="cfDialongParam.title == '评论'" type="primary" @click="onComment()" size="medium">确认评论</el-button>
					<el-button v-show="cfDialongParam.title == '回复'" type="primary" @click="onReply()" size="medium">确认回复</el-button>
					<el-button v-show="cfDialongParam.title == '转发'" type="primary" @click="onForward()" size="medium">确认转发</el-button>
				  </span>
				</el-dialog>
			</div>
			<!-- 每一条说说卡片对象 -->
		    <el-card :id="$options.filters.dateToStr(postingInfo.sendTime)" class="posting-item" v-for="postingInfo in postingInfos" :key="postingInfo.id">
		    	<div style="">
		    		<el-avatar class="own_head" shape="square" :size="45" :src="postingInfo.fromUserInfo.avatar"></el-avatar>
		    		<div style="display: inline-block;margin-left: 5px;">
		    			<span style="font-size: 16px;display: block;position: relative;top: -3px;">{{postingInfo.fromUserInfo.nickName}}</span>
		    			<i style="color: #777;font-size: 13px;position: relative;top: -6px;">{{postingInfo.sendTime|cutoutDate}}</i>
		    		</div>
		    	</div>
		    	<div style="margin: 0 auto;width: 83%;">
		    		<!-- 显示说说的地方 -->
		    		<div class="show-posting">
		    			<span class="posting-info" v-html="postingInfo.content"></span>
						<!-- 图片 -->
		    			<div class="posting-img" v-if="postingInfo.pics.length != 0">
							<template v-if="cutoutImgStr(postingInfo.pics).length == 1">
								<el-image :key="imgIndex" v-for="(imgUrl,imgIndex) in cutoutImgStr(postingInfo.pics)" class="oneImage" :src="imgUrl" :preview-src-list="cutoutImgStr(postingInfo.pics)"></el-image>
							</template>
							<template v-else-if="cutoutImgStr(postingInfo.pics).length == 2 || cutoutImgStr(postingInfo.pics).length == 4">
								<el-image :key="imgIndex" v-for="(imgUrl,imgIndex) in cutoutImgStr(postingInfo.pics)" class="twoImage" :src="imgUrl" :preview-src-list="cutoutImgStr(postingInfo.pics)"></el-image>
							</template>
							<template v-else-if="cutoutImgStr(postingInfo.pics).length == 3 || cutoutImgStr(postingInfo.pics).length == 5 || cutoutImgStr(postingInfo.pics).length == 6">
								<el-image :key="imgIndex" v-for="(imgUrl,imgIndex) in cutoutImgStr(postingInfo.pics)" class="nImage" :src="imgUrl" :preview-src-list="cutoutImgStr(postingInfo.pics)"></el-image>
							</template>
						</div>
						<!-- 转发信息 -->
						<div class="forward-postring" v-if="postingInfo.forwardId!=0">
							<span class="forward-username">{{postingInfo.forWordPostingInfo.fromUserInfo.nickName}}：</span> 
							<span class="forward-info" v-html="postingInfo.forWordPostingInfo.content"></span>
							
							<div class="forward-img" v-if="postingInfo.forWordPostingInfo.pics.length!=0">
								<template v-if="cutoutImgStr(postingInfo.forWordPostingInfo.pics).length == 1">
									<el-image :key="imgIndex" v-for="(imgUrl,imgIndex) in cutoutImgStr(postingInfo.forWordPostingInfo.pics)" class="oneImage" :src="imgUrl" :preview-src-list="cutoutImgStr(postingInfo.forWordPostingInfo.pics)"></el-image>
								</template>
								<template v-if="cutoutImgStr(postingInfo.forWordPostingInfo.pics).length == 2 || cutoutImgStr(postingInfo.forWordPostingInfo.pics).length == 4">
									<el-image :key="imgIndex" v-for="(imgUrl,imgIndex) in cutoutImgStr(postingInfo.forWordPostingInfo.pics)" class="twoImage" :src="imgUrl" :preview-src-list="cutoutImgStr(postingInfo.forWordPostingInfo.pics)"></el-image>
								</template>
								<template v-if="cutoutImgStr(postingInfo.forWordPostingInfo.pics).length == 3 || cutoutImgStr(postingInfo.forWordPostingInfo.pics).length == 5 || cutoutImgStr(postingInfo.forWordPostingInfo.pics).length == 6">
									<el-image :key="imgIndex" v-for="(imgUrl,imgIndex) in cutoutImgStr(postingInfo.forWordPostingInfo.pics)" class="nImage" :src="imgUrl" :preview-src-list="cutoutImgStr(postingInfo.forWordPostingInfo.pics)"></el-image>
								</template>
								
							</div>
						</div>
						
		    		</div>
		    		<!-- 点赞评论转发区域 -->
		    		<div class="handle-posting">
		    			<span style="color: #777;font-size:14px;line-height: 45px;">浏览{{postingInfo.browseCount}}次</span>
		    		
		    			<span class="iconfont" title="转发" @click="showForward(postingInfo)">&#xe627;</span>
		    			<span class="iconfont" title="评论" @click="showComment(postingInfo)">&#xe61a;</span>
						<span v-if="isLike(postingInfo.likeUserInfo)" class="iconfont" title="点赞" @click="cancelLike(postingInfo.id)" style="color: #1E90FF;">&#xe60c;</span>
		    			<span v-else class="iconfont" title="点赞" @click="onLike(postingInfo.id)">&#xe60c;</span>
						
		    		</div>
		    		<!-- 显示点赞人的区域 -->
		    		<div class="show-likes">
		    			<span class="iconfont" title="点赞">&#xe60c;</span>
		    			<span v-for="likeUser in postingInfo.likeUserInfo" class="likes-name">{{likeUser.nickName}}</span>
		    			<span>等{{postingInfo.likeUserInfo.length}}人觉得很赞</span>
		    		</div>
		    		<!-- 显示评论的区域 -->
		    		<div>
		    			<div class="comment-item" v-for="replyInfo in postingInfo.replyInfoList">
		    				<el-avatar class="own_head" shape="square" :size="35" :src="replyInfo.fromUserInfo.avatar"></el-avatar>
		    				<div class="comment-info">
		    					<span class="comment-name">{{replyInfo.fromUserInfo.nickName}}：<span v-html="replyInfo.content"></span></span>
		    					<i class="comment-date" >{{replyInfo.replyTime|cutoutReplyDate}}</i>
								<span class="iconfont" title="回复" @click="showReply(replyInfo)">&#xe61a;</span>
		    				</div>
		    				<!-- 回复 -->
							<template  v-for="replyAgainInfo in replyInfo.replyAgainInfoList" v-if="replyAgainInfo.fromUserInfo!=null && replyAgainInfo.toUserInfo!=null">
		    				<br />
		    				<div class="reply-item">
		    					<el-avatar class="reply_head" shape="square" :size="35" :src="replyAgainInfo.fromUserInfo.avatar"></el-avatar>
		    					<div>
		    						<span class="comment-name">{{replyAgainInfo.fromUserInfo.nickName}} <span>回复</span> {{replyAgainInfo.toUserInfo.nickName}}：<span v-html="replyAgainInfo.content"></span></span>
		    						<i class="comment-date" >{{replyAgainInfo.replyTime}}</i>
									<span class="iconfont" title="回复" @click="showReply(replyInfo,replyAgainInfo)">&#xe61a;</span>
		    					</div>
		    				</div>
							</template>
		    			</div>
		    		</div>
		    	</div>
		    </el-card>
		</div>
	</div>
</template>

<script>
	import {
	  TwemojiTextarea
	} from '@kevinfaguiar/vue-twemoji-picker';
	import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/da/emoji-all-groups.json';
	import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
	export default{
		data(){
			return{
				userInfo:null,//用户信息
				postingInfos:[],//所有帖子信息
				friendTypeInfo:[],//分组信息
				cfDialongParam:{//评论转发模态框数据
					show:false,
					title:'',
					postingInfo:{},//帖子信息
					replyInfo:{},//回复信息
					replyAgainInfo:{},//再次回复信息
				},
			};
		},
		mounted() {
			//获得用户信息
			this.userInfo = this.$store.getters.getUserInfo
			
			//获得动态类型
			var trendType = this.$route.params.trendType
			if(trendType == null || trendType == '好友动态'){
				//查询好友动态
				this.queryPostingAll(1);
			}
			
			this.queryFriendType()//查询分组信息
		},
		methods:{
			queryPostingAll(isAddBrowseCount){//获得所有能访问到的帖子
				this.$http.get('http://localhost:8080/api/postingInfo/query',{
					params:{
						userId:this.userInfo.id,
						isAddBrowseCount:isAddBrowseCount //是否回增加浏览次数 0表示不会
					}
				})
				.then(response=>{
					//console.log(response.data)
					if(response.data.code == '200'){
						this.postingInfos = response.data.data
					}else if(response.data.code == '500'){
						this.$message.error(response.data.msg)
					}
				})
			},
			queryFriendType(){//查询分组信息
				var userId = this.userInfo.id;
				this.$http.get('/friendType',{params:{userId:userId}})
				.then(response => {
					var result = response.data;
					// console.log(result)
					if(result.code == '200'){
						//获得分组所有信息
						this.friendTypeInfo = result.data
					}else{
						this.$message.error(result.msg)
					}
					
				})
				
			},
			toLook(targer){//点击时间线让滚动条跳转到指定位置
				var $ = this.$jquery
				//有滚动条的div
				var container = $('.el-scrollbar__wrap').not('#time-line-all .el-scrollbar__wrap');
				//目标
				var scrollTo = $('#'+targer)
				container.animate({
					scrollTop:scrollTo.offset().top - container.offset().top + container.scrollTop() - 10
				},800)
			},
			toTop(){//滚动条跳转到顶端
				var $ = this.$jquery
				//有滚动条的div
				var container = $('.el-scrollbar__wrap').not('#time-line-all .el-scrollbar__wrap');
				container.animate({
					scrollTop:0
				},500)
			},
			showForward(postingInfo){//弹出转发
				this.cfDialongParam.title = '转发'
				this.cfDialongParam.show = true
				this.cfDialongParam.postingInfo = postingInfo
			},
			onForward(){//转发
				//获得写的说说内容
				var content = this.getInputBoxMessage();
				if (content == "") {
					this.$message.warning("请输入消息")
					return ;
				}else if(content.length > 2000){
					this.$message.warning('转发内容过长,请重新输入')
					return ;
				}
				
				
				//可见范围
				var lookFriendValues = []
				//获得自己的所有好友id
				this.friendTypeInfo.forEach(type=>{
					type.friends.forEach(friend=>{
						lookFriendValues.push(friend.friendId)
					})
				})
				lookFriendValues.push(this.userInfo.id)//加上自己
				var forwardId = this.cfDialongParam.postingInfo.forwardId!=0?this.cfDialongParam.postingInfo.forwardId:this.cfDialongParam.postingInfo.id
				var data={
					postingInfo:{
						content:content,//说说内容
						pics:'',//说说逗号分隔的图片地址
						browseCount:0,//浏览次数
						fromUserId:this.userInfo.id,//发帖id
						forwardId:forwardId,//转发id
					},
					userIds:lookFriendValues //所有可见用户id
				}
				
				this.$http.post('/postingInfo/add',data)
				.then(response=>{
					// console.log(response.data)
					if(response.data.code == '200'){
						this.$message.success(response.data.msg)
						//刷新一遍
						this.queryPostingAll(0)
						this.cfDialongParam.show = false
						this.toTop()//滚动条跳转到顶端
					}else{
						this.$message.error(response.data.msg)
					}
				})
				
				
			},
			showComment(postingInfo){//弹出评论
				this.cfDialongParam.title = '评论'
				this.cfDialongParam.show = true
				this.cfDialongParam.postingInfo = postingInfo
			},
			onComment(){//评论
				var content = this.getInputBoxMessage()
				if(content.length == 0){
					this.$message.warning('请输入评论内容')
					return;
				}else if(content.length > 1000){
					this.$message.warning('评论内容过长,请重新输入')
					return;
				}
				var data={
					content:content,
					fromUserId:this.userInfo.id,
					postingId:this.cfDialongParam.postingInfo.id
				}
				this.$http.post('/replyInfo/add',data)
				.then(response =>{
					if(response.data.code == 200){
						this.$message.success(response.data.msg)
						this.queryPostingAll(0)
						this.cfDialongParam.show = false
					}else{
						this.$message.error(response.data.msg)
					}
				})
			},
			showReply(replyInfo,replyAgainInfo){//弹出回复
				this.cfDialongParam.replyInfo = replyInfo
				this.cfDialongParam.replyAgainInfo = replyAgainInfo
				this.cfDialongParam.title = '回复'
				this.cfDialongParam.show = true
			},
			onReply(){//回复
				// console.log(this.cfDialongParam.replyInfo)
				// return
				var content = this.getInputBoxMessage()
				if(content.length == 0){
					this.$message.warning('请输入回复内容')
					return;
				}else if(content.length > 1000){
					this.$message.warning('回复内容过长,请重新输入')
					return;
				}
				
				var toUserId = this.cfDialongParam.replyAgainInfo != null ? this.cfDialongParam.replyAgainInfo.fromUserId : this.cfDialongParam.replyInfo.fromUserId
				var data={
					content:content,
					fromUserId:this.userInfo.id,
					toUserId:toUserId,
					replyId:this.cfDialongParam.replyInfo.id
				}
				this.$http.post('/replyAgainInfo/add',data)
				.then(response =>{
					if(response.data.code == 200){
						this.$message.success(response.data.msg)
						this.queryPostingAll(0)
						this.cfDialongParam.show = false
					}else{
						this.$message.error(response.data.msg)
					}
				})
				
			},
			cfDialongClose(){//关闭评论转发模态框回调
				//清空输入文本
				this.$jquery("#twemoji-textarea").html("")
				//清空值
				this.cfDialongParam.postingInfo = {}
				this.cfDialongParam.replyInfo = {}
				this.cfDialongParam.replyAgainInfo = {}
			},
			onLike(postingId){//点赞
				var data={
					postingId:postingId,
					userId:this.userInfo.id
				}
				
				this.$http.post('/postingLike/add',data)
				.then(response=>{
					if(response.data.code == 200){
						this.queryPostingAll(0)
					}else{
						this.$message.error(response.data.msg)
					}
				})
			},
			cancelLike(postingId){//取消点赞
				var data={
					postingId:postingId,
					userId:this.userInfo.id
				}
				
				this.$http.post('/postingLike/del',data)
				.then(response=>{
					if(response.data.code == 200){
						this.queryPostingAll(0)
					}else{
						this.$message.error(response.data.msg)
					}
				})
			},
			isLike(likeUserInfo){//判断自己是否点过赞
			  var result = false
			  var _this = this
			  likeUserInfo.forEach(item =>{
			  	if(item.id == _this.userInfo.id){
			  		result = true
					return;
			  	}
			  })
			  return result
			},
			cutoutImgStr(imgStr){//切割图片
				var imgs = imgStr.split(",");
				return imgs
			},
			getInputBoxMessage(){//获得输入框内的消息
				var html = this.$jquery("#twemoji-textarea").html();
				return html;
			},
			onEnterKey(e) {//回车发送消息发送消息
				e.preventDefault();
				if(this.cfDialongParam.title == '评论'){
					this.onComment()
				}else if(this.cfDialongParam.title == '回复'){
					this.onReply()
				}else if(this.cfDialongParam.title == '转发'){
					this.onForward()
				}
			},
			
		},
		computed: {
		  emojiDataAll() {
		      return EmojiAllData;
		  },
		  emojiGroups() {
		      return EmojiGroups;
		  },
		  
		  
		},
		components: {
		  'twemoji-textarea': TwemojiTextarea
		},
		watch:{
			
		},
		filters:{
			cutoutDate:function(strDate){//截取时间
				return strDate.substring(0,19)
			},
			cutoutReplyDate:function(strDate){
				return strDate.substring(0,16)
			},
			dateToStr:function(strDate){//去除时间所有空格
				strDate = strDate.replace(/-|:|\s*|/g,"")//去除所有“-” “:” “空格”
				return strDate;
			}
		},
		destroyed () {//vue对象销毁时
			//清空输入文本
			this.$jquery("#twemoji-textarea").html("")
		},
	}
</script>

<style scoped="scoped">
	/* 中间显示说说的区域 */
	.median{
		width: 700px;
		margin: 0 auto 0px auto;
	}
	/* 每一条说说 */
	.posting-item{
		margin: 0 auto 30px auto;
		background-color: white;
		/* height: 300px; */
		width: 100%;
	}
	/* 时间线 */
	#time-line-all{
		width:115px;
		height: 350px;
		position: fixed;
	}
	
	/* 显示说说区域 start*/
	.show-posting{
		margin: 5px 0px 0px 0px;
	}
	.show-posting .posting-info{
		word-wrap: break-word;
	}
	.show-posting .posting-img{
		margin-top: 10px;
	}
	/* 说说图片 */
	.posting-img .oneImage{/* 显示一张图片 */
		width: 100%;
		height: 350px;
		/* max-height: 338px; */
		margin-right: 5px;
	}
	.posting-img .twoImage{/* 显示2张或4张图片 */
		width: 268px; 
		height: 180px;
		margin-right: 5px;
	}
	.posting-img .nImage{/* 显示3，5，6张图片 */
		width: 177px; 
		height: 140px;
		margin-right: 5px;
	}
	/* 显示说说区域 end*/
	
	/* 转发区域 start */
	/* 转发图片 */
	.forward-img{
		margin-top: 5px;
	}
	.forward-postring .oneImage{/* 显示一张图片 */
		width: 100%;
		height: 340px;
		/* max-height: 338px; */
		margin-right: 5px;
	}
	.forward-postring .twoImage{/* 显示2张或4张图片 */
		width: 258px; 
		height: 170px;
		margin-right: 5px;
	}
	.forward-postring .nImage{/* 显示3，5，6张图片 */
		width: 170px; 
		height: 135px;
		margin-right: 5px;
	}
	
	.show-posting .forward-postring{/* 转发信息区域 */
		background-color: #f5f5f5;
		padding: 10px;
		width: 100%;
		margin-top: 5px;
		/* 超过显示省略号 */
		/* overflow:hidden;
		text-overflow:ellipsis;
		-o-text-overflow:ellipsis; 
		white-space:nowrap;
		word-break:keep-all; */
	}
	.forward-postring .forward-username{
		color: #337ab7;
		cursor: pointer;
		float: left;
	}
	
	.forward-postring .forward-username:hover{
		text-decoration:underline;
	}
	.forward-postring .forward-info{
		word-break:normal; 
		white-space:pre-wrap;
		word-wrap : break-word ;
	}
	/* 转发区域 end */
	
	
	/* 评论转发点赞区域 */
	.handle-posting{
		border-bottom: 1px solid #E8E8E8;
		margin-top: 15px;
		height: 45px;
	}
	
	.handle-posting .iconfont{
		font-size: 26px;
		float: right;
		margin-left: 55px;
		cursor: pointer;
	}
	.handle-posting .iconfont:hover{
		color: #1E90FF;
	}
	
	/* 显示点赞的人区域 */
	.show-likes{
		display: block;
		margin-top: 10px;
	}
	.show-likes .iconfont{
		font-size: 18px;
		cursor: pointer;
	}
	.show-likes .iconfont:hover{
		color: #1E90FF;
	}
	.show-likes span{
		font-size: 14px;
		color: #777;
	}
	.show-likes .likes-name{
		color: #1E90FF;
		cursor: pointer;
		margin: 0px 2px 0px 2px;
	}
	.show-likes .likes-name:hover{
		text-decoration:underline;
	}
	
	/* 评论区域 start */
	.comment-item{
		margin-top: 10px;
		width: 95%;
		overflow:hidden;
		text-overflow:ellipsis;
		-o-text-overflow:ellipsis; 
		white-space:nowrap;
		word-break:keep-all;
	}
	.comment-item>.comment-info{
		display: inline-block;
		margin-left: 5px;
	}
	.comment-name{
		font-size: 14px;
		display: block;
		color: #337ab7;
		position: relative;
		top:3px;
	}
	.comment-name span{
		color: #000000;
	}
	.comment-date{
		color: #777;
		font-size: 13px;
		position: relative;
	}
	.reply-item{
		margin-top: 10px;
		display: inline-block;
		margin-left: 44px;
	}
	.reply-item>div{
		display: inline-block;
		margin-left: 9px;
		margin-top: -5px;
	}
	.reply_head{
		float: left;
	}
	.comment-item .iconfont{/* 回复小按钮 */
		display: inline;
		cursor: pointer;
		color: #e8e4e4;
	}
	.comment-item .iconfont:hover{
		display: inline;
		color: #1E90FF;
	}
	/* 评论区域 end */
	
</style>
