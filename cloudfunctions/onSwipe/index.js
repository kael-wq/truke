const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

/**
 * 记录滑动动作并判断是否互相匹配（B 语义：右滑 = 我出价某件物品换对方物品）。
 * action: like | pass | swap | superSwap
 * offerItemId: 右滑时由推荐算法锁定的出价物品
 * rankedOfferIds: 完整出价排序（兜底）
 * superSwap 带 priority 标记，对方下次拉取时该卡片排最前。
 */
exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext()
  const { targetItemId, action, offerItemId, rankedOfferIds } = event
  if (!targetItemId || !action) return { code: 1, message: '参数缺失' }

  // 记录 swipe
  await db.collection('swipes').add({
    data: {
      from: OPENID,
      targetItemId,
      action,
      offerItemId: offerItemId || '',
      rankedOfferIds: rankedOfferIds || [],
      priority: action === 'superSwap',
      createdAt: Date.now()
    }
  })

  if (action !== 'swap' && action !== 'superSwap') {
    return { code: 0, data: null }
  }

  // 目标物品
  let target
  try {
    target = (await db.collection('items').doc(targetItemId).get()).data
  } catch (e) {
    return { code: 0, data: null }
  }
  if (!target) return { code: 0, data: null }

  // 对方是否右滑过我的物品
  const theirSwipes = (await db.collection('swipes')
    .where({ from: target.ownerOpenid, action: _.in(['swap', 'superSwap']) })
    .get()).data

  let matched = null

  // 优先：对方想换的正是我出价的那件（或排序列表中的某件）
  const preferIds = [offerItemId, ...(rankedOfferIds || [])].filter(Boolean)
  for (const id of preferIds) {
    if (theirSwipes.some(s => s.targetItemId === id)) {
      const myItem = (await db.collection('items').doc(id).get()).data
      if (myItem && myItem.ownerOpenid === OPENID && myItem.status === 'active') {
        matched = await createMatch(OPENID, target.ownerOpenid, myItem, target)
        break
      }
    }
  }

  // 兜底：对方右滑了我任意一件活跃物品
  if (!matched) {
    for (const s of theirSwipes) {
      let theirTarget = null
      try {
        theirTarget = (await db.collection('items').doc(s.targetItemId).get()).data
      } catch (e) {}
      if (theirTarget && theirTarget.ownerOpenid === OPENID && theirTarget.status === 'active') {
        matched = await createMatch(OPENID, target.ownerOpenid, theirTarget, target)
        break
      }
    }
  }

  return { code: 0, data: matched }
}

async function createMatch(userA, userB, itemA, itemB) {
  const match = {
    userA,
    userB,
    itemA: itemA._id,
    itemB: itemB._id,
    createdAt: Date.now(),
    status: 'matched',
    exchangeCode: 'SWAP-' + Math.floor(1000 + Math.random() * 9000)
  }
  const addRes = await db.collection('matches').add({ data: match })

  await db.collection('notifications').add({
    data: {
      to: userB,
      type: 'match',
      content: '有人想用「' + itemA.title + '」换你的「' + itemB.title + '」，你们匹配啦！',
      matchId: addRes._id,
      createdAt: Date.now()
    }
  })

  return {
    matchId: addRes._id,
    exchangeCode: match.exchangeCode,
    myItem: itemA,
    theirItem: itemB,
    matchedAt: Date.now()
  }
}
