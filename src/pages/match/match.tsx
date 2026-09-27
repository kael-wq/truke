import { View, Text, Button } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useCardStore } from '../../stores/useCardStore'
import './index.scss'

const CONFETTI_COLORS = ['#E8572A', '#FFB020', '#3DB87A', '#4A90D9', '#9B6BDF', '#FF6B81', '#D4A843']

/** 独立匹配结果页（从通知/消息跳转进入时使用） */
export default function MatchPage() {
  const lastMatch = useCardStore(s => s.lastMatch)

  useLoad(() => {
    // 若没有匹配数据（直接进入本页），展示示例
    if (!lastMatch) {
      // 可在此从云函数拉取，演示版忽略
    }
  })

  const theirItem = lastMatch?.theirItem
  const myItem = lastMatch?.myItem

  const confetti = Array.from({ length: 24 }, (_, i) => i)

  return (
    <View className="match-page">
      <View className="match-page__card">
        {confetti.map(i => (
          <View
            key={i}
            className="match-page__confetti"
            style={{
              left: `${(i * 41) % 100}%`,
              animationDelay: `${(i * 0.11).toFixed(2)}s`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length]
            }}
          />
        ))}
        <Text className="match-page__title text-gradient">匹配成功!</Text>
        <Text className="match-page__sub">你们互相看中了彼此的闲置</Text>

        <View className="match-page__items">
          <View className="match-page__item">
            <Text className="match-page__tag">TA 的</Text>
            <Text className="match-page__emoji">{theirItem?.cover || '🎁'}</Text>
            <Text className="match-page__name">{theirItem?.title || '闲置物品'}</Text>
          </View>
          <Text className="match-page__arrow">⇄</Text>
          <View className="match-page__item">
            <Text className="match-page__tag match-page__tag--mine">你的</Text>
            <Text className="match-page__emoji">{myItem?.cover || '🎁'}</Text>
            <Text className="match-page__name">{myItem?.title || '闲置物品'}</Text>
          </View>
        </View>

        <View className="match-page__cta">
          <Button className="match-page__chat" onClick={() => Taro.redirectTo({ url: '/pages/messages/messages' })}>去聊聊</Button>
          <Button className="match-page__browse" onClick={() => Taro.redirectTo({ url: '/pages/index/index' })}>继续浏览</Button>
        </View>
      </View>
    </View>
  )
}
