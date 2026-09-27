import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
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
  const isMember = useUserStore(s => s.isMember)
  const consumeFreeBoost = useUserStore(s => s.consumeFreeBoost)

  const [superMode, setSuperMode] = useState(false)

  const current = cards[index]
  const hasCard = !!current

  const toast = (title: string, icon: 'none' | 'success' = 'none') => Taro.showToast({ title, icon, duration: 1500 })

  const handleRewind = () => {
    if (isMember) {
      rewind()
      return
    }
    spend(1, () => rewind())
  }

  const handleSwap = () => {
    if (superMode) {
      setSuperMode(false)
      spend(3, () => swipe('right', true))
      return
    }
    swipe('right')
  }

  const handlePass = () => swipe('left')

  const handleLike = () => {
    if (!current) return
    // 收藏到「我的收藏」
    try {
      const favs = Taro.getStorageSync('swapswap_favs') || []
      if (!favs.find((f: any) => f._id === current._id)) {
        Taro.setStorageSync('swapswap_favs', [current, ...favs])
      }
    } catch (e) {}
    toast('已加入收藏 ♡', 'success')
    swipe('right')
  }

  const handleBoost = () => {
    if (!current) return
    if (current.boosted) {
      toast('这张卡已经在曝光中啦 ⚡')
      return
    }
    // 会员每月 5 次免费 Boost
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
      <View className="abtn abtn--sm abtn--rewind" onClick={handleRewind}>↩</View>
      <View className="abtn abtn--md abtn--pass" onClick={handlePass}>✕</View>
      <View
        className={`abtn abtn--lg abtn--swap ${superMode ? 'abtn--swap-gold' : ''}`}
        onClick={handleSwap}
        onLongPress={() => { setSuperMode(true); toast('已切换到超级想换，消耗 3 换换币', 'none') }}
      >
        ⇄
        <Text className="abtn-sub">长按超级想换</Text>
      </View>
      <View className="abtn abtn--md abtn--like" onClick={handleLike}>♡</View>
      <View className="abtn abtn--sm abtn--boost" onClick={handleBoost}>⚡</View>
    </View>
  )
}
