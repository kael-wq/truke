import { create } from 'zustand'
import Taro from '@tarojs/taro'

interface UserState {
  openid: string
  nickname: string
  emojiAvatar: string
  isMember: boolean
  memberExpireAt: number | null
  /** 会员每月免费 Boost 次数（5次） */
  freeBoostsLeft: number
  publishedCount: number
  swappedOut: number
  swappedIn: number
  login: () => Promise<void>
  setProfile: (patch: Partial<Pick<UserState, 'nickname' | 'emojiAvatar'>>) => void
  setMember: (active: boolean) => void
  consumeFreeBoost: () => boolean
}

const EMOJI_AVATARS = ['🦊', '🐱', '🐻', '🐰', '🐼', '🦉', '🦌', '🐯', '🦒', '🐬']

/** 本地兜底登录：云函数 login 失败时生成游客身份 */
function guestProfile(): { openid: string; nickname: string; emojiAvatar: string } {
  const openid = 'guest_' + Math.random().toString(36).slice(2, 10)
  return {
    openid,
    nickname: '换友' + openid.slice(-4),
    emojiAvatar: EMOJI_AVATARS[Math.floor(Math.random() * EMOJI_AVATARS.length)]
  }
}

export const useUserStore = create<UserState>((set, get) => ({
  openid: '',
  nickname: '换友',
  emojiAvatar: '🦊',
  isMember: false,
  memberExpireAt: null,
  freeBoostsLeft: 0,
  publishedCount: 2,
  swappedOut: 8,
  swappedIn: 6,

  async login() {
    try {
      const res = await Taro.cloud.callFunction({ name: 'login', data: {} })
      const result = res.result as any
      if (result && result.code === 0) {
        set({ openid: result.data.openid })
        return
      }
    } catch (e) {
      // 未配置云环境：使用游客身份
    }
    set(guestProfile())
  },

  setProfile(patch) {
    set(patch)
  },

  setMember(active) {
    set({
      isMember: active,
      memberExpireAt: active ? Date.now() + 30 * 24 * 3600 * 1000 : null,
      freeBoostsLeft: active ? 5 : 0
    })
  },

  consumeFreeBoost() {
    const { isMember, freeBoostsLeft } = get()
    if (!isMember || freeBoostsLeft <= 0) return false
    set({ freeBoostsLeft: freeBoostsLeft - 1 })
    return true
  }
}))
