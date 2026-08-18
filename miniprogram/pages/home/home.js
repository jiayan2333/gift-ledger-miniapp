const { call } = require('../../utils/api');
const { format } = require('../../utils/money');
const { applyTheme } = require('../../utils/theme');

Page({
  data: {
    records: [],
    theme: 'danqing',
    summary: { receivedText: '¥0', givenText: '¥0', netText: '¥0', net: 0 }
  },

  async onShow() {
    applyTheme(this);
    try {
      const raw = await call('listRecords');
      let totals;
      try {
        totals = await call('getHomeSummary');
      } catch (summaryError) {
        totals = raw.reduce((result, item) => {
          if (item.direction === 'RECEIVE') result.received += item.amountCents;
          else result.given += item.amountCents;
          result.net = result.received - result.given;
          return result;
        }, { received: 0, given: 0, net: 0 });
      }
      const records = raw.map(item => {
        const parts = (item.eventDate || '').split('-');
        return {
          ...item,
          amountText: format(item.amountCents),
          yearMonth: parts.length > 1 ? `${parts[0]}.${parts[1]}` : '',
          day: parts[2] || ''
        };
      });
      const { received = 0, given = 0, net = 0 } = totals || {};
      this.setData({
        records,
        summary: {
          received,
          given,
          net,
          receivedText: format(received),
          givenText: format(given),
          netText: `${net > 0 ? '+' : ''}${format(net)}`
        }
      });
    } catch (error) {
      if (String(error.message).includes('登录')) wx.reLaunch({ url: '/pages/login/login' });
      else wx.showToast({ title: error.message, icon: 'none' });
    }
  },

  detail(event) {
    wx.navigateTo({ url: `/pages/contact-detail/contact-detail?id=${event.currentTarget.dataset.id}` });
  }
});
