import { View, Text } from '@tarojs/components'
import { Popup, Button } from '@nutui/nutui-react-taro'
import { useCoinStore } from '../../stores/useCoinStore'
import { COIN_TIERS } from '../../services/payment'
import './index.scss'

export default function CoinPayModal() {
  const payOpen = useCoinStore(s => s.payOpen)
  const balance = useCoinStore(s => s.balance)
  const selectedTier = useCoinStore(s => s.selectedTier)
  const selectedPay = useCoinStore(s => s.selectedPay)
  const setSelectedTier = useCoinStore(s => s.setSelectedTier)
  const setSelectedPay = useCoinStore(s => s.setSelectedPay)
  const closePay = useCoinStore(s => s.closePay)
  const recharge = useCoinStore(s => s.recharge)

  return (
    <Popup
      visible={payOpen}
      position="bottom"
      round
      closeable
      closeIconPosition="top-right"
      onClose={closePay}
      className="coin-popup"
    >
      <View className="coin-sheet">
        <Text className="sheet-title">💰 充值换换币</Text>
        <Text className="sheet-desc">余额 {balance} 币 · 用于 Boost 曝光、超级想换、置顶发布</Text>

        {COIN_TIERS.map((t, i) => (
          <View
            key={t.coins}
            className={`tier ${i === selectedTier ? 'tier--sel' : ''}`}
            onClick={() => setSelectedTier(i)}
          >
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

        <View className="pay-methods">
          <View
            className={`pay-method ${selectedPay === 'wechat' ? 'pay-method--sel' : ''}`}
            onClick={() => setSelectedPay('wechat')}
          >
            🟢 微信支付
          </View>
          <View
            className={`pay-method ${selectedPay === 'alipay' ? 'pay-method--sel' : ''}`}
            onClick={() => setSelectedPay('alipay')}
          >
            🔵 支付宝
          </View>
        </View>

        <Button type="primary" size="large" block onClick={() => recharge()}>
          立即充值
        </Button>
        <Text className="sheet-note">虚拟币仅用于演示 · 充值即视为同意用户协议</Text>
      </View>
    </Popup>
  )
}
