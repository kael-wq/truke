const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

/**
 * 充值换换币。
 * 真实项目：云支付统一下单 → 返回支付参数 → 支付回调里加币。
 * 演示版：直接到账。
 */
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { amount, price } = event
  if (!amount || !price) return { code: 1, message: '参数缺失' }

  const users = db.collection('users')
  const res = await users.where({ openid: OPENID }).get()

  if (res.data.length === 0) {
    await users.add({ data: { openid: OPENID, coins: amount, createdAt: Date.now() } })
  } else {
    await users.where({ openid: OPENID }).update({ data: { coins: _.inc(amount) } })
  }

  await db.collection('coin_transactions').add({
    data: {
      openid: OPENID,
      amount,
      type: 'earn',
      reason: '换换币充值',
      price,
      createdAt: Date.now()
    }
  })

  return { code: 0, data: { orderId: 'order_' + Date.now(), amount } }
}
