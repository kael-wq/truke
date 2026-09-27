import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export type TabKey = 'index' | 'messages' | 'wishlist' | 'profile'

interface TabBarProps {
  current: TabKey
  msgBadge?: number
}

const TABS: { key: TabKey; label: string; icon: string; url: string }[] = [
  { key: 'index', label: '发现', icon: '🧭', url: '/pages/index/index' },
  { key: 'messages', label: '消息', icon: '💬', url: '/pages/messages/messages' },
  { key: 'wishlist', label: '愿望单', icon: '🧾', url: '/pages/wishlist/wishlist' },
  { key: 'profile', label: '我的', icon: '👤', url: '/pages/profile/profile' }
]

export default function TabBar({ current, msgBadge = 0 }: TabBarProps) {
  const navigate = (url: string) => {
    const pages = Taro.getCurrentPages()
    const cur = pages[pages.length - 1]?.route
    const path = url.replace(/^\//, '')
    if (cur !== path) {
      Taro.redirectTo({ url })
    }
  }

  const left = TABS.slice(0, 2)
  const right = TABS.slice(2)

  return (
    <View className="tabbar">
      {left.map(t => (
        <View
          key={t.key}
          className={`tabbar__item ${current === t.key ? 'tabbar__item--active' : ''}`}
          onClick={() => navigate(t.url)}
        >
          <Text className="tabbar__icon">{t.icon}</Text>
          <Text className="tabbar__label">{t.label}</Text>
          {t.key === 'messages' && msgBadge > 0 && <Text className="tabbar__badge">{msgBadge}</Text>}
        </View>
      ))}

      <View className="tabbar__publish-wrap" onClick={() => Taro.navigateTo({ url: '/pages/publish/publish' })}>
        <View className="tabbar__publish"><Text className="tabbar__plus">＋</Text></View>
      </View>

      {right.map(t => (
        <View
          key={t.key}
          className={`tabbar__item ${current === t.key ? 'tabbar__item--active' : ''}`}
          onClick={() => navigate(t.url)}
        >
          <Text className="tabbar__icon">{t.icon}</Text>
          <Text className="tabbar__label">{t.label}</Text>
        </View>
      ))}
    </View>
  )
}
