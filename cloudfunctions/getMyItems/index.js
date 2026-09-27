const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

/** 我的发布列表 */
exports.main = async () => {
  const { OPENID } = cloud.getWXContext()
  const res = await db.collection('items')
    .where({ ownerOpenid: OPENID })
    .orderBy('createdAt', 'desc')
    .get()
  return { code: 0, data: res.data }
}
