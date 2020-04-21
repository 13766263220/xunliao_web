<template>
	<div class="friend_circle">
		<!-- 整个页面自定义滚动条 -->
		<el-scrollbar ref="scro-main" class="circle_main">
			
			<!-- 显示东西的区域 -->
			<div style="width: 1000px;margin: 0 auto;">
				
				<!-- 置顶按钮 -->
				<el-backtop target=".el-scrollbar__wrap"></el-backtop>
				<!-- 顶部 -->
				<div class="head_top">
					<!-- 头像 -->
					<el-avatar class="own_head" shape="square" :size="100" :src="$store.getters.getUserInfo.avatar"></el-avatar>
					<div style="margin-left: 150px;width: 700px;height: 100%;border-bottom:solid 1px rgb(216, 208, 208);">
						<!-- 名称 -->
						<span class="own_name">{{$store.getters.getUserInfo.nickName}}的空间</span>
						<!-- 导航 -->
						<el-radio-group size="medium" class="radio-handle" v-model="radioHandle" fill="rgb(110, 117, 158)">
						      <el-radio-button label="好友动态"></el-radio-button>
						      <el-radio-button label="发表说说"></el-radio-button>
						</el-radio-group>
					</div>
				</div>
				<!-- 导航输出位置 -->
				<router-view :key="key"></router-view>
			</div>
		</el-scrollbar>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				radioHandle:'好友动态'
			};
		},
		mounted() {
			
		},
		methods:{
			setRadioHandle(val){
				this.radioHandle = val
			}
		},
		computed: {
		  key() {
		      return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
		  }
		},
		components: {
			
		},
		watch:{
			radioHandle:function(val){
				if(val == '好友动态'){
					this.$router.push({name:'friendCircleIndex'})
					this.$router.push({name:'friendTrends',params:{trendType:val}})
				}else if(val == '发表说说'){
					this.$router.push({name:'pushTrends'})
				}
			}
		}
	}
</script>

<style>
	
	.friend_circle{
		height: 100%;
		width: 100%;
	}
	/* 主页面 */
	.circle_main{
		/* height: 100%; */
		height: calc(100% - 50px);
		width: 100%;
		/* position: inherit; */
		/* top: 50px; */
		margin: 50px auto -50px auto;
		scroll-behavior:smooth;
	}
	/* 上面导航 */
	.head_top{
		/* background-color: yellow; */
		width: 100%;
		height: 100px;
		margin: 20px 0px 30px 0px;
	}
	/* 头像 */
	.head_top .own_head{
		float: left;
	}
	/* 名字 */
	.head_top .own_name{
		font-size: 30px;
		font-weight: bold;
		display: block;
		color: #295c9d;
		font-family: "楷体";
	}
	/* 导航选项 */
	.head_top .radio-handle{
		margin-top: 18px;
		/* margin-left: -1px; */
		border: none;
	}
	
	
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
		width:100px;
		height: 300px;
		position: fixed;
	}
</style>
