const THEMES={danqing:{name:'丹青',nav:'#F5F8F6',bg:'#F5F8F6',text:'#244E49'},warm:{name:'暖棕',nav:'#F8F3EB',bg:'#F8F3EB',text:'#72513A'},red:{name:'喜庆',nav:'#FFF8F2',bg:'#FFF8F2',text:'#A72F2B'}};
const getTheme=()=>wx.getStorageSync('uiTheme')||'danqing';
const applyTheme=page=>{const theme=getTheme(),t=THEMES[theme]||THEMES.danqing;page.setData({theme,themeName:t.name});wx.setNavigationBarColor({frontColor:'#000000',backgroundColor:t.nav});wx.setTabBarStyle({color:'#8A8E8C',selectedColor:t.text,backgroundColor:t.bg,borderStyle:'white'});};
const setTheme=(theme,page)=>{if(!THEMES[theme])return;wx.setStorageSync('uiTheme',theme);getApp().globalData.theme=theme;applyTheme(page);};
module.exports={THEMES,getTheme,applyTheme,setTheme};
