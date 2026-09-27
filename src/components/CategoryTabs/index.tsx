import { View, Text, ScrollView } from '@tarojs/components'
import { useCardStore } from '../../stores/useCardStore'
import './index.scss'

const CATS = ['附近', '数码', '潮玩', '书籍', '服饰', '家居']

export default function CategoryTabs() {
  const active = useCardStore(s => s.activeCategory)
  const setActive = useCardStore(s => s.setActiveCategory)

  return (
    <ScrollView scrollX className="cat-scroll" showScrollbar={false} enhanced>
      <View className="cat-row">
        {CATS.map(c => (
          <View
            key={c}
            className={`cat ${c === active ? 'cat--active' : ''}`}
            onClick={() => setActive(c)}
          >
            <Text>{c}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
