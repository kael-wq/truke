import { View } from '@tarojs/components'
import { Undo, Close, ArrowExchange, Heart, DoubleArrowUp } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import { useCardStore } from '../../stores/useCardStore'
import { useCoinStore } from '../../stores/useCoinStore'
import { useUserStore } from '../../stores/useUserStore'
import './index.scss'

export default function ActionButtons() {
  const cards = useCardStore(s => s.cards)
  const index = useCardStore(s => s.index)
  const swipe = useCardStore(s => s.swipe)
  const rewind = useCardStore(s => s.rewind)
  const boostLocal = useCardStore(s => s.boostLocal)

  const spend = useCoinStore(s => s.spend)
  const consumeFreeBoost = useUserStore(s => s.consumeFreeBoost)

  const current = cards[index]

  const toast = (title: string, icon: 'none' | 'success' = 'none') => Taro.showToast({ title, icon, duration: 1500 })

  // 回退：免费无限（Q12/Q13）
  const handleRewind = () => rewind()

  const handleSwap = () => swipe('right')

  const handlePass = () => swipe('left')

  const handleLike = () => {
    if (!current) return
    try {
      const favs = Taro.getStorageSync('truke_favs') || []
      if (!favs.find((f: any) => f._id === current._id)) {
        Taro.setStorageSync('truke_favs', [current, ...favs])
      }
    } catch (e) {}
    toast('已加入收藏 ♡', 'success')
    swipe('right')
  }

  // Boost：会员每月 5 次免费，否则 1 换换币
  const handleBoost = () => {
    if (!current) return
    if (current.boosted) {
      toast('这张卡已经在曝光中啦 ⚡')
      return
    }
    if (consumeFreeBoost()) {
      boostLocal(current._id)
      toast('会员免费 Boost 已生效 ⚡', 'success')
      return
    }
    spend(1, () => {
      boostLocal(current._id)
      toast('Boost 成功！曝光 +128% ⚡', 'success')
    })
  }

  return (
    <View className="action-bar">
      <View className="abtn abtn--sm abtn--rewind" onClick={handleRewind}>
        <Undo size={20} />
      </View>
      <View className="abtn abtn--md abtn--pass" onClick={handlePass}>
        <Close size={24} />
      </View>
      <View className="abtn abtn--lg abtn--swap" onClick={handleSwap}>
        <ArrowExchange size={32} color="#fff" />
      </View>
      <View className="abtn abtn--md abtn--like" onClick={handleLike}>
        <Heart size={24} />
      </View>
      <View className="abtn abtn--sm abtn--boost" onClick={handleBoost}>
        <DoubleArrowUp size={20} />
      </View>
    </View>
  )
}
