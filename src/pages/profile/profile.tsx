import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MemberBanner from '../../components/MemberBanner'
import TabBar from '../../components/TabBar'
import { useUserStore } from '../../stores/useUserStore'
import { useCoinStore } from '../../stores/useCoinStore'
import './index.scss'

const EMOJI_AVATARS = ['🦊', '🐱', '🐻', '🐰', '🐼', '🦉', '🦌', '🐯', '🦒', '🐬']

export default function Profile() {
  const nickname = useUserStore(s => s.nickname)
  const emojiAvatar = useUserStore(s => s.emojiAvatar)
  const isMember = useUserStore(s => s.isMember)
  const publishedCount = useUserStore(s => s.publishedCount)
  const swappedOut = useUserStore(s => s.swappedOut)
  const swappedIn = useUserStore(s => s.swappedIn)
  const setProfile = useUserStore(s => s.setProfile)

  const balance = useCoinStore(s => s.balance)

  const pickAvatar = () => {
    Taro.showActionSheet({
      itemList: EMOJI_AVATARS,
      success: res => setProfile({ emojiAvatar: EMOJI_AVATARS[res.tapIndex] })
    })
  }

  const editNickname = () => {
    Taro.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '输入昵称',
      success: res => {
        if (res.confirm && res.content) setProfile({ nickname: res.content })
      }
    })
  }

  const menu = [
    { icon: '💰', bg: '#F7E8C9', label: '换换币余额', val: `${balance} 币`, action: () => Taro.navigateTo({ url: '/pages/coins/coins' }) },
    { icon: '📦', bg: '#FCE3D9', label: '我的发布', val: '', action: () => Taro.redirectTo({ url: '/pages/wishlist/wishlist' }) },
    { icon: '♡', bg: '#DFF3E6', label: '我的收藏', val: '', action: () => Taro.showToast({ title: '收藏列表', icon: 'none' }) },
    { icon: '📋', bg: '#E3EFFB', label: '交换记录', val: '', action: () => Taro.showToast({ title: '交换记录', icon: 'none' }) },
    { icon: '👑', bg: '#EEE7FD', label: '会员状态', val: isMember ? '已开通' : '未开通', action: () => Taro.navigateTo({ url: '/pages/membership/membership' }) },
    { icon: '⚙️', bg: '#EAE3D5', label: '设置', val: '', action: () => Taro.showToast({ title: '设置', icon: 'none' }) },
    { icon: '📞', bg: '#EAE3D5', label: '客服', val: '', action: () => Taro.showToast({ title: '客服', icon: 'none' }) }
  ]

  return (
    <View className="profile-page">
      {/* 头像 + 昵称 */}
      <View className="profile-top">
        <View className="p-avatar" onClick={pickAvatar}>
          <Text className="p-avatar__emoji">{emojiAvatar}</Text>
          <Text className="p-avatar__edit">换</Text>
        </View>
        <View className="p-info">
          <View className="p-name" onClick={editNickname}>
            <Text className="p-name__text">{nickname}</Text>
            {isMember && <Text className="p-member-tag">👑 会员</Text>}
            <Text className="p-name__edit">✎</Text>
          </View>
          <Text className="p-sub">表情头像 · 保护隐私，不传真实照片</Text>
        </View>
      </View>

      {/* 统计 */}
      <View className="p-stats">
        <View className="p-stat"><Text className="p-stat__num">{publishedCount}</Text><Text className="p-stat__label">发布</Text></View>
        <View className="p-stat"><Text className="p-stat__num">{swappedOut}</Text><Text className="p-stat__label">换出</Text></View>
        <View className="p-stat"><Text className="p-stat__num">{swappedIn}</Text><Text className="p-stat__label">换入</Text></View>
      </View>

      {/* 会员横幅 */}
      <MemberBanner />

      {/* 菜单 */}
      <View className="p-menu">
        {menu.map((m, i) => (
          <View key={i} className="p-menu__item" onClick={m.action}>
            <View className="p-menu__ico" style={{ background: m.bg }}><Text>{m.icon}</Text></View>
            <Text className="p-menu__label">{m.label}</Text>
            {m.val ? <Text className="p-menu__val">{m.val}</Text> : null}
            <Text className="p-menu__arrow">›</Text>
          </View>
        ))}
      </View>

      <Text className="p-version">换换 SwapSwap v1.0 · 让闲置流动起来</Text>

      <View style={{ height: '160rpx' }} />
      <TabBar current="profile" />
    </View>
  )
}
