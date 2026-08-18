const { call } = require('../../utils/api');
const { applyTheme } = require('../../utils/theme');

const events = [
  { value: 'WEDDING', name: '结婚' },
  { value: 'BABY', name: '生子/满月' },
  { value: 'HOUSEWARMING', name: '乔迁' },
  { value: 'OTHER', name: '其他' }
];

const membershipPlans = [
  { id: 'SILVER', name: '白银会员', price: '9.9', quota: 1, description: '开通 1 本高级账本' },
  { id: 'GOLD', name: '黄金会员', price: '19.9', quota: 5, description: '开通 5 本高级账本' }
];

Page({
  data: {
    theme: 'danqing',
    events,
    membershipPlans,
    eventType: 'WEDDING',
    eventName: '结婚',
    eventDate: '',
    name: '',
    quota: 0,
    freeQuota: 0,
    saving: false,
    purchasingPlan: ''
  },
  onLoad() {
    const d = new Date();
    this.setData({
      eventDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    });
  },
  onShow() {
    applyTheme(this);
    this.loadQuota();
  },
  async loadQuota() {
    try {
      const user = await call('me');
      this.setData({
        quota: (user.ledgerQuota || 0) + (user.freeLedgerQuota || 0),
        freeQuota: user.freeLedgerQuota || 0
      });
    } catch (e) {}
  },
  nameInput(e) { this.setData({ name: e.detail.value }); },
  eventChange(e) {
    const item = events[Number(e.detail.value)];
    this.setData({ eventType: item.value, eventName: item.name });
  },
  dateChange(e) { this.setData({ eventDate: e.detail.value }); },
  async create() {
    if (!this.data.name.trim()) return wx.showToast({ title: '请填写账本名称', icon: 'none' });
    try {
      this.setData({ saving: true });
      const result = await call('createLedger', {
        ledger: {
          name: this.data.name,
          eventType: this.data.eventType,
          eventDate: this.data.eventDate,
          direction: 'RECEIVE'
        }
      });
      wx.redirectTo({ url: `/pages/ledger-detail/ledger-detail?id=${result._id}` });
    } catch (e) {
      wx.showToast({ title: e.message, icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },
  async buyMembership(e) {
    const planId = e.currentTarget.dataset.id;
    if (this.data.purchasingPlan) return;
    try {
      this.setData({ purchasingPlan: planId });
      const payment = await call('createLedgerMembershipOrder', { planId });
      await wx.requestPayment(payment.paymentParams);
      wx.showToast({ title: '开通成功' });
      await this.loadQuota();
    } catch (e) {
      wx.showModal({ title: '暂未完成开通', content: e.message || '支付未完成，请稍后重试', showCancel: false });
    } finally {
      this.setData({ purchasingPlan: '' });
    }
  }
});
