import { View, Text } from '@tarojs/components'
import { Badge } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import TabBar from '../../components/TabBar'
import { Conversation } from '../../types'
import { MOCK_CONVERSATIONS } from '../../services/mock'
import './index.scss'

export default function Messages() {
  const [convos, setConvos] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const unread = convos.filter(c => c.unread > 0).length

  const openChat = (c: Conversation) => {
    setConvos(prev => prev.map(x => (x._id === c._id ? { ...x, unread: 0 } : x)))
    Taro.navigateTo({
      url: `/pages/chat/chat?peer=${encodeURIComponent(c.peer.nickname)}&emoji=${encodeURIComponent(c.peer.emoji)}&item=${encodeURIComponent(c.theirItemTitle)}`
    })
  }

  return (
    <View className="messages-page">
      {/* 系统通知 */}
      <View className="sys-notice" onClick={() => Taro.showToast({ title: '系统通知', icon: 'none' })}>
        <Text className="sys-notice__icon">🔔</Text>
        <View className="sys-notice__body">
          <Text className="sys-notice__title">有人想换你的物品</Text>
          <Text className="sys-notice__desc">🐰 兔兔 想用「泡泡玛特盲盒」换你的「机械键盘」</Text>
        </View>
        <Text className="sys-notice__time">2分钟前</Text>
      </View>

      <View className="msg-head">
        <Text className="msg-head__title">💬 交换消息</Text>
        <Text className="msg-head__count">{unread} 条未读</Text>
      </View>

      {convos.map(c => (
        <View key={c._id} className="convo" onClick={() => openChat(c)}>
          {c.unread > 0 ? (
            <Badge value={c.unread}>
              <View className="convo__avatar">
                <Text className="convo__item">🎁</Text>
                <Text className="convo__emoji">{c.peer.emoji}</Text>
              </View>
            </Badge>
          ) : (
            <View className="convo__avatar">
              <Text className="convo__item">🎁</Text>
              <Text className="convo__emoji">{c.peer.emoji}</Text>
            </View>
          )}
          <View className="convo__body">
            <View className="convo__top">
              <Text className="convo__name">{c.peer.nickname}</Text>
              <Text className="convo__time">{c.lastTime}</Text>
            </View>
            <Text className="convo__exchange">⇄ 你的「{c.myItemTitle}」换 TA 的「{c.theirItemTitle}」</Text>
            <Text className="convo__msg">{c.lastMessage}</Text>
          </View>
        </View>
      ))}

      <View style={{ height: '160rpx' }} />
      <TabBar current="messages" msgBadge={0} />
    </View>
  )
}
