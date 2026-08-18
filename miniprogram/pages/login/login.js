const {call}=require('../../utils/api');

Page({
  data:{agreed:false,loading:false},
  async onLoad(){try{await call('me');wx.switchTab({url:'/pages/home/home'});}catch(e){}},
  agreementChange(e){this.setData({agreed:e.detail.value.includes('agreed')});},
  showUserAgreement(){wx.showModal({title:'用户协议',content:'欢迎使用份子钱。请仅记录你有权保存的信息，并妥善保管自己的账号与数据。',showCancel:false,confirmText:'我知道了'});},
  showPrivacyPolicy(){wx.showModal({title:'隐私政策',content:'份子钱仅为提供人情往来记录服务处理必要数据，不读取通讯录、不采集定位、不强制获取手机号。',showCancel:false,confirmText:'我知道了'});},
  async login(){
    if(!this.data.agreed)return wx.showToast({title:'请先阅读并同意协议',icon:'none'});
    try{this.setData({loading:true});await call('login');wx.switchTab({url:'/pages/home/home'});}
    catch(e){wx.showToast({title:e.message||'登录失败，请重试',icon:'none'});}
    finally{this.setData({loading:false});}
  }
});
