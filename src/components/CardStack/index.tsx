import { View, Text } from '@tarojs/components'
import SwipeCard from '../SwipeCard'
import { useCardStore } from '../../stores/useCardStore'
import './index.scss'

export default function CardStack() {
  const cards = useCardStore(s => s.cards)
  const index = useCardStore(s => s.index)
  const swipe = useCardStore(s => s.swipe)
  const setDragFeedback = useCardStore(s => s.setDragFeedback)
  const openDetail = useCardStore(s => s.openDetail)

  const visible = cards.slice(index, index + 3)

  if (visible.length === 0) {
    return (
      <View className="card-stack card-stack--empty">
        <Text className="card-stack__empty-emoji">📭</Text>
        <Text className="card-stack__empty-title">这一分类暂时没有更多了</Text>
        <Text className="card-stack__empty-sub">换个分类看看，或发布你的闲置物品</Text>
      </View>
    )
  }

  return (
    <View className="card-stack">
      {visible.map((item, i) => (
        <View
          key={item._id}
          className="card-stack__slot"
          style={{
            zIndex: 3 - i,
            transform: i === 0 ? 'none' : `translateY(${i * 16}px) scale(${1 - i * 0.04})`
          }}
        >
          <SwipeCard
            item={item}
            active={i === 0}
            onSwipe={dir => swipe(dir)}
            onDrag={setDragFeedback}
            onExpand={() => openDetail(item)}
          />
        </View>
      ))}
    </View>
  )
}
