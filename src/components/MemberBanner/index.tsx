import { View, Text } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useUserStore } from '../../stores/useUserStore'
import { MEMBER_PRICE } from '../../services/payment'
import './index.scss'

export default function MemberBanner() {
  const isMember = useUserStore(s => s.isMember)

  const goMembership = () => Taro.navigateTo({ url: '/pages/membership/membership' })

  return (
    <View className="member-banner">
      <View className="mb-row">
        <View className="mb-info">
          <Text className="mb-title">👑 换换会员 Swap Pass</Text>
          <Text className="mb-price">¥{MEMBER_PRICE}/月 · 随时取消</Text>
        </View>
        <Button
          className="mb-cta"
          type="primary"
          size="small"
          disabled={isMember}
          onClick={goMembership}
        >
          {isMember ? '已开通 ✓' : '开通会员'}
        </Button>
      </View>
      <View className="mb-benefits">
        <Text>⚡ 每月5次免费Boost</Text>
        <Text>👀 看谁想换你</Text>
        <Text>↩ 无限回退</Text>
        <Text>👑 专属会员标识</Text>
      </View>
    </View>
  )
}
