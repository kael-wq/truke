/* ============ 换换 全局类型定义 ============ */

export type Condition = '全新' | '99新' | '95新' | '9成新' | '8成新'

export type ItemStatus = 'active' | 'matched' | 'archived'

export interface OwnerInfo {
  /** 表情头像 —— 产品定位：绝不上传真实照片，避免约会感 */
  emoji: string
  nickname: string
}

export interface CardItem {
  _id: string
  title: string
  /** 封面图（云存储 fileID 或临时 URL） */
  cover: string
  /** 可选多图 */
  images?: string[]
  owner: OwnerInfo
  ownerOpenid: string
  category: string
  subCategory?: string
  condition: Condition
  /** 距离（公里） */
  distanceKm: number
  /** 想换什么 */
  wishlist: string[]
  tags: string[]
  /** 参考价（可选） */
  priceRef?: string
  boosted: boolean
  pinned: boolean
  /** 超级想换标记：对方会优先看到 */
  superSwap?: boolean
  status: ItemStatus
  createdAt: number
}

export interface MatchResult {
  myItem: CardItem
  theirItem: CardItem
  matchedAt: number
}

export interface Conversation {
  _id: string
  peer: OwnerInfo
  peerOpenid: string
  /** 双方交换的物品标题 */
  myItemTitle: string
  theirItemTitle: string
  lastMessage: string
  lastTime: string
  unread: number
}

export interface Message {
  _id: string
  from: 'me' | 'peer'
  type: 'text' | 'image'
  content: string
  time: string
}

export interface CoinTransaction {
  _id: string
  amount: number
  reason: string
  time: string
  type: 'earn' | 'spend'
}

export type SwipeDir = 'left' | 'right'
export type DragFeedback = { dir: SwipeDir | 'none'; progress: number }
