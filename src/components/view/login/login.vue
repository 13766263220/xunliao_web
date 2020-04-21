<template>
  <div>
	<div class="_login">
		<img src="../../../assets/images/login/login_1.jpg" class="backgroud_img" />
		<!-- 账号：<el-input v-model="loginInfo.username"></el-input> 
		密码：<el-input v-model="loginInfo.password"></el-input>
		<el-button @click="doLogin()">登录</el-button> -->
		<el-card class="login_inner">
			<el-form class="form" ref="form" :model="loginInfo">
			  <el-form-item>
			    <h2 class="title">迅聊系统</h2>
			  </el-form-item>
			  <el-form-item>
			    <el-input @keyup.enter.native="doLogin()" prefix-icon="el-icon-user" type="text" v-model="loginInfo.username" placeholder="请输入账号/号码"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-input @keyup.enter.native="doLogin()" prefix-icon="el-icon-lock" type="password" v-model="loginInfo.password" placeholder="请输入密码" show-password></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button  class="do_lodin" type="primary" @click="doLogin()" >登陆</el-button>
				<el-link @click="forgetPassword()" class="_a" :underline="false">忘记密码</el-link>
				<el-link @click="registerAccount()" class="_a" :underline="false">注册账号</el-link>
			  </el-form-item>
			</el-form>
		</el-card>
	</div>
  </div>
</template>

<script>
export default{
	created() {
		// var _this = this;
		// document.onkeydown = function(e) {
		// 	var key = window.event.keyCode;
		// 	if (key == 13) {
		// 		_this.doLogin();
		// 	}
		// }
	},
	mounted() {
		
	},
	methods:{
		
		doLogin(){//确认登录
			this.$http.get('/userInfo/login',{
				params:this.loginInfo
			})
			.then(response => {
				var result = response.data;
				// console.log(result)
				if(result.code == '200'){
					this.$message({
						type:'success',
						message:result.msg
					})
					this.$store.commit('setUserInfo',result.data)
					
					//跳转到聊天页面
					this.$router.push({name:'groupInfo'})
					
					
				}else{
					this.$message({
						type:'error',
						message:result.msg
					})
				}
			})
		},
		forgetPassword(){//忘记密码
			
		},
		registerAccount(){//注册账号
			
		},
	},
	data(){
		return{
			loginInfo:{//登录信息
				username:'',
				password:''
			}
		}
		
	}
}
</script>

<style scoped="scoped">
	._login {
		position: absolute;
		width: 100%;
		height: 100%;
		background-position: center center;
		background-size: cover;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.backgroud_img{
		position: absolute;
		width: 100%;
		height: 100%;
		/* 图片模块化 */
		filter: blur(20px);
		-webkit-filter: blur(20px);
		-ms-filter: blur(20px);
		-moz-filter: blur(20px);
	}
	.login_inner {
		position: relative;
		width: 460px;
		height: 300px;
		display: flex;
		justify-content: center;
	 }
	 .form {
	   width: 300px;
	   text-align: center;
	   
	 }
	.title {
		color: #7b7bda;
		font-size: 25px;
		font-weight: bold;
		user-select: none;
		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
	}
	.do_lodin{
		width: 100%;
	}
	._a{
		font-size: 12px;
		color: #AAAAAA;
	}
</style>
