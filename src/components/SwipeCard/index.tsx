import { View, Text, Image } from '@tarojs/components'
import { ArrowUp } from '@nutui/icons-react-taro'
import { useRef, useState } from 'react'
import { CardItem, DragFeedback, SwipeDir } from '../../types'
import { computeSwipe, shouldFling, flingTransform } from '../../utils/gesture'
import './index.scss'

interface SwipeCardProps {
  item: CardItem
  /** 是否可拖拽（只有堆叠最顶部的卡片可交互） */
  active?: boolean
  onSwipe: (dir: SwipeDir) => void
  onDrag?: (f: DragFeedback) => void
  /** 上滑 → 打开详情 */
  onExpand?: () => void
}

/** 封面是 emoji 还是图片 URL */
function isEmojiCover(src: string): boolean {
  return !src.startsWith('cloud') && !src.startsWith('http')
}

export default function SwipeCard({ item, active = true, onSwipe, onDrag, onExpand }: SwipeCardProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, angle: 0 })
  const [dragging, setDragging] = useState(false)
  const [flying, setFlying] = useState(false)
  const start = useRef({ x: 0, y: 0 })
  const last = useRef({ x: 0, y: 0 })
  const done = useRef(false)

  const onTouchStart = (e: any) => {
    if (!active || done.current) return
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
    last.current = { x: t.clientX, y: t.clientY }
    setDragging(true)
  }

  const onTouchMove = (e: any) => {
    if (!dragging || done.current) return
    const t = e.touches[0]
    last.current = { x: t.clientX, y: t.clientY }
    const v = computeSwipe(start.current.x, start.current.y, t.clientX, t.clientY)
    setTransform({ x: v.dx, y: v.dy, angle: v.angle })
    onDrag?.({ dir: v.direction, progress: v.progress })
  }

  const onTouchEnd = () => {
    if (!dragging || done.current) return
    setDragging(false)
    const v = computeSwipe(start.current.x, start.current.y, last.current.x, last.current.y)
    if (shouldFling(v)) {
      done.current = true
      setFlying(true)
      const f = flingTransform(v.direction as SwipeDir, v.dy)
      setTransform(f)
      const dir = v.direction as SwipeDir
      setTimeout(() => onSwipe(dir), 300)
    } else if (v.dy < -90 && Math.abs(v.dy) > Math.abs(v.dx) * 1.4) {
      // 上滑 → 打开详情
      onExpand?.()
      setTransform({ x: 0, y: 0, angle: 0 })
    } else {
      setTransform({ x: 0, y: 0, angle: 0 })
    }
    onDrag?.({ dir: 'none', progress: 0 })
  }

  const progress = Math.min(1, Math.abs(transform.x) / 100)
  const showRight = transform.x > 0

  return (
    <View
      className={`swipe-card ${flying ? 'swipe-card--flying' : ''} ${item.boosted ? 'swipe-card--boosted' : ''}`}
      style={{ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(${transform.angle}deg)` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* 图片 / emoji 封面区 */}
      <View className="swipe-card__photo">
        {isEmojiCover(item.cover) ? (
          <Text className="swipe-card__emoji">{item.cover}</Text>
        ) : (
          <Image className="swipe-card__img" src={item.cover} mode="aspectFill" />
        )}
        <Text className="swipe-card__cond">✦ {item.condition}</Text>
        {item.boosted && <Text className="swipe-card__boost-badge">⚡ 已Boost</Text>}
        <View className="swipe-card__wishbar">
          <Text className="swipe-card__wish-tag">想换</Text>
          <Text className="swipe-card__wish">{item.wishlist.join(' / ')}</Text>
        </View>
      </View>

      {/* 信息区 */}
      <View className="swipe-card__body">
        <Text className="swipe-card__title">{item.title}</Text>
        <View className="swipe-card__tags">
          {item.tags.map(t => <Text key={t} className="swipe-card__tag">{t}</Text>)}
        </View>
        <View className="swipe-card__meta">
          <View className="swipe-card__owner">
            <Text className="swipe-card__avatar">{item.owner.emoji}</Text>
            <Text className="swipe-card__owner-name">{item.owner.nickname}</Text>
          </View>
          <Text className="swipe-card__distance">📍 {item.distanceKm.toFixed(1)}km</Text>
          <Text className="swipe-card__cond-tag">{item.condition}</Text>
        </View>
      </View>

      {/* 滑动反馈：印章 + 彩色边框 */}
      <View className={`swipe-card__stamp ${showRight ? 'stamp-yes' : 'stamp-no'}`} style={{ opacity: progress }}>
        {showRight ? '想换!' : '算了'}
      </View>
      <View className={`swipe-card__border ${showRight ? 'border-yes' : 'border-no'}`} style={{ opacity: progress * 0.9 }} />

      {/* 上滑查看详情提示 */}
      <View className="swipe-card__grab-hint">
        <ArrowUp size={13} />
        <Text>上滑看详情</Text>
      </View>
    </View>
  )
}
