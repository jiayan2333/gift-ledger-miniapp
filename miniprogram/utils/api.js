const call = async (action, data = {}) => {
  const res = await wx.cloud.callFunction({ name: 'api', data: { action, ...data } });
  if (!res.result || !res.result.ok) throw new Error((res.result && res.result.message) || '请求失败');
  return res.result.data;
};
module.exports = { call };
