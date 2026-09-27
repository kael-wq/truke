import { View, Text } from '@tarojs/components'
import { Cell, Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useCoinStore } from '../../stores/useCoinStore'
import { COIN_TIERS } from '../../services/payment'
import './index.scss'

export default function Coins() {
  const balance = useCoinStore(s => s.balance)
  const transactions = useCoinStore(s => s.transactions)
  const selectedTier = useCoinStore(s => s.selectedTier)
  const selectedPay = useCoinStore(s => s.selectedPay)
  const setSelectedTier = useCoinStore(s => s.setSelectedTier)
  const setSelectedPay = useCoinStore(s => s.setSelectedPay)
  const recharge = useCoinStore(s => s.recharge)

  const doRecharge = async () => {
    await recharge()
    Taro.showToast({ title: '充值成功 🎉', icon: 'success' })
  }

  return (
    <View className="coins-page">
      <View className="coins-balance">
        <Text className="coins-balance__label">当前余额</Text>
        <Text className="coins-balance__num">💰 {balance}</Text>
        <Text className="coins-balance__desc">换换币 · 用于 Boost 曝光、超级想换、置顶发布</Text>
      </View>

      <View className="coins-tiers">
        {COIN_TIERS.map((t, i) => (
          <View key={t.coins} className={`tier ${i === selectedTier ? 'tier--sel' : ''}`} onClick={() => setSelectedTier(i)}>
            {t.tag && <Text className={`tier__hot ${t.tagCls}`}>{t.tag}</Text>}
            <Text className="tier__coin">{t.coins}</Text>
            <View className="tier__info">
              <Text className="tier__name">换换币 × {t.coins}</Text>
              <Text className="tier__desc">{t.unit}</Text>
            </View>
            <Text className="tier__price">¥{t.price}</Text>
            <View className="tier__check">{i === selectedTier ? '✓' : ''}</View>
          </View>
        ))}
      </View>

      <View className="coins-pay">
        <View className={`coins-pay__method ${selectedPay === 'wechat' ? 'coins-pay__method--sel' : ''}`} onClick={() => setSelectedPay('wechat')}>🟢 微信支付</View>
        <View className={`coins-pay__method ${selectedPay === 'alipay' ? 'coins-pay__method--sel' : ''}`} onClick={() => setSelectedPay('alipay')}>🔵 支付宝</View>
      </View>

      <Button type="primary" size="large" block onClick={doRecharge}>立即充值</Button>

      {/* 交易记录（NutUI Cell）*/}
      <View className="coins-history">
        <Text className="coins-history__title">📋 交易记录</Text>
        <Cell.Group>
          {transactions.map(t => (
            <Cell
              key={t._id}
              title={t.reason}
              description={t.time}
              extra={
                <Text className={`coins-tx__amount ${t.type === 'earn' ? 'earn' : 'spend'}`}>
                  {t.type === 'earn' ? '+' : '-'}{t.amount}
                </Text>
              }
            />
          ))}
        </Cell.Group>
      </View>
    </View>
  )
}
