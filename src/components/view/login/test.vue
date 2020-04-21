<template>
	<div>
		<!-- <h1>111</h1> -->
		<el-popover
		  placement="right"
		  width="400"
		  trigger="click">
		  <div>
			  11111111111111111111111111111111111111111111111111111111111111111111111111
		  </div>
		  <el-button slot="reference">111</el-button>
		</el-popover>
		
		<el-upload
		     action="#"
			 :show-file-list="false"
		     :http-request="handleRequest"
		     :before-upload="beforeUpload">
		     <el-button class="btn upload-btn">文件</el-button>
		  </el-upload>
			
		  <el-card style="width: 300px;margin-top: 10px;" :key="index" v-for="(file,index) in uploadFiles">
			  <i class="el-icon-document"></i><span style="margin-left: 5px;">文件</span>
			  <div style="word-break: break-all;width:auto;display:block;word-wrap:break-word;">
					<span>{{file.name}}</span><span style="font-size: 14px;">{{file.size}}</span>
			  </div>
			  <el-progress type="line" status="success" :percentage="file.progressPercent" v-show="file.progressPercent!=100" ></el-progress>
			  <el-divider></el-divider>
			  <template v-if="file.url!=''">
				<a :href="file.url" style="float: right;font-size: 14px;margin-top: -15px;margin-right: 10px;">下载</a>
			  </template>
		  </el-card>
		  
		 
	</div>
</template>

<script>
	export default{
		data(){
			return {
				uploadFiles:[] //上传文件
			}
		},
		mounted() {
			
		},
		methods:{
			clearFiles(){
				 this.$refs['my-upload'].clearFiles();
			},
			//上传前对文件大小进行校验
			  beforeUpload(file) {
			      const isLt2M = file.size / 1024 / 1024 < 50;
			      if (!isLt2M) {
			        this.$message.error('上传文件大小大小不能超过 50MB!');
			        return isLt2M;
			      }
			  },
			  handleRequest (data) {//处理上传
					
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
				  
				  //创建文件信息对象
				var fileInfo = {
					name:file.name,//文件名称
					size:size,//文件大小
					url:'',//文件下载路径
					progressPercent:0,//文件百分比
				}
				//添加进上传文件集合里面
				this.uploadFiles.push(fileInfo)
					//计算上传进度百分比
			      const config = {
			        onUploadProgress: progressEvent => {
			          fileInfo.progressPercent = Number((progressEvent.loaded / progressEvent.total * 100).toFixed(2))
						console.log(fileInfo.progressPercent)
					}
			      }
				  
			      this.$http.post('/file/upload',formdata,config).then(res => {
					  //console.log(res)
			        if(res.data.code == '200'){
						//获得文件名称
						//var name = res.data.data.substring(res.data.data.indexOf('images')+'images'.length+1)
						fileInfo.url = res.data.data
					}
			      }).catch(error=>{
					  console.log(error)
				  })
			  },
		}
	}
</script>

<style>
	
</style>