<template>
	<div>
		<div class="box">
		<el-menu 
		:default-active="active" 
		class="el-menu-demo top-menu" 
		mode="horizontal" 
		@select="handleSelect"
		background-color="#304156"
		text-color="rgb(191,203,217)"
		active-text-color="rgb(64,158,255)"
		>
		  <el-menu-item style="height: 50px;" index="1">聊天</el-menu-item>
		  <el-menu-item style="height: 50px;" index="2">朋友圈</el-menu-item>
		  <el-menu-item style="height: 50px;" index="3">退出登录</el-menu-item>
		</el-menu>
		
		<!-- 输出位置 -->
		<router-view></router-view>
			
			
		</div>
	</div>
</template>

<script>
	export default{
		mounted() {//初始化
			//localStorage.clear();
			//建立websocket连接
			this.$store.dispatch('websocketInit');
		},
		destroyed() {//销毁
			
		},
		methods:{
			goTo(name){
				this.$router.push({name:name})
			},
			handleSelect(key, keyPath) {//选择的导航
			    //console.log(key, keyPath);
				if(key == 1){
					//跳转到好友聊天
					this.$router.push({name:'groupInfo'})
				}else if(key == 2){
					this.$router.push({name:'friendTrends'})
				}
				else if(key == 3){
					this.$confirm('此操作将退出登录, 是否继续?', '提示', {
							  confirmButtonText: '确定',
							  cancelButtonText: '取消',
							  type: 'warning',
							  center: true
						}).then(() => {
							this.$router.push({name:'login'})
							//断开连接
							this.$store.dispatch('websocketClose')
						}).catch(() => {});
					
				}
			}
		},
		data(){
			return {
				active:'1'
			}
		},
		watch:{
			'$store.state.socket.newMsg':function(newMsg,oldMsg){
				
			}
		}
	}
</script>

<style scoped="scoped">
	/* 顶上的导航栏 */
	.top-menu{
		height: 50px;
		width: 100%; 
		position: 
		fixed;top: 0px;
		border-radius: 2px;
		border: none;
	}
	.box {
		position: absolute;
	    background-image: url(../../../assets/images/bg.jpg);
	    background-repeat: no-repeat;
	    width: 100%;
	    height: 100%;
		
	    background-position: center center;
	    background-size: cover;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}
	
</style>
