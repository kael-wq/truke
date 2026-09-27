import { View, Text, Image } from '@tarojs/components'
import { Tag } from '@nutui/nutui-react-taro'
import Taro, { useLoad } from '@tarojs/taro'
import { useRef, useState } from 'react'
import TabBar from '../../components/TabBar'
import { CardItem, ItemStatus } from '../../types'
import { fetchMyItems } from '../../services/match'
import { MY_PUBLISHED } from '../../services/mock'
import './index.scss'

const STATUS_TEXT: Record<ItemStatus, string> = {
  active: '展示中',
  matched: '已换出',
  archived: '已下架'
}

const STATUS_TYPE: Record<ItemStatus, 'success' | 'primary' | 'default'> = {
  active: 'success',
  matched: 'primary',
  archived: 'default'
}

export default function Wishlist() {
  const [items, setItems] = useState<CardItem[]>([])
  const [whoWants, setWhoWants] = useState<Record<string, string[]>>({})

  useLoad(async () => {
    try {
      const list = await fetchMyItems()
      setItems(list.length ? list : MY_PUBLISHED)
    } catch (e) {
      setItems(MY_PUBLISHED)
    }
    setWhoWants({ p1: ['🐱', '🐻', '🐰'], p2: ['🦉', '🐼'] })
  })

  const manage = (item: CardItem) => {
    Taro.showActionSheet({
      itemList: item.status === 'active' ? ['标记为已换出', '下架'] : ['重新上架', '删除'],
      success: res => {
        const idx = res.tapIndex
        setItems(prev =>
          prev
            .map(it => {
              if (it._id !== item._id) return it
              if (item.status === 'active') return { ...it, status: idx === 0 ? 'matched' : 'archived' }
              return { ...it, status: idx === 0 ? 'active' : it.status }
            })
            .filter(it => !(item.status !== 'active' && idx === 1 && it._id === item._id))
        )
      }
    })
  }

  return (
    <View className="wishlist-page">
      <View className="wish-head">
        <Text className="wish-head__title">📦 我的发布</Text>
        <Text className="wish-head__count">共 {items.length} 件</Text>
      </View>

      {items.map(item => (
        <WishRow key={item._id} item={item} whoWants={whoWants[item._id] || []} onManage={() => manage(item)} />
      ))}

      <View className="wish-tip">
        <Text className="wish-tip__title">👑 会员专享</Text>
        <Text className="wish-tip__desc">查看谁对你的物品点了「想换」—— 免费用户显示模糊头像，会员可直接查看</Text>
      </View>

      <View style={{ height: '160rpx' }} />
      <TabBar current="wishlist" />
    </View>
  )
}

function WishRow({ item, whoWants, onManage }: { item: CardItem; whoWants: string[]; onManage: () => void }) {
  const [dx, setDx] = useState(0)
  const startX = useRef(0)

  const onStart = (e: any) => { startX.current = e.touches[0].clientX }
  const onMove = (e: any) => {
    const d = e.touches[0].clientX - startX.current
    if (d < 0) setDx(Math.max(d, -180))
  }
  const onEnd = () => setDx(dx < -80 ? -180 : 0)

  return (
    <View className="wish-row-wrap">
      <View className="wish-row__del" onClick={onManage}>删除</View>
      <View
        className="wish-row"
        style={{ transform: `translateX(${dx}rpx)` }}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        onClick={() => (dx < 0 ? setDx(0) : onManage())}
      >
        <View className="wish-row__thumb">
          {item.cover.startsWith('http') || item.cover.startsWith('cloud') ? (
            <Image className="wish-row__img" src={item.cover} mode="aspectFill" />
          ) : (
            <Text className="wish-row__emoji">{item.cover}</Text>
          )}
        </View>
        <View className="wish-row__body">
          <Text className="wish-row__title">{item.title}</Text>
          <View className="wish-row__meta">
            <Tag type={STATUS_TYPE[item.status]}>{STATUS_TEXT[item.status]}</Tag>
            <Text className="wish-row__swaps">🔥 {whoWants.length} 人想换</Text>
          </View>
          {whoWants.length > 0 && (
            <View className="wish-row__who">
              {whoWants.map((e, i) => (
                <Text key={i} className="wish-row__avatar">{e}</Text>
              ))}
              <Text className="wish-row__who-tip">👑 会员可查看具体是谁</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}
