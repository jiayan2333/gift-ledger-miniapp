const {getTheme}=require('./utils/theme');
const {CLOUD_ENV_ID}=require('./config/env');
App({
  globalData: { user: null, theme:'danqing', cloudEnvId:CLOUD_ENV_ID },
  onLaunch() {
    if (!wx.cloud) throw new Error('请使用 2.2.3 或以上基础库');
    wx.cloud.init({env:CLOUD_ENV_ID,traceUser:true});
    this.globalData.theme=getTheme();
  }
});
