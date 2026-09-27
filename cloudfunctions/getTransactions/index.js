const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

/** 换换币交易流水 */
exports.main = async () => {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('coin_transactions')
    .where({ openid: OPENID })
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get()

  const data = res.data.map(t => ({
    _id: t._id,
    amount: t.amount,
    reason: t.reason,
    type: t.type,
    time: new Date(t.createdAt).toLocaleDateString('zh-CN')
  }))

  return { code: 0, data }
}
