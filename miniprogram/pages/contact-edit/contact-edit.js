const {call}=require('../../utils/api');
const {applyTheme}=require('../../utils/theme');

Page({
  data:{id:'',theme:'danqing',saving:false,canSave:false,notesLength:0,form:{name:'',relationship:'',notes:''}},
  async onLoad(o){
    if(o.id){
      wx.setNavigationBarTitle({title:'编辑联系人'});
      try{const form=await call('getContact',{id:o.id});this.setData({id:o.id,form,canSave:!!(form.name||'').trim(),notesLength:(form.notes||'').length});}
      catch(e){wx.showToast({title:e.message||'加载失败',icon:'none'});}
    }
  },
  onShow(){applyTheme(this);},
  input(e){
    const key=e.currentTarget.dataset.k,value=e.detail.value;
    const data={['form.'+key]:value};
    if(key==='notes')data.notesLength=value.length;
    if(key==='name')data.canSave=!!value.trim();
    this.setData(data);
  },
  async save(){
    if(this.data.saving)return;
    if(!this.data.form.name.trim())return wx.showToast({title:'请填写联系人姓名',icon:'none'});
    try{
      this.setData({saving:true});
      await call(this.data.id?'updateContact':'createContact',{id:this.data.id,contact:this.data.form});
      wx.showToast({title:'联系人已保存'});
      setTimeout(()=>wx.navigateBack(),450);
    }catch(e){wx.showToast({title:e.message||'保存失败，请重试',icon:'none'});}
    finally{this.setData({saving:false});}
  }
});
