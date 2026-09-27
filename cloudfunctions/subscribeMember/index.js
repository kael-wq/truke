const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

/** 开通会员：¥18/月，演示版直接开通 */
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const price = event.price || 18
  const expireAt = Date.now() + 30 * 24 * 3600 * 1000

  const users = db.collection('users')
  const res = await users.where({ openid: OPENID }).get()

  if (res.data.length === 0) {
    await users.add({
      data: { openid: OPENID, isMember: true, memberExpireAt: expireAt, freeBoosts: 5, createdAt: Date.now() }
    })
  } else {
    await users.where({ openid: OPENID }).update({
      data: { isMember: true, memberExpireAt: expireAt, freeBoosts: 5 }
    })
  }

  return { code: 0, data: { expireAt, price } }
}
