const {call}=require('../../utils/api');
const {applyTheme}=require('../../utils/theme');

Page({
  data:{all:[],groups:[],keyword:'',theme:'danqing'},
  async onShow(){applyTheme(this);try{const all=await call('listContacts');this.setData({all});this.group(all);}catch(e){wx.showToast({title:e.message,icon:'none'});}},
  group(list){const map={};list.forEach(x=>{const item={...x,initialChar:(x.name||'?').charAt(0)};(map[x.nameInitial||'#']||(map[x.nameInitial||'#']=[])).push(item)});this.setData({groups:Object.keys(map).sort().map(initial=>({initial,items:map[initial]}))});},
  search(e){const keyword=e.detail.value.trim();this.setData({keyword});this.group(this.data.all.filter(x=>x.name.includes(keyword)||(x.relationship||'').includes(keyword)));},
  add(){wx.navigateTo({url:'/pages/contact-edit/contact-edit'});},
  open(e){wx.navigateTo({url:'/pages/contact-detail/contact-detail?id='+e.currentTarget.dataset.id});}
});
