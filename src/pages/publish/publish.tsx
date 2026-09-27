import { View, Text, Input, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { useCoinStore } from '../../stores/useCoinStore'
import { callCloud } from '../../services/cloud'
import './index.scss'

const CATEGORIES = ['数码', '潮玩', '书籍', '服饰', '家居']
const CONDITIONS = ['全新', '99新', '95新', '9成新', '8成新']

export default function Publish() {
  const [title, setTitle] = useState('')
  const [wish, setWish] = useState('')
  const [priceRef, setPriceRef] = useState('')
  const [condition, setCondition] = useState('95新')
  const [category, setCategory] = useState('数码')
  const [images, setImages] = useState<string[]>([])
  const [pin, setPin] = useState(false)

  const chooseImages = () => {
    const left = 9 - images.length
    if (left <= 0) return
    Taro.chooseMedia({
      count: left,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    })
      .then(res => setImages([...images, ...res.tempFiles.map(f => f.tempFilePath)]))
      .catch(() => {})
  }

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const togglePin = () => setPin(!pin)

  async function uploadImages(paths: string[]): Promise<string[]> {
    if (!Taro.cloud) return paths
    const ids: string[] = []
    for (const p of paths) {
      try {
        const res = await Taro.cloud.uploadFile({
          cloudPath: `items/${Date.now()}-${Math.floor(Math.random() * 1e6)}.jpg`,
          filePath: p
        })
        ids.push(res.fileID)
      } catch (e) {
        ids.push(p)
      }
    }
    return ids
  }

  const submit = async () => {
    if (!title.trim()) {
      Taro.showToast({ title: '先给物品起个名字吧', icon: 'none' })
      return
    }
    // 置顶发布：消耗 5 换换币
    if (pin) {
      const ok = useCoinStore.getState().spend(5)
      if (!ok) return // 余额不足时 spend 内部已弹充值框
    }

    Taro.showLoading({ title: '发布中...' })
    try {
      const uploaded = images.length ? await uploadImages(images.slice(0, 9)) : []
      const cover = uploaded[0] || '🎁'
      const payload = {
        title,
        category,
        condition,
        wishlist: wish.split('/').map(s => s.trim()).filter(Boolean),
        priceRef,
        cover,
        images: uploaded,
        pin
      }
      try {
        await callCloud('saveItem', payload)
      } catch (e) {
        // 未配置云环境时静默跳过
      }
      Taro.hideLoading()
      Taro.showToast({ title: pin ? '📌 已置顶发布' : '发布成功 🎉', icon: 'success' })
      setTimeout(() => Taro.navigateBack(), 1200)
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: '发布失败，请重试', icon: 'none' })
    }
  }

  return (
    <View className="publish-page">
      {/* 图片上传 */}
      <View className="pub-section">
        <Text className="pub-label">物品照片（最多9张，第一张为封面）</Text>
        <View className="pub-images">
          {images.map((img, i) => (
            <View key={i} className="pub-img">
              <Image className="pub-img__inner" src={img} mode="aspectFill" />
              {i === 0 && <Text className="pub-img__cover">封面</Text>}
              <View className="pub-img__del" onClick={() => removeImage(i)}>✕</View>
            </View>
          ))}
          {images.length < 9 && (
            <View className="pub-add" onClick={chooseImages}><Text className="pub-add__plus">＋</Text><Text className="pub-add__text">添加</Text></View>
          )}
        </View>
      </View>

      {/* 标题 */}
      <View className="pub-section">
        <Text className="pub-label">物品名称</Text>
        <Input className="pub-input" value={title} maxlength={30} placeholder="例如：罗技 G613 机械键盘" onInput={e => setTitle(e.detail.value)} />
      </View>

      {/* 分类 */}
      <View className="pub-section">
        <Text className="pub-label">分类</Text>
        <View className="pub-chips">
          {CATEGORIES.map(c => (
            <View key={c} className={`pub-chip ${c === category ? 'pub-chip--sel' : ''}`} onClick={() => setCategory(c)}>{c}</View>
          ))}
        </View>
      </View>

      {/* 成色 */}
      <View className="pub-section">
        <Text className="pub-label">成色</Text>
        <View className="pub-chips">
          {CONDITIONS.map(c => (
            <View key={c} className={`pub-chip ${c === condition ? 'pub-chip--sel' : ''}`} onClick={() => setCondition(c)}>{c}</View>
          ))}
        </View>
      </View>

      {/* 想换 */}
      <View className="pub-section">
        <Text className="pub-label">我想换（愿望）</Text>
        <Input className="pub-input" value={wish} maxlength={30} placeholder="例如：Switch 游戏机 / 蓝牙音箱" onInput={e => setWish(e.detail.value)} />
      </View>

      {/* 参考价 */}
      <View className="pub-section">
        <Text className="pub-label">参考价（可选）</Text>
        <Input className="pub-input" value={priceRef} maxlength={20} placeholder="原购买价，帮助对方判断价值" onInput={e => setPriceRef(e.detail.value)} />
      </View>

      {/* 置顶 */}
      <View className="pub-section">
        <View className="pin-row" onClick={togglePin}>
          <View className="pin-info">
            <Text className="pin-title">📌 置顶发布 7 天</Text>
            <Text className="pin-sub">置顶物品在分类信息流中排在最前</Text>
            <Text className="pin-cost">消耗 5 换换币</Text>
          </View>
          <View className={`switch ${pin ? 'switch--on' : ''}`}><View className="switch__knob" /></View>
        </View>
      </View>

      <Button className="pub-submit" onClick={submit}>发布 · 换换</Button>
    </View>
  )
}
