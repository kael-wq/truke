import { View, Text } from '@tarojs/components'
import { Badge } from '@nutui/nutui-react-taro'
import { Home, Message, Heart, User, Add } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

export type TabKey = 'index' | 'messages' | 'wishlist' | 'profile'

interface TabBarProps {
  current: TabKey
  msgBadge?: number
}

const TABS: { key: TabKey; label: string; Icon: any; url: string }[] = [
  { key: 'index', label: '发现', Icon: Home, url: '/pages/index/index' },
  { key: 'messages', label: '消息', Icon: Message, url: '/pages/messages/messages' },
  { key: 'wishlist', label: '愿望单', Icon: Heart, url: '/pages/wishlist/wishlist' },
  { key: 'profile', label: '我的', Icon: User, url: '/pages/profile/profile' }
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

  const renderItem = (t: (typeof TABS)[number]) => (
    <View
      key={t.key}
      className={`tabbar__item ${current === t.key ? 'tabbar__item--active' : ''}`}
      onClick={() => navigate(t.url)}
    >
      {t.key === 'messages' && msgBadge > 0 ? (
        <Badge value={msgBadge}>
          <t.Icon className="tabbar__icon" size={22} />
        </Badge>
      ) : (
        <t.Icon className="tabbar__icon" size={22} />
      )}
      <Text className="tabbar__label">{t.label}</Text>
    </View>
  )

  return (
    <View className="tabbar">
      {TABS.slice(0, 2).map(renderItem)}
      <View className="tabbar__publish-wrap" onClick={() => Taro.navigateTo({ url: '/pages/publish/publish' })}>
        <View className="tabbar__publish">
          <Add className="tabbar__plus" size={26} color="#fff" />
        </View>
      </View>
      {TABS.slice(2).map(renderItem)}
    </View>
  )
}
