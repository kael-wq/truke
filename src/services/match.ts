import { CardItem, MatchResult } from '../types'
import { callCloud } from './cloud'
import { MOCK_CARDS, MY_PUBLISHED } from './mock'

/** 拉取待滑动的卡片列表（附近 + 分类 + Boost 优先） */
export async function fetchCards(category: string): Promise<CardItem[]> {
  try {
    const cards = await callCloud<CardItem[]>('getCards', { category })
    if (cards && cards.length) return cards
  } catch (e) {
    // 云环境未配置，回退到演示数据
  }
  return MOCK_CARDS.filter(c => category === '附近' || c.category === category)
}

/**
 * 记录滑动动作。
 * 云函数 onSwipe 负责：记录 → 检查是否互相想换 → 命中则返回 MatchResult。
 *
 * @param offerItemId    出价物品（右滑时由推荐算法锁定 top-1）
 * @param rankedOfferIds 完整出价排序列表（兜底用）
 */
export async function recordSwipe(
  targetItemId: string,
  action: 'like' | 'pass' | 'swap' | 'superSwap',
  offerItemId?: string,
  rankedOfferIds?: string[]
): Promise<MatchResult | null> {
  try {
    return await callCloud<MatchResult | null>('onSwipe', { targetItemId, action, offerItemId, rankedOfferIds })
  } catch (e) {
    // 本地演示：约 40% 概率命中匹配，且「我的物品」= 出价物品
    const item = MOCK_CARDS.find(c => c._id === targetItemId)
    if ((action === 'swap' || action === 'superSwap') && item && Math.random() < 0.4) {
      const offered =
        MY_PUBLISHED.find(m => m._id === offerItemId) ||
        MY_PUBLISHED[0] ||
        { ...item, _id: 'me_' + item._id, title: 'Fender 电吉他', cover: '🎸', owner: { emoji: '🦊', nickname: '小狐狸' }, ownerOpenid: 'me' }
      return {
        myItem: { ...offered, owner: offered.owner || { emoji: '🦊', nickname: '小狐狸' } },
        theirItem: item,
        matchedAt: Date.now()
      }
    }
    return null
  }
}

/** 我的发布列表 */
export async function fetchMyItems(): Promise<CardItem[]> {
  try {
    const items = await callCloud<CardItem[]>('getMyItems', {})
    if (items && items.length) return items
  } catch (e) {}
  return []
}

export function wishlistLabel(wishlist: string[]): string {
  return wishlist.join(' / ')
}
