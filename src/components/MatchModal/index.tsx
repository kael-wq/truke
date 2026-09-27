import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useCardStore } from '../../stores/useCardStore'
import './index.scss'

const CONFETTI_COLORS = ['#E8572A', '#FFB020', '#3DB87A', '#4A90D9', '#9B6BDF', '#FF6B81', '#D4A843']

export default function MatchModal() {
  const lastMatch = useCardStore(s => s.lastMatch)
  const clearMatch = useCardStore(s => s.clearMatch)

  if (!lastMatch) return null

  const confetti = Array.from({ length: 24 }, (_, i) => i)

  const goChat = () => {
    clearMatch()
    Taro.redirectTo({ url: '/pages/messages/messages' })
  }

  return (
    <View className="match-backdrop">
      <View className="match-modal">
        {confetti.map(i => (
          <View
            key={i}
            className="match-confetti"
            style={{
              left: `${(i * 41) % 100}%`,
              animationDelay: `${(i * 0.11).toFixed(2)}s`,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length]
            }}
          />
        ))}

        <Text className="match-title text-gradient">匹配成功!</Text>
        <Text className="match-sub">你们互相看中了彼此的闲置</Text>

        <View className="match-items">
          <View className="match-item">
            <Text className="m-tag">TA 的</Text>
            <Text className="m-emoji">{lastMatch.theirItem.cover}</Text>
            <Text className="m-name">{lastMatch.theirItem.title}</Text>
          </View>
          <Text className="match-arrow">⇄</Text>
          <View className="match-item match-item--mine">
            <Text className="m-tag">你的</Text>
            <Text className="m-emoji">{lastMatch.myItem.cover}</Text>
            <Text className="m-name">{lastMatch.myItem.title}</Text>
          </View>
        </View>

        <View className="match-cta">
          <Button className="cta-chat" onClick={goChat}>去聊聊</Button>
          <Button className="cta-browse" onClick={clearMatch}>继续浏览</Button>
        </View>
      </View>
    </View>
  )
}
