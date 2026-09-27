import { View, Text } from '@tarojs/components'
import { ArrowExchange } from '@nutui/icons-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import CardStack from '../../components/CardStack'
import ActionButtons from '../../components/ActionButtons'
import MatchModal from '../../components/MatchModal'
import ItemDetailSheet from '../../components/ItemDetailSheet'
import TabBar from '../../components/TabBar'
import { useCardStore } from '../../stores/useCardStore'
import './index.scss'

export default function Index() {
  const loadCards = useCardStore(s => s.loadCards)

  const [statusBarH, setStatusBarH] = useState(20)

  useLoad(() => {
    try {
      const info = Taro.getWindowInfo ? Taro.getWindowInfo() : Taro.getSystemInfoSync()
      setStatusBarH(info.statusBarHeight || 20)
    } catch (e) {}
    loadCards()
  })

  return (
    <View className="index-page">
      <View className="grain-overlay" />

      {/* 顶部导航（自定义） */}
      <View className="index-header" style={{ paddingTop: `${statusBarH + 10}px` }}>
        <View className="logo">
          <View className="logo-mark"><ArrowExchange size={18} /></View>
          <Text className="logo-text">换换</Text>
          <Text className="logo-sub">SwapSwap</Text>
        </View>
      </View>

      <View className="index-stack-wrap">
        <CardStack />
      </View>

      <ActionButtons />

      <TabBar current="index" msgBadge={3} />
      <MatchModal />
      <ItemDetailSheet />
    </View>
  )
}
