const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

/** 发布物品：保存到数据库，置顶时扣 5 换换币 */
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { title, category, condition, wishlist, priceRef, cover, images, pin } = event

  if (!title || !category || !condition) {
    return { code: 1, message: '参数不完整' }
  }

  // 查找/创建用户档案
  const users = db.collection('users')
  let user = (await users.where({ openid: OPENID }).get()).data[0]
  if (!user) {
    const newUser = {
      openid: OPENID,
      nickname: '换友' + OPENID.slice(-4),
      emojiAvatar: '🦊',
      coins: 0,
      isMember: false,
      createdAt: Date.now()
    }
    await users.add({ data: newUser })
    user = newUser
  }

  // 置顶扣币校验
  if (pin) {
    if ((user.coins || 0) < 5) {
      return { code: 2, message: '换换币不足' }
    }
    await users.where({ openid: OPENID }).update({ data: { coins: _.inc(-5) } })
    await db.collection('coin_transactions').add({
      data: { openid: OPENID, amount: 5, type: 'spend', reason: '置顶发布 7 天', createdAt: Date.now() }
    })
  }

  const now = Date.now()
  const item = {
    title,
    category,
    condition,
    wishlist: wishlist || [],
    priceRef: priceRef || '',
    cover: cover || '',
    images: images || [],
    tags: [],
    owner: { emoji: user.emojiAvatar || '🦊', nickname: user.nickname || '换友' },
    ownerOpenid: OPENID,
    distanceKm: 0,
    boosted: false,
    pinned: !!pin,
    status: 'active',
    swapCount: 0,
    createdAt: now,
    pinnedExpireAt: pin ? now + 7 * 24 * 3600 * 1000 : 0
  }

  const res = await db.collection('items').add({ data: item })
  return { code: 0, data: { id: res._id } }
}
