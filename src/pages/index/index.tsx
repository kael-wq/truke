import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import CategoryTabs from '../../components/CategoryTabs'
import CardStack from '../../components/CardStack'
import ActionButtons from '../../components/ActionButtons'
import MatchModal from '../../components/MatchModal'
import TabBar from '../../components/TabBar'
import { useCardStore } from '../../stores/useCardStore'
import { useCoinStore } from '../../stores/useCoinStore'
import './index.scss'

export default function Index() {
  const loadCards = useCardStore(s => s.loadCards)
  const balance = useCoinStore(s => s.balance)
  const insufficient = useCoinStore(s => s.insufficient)
  const openPay = useCoinStore(s => s.openPay)

  const [statusBarH, setStatusBarH] = useState(20)

  useLoad(() => {
    try {
      const info = Taro.getWindowInfo ? Taro.getWindowInfo() : Taro.getSystemInfoSync()
      setStatusBarH(info.statusBarHeight || 20)
    } catch (e) {}
    loadCards()
  })

  const toast = (title: string) => Taro.showToast({ title, icon: 'none', duration: 1200 })

  return (
    <View className="index-page">
      <View className="grain-overlay" />

      {/* 顶部导航（自定义） */}
      <View className="index-header" style={{ paddingTop: `${statusBarH + 10}px` }}>
        <View className="logo">
          <Text className="logo-mark">⇄</Text>
          <Text className="logo-text">换换</Text>
          <Text className="logo-sub">SwapSwap</Text>
        </View>
        <View className="header-actions">
          <View className="icon-btn" onClick={() => toast('筛选功能')}>⚙️</View>
          <View className={`coin-pill ${insufficient ? 'coin-pill--shake' : ''}`} onClick={openPay}>
            <Text>💰 {balance}</Text>
          </View>
        </View>
      </View>

      <CategoryTabs />

      <View className="index-stack-wrap">
        <CardStack />
      </View>

      <ActionButtons />

      <TabBar current="index" msgBadge={3} />
      <MatchModal />
    </View>
  )
}
