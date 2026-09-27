import { create } from 'zustand'
import { CoinTransaction } from '../types'
import { COIN_TIERS, CoinTier, createRechargeOrder } from '../services/payment'

interface CoinState {
  balance: number
  transactions: CoinTransaction[]
  /** 余额不足触发摇一摇动画 */
  insufficient: boolean
  /** 充值弹窗开关 */
  payOpen: boolean
  selectedTier: number
  selectedPay: 'wechat' | 'alipay'
  /** 余额不足时保存原动作，充值成功后重试 */
  retryAction: (() => void) | null

  setSelectedTier: (i: number) => void
  setSelectedPay: (p: 'wechat' | 'alipay') => void
  openPay: () => void
  closePay: () => void

  /**
   * 消费换换币。
   * 余额足够 → 扣除并执行 action；
   * 余额不足 → 摇一摇 + 打开充值弹窗 + 保存 action 待重试。
   */
  spend: (amount: number, action?: () => void) => boolean

  /** 充值到账 */
  recharge: (tierIndex?: number) => Promise<void>

  /** 会员免费发放的 Boost 次数（由会员状态控制，见 ActionButtons） */
  recordTransaction: (tx: CoinTransaction) => void
}

const MOCK_TX: CoinTransaction[] = [
  { _id: 't1', amount: 30, reason: '微信充值', time: '2024-01-05', type: 'earn' },
  { _id: 't2', amount: 1, reason: 'Boost 曝光', time: '2024-01-06', type: 'spend' },
  { _id: 't3', amount: 3, reason: '超级想换', time: '2024-01-07', type: 'spend' }
]

export const useCoinStore = create<CoinState>((set, get) => ({
  balance: 30,
  transactions: MOCK_TX,
  insufficient: false,
  payOpen: false,
  selectedTier: 1,
  selectedPay: 'wechat',
  retryAction: null,

  setSelectedTier(i) {
    set({ selectedTier: i })
  },
  setSelectedPay(p) {
    set({ selectedPay: p })
  },
  openPay() {
    set({ payOpen: true })
  },
  closePay() {
    set({ payOpen: false })
  },

  spend(amount, action) {
    const { balance } = get()
    if (balance >= amount) {
      set({ balance: balance - amount })
      action?.()
      return true
    }
    // 余额不足：摇一摇 → 打开充值弹窗 → 保存动作
    set({ insufficient: true, retryAction: action || null })
    setTimeout(() => {
      set({ insufficient: false, payOpen: true })
    }, 500)
    return false
  },

  async recharge(tierIndex) {
    const idx = tierIndex ?? get().selectedTier
    const tier: CoinTier = COIN_TIERS[idx]
    try {
      await createRechargeOrder(tier)
    } catch (e) {
      // 云开发未配置时本地模拟到账
    }
    const tx: CoinTransaction = {
      _id: 'tx' + Date.now(),
      amount: tier.coins,
      reason: '换换币充值',
      time: new Date().toLocaleDateString('zh-CN'),
      type: 'earn'
    }
    set((s) => ({
      balance: s.balance + tier.coins,
      transactions: [tx, ...s.transactions],
      payOpen: false
    }))
    // 充值成功后重试原动作
    const retry = get().retryAction
    if (retry) {
      set({ retryAction: null })
      setTimeout(retry, 300)
    }
  },

  recordTransaction(tx) {
    set((s) => ({ transactions: [tx, ...s.transactions] }))
  }
}))
