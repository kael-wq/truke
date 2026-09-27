import { CoinTransaction } from '../types'
import { callCloud } from './cloud'

export interface CoinTier {
  coins: number
  price: number
  unit: string
  tag?: string
  tagCls?: 'hot' | 'best'
}

/** 换换币充值档位 */
export const COIN_TIERS: CoinTier[] = [
  { coins: 6, price: 6, unit: '¥1/币' },
  { coins: 30, price: 25, unit: '省 ¥5', tag: '热门', tagCls: 'hot' },
  { coins: 68, price: 50, unit: '省 ¥18', tag: '超值', tagCls: 'best' }
]

/** 会员价格（元/月） */
export const MEMBER_PRICE = 18

/**
 * 创建充值订单。
 * 真实项目里应调用云函数 recharge → 微信支付统一下单 → 返回支付参数。
 * 演示版直接模拟到账。
 */
export async function createRechargeOrder(tier: CoinTier): Promise<{ orderId: string }> {
  try {
    return await callCloud('recharge', { amount: tier.coins, price: tier.price })
  } catch (e) {
    return { orderId: 'mock_' + Date.now() }
  }
}

/** 开通会员 */
export async function subscribeMember(): Promise<{ expireAt: number }> {
  try {
    return await callCloud('subscribeMember', { price: MEMBER_PRICE })
  } catch (e) {
    return { expireAt: Date.now() + 30 * 24 * 3600 * 1000 }
  }
}

/** 交易流水 */
export async function fetchTransactions(): Promise<CoinTransaction[]> {
  try {
    return await callCloud<CoinTransaction[]>('getTransactions', {})
  } catch (e) {
    return []
  }
}
