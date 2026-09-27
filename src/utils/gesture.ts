import { SwipeDir } from '../types'

export interface SwipeVector {
  dx: number
  dy: number
  direction: SwipeDir | 'none'
  /** 0 ~ 1，相对阈值（100px）的进度，用于印章/边框透明度 */
  progress: number
  /** 旋转角度（度） */
  angle: number
}

/**
 * 滑动手势计算
 * @param startX 起始 clientX
 * @param startY 起始 clientY
 * @param x      当前 clientX
 * @param y      当前 clientY
 * @param threshold 触发阈值（px），默认 100
 */
export function computeSwipe(
  startX: number,
  startY: number,
  x: number,
  y: number,
  threshold = 100
): SwipeVector {
  const dx = x - startX
  const dy = y - startY
  const abs = Math.abs(dx)
  const direction: SwipeDir | 'none' = abs < 8 ? 'none' : dx > 0 ? 'right' : 'left'
  return {
    dx,
    dy,
    direction,
    progress: Math.min(1, abs / threshold),
    angle: dx * 0.06
  }
}

/** 判断释放时是否触发滑出（超过阈值） */
export function shouldFling(vector: SwipeVector, threshold = 100): boolean {
  return Math.abs(vector.dx) > threshold && vector.direction !== 'none'
}

/** 计算飞出的目标位移 */
export function flingTransform(dir: SwipeDir, dy: number) {
  return {
    x: dir === 'right' ? 900 : -900,
    y: dy,
    angle: dir === 'right' ? 20 : -20
  }
}
