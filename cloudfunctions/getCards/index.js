const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

/** 获取可滑动的卡片：排除自己、置顶优先、Boost 优先、距离最近 */
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { category, limit = 20 } = event

  const query = { status: 'active', ownerOpenid: _.neq(OPENID) }
  if (category && category !== '附近') {
    query.category = category
  }

  const now = Date.now()
  const res = await db.collection('items')
    .where(query)
    .orderBy('pinned', 'desc')
    .orderBy('boosted', 'desc')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  const items = res.data
    .filter(i => !i.pinned || (i.pinnedExpireAt && i.pinnedExpireAt > now))
    .map(i => ({
      _id: i._id,
      title: i.title,
      cover: i.cover,
      images: i.images || [],
      category: i.category,
      condition: i.condition,
      wishlist: i.wishlist || [],
      tags: i.tags || [],
      priceRef: i.priceRef || '',
      boosted: !!i.boosted,
      pinned: !!i.pinned,
      owner: i.owner || { emoji: '🦊', nickname: '换友' },
      ownerOpenid: i.ownerOpenid,
      distanceKm: i.distanceKm || 0,
      status: i.status,
      createdAt: i.createdAt
    }))

  return { code: 0, data: items }
}
