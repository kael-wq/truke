import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'

import CoinPayModal from './components/CoinPayModal'
import { useUserStore } from './stores/useUserStore'
import '@nutui/nutui-react-taro/dist/style.css'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    // 初始化云开发环境（请替换成你自己的环境 ID）
    if (Taro.cloud) {
      Taro.cloud.init({
        env: 'swapswap-xxxxxx', // TODO: 替换为你的云开发环境 ID
        traceUser: true
      })
    }

    // 静默登录：获取 openid
    useUserStore.getState().login()
  })

  return (
    <>
      {children}
      {/* 全局充值弹窗：任意页面触发余额不足都会弹起 */}
      <CoinPayModal />
    </>
  )
}

export default App
