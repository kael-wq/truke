import { View, Text } from '@tarojs/components'
import { Popup, Button } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useCardStore } from '../../stores/useCardStore'
import './index.scss'

const CONFETTI_COLORS = ['#256B4E', '#C08A1E', '#3B8B5C', '#3A6B9E', '#6C5B9E', '#B3432F', '#D9A838']

export default function MatchModal() {
  const lastMatch = useCardStore(s => s.lastMatch)
  const clearMatch = useCardStore(s => s.clearMatch)

  const confetti = Array.from({ length: 24 }, (_, i) => i)

  const goChat = () => {
    clearMatch()
    Taro.redirectTo({ url: '/pages/messages/messages' })
  }

  return (
    <Popup
      visible={!!lastMatch}
      position="center"
      round
      onClose={clearMatch}
      className="match-popup"
    >
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
            <Text className="m-emoji">{lastMatch?.theirItem.cover}</Text>
            <Text className="m-name">{lastMatch?.theirItem.title}</Text>
          </View>
          <Text className="match-arrow">⇄</Text>
          <View className="match-item match-item--mine">
            <Text className="m-tag">你的</Text>
            <Text className="m-emoji">{lastMatch?.myItem.cover}</Text>
            <Text className="m-name">{lastMatch?.myItem.title}</Text>
          </View>
        </View>

        <View className="match-cta">
          <Button type="primary" onClick={goChat}>去聊聊</Button>
          <Button onClick={clearMatch}>继续浏览</Button>
        </View>
      </View>
    </Popup>
  )
}
