import { CardItem, Conversation } from '../types'

/**
 * 云开发未配置时的演示数据。
 * 保证 UI 在本地也能完整跑起来（微信开发者工具选择「不使用云服务」时）。
 */
export const MOCK_CARDS: CardItem[] = [
  { _id: 'm1', title: '罗技 G613 机械键盘', cover: '⌨️', owner: { emoji: '🐻', nickname: '熊仔' }, ownerOpenid: 'o1', category: '数码', condition: '95新', distanceKm: 0.8, wishlist: ['Switch 游戏机', '蓝牙音箱'], tags: ['机械键盘', '无线'], boosted: true, pinned: false, status: 'active', createdAt: Date.now() - 3600e3 },
  { _id: 'm2', title: 'Sony WH-1000XM4 降噪耳机', cover: '🎧', owner: { emoji: '🦊', nickname: '小狐狸' }, ownerOpenid: 'o2', category: '数码', condition: '9成新', distanceKm: 2.1, wishlist: ['电子书阅读器'], tags: ['降噪', '头戴式'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 7200e3 },
  { _id: 'm3', title: '富士 X100V 复古相机', cover: '📷', owner: { emoji: '🐱', nickname: '阿喵' }, ownerOpenid: 'o3', category: '数码', condition: '99新', distanceKm: 1.2, wishlist: ['机械键盘', '胶片相机'], tags: ['复古', '街拍'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 10800e3 },
  { _id: 'm4', title: 'Switch 游戏机 + 3款卡带', cover: '🎮', owner: { emoji: '🐼', nickname: '滚滚' }, ownerOpenid: 'o4', category: '数码', condition: '9成新', distanceKm: 3.5, wishlist: ['降噪耳机', '手冲咖啡'], tags: ['主机', '卡带'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 14400e3 },
  { _id: 'm5', title: '泡泡玛特 Molly 盲盒套装', cover: '🧸', owner: { emoji: '🐰', nickname: '兔兔' }, ownerOpenid: 'o5', category: '潮玩', condition: '全新', distanceKm: 0.6, wishlist: ['乐高积木'], tags: ['盲盒', 'Molly'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 18000e3 },
  { _id: 'm6', title: '乐高 Saturn V 登月火箭', cover: '🚀', owner: { emoji: '🦉', nickname: '猫头鹰' }, ownerOpenid: 'o6', category: '潮玩', condition: '95新', distanceKm: 5.0, wishlist: ['Molly 盲盒'], tags: ['乐高', '航天'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 21600e3 },
  { _id: 'm7', title: '《三体》全集 精装版', cover: '📚', owner: { emoji: '🦌', nickname: '小鹿' }, ownerOpenid: 'o7', category: '书籍', condition: '9成新', distanceKm: 1.5, wishlist: ['科幻小说', '尤克里里'], tags: ['科幻', '精装'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 25200e3 },
  { _id: 'm8', title: 'Air Jordan 1 限量球鞋 42码', cover: '👟', owner: { emoji: '🦅', nickname: '老鹰' }, ownerOpenid: 'o8', category: '服饰', condition: '99新', distanceKm: 1.0, wishlist: ['北面冲锋衣'], tags: ['球鞋', '限量'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 28800e3 },
  { _id: 'm9', title: '中古藤编休闲椅', cover: '🪑', owner: { emoji: '🦒', nickname: '长颈鹿' }, ownerOpenid: 'o9', category: '家居', condition: '9成新', distanceKm: 0.9, wishlist: ['落地灯'], tags: ['中古', '藤编'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 32400e3 },
  { _id: 'm10', title: '手冲咖啡壶套装', cover: '☕', owner: { emoji: '🐿️', nickname: '松鼠' }, ownerOpenid: 'o10', category: '家居', condition: '全新', distanceKm: 2.5, wishlist: ['陶瓷餐具'], tags: ['咖啡', '手冲'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 36000e3 }
]

export const MOCK_CONVERSATIONS: Conversation[] = [
  { _id: 'c1', peer: { emoji: '🐱', nickname: '阿喵' }, peerOpenid: 'o3', myItemTitle: 'Fender 电吉他', theirItemTitle: '富士 X100V 复古相机', lastMessage: '好啊，周末可以当面换！', lastTime: '10:24', unread: 2 },
  { _id: 'c2', peer: { emoji: '🐻', nickname: '熊仔' }, peerOpenid: 'o1', myItemTitle: '复古收音机', theirItemTitle: '罗技 G613 机械键盘', lastMessage: '键盘还在吗？我想换~', lastTime: '昨天', unread: 1 },
  { _id: 'c3', peer: { emoji: '🐰', nickname: '兔兔' }, peerOpenid: 'o5', myItemTitle: '27寸 4K 显示器', theirItemTitle: '泡泡玛特 Molly 盲盒', lastMessage: '盲盒换键盘，考虑一下？', lastTime: '周二', unread: 0 }
]

export const MY_PUBLISHED: CardItem[] = [
  { _id: 'p1', title: 'Fender 电吉他', cover: '🎸', owner: { emoji: '🦊', nickname: '小狐狸' }, ownerOpenid: 'me', category: '潮玩', condition: '95新', distanceKm: 0, wishlist: ['复古相机', '胶片相机'], tags: ['电吉他', '乐器'], boosted: false, pinned: true, status: 'active', createdAt: Date.now() - 86400e3 },
  { _id: 'p2', title: '复古木质收音机', cover: '📻', owner: { emoji: '🦊', nickname: '小狐狸' }, ownerOpenid: 'me', category: '家居', condition: '9成新', distanceKm: 0, wishlist: ['机械键盘'], tags: ['复古', '木质'], boosted: true, pinned: false, status: 'active', createdAt: Date.now() - 172800e3 }
]
