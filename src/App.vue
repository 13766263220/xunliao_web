<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
	@import url("../static/font_vno88dufpwf/iconfont.css");
	ul {
	    margin: 0;
	    padding: 0;
	}
	ul li {
	    list-style-type: none;
	}
	p {
	    margin: 0;
	}
	/* 去除el-scrollbar自定义的横向滚动条 */
	.el-scrollbar__wrap{ 
	  overflow-x: hidden;
	}
	
	/* 内边距不撑开div */
	*, :after, :before {
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	}
	/* 聊天模块最新消息中的表情 */
	.center-in-center .user_message img{ 
		margin-bottom: 5px;
		max-width: 15px;
		max-height: 15px;
	}
	
	/* 表情插件 聊天模块 start */
	.center-in-center #btn-emoji-default{
		display: none;
	}
	.center-in-center #popper-button{
		position: relative;
		top: -24px;
		left: 40px;
	}
	.center-in-center #twemoji-textarea{
		height: 40px;
		border: none;
		overflow-y:auto;
		padding: 5px; 
		margin: 0px 28px 0px 28px;
		outline:0;
		background-color: #F5F5F5;
		word-break: break-all;/* 字不换行断开 */
	}
	.center-in-center #twemoji-textarea>.emoji,.messages .emoji{/* 输入框 */
		max-width: 20px;
		max-height: 20px;
		margin: 0px 1px 3px 1px;
	}
	
	/* 表情插件 聊天模块 end */
	
	
	/* 表情插件 朋友圈模块 sart */
	.friend_circle #twemoji-textarea{/* 评论 */
		border: 1px solid #E8E8E8;
		overflow-y:auto;
		outline: 0;
		border-radius: 5px;
		height: 100px;
		word-break: break-all;
	}
	.pushTredns #twemoji-textarea{/* 发朋友圈 */
		border: 1px solid #E8E8E8;
		overflow-y:auto;
		outline: 0;
		border-radius: 5px;
		height: 200px;
		word-break: break-all;
	}
	.friend_circle .bg-cream {
	    background-color: white;
		/* margin-left: -50px; */
	}
	#btn-emoji-default{
		outline: 0;
	}
	.friend_circle .comment-name img{ 
		margin-bottom: 5px;
		max-width: 20px;
		max-height: 20px;
	}
	.posting-info img,.forward-info img{
		margin: 0px 0px 5px 2px;
		max-width: 23px;
		max-height: 23px;
	}
	/* 表情插件 朋友圈模块 end */
	
	/*朋友圈模块 时间轴 start */
	.el-timeline-item__timestamp.is-top{
		color: #f5f5e9;
	}
	.el-timeline-item__content span{
		color: #f5f5e9;
	}
	.el-timeline-item__content span:hover{
		color: #00FFFF;
	}
	.el-timeline-item__content a{
		text-decoration:none;
	}
	/*朋友圈模块 时间轴 end */
	
	
	/* 群信息与用户信息样式 start */
	.am-dropdown-content {
	    padding: 15px;
	    text-align: left;
	    line-height: 1.6;
	    background-color: #fff;
	}
	.own_head_top {
		width: 100%;
		display: inline-block;
		border-bottom: 1px solid #f4f4f4;
		padding-bottom: 20px;
	}
	.own_head_top_text {
	    float: left;
		width: 100%;
	}
	.am-dropdown-content .own_name {
	    font-size: 18px;
	    color: #333;
	    margin-bottom: 6px;
		display: inline-block;
		width: 150px;
	}
	.own_gender_0{/* 男 */
		color: #3087e4;
	}
	.own_gender_1{/* 女 */
		color: #f36ecf;
	}
	.own_numb {
	    font-size: 14px;
	    color: #999;
		margin-top: 10px;
	}
	.own_head_top>.own_head_top_text>img {
		position: absolute;
	    width: 60px;
		height: 60px;
		margin-left: 25px;
	}
	.own_head_bottom {
	    padding-top: 5px;
	}
	.own_head_bottom i {
		font-size: 16px;
		margin-right: 10px;
		cursor: pointer;
	}
	.own_head_bottom i:hover{
		color: #0056B3;
	}
	/* 群信息与用户信息样式 end */
	
	
	
</style>
