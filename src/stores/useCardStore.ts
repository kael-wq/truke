import { create } from 'zustand'
import { CardItem, DragFeedback, MatchResult, SwipeDir } from '../types'
import { fetchCards, recordSwipe } from '../services/match'
import { rankOffers } from '../services/recommend'
import { MY_PUBLISHED } from '../services/mock'

interface CardState {
  cards: CardItem[]
  index: number
  history: CardItem[]
  loading: boolean
  activeCategory: string
  /** 当前拖拽反馈（供 ActionButtons 之外的地方展示状态） */
  dragFeedback: DragFeedback
  /** 最近一次匹配结果，非空时显示 MatchModal */
  lastMatch: MatchResult | null

  setActiveCategory: (cat: string) => void
  setDragFeedback: (f: DragFeedback) => void
  loadCards: () => Promise<void>
  swipe: (dir: SwipeDir, superSwap?: boolean) => Promise<void>
  rewind: () => void
  boostLocal: (itemId: string) => void
  clearMatch: () => void
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  index: 0,
  history: [],
  loading: false,
  activeCategory: '附近',
  dragFeedback: { dir: 'none', progress: 0 },
  lastMatch: null,

  setActiveCategory(cat) {
    set({ activeCategory: cat, index: 0, history: [] })
    get().loadCards()
  },

  setDragFeedback(f) {
    set({ dragFeedback: f })
  },

  async loadCards() {
    set({ loading: true })
    try {
      const cards = await fetchCards(get().activeCategory)
      set({ cards, index: 0, history: [], loading: false })
    } catch (e) {
      set({ loading: false })
      // 云函数异常时不中断 UI
    }
  },

  async swipe(dir, superSwap = false) {
    const { cards, index } = get()
    const item = cards[index]
    if (!item) return

    // 右滑时：用推荐算法锁定出价物品（top-1）
    let offerItemId = ''
    let rankedOfferIds: string[] = []
    if (dir === 'right') {
      const offers = rankOffers(MY_PUBLISHED, item)
      offerItemId = offers[0]?.item._id || ''
      rankedOfferIds = offers.map(o => o.item._id)
    }

    set({ index: index + 1, history: [...get().history, item], dragFeedback: { dir: 'none', progress: 0 } })

    const action = dir === 'left' ? 'pass' : superSwap ? 'superSwap' : 'swap'
    try {
      const match = await recordSwipe(item._id, action, offerItemId, rankedOfferIds)
      if (match) {
        set({ lastMatch: match })
      }
    } catch (e) {
      // 忽略云函数错误
    }
  },

  rewind() {
    const { history, index, cards } = get()
    if (history.length === 0) return
    const prev = history[history.length - 1]
    const remaining = cards.slice(index)
    set({
      history: history.slice(0, -1),
      index: 0,
      cards: [prev, ...remaining]
    })
  },

  boostLocal(itemId) {
    set({
      cards: get().cards.map(c => (c._id === itemId ? { ...c, boosted: true } : c))
    })
  },

  clearMatch() {
    set({ lastMatch: null })
  }
}))
