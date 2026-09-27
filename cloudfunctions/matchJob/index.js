const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

/**
 * 异步愿望单匹配（定时任务）：
 * 检查最近 24 小时新发布的物品，命中用户愿望单关键词时推送通知。
 * 通过 config.json 的定时触发器每小时执行一次。
 */
exports.main = async () => {
  const now = Date.now()
  const dayAgo = now - 24 * 3600 * 1000

  const recent = (await db.collection('items')
    .where({ status: 'active', createdAt: _.gt(dayAgo) })
    .get()).data

  let hitCount = 0
  for (const item of recent) {
    const keywords = item.wishlist || []
    if (!keywords.length) continue

    // 查找愿望单中含相同关键词的用户
    const wishers = (await db.collection('wishlists')
      .where({ keywords: _.in(keywords), openid: _.neq(item.ownerOpenid) })
      .get()).data

    for (const w of wishers) {
      await db.collection('notifications').add({
        data: {
          to: w.openid,
          type: 'wish_match',
          content: `你想要的「${item.title}」上线啦，快去看看吧`,
          itemId: item._id,
          createdAt: now,
          read: false
        }
      })
      hitCount++
    }
  }

  return { code: 0, data: { checked: recent.length, notified: hitCount } }
}
