export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/messages/messages',
    'pages/wishlist/wishlist',
    'pages/profile/profile',
    'pages/publish/publish',
    'pages/chat/chat',
    'pages/coins/coins',
    'pages/membership/membership',
    'pages/match/match'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#F5F0E8',
    navigationBarTitleText: '换换',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F5F0E8'
  },
  permission: {
    'scope.userLocation': {
      desc: '用于计算附近可交换物品的距离'
    }
  },
  requiredPrivateInfos: ['getLocation']
})
