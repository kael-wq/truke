import { View, Text, ScrollView } from '@tarojs/components'
import { Popup } from '@nutui/nutui-react-taro'
import { Location, Star, Check } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import { useCardStore } from '../../stores/useCardStore'
import './index.scss'

export default function ItemDetailSheet() {
  const item = useCardStore(s => s.detailItem)
  const closeDetail = useCardStore(s => s.closeDetail)
  const swipe = useCardStore(s => s.swipe)

  const handleSwap = () => {
    closeDetail()
    swipe('right')
  }

  return (
    <Popup
      visible={!!item}
      position="bottom"
      round
      closeable
      onClose={closeDetail}
      style={{ height: '84vh' }}
      className="detail-popup"
    >
      {item && (
        <ScrollView scrollY className="detail-sheet">
          {/* 商品大图 */}
          <View className="detail-sheet__hero">
            <Text className="detail-sheet__emoji">{item.cover}</Text>
            <Text className="detail-sheet__cond">✦ {item.condition}</Text>
            {item.boosted && <Text className="detail-sheet__boost">⚡ 已Boost</Text>}
          </View>

          {/* 想换卡（独立卡片，不覆盖图片） */}
          <View className="detail-sheet__wish">
            <Text className="detail-sheet__wish-label">想换</Text>
            <Text className="detail-sheet__wish-text">{item.wishlist.join(' / ')}</Text>
          </View>

          {/* 标题 + 实用标签 */}
          <View className="detail-sheet__info">
            <Text className="detail-sheet__title">{item.title}</Text>
            <View className="detail-sheet__tags">
              {item.tags.map(t => <Text key={t} className="detail-sheet__tag">{t}</Text>)}
              {item.priceRef ? <Text className="detail-sheet__tag">参考价 {item.priceRef}</Text> : null}
            </View>
          </View>

          {/* 卖家信任卡 */}
          <View className="detail-sheet__seller">
            <View className="detail-sheet__avatar-wrap">
              <View className="detail-sheet__avatar">{item.owner.emoji}</View>
              <View className="detail-sheet__shield"><Check size={10} color="#fff" /></View>
            </View>
            <View className="detail-sheet__seller-info">
              <View className="detail-sheet__seller-name">
                <Text className="detail-sheet__seller-nick">{item.owner.nickname}</Text>
                <View className="detail-sheet__rating">
                  <Star size={13} color="#C08A1E" />
                  <Text>{(item.rating ?? 4.8).toFixed(1)}</Text>
                </View>
              </View>
              <Text className="detail-sheet__seller-sub">已换 {item.swapCount ?? 0} 次 · {item.category}</Text>
            </View>
            <View className="detail-sheet__distance">
              <Location size={13} />
              <Text>{item.distanceKm.toFixed(1)}km</Text>
            </View>
          </View>

          {/* 物品描述 */}
          <View className="detail-sheet__desc">
            <View className="detail-sheet__desc-head">
              <Text className="detail-sheet__desc-title">物品描述</Text>
              <View className="detail-sheet__rule" />
            </View>
            <Text className="detail-sheet__desc-text">{item.description || '物主暂未填写描述。'}</Text>
          </View>

          {/* 底部操作 */}
          <View className="detail-sheet__cta">
            <View className="detail-sheet__cta-ghost" onClick={() => Taro.showToast({ title: `已打开与 ${item.owner.nickname} 的聊天`, icon: 'none' })}>
              聊一聊
            </View>
            <View className="detail-sheet__cta-primary" onClick={handleSwap}>想换 TA 的</View>
          </View>
        </ScrollView>
      )}
    </Popup>
  )
}
