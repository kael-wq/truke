import Taro from '@tarojs/taro'

export interface CloudResult<T = any> {
  code: number
  message?: string
  data: T
}

/**
 * 云函数调用封装。
 * 约定所有云函数返回 { code: 0, data } 或 { code: 非0, message }
 */
export async function callCloud<T = any>(name: string, data: Record<string, any> = {}): Promise<T> {
  const res = await Taro.cloud.callFunction({ name, data })
  const result = res.result as CloudResult<T>
  if (result && result.code === 0) {
    return result.data
  }
  throw new Error(result?.message || `${name} 调用失败`)
}

/** 判断云开发是否可用（未初始化或游客态时回退到 mock 数据） */
export function isCloudReady(): boolean {
  return typeof Taro.cloud !== 'undefined' && !!Taro.cloud
}
