import { View, Text } from '@tarojs/components'
import { Cell, Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useUserStore } from '../../stores/useUserStore'
import { MEMBER_PRICE, subscribeMember } from '../../services/payment'
import './index.scss'

const BENEFITS = [
  { icon: '⚡', title: '每月 5 次免费 Boost', desc: '让你的闲置获得更多曝光' },
  { icon: '👀', title: '看谁想换你', desc: '解锁模糊头像，第一时间知道谁对你感兴趣' },
  { icon: '↩', title: '无限回退', desc: '手滑错过？随便退，不限次数' },
  { icon: '👑', title: '专属会员标识', desc: '个人主页金色标识，身份象征' }
]

const COMPARE = [
  { name: 'Boost 曝光', free: '1币/次', member: '每月5次免费' },
  { name: '回退', free: '1币/次', member: '无限免费' },
  { name: '查看想换你的人', free: '模糊头像', member: '完整可见' },
  { name: '会员标识', free: '—', member: '👑 金色标识' }
]

export default function Membership() {
  const isMember = useUserStore(s => s.isMember)
  const setMember = useUserStore(s => s.setMember)

  const open = async () => {
    if (isMember) {
      Taro.showToast({ title: '你已经是会员啦 👑', icon: 'none' })
      return
    }
    Taro.showLoading({ title: '开通中...' })
    try {
      await subscribeMember()
    } catch (e) {}
    setMember(true)
    Taro.hideLoading()
    Taro.showToast({ title: '🎉 已开通换换会员', icon: 'success' })
  }

  return (
    <View className="membership-page">
      <View className="mem-hero">
        <Text className="mem-hero__icon">👑</Text>
        <Text className="mem-hero__title">换换会员 Swap Pass</Text>
        <Text className="mem-hero__price">¥{MEMBER_PRICE}<Text className="mem-hero__unit">/月</Text></Text>
        <Text className="mem-hero__sub">让闲置更快流动，交换效率翻倍</Text>
      </View>

      {/* 权益（NutUI Cell）*/}
      <View className="mem-benefits">
        <Cell.Group>
          {BENEFITS.map(b => (
            <Cell key={b.title} title={`${b.icon}  ${b.title}`} description={b.desc} />
          ))}
        </Cell.Group>
      </View>

      <View className="mem-compare">
        <View className="mem-compare__row mem-compare__head">
          <Text className="mem-compare__col">权益</Text>
          <Text className="mem-compare__col">免费</Text>
          <Text className="mem-compare__col mem-compare__col--gold">会员</Text>
        </View>
        {COMPARE.map(c => (
          <View key={c.name} className="mem-compare__row">
            <Text className="mem-compare__col mem-compare__name">{c.name}</Text>
            <Text className="mem-compare__col mem-compare__free">{c.free}</Text>
            <Text className="mem-compare__col mem-compare__col--gold">{c.member}</Text>
          </View>
        ))}
      </View>

      <Button type="warning" size="large" block onClick={open}>
        {isMember ? '已开通 ✓' : `¥${MEMBER_PRICE} 立即开通`}
      </Button>
      <Text className="mem-note">虚拟会员仅用于演示 · 可随时取消</Text>
    </View>
  )
}
