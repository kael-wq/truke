import { View, Text } from '@tarojs/components'
import { Input, Button } from '@nutui/nutui-react-taro'
import Taro, { useRouter } from '@tarojs/taro'
import { useState } from 'react'
import { Message } from '../../types'
import './index.scss'

export default function Chat() {
  const router = useRouter()
  const peer = decodeURIComponent(router.params.peer || '换友')
  const emoji = decodeURIComponent(router.params.emoji || '🦊')
  const item = decodeURIComponent(router.params.item || '闲置物品')

  const [messages, setMessages] = useState<Message[]>([
    { _id: '1', from: 'peer', type: 'text', content: '嗨！我看到你的物品了，正好是我想要的~', time: '10:20' },
    { _id: '2', from: 'me', type: 'text', content: '好呀，你的我也很感兴趣，怎么换？', time: '10:22' },
    { _id: '3', from: 'peer', type: 'text', content: '周末在附近的咖啡店当面换可以吗？', time: '10:24' }
  ])
  const [input, setInput] = useState('')

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages([...messages, { _id: String(Date.now()), from: 'me', type: 'text', content: text, time: '刚刚' }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { _id: String(Date.now() + 1), from: 'peer', type: 'text', content: '收到，我们详聊～', time: '刚刚' }])
    }, 1200)
  }

  const confirmTrade = () => {
    Taro.showModal({
      title: '确认交换',
      content: '双方确认后生成交换码，各自寄出并确认收货即完成交易。演示环境将直接生成交换码。',
      confirmText: '生成交换码',
      success: res => {
        if (res.confirm) Taro.showToast({ title: '交换码：SWAP-8842', icon: 'none', duration: 2500 })
      }
    })
  }

  return (
    <View className="chat-page">
      {/* 交换信息卡 */}
      <View className="chat-trade">
        <Text className="chat-trade__item">你的物品</Text>
        <Text className="chat-trade__arrow">⇄</Text>
        <Text className="chat-trade__item">{item}</Text>
        <Button type="primary" size="small" onClick={confirmTrade}>确认交换</Button>
      </View>

      <View className="chat-scroll">
        {messages.map(m => (
          <View key={m._id} className={`msg ${m.from === 'me' ? 'msg--me' : 'msg--peer'}`}>
            {m.from === 'peer' && <Text className="msg__avatar">{emoji}</Text>}
            <View className="msg__bubble"><Text className="msg__text">{m.content}</Text></View>
            {m.from === 'me' && <Text className="msg__avatar">🦊</Text>}
          </View>
        ))}
      </View>

      <View className="chat-inputbar">
        <Input
          className="chat-input"
          value={input}
          placeholder="输入消息（仅文字/图片）"
          confirmType="send"
          onChange={setInput}
          onConfirm={send}
        />
        <Button type="primary" size="small" onClick={send}>发送</Button>
      </View>
    </View>
  )
}
