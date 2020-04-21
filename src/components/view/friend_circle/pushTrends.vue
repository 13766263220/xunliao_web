<template>
	<div class="median pushTredns">
		<el-card class="pushTrends-card">
			<div>
				<twemoji-textarea
					:emojiData="emojiDataAll" 
					:emojiGroups="emojiGroups" 
					@enterKey="onEnterKey"
					>
				</twemoji-textarea>
			</div>
			<!-- http://localhost:8080/file/upload -->
			<div class="uploadImage">
				<el-upload
				  action="http://localhost:8080/api/file/upload"
				  list-type="picture-card"
				  :limit='6'
				  :on-preview="handlePictureCardPreview"
				  :on-remove="handleRemove"
				  :on-success="handleSuccess"
				  :before-upload="beforeUpload"
				  >
				  <i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
				  <img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</div>
			<div class="pushTrends-footer">
				<!-- <el-button @click="" size="medium">可见范围</el-button> -->
				
				  <el-dialog
				    title="选择可见好友"
				    :visible.sync="lookDialongParam.show"
				    width="500px"
				    center
				    @close="lookDialongClose"
					  @opened="lookDialongOpen"
				    >
					  <el-select
						style="width: 100%;"
						 v-model="lookFriendValues"
						 multiple
						 filterable
						 placeholder="请选择可见好友">
						 <el-option-group
						       v-for="friendType in friendTypeInfo"
						       :key="friendType.id"
						       :label="friendType.typeName">
						       <el-option
						         v-for="friend in friendType.friends"
						         :key="friend.friendId"
						         :label="friend.noteName == null||friend.noteName == ''?friend.userInfo.nickName:friend.noteName"
						         :value="friend.friendId">
						       </el-option>
						     </el-option-group>
					  </el-select>
					  <span slot="footer" class="dialog-footer">
							<el-button @click="lookDialongParam.show = false" size="medium">取 消</el-button>
							<el-button type="primary" @click="pushTredns()" size="medium">发表说说</el-button>
					  </span>
				  </el-dialog>
				  <div class="pushTrends-footer-button">
				  <el-select v-model="lookScopeValue" placeholder="可见范围">
				      <el-option
				        v-for="item in lookScopeValues"
				        :key="item.value"
				        :label="item.label"
				        :value="item.value">
				      </el-option>
				    </el-select>
				<el-button v-show="lookScopeValue!=3" type="primary" @click="pushTredns()" size="medium">发表说说</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	import {
	  TwemojiTextarea
	} from '@kevinfaguiar/vue-twemoji-picker';
	import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/da/emoji-all-groups.json';
	import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';

  export default {
    data() {
      return {
		userInfo:null,
		friendTypeInfo:[],//好友分组信息
        dialogImageUrl: '',//查看图片的路径
        dialogVisible: false,//是否弹出查看图片模态框
		images:[//保存所有的图片路径
			// {uid:'12',url:'aaa'},
			// {uid:'23',url:'bbb'},
			// {uid:'45',url:'ccc'}
		],
		lookScopeValues: [{//可见范围
		  value: '1',
		  label: '所有人可见'
		}, {
		  value: '2',
		  label: '仅自己可见'
		}, {
		  value: '3',
		  label: '部分好友可见'
		}],
		lookScopeValue: '1',
		lookDialongParam:{//选择部分好友可见模态框数据
			show:false
		},
		lookFriendValues:[],//所有已选择可见的好友id
		
      };
    },
	mounted() {
		this.$jquery(".el-select-dropdown__wrap").css("margin-bottom","0px")
		//查询用户信息
		this.userInfo = this.$store.getters.getUserInfo;
		
		//查询所有分组信息
		this.queryFriendType();
		
	},
    methods: {
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
		onEnterKey(e) {//回车发表说说
			e.preventDefault();
			this.pushTredns();
		},
		pushTredns(){//发表说说
			
			//获得写的说说内容
			var content = this.getInputBoxMessage();
			if (content == "") {
				this.$message.warning("请输入消息")
				return ;
			}else if(content.length > 2000){
				this.$notify({
				  title: '警告',
				  message: '输入内容过多,请重新输入',
				  type: 'warning'
				});
				return ;
			}
		
		
			//获得可见人id
			if(this.lookScopeValue == '1'){//表示所有人可见
				this.lookFriendValues = []
				//获得自己的所有好友id
				this.friendTypeInfo.forEach(type=>{
					type.friends.forEach(friend=>{
						this.lookFriendValues.push(friend.friendId)
					})
				})
				this.lookFriendValues.push(this.userInfo.id)//加上自己
			}else if(this.lookScopeValue == '2'){//表示仅自己可见
				this.lookFriendValues = []
				this.lookFriendValues.push(this.userInfo.id)
			}
			else{ //表示部分好友可见
				this.lookFriendValues.push(this.userInfo.id)
			}
			
			//获得上传的图片地址，以逗号分隔
			var imgUrl = "";
			this.images.forEach(item=>{
				imgUrl+=item.url+","
			})
			imgUrl = imgUrl.substring(0,imgUrl.length-1)
			
			
			var data={
				postingInfo:{
					content:content,//说说内容
					pics:imgUrl,//说说逗号分隔的图片地址
					browseCount:0,//浏览次数
					fromUserId:this.userInfo.id,//发帖id
					forwardId:0 ,//转发id
				},
				userIds:this.lookFriendValues //所有可见用户id
			}
			
			this.$http.post('/postingInfo/add',data)
			.then(response=>{
				// console.log(response.data)
				if(response.data.code == '200'){
					this.$message.success(response.data.msg)
					//跳转到好友动态
					//this.$router.push({ name: 'friendTrends'})
					this.$parent.$parent.setRadioHandle('好友动态')
				}else{
					this.$message.error(response.data.msg)
				}
			})
			
		},
		getInputBoxMessage(){//获得输入框内的消息
			var html = this.$jquery("#twemoji-textarea").html();
			return html;
		},
		removeImages(uid){//删除图片地址
			var arr = this.images
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].uid == uid){
					arr.splice(i, 1);//删除下标为i，数量为1的数据
					return arr;
				}
			}
			return this.images;
		},
      handleRemove(file, fileList) {//删除图片回调
		this.images = this.removeImages(file.uid);
      },
      handlePictureCardPreview(file) {//点击查看图片
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
	  handleSuccess(response, file, fileList){//上传成功回调
		  if(response.code == 200){
			this.images.push({uid:file.uid,url:response.data})
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
	  lookDialongClose(){//关闭选择可见好友模态框
		  this.lookScopeValue = '1'
		  this.lookFriendValues = [] //清空选择的好友
	  },
	  lookDialongShow(){//打开选择可见好友模态框
	  		this.lookDialongParam.show = true
			this.lookFriendValues = [] //清空选择的好友
	  },
	  lookDialongOpen(){//打开完成回调
		  this.$jquery(".el-select-dropdown__wrap").css("margin-bottom","0px")
	  }
	  
    },
	computed: {
	  emojiDataAll() {
	      return EmojiAllData;
	  },
	  emojiGroups() {
	      return EmojiGroups;
	  }
	},
	components: {
	  'twemoji-textarea': TwemojiTextarea
	},
	watch:{
		lookScopeValue:function(newVal,oldVal){//监听可见范围
			if(newVal == '3'){
				this.lookDialongShow()
			}
		}
	}
  }
</script>

<style scoped="scoped">
	/* 中间显示说说的区域 */
	.median{
		width: 700px;
		margin: 0 auto 0px auto;
	}
	.pushTrends-card{
		/* margin-bottom: 30px; */
	}
	.uploadImage{
		margin-left: 70px;
	}
	.pushTrends-footer{
		width: 100%;
		margin: 20px 0px 0px 0px;
	}
	.pushTrends-footer-button{
		float: right;
		margin-bottom: 10px;
	}
</style>
