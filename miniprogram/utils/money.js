const toCents = value => {
  const text = String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
  const [yuan, fen = ''] = text.split('.');
  return Number(yuan) * 100 + Number((fen + '00').slice(0, 2));
};
const format = cents => { const n=Number(cents||0); return (n<0?'-':'')+'¥'+(Math.abs(n)/100).toLocaleString('zh-CN',{minimumFractionDigits:0,maximumFractionDigits:2}); };
module.exports = { toCents, format };
