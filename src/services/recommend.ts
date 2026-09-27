import { CardItem } from '../types'

/**
 * 换换 · 出价推荐算法
 * ------------------------------------------------------------
 * 解决的问题（B 语义下）：我右滑对方物品时，系统用「我的哪一件」去匹配？
 *
 * 目标函数：最大化 P(对方接受) = P(我出价的物品 ∈ 对方 wishlist 或对方右滑它)
 * 锁定规则：右滑瞬间锁定 top-1 作为「出价物品」，同时保留完整排序列表；
 *           匹配成立时优先用出价物品，若对方右滑的是我另一件，则以对方实际选择为准。
 */

/* ==================== 同义词表 & 归一化 ==================== */
const SYNONYMS: Record<string, string[]> = {
  键盘: ['机械键盘', '无线键盘', '键帽', '客制化'],
  相机: ['胶片相机', '数码相机', '微单', '单反', '拍立得', '卡片机'],
  耳机: ['降噪耳机', '头戴式耳机', '蓝牙耳机', '耳塞', '入耳式'],
  游戏机: ['switch', 'switch主机', 'ps5', 'xbox', '掌机', '主机'],
  球鞋: ['aj', 'air jordan', '运动鞋', '帆布鞋', '板鞋', '跑鞋'],
  手表: ['机械表', '智能手表', '电子表', '石英表'],
  音响: ['蓝牙音箱', '音箱', '黑胶', 'cd机', '唱片机'],
  餐具: ['陶瓷餐具', '碗碟', '杯子', '茶具'],
  灯具: ['落地灯', '台灯', '吊灯', '氛围灯'],
  家具: ['藤编椅', '椅子', '沙发', '书桌', '柜子']
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '')
}

/** 展开关键词：同义词组 + CJK 二元组（用于模糊匹配） */
function expandKeywords(input: string): string[] {
  const raw = normalize(input)
  const out = new Set<string>([raw])

  for (const [key, syns] of Object.entries(SYNONYMS)) {
    const group = [key, ...syns]
    if (group.some(g => raw.includes(g) || g.includes(raw))) {
      group.forEach(g => out.add(g))
    }
  }
  const cjk = raw.replace(/[^\u4e00-\u9fa5]/g, '')
  for (let i = 0; i + 1 < cjk.length; i++) out.add(cjk.slice(i, i + 2))
  return Array.from(out)
}

function itemKeywords(item: CardItem): string[] {
  const base = [item.title, item.category, ...(item.tags || []), ...(item.wishlist || [])]
  const set = new Set<string>()
  base.forEach(b => expandKeywords(b).forEach(k => set.add(normalize(k))))
  return Array.from(set)
}

function bigramOverlap(a: string, b: string): number {
  const grams = (s: string) => {
    const set = new Set<string>()
    for (let i = 0; i + 1 < s.length; i++) set.add(s.slice(i, i + 2))
    return set
  }
  const A = grams(a)
  const B = grams(b)
  if (!A.size || !B.size) return 0
  let inter = 0
  A.forEach(g => { if (B.has(g)) inter++ })
  return inter / Math.min(A.size, B.size)
}

/* ==================== 分项打分 ==================== */

/** 愿望命中：我的物品 vs 对方 wishlist，0~1 */
export function wishlistHit(item: CardItem, wishlist: string[]): number {
  if (!wishlist || wishlist.length === 0) return 0.5 // 对方没写愿望 → 中性
  const myKeys = itemKeywords(item)
  let best = 0
  for (const w of wishlist) {
    for (const wk of expandKeywords(w)) {
      const target = normalize(wk)
      for (const mk of myKeys) {
        if (mk === target) best = Math.max(best, 1)
        else if (mk.includes(target) || target.includes(mk)) best = Math.max(best, 0.85)
        else if (bigramOverlap(mk, target) > 0.5) best = Math.max(best, 0.6)
      }
    }
  }
  return best
}

export interface SwipeHistory { category: string; wanted: number; total: number }

/** 品类偏好：对方历史右滑里该品类的接受率，0~1 */
export function categoryAffinity(targetItem: CardItem, history: SwipeHistory[] = []): number {
  if (!history.length) return 0.5
  const h = history.find(x => x.category === targetItem.category)
  if (!h || h.total === 0) return 0.3
  return h.wanted / h.total
}

function parsePrice(s?: string): number {
  if (!s) return 0
  const m = s.replace(/[^\d.]/g, '')
  return m ? parseFloat(m) : 0
}

/** 价值平衡：双方参考价越接近越容易成交，0~1 */
export function valueBalance(myItem: CardItem, targetItem: CardItem): number {
  const a = parsePrice(myItem.priceRef)
  const b = parsePrice(targetItem.priceRef)
  if (!a || !b) return 0.5
  return Math.min(a, b) / Math.max(a, b)
}

/** 距离得分：同城交换，越近越好，0~1 */
export function distanceScore(km: number): number {
  return 1 / (1 + km)
}

/** 物品健康度：新发布 + 未被反复出价（避免老推同一件），0~1 */
export function itemHealth(item: CardItem, offerCount = 0): number {
  const ageDays = (Date.now() - item.createdAt) / 86400000
  const freshness = 1 / (1 + ageDays / 30)
  const notExhausted = 1 / (1 + offerCount / 5)
  return 0.5 * freshness + 0.5 * notExhausted
}

/* ==================== 加权排序 ==================== */
const W = {
  wishlist: 0.40,  // 是否命中对方愿望（核心）
  affinity: 0.20,  // 对方品类偏好
  value: 0.15,     // 价值对等
  distance: 0.10,  // 距离
  health: 0.15     // 物品健康度（防过度曝光同一件）
}

export interface RankedOffer {
  item: CardItem
  score: number
  hitWishlist: boolean
  breakdown: { wishlist: number; affinity: number; value: number; distance: number; health: number }
}

/**
 * 对我方物品排序，返回「出价列表」。
 * @param myItems       我发布的活跃物品
 * @param targetItem    我要换的对方物品
 * @param opts.history  对方品类偏好（可来自云函数统计，冷启动传 []）
 * @param opts.offerCounts 每件物品已出价次数（防疲劳）
 */
export function rankOffers(
  myItems: CardItem[],
  targetItem: CardItem,
  opts: { history?: SwipeHistory[]; offerCounts?: Record<string, number> } = {}
): RankedOffer[] {
  return myItems
    .filter(i => i.status === 'active')
    .map(item => {
      const wish = wishlistHit(item, targetItem.wishlist)
      const affinity = categoryAffinity(targetItem, opts.history)
      const value = valueBalance(item, targetItem)
      const distance = distanceScore(targetItem.distanceKm)
      const health = itemHealth(item, opts.offerCounts?.[item._id] || 0)
      const hitWishlist = wish >= 0.6

      let score =
        W.wishlist * wish +
        W.affinity * affinity +
        W.value * value +
        W.distance * distance +
        W.health * health

      // 对方明确写了愿望、但我完全不命中 → 重惩罚（保留 5% 惊喜匹配空间）
      if (targetItem.wishlist.length > 0 && !hitWishlist) score *= 0.05

      return { item, score, hitWishlist, breakdown: { wishlist: wish, affinity, value, distance, health } }
    })
    .sort((a, b) => b.score - a.score)
}
