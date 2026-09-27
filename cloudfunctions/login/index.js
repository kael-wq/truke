const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

/** 静默登录：返回 openid */
exports.main = async () => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  return { code: 0, data: { openid: OPENID, appid: APPID, unionid: UNIONID || '' } }
}
