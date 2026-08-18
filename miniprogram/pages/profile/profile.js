const {call}=require('../../utils/api');
const {applyTheme,setTheme}=require('../../utils/theme');

Page({
  data:{
    user:{},theme:'danqing',themeName:'丹青',showThemes:false,exporting:false,
    themes:[
      {id:'danqing',name:'丹青',desc:'雾青如画'},
      {id:'warm',name:'暖棕',desc:'温润纸感'},
      {id:'red',name:'喜庆',desc:'正红雅韵'}
    ]
  },
  async onShow(){applyTheme(this);try{const user=await call('me');user.ledgerQuota=(user.ledgerQuota||0)+(user.freeLedgerQuota||0);this.setData({user,avatarChar:(user.nickname||'微').charAt(0)});}catch(e){}},
  noop(){},
  openThemes(){this.setData({showThemes:true});},
  closeThemes(){this.setData({showThemes:false});},
  chooseTheme(e){setTheme(e.currentTarget.dataset.id,this);this.setData({showThemes:false});wx.showToast({title:'已切换为'+this.data.themeName,icon:'none'});},
  editProfile(){wx.navigateTo({url:'/pages/profile-edit/profile-edit'});},
  openLedgers(){wx.navigateTo({url:'/pages/ledgers/ledgers'});},
  async exportExcel(){if(this.data.exporting)return;try{this.setData({exporting:true});wx.showLoading({title:'正在生成'});const result=await call('exportExcel');const file=await wx.cloud.downloadFile({fileID:result.fileID});wx.hideLoading();await wx.openDocument({filePath:file.tempFilePath,fileType:'xlsx',showMenu:true});}catch(e){wx.hideLoading();wx.showToast({title:e.message||'导出失败',icon:'none'});}finally{this.setData({exporting:false});}},
  feedback(){wx.showModal({title:'意见反馈',editable:true,placeholderText:'请告诉我们你的建议',success:async r=>{if(r.confirm&&r.content.trim()){await call('feedback',{content:r.content.trim()});wx.showToast({title:'感谢反馈'});}}});},
  cancel(){wx.showModal({title:'确认注销账号？',content:'联系人、礼金流水及相关数据将被删除且无法恢复。',confirmColor:'#C45246',success:async r=>{if(r.confirm){await call('cancelAccount');wx.reLaunch({url:'/pages/login/login'});}}});}
});
