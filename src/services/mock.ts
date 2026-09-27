import { CardItem, Conversation } from '../types'

/**
 * 云开发未配置时的演示数据。
 * 保证 UI 在本地也能完整跑起来（微信开发者工具选择「不使用云服务」时）。
 */
export const MOCK_CARDS: CardItem[] = [
  { _id: 'm1', title: '罗技 G613 机械键盘', cover: '⌨️', owner: { emoji: '🐻', nickname: '熊仔' }, ownerOpenid: 'o1', category: '数码', condition: '95新', distanceKm: 0.8, wishlist: ['Switch 游戏机', '蓝牙音箱'], tags: ['含原装盒', '在保至2026.03', '可面交'], boosted: true, pinned: false, status: 'active', createdAt: Date.now() - 3600e3, description: '罗技 G613 无线机械键盘，Lightspeed 连接几乎零延迟，续航约 18 个月。键帽无油无划痕，附原装腕托与 USB 接收器，因换了静音轴闲置出掉，可约地铁站当面试打。', rating: 4.8, swapCount: 23 },
  { _id: 'm2', title: 'Sony WH-1000XM4 降噪耳机', cover: '🎧', owner: { emoji: '🦊', nickname: '小狐狸' }, ownerOpenid: 'o2', category: '数码', condition: '9成新', distanceKm: 2.1, wishlist: ['电子书阅读器'], tags: ['原装配件齐', '可面交'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 7200e3, description: '降噪依旧能打，耳罩无破损，附收纳盒与音频线。换设备后一直吃灰，想换台电纸书。', rating: 4.9, swapCount: 11 },
  { _id: 'm3', title: '富士 X100V 复古相机', cover: '📷', owner: { emoji: '🐱', nickname: '阿喵' }, ownerOpenid: 'o3', category: '数码', condition: '99新', distanceKm: 1.2, wishlist: ['机械键盘', '胶片相机'], tags: ['几乎全新', '含原装盒', '可面交'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 10800e3, description: '买来拍了不到 500 张，快门数很低，机身无磕碰。附原装电池两块、皮套。想换一台机械键盘或胶片机。', rating: 5.0, swapCount: 7 },
  { _id: 'm4', title: 'Switch 游戏机 + 3款卡带', cover: '🎮', owner: { emoji: '🐼', nickname: '滚滚' }, ownerOpenid: 'o4', category: '数码', condition: '9成新', distanceKm: 3.5, wishlist: ['降噪耳机', '手冲咖啡'], tags: ['含3款游戏', '可面交'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 14400e3, description: '续航增强版主机，附《塞尔达》《马力欧赛车》《动森》三款卡带，手柄无漂移。', rating: 4.7, swapCount: 15 },
  { _id: 'm5', title: '泡泡玛特 Molly 盲盒套装', cover: '🧸', owner: { emoji: '🐰', nickname: '兔兔' }, ownerOpenid: 'o5', category: '潮玩', condition: '全新', distanceKm: 0.6, wishlist: ['乐高积木'], tags: ['未拆封', '整套', '可面交'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 18000e3, description: '整套 12 只 Molly 星座系列，盒都没拆，重复款多余的出掉，想换乐高。', rating: 4.9, swapCount: 31 },
  { _id: 'm6', title: '乐高 Saturn V 登月火箭', cover: '🚀', owner: { emoji: '🦉', nickname: '猫头鹰' }, ownerOpenid: 'o6', category: '潮玩', condition: '95新', distanceKm: 5.0, wishlist: ['Molly 盲盒'], tags: ['已拼装', '零件齐全'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 21600e3, description: '21309 经典款，已拼装展示过，零件齐全含说明书，可拆件邮寄。', rating: 4.6, swapCount: 5 },
  { _id: 'm7', title: '《三体》全集 精装版', cover: '📚', owner: { emoji: '🦌', nickname: '小鹿' }, ownerOpenid: 'o7', category: '书籍', condition: '9成新', distanceKm: 1.5, wishlist: ['科幻小说', '尤克里里'], tags: ['精装全套', '无笔记', '可面交'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 25200e3, description: '三册精装，无笔记无划线，书脊完好。想换其它科幻小说或一把尤克里里。', rating: 4.8, swapCount: 9 },
  { _id: 'm8', title: 'Air Jordan 1 限量球鞋 42码', cover: '👟', owner: { emoji: '🦅', nickname: '老鹰' }, ownerOpenid: 'o8', category: '服饰', condition: '99新', distanceKm: 1.0, wishlist: ['北面冲锋衣'], tags: ['仅试穿', '含原鞋盒', '可面交'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 28800e3, description: '42 码，中签抽到后仅室内试穿，鞋底无磨损，原盒配件齐全。想换一件冲锋衣。', rating: 4.7, swapCount: 12 },
  { _id: 'm9', title: '中古藤编休闲椅', cover: '🪑', owner: { emoji: '🦒', nickname: '长颈鹿' }, ownerOpenid: 'o9', category: '家居', condition: '9成新', distanceKm: 0.9, wishlist: ['落地灯'], tags: ['中古正品', '仅限自提'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 32400e3, description: '上世纪中古藤编椅，结构稳固无松散，藤面自然使用痕迹。体积较大建议同城自提。', rating: 4.8, swapCount: 6 },
  { _id: 'm10', title: '手冲咖啡壶套装', cover: '☕', owner: { emoji: '🐿️', nickname: '松鼠' }, ownerOpenid: 'o10', category: '家居', condition: '全新', distanceKm: 2.5, wishlist: ['陶瓷餐具'], tags: ['全新未拆', '一整套', '可面交'], boosted: false, pinned: false, status: 'active', createdAt: Date.now() - 36000e3, description: 'V60 陶瓷滤杯 + 分享壶 + 手冲壶一套，全新未拆封。想换一套陶瓷餐具。', rating: 4.9, swapCount: 18 }
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
