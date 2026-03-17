import { ref, type Ref } from 'vue'
import type { Sounds } from '@/stores/types'

// 全局 sounds 实例，确保整个应用共享同一个实例
const sounds: Ref<Sounds> = ref({})

/**
 * 音效管理 Composable
 *
 * @description
 * 提供音效的创建、播放、暂停、停止等功能
 *
 * @example
 * ```typescript
 * import { useSound } from '@/composables/useSound'
 * import { Howl } from 'howler'
 *
 * const { createSounds, play, pause, stop, getSounds } = useSound()
 *
 * // 创建音效实例
 * createSounds({
 *   bgm: new Howl({ src: ['bgm.mp3'], loop: true }),
 *   click: new Howl({ src: ['click.mp3'] })
 * })
 *
 * // 播放音效
 * play('bgm')
 * play('click')
 *
 * // 暂停音效
 * pause('bgm')
 *
 * // 停止音效
 * stop('bgm')
 * ```
 */
export function useSound() {
  /**
   * 创建音效实例（会先卸载已有实例，避免重复创建导致多个 BGM 同时播放）
   * @param soundsMap - 音效映射对象，key 为音效名称，value 为 Howl 实例
   */
  function createSounds(soundsMap: Sounds) {
    if (Object.keys(sounds.value || {}).length > 0) {
      Object.keys(sounds.value).forEach((key) => {
        const s = sounds.value[key]
        if (s) s.unload()
      })
      sounds.value = {}
    }
    sounds.value = soundsMap
  }

  /**
   * 播放指定的音效
   * @param key - 音效名称
   * @returns 是否成功播放
   */
  function playSounds(key: string): boolean {
    if (sounds.value && sounds.value[key]) {
      sounds.value[key].play()
      return true
    }
    console.warn(`[useSound] Sound "${key}" not found`)
    return false
  }

  /**
   * 暂停指定的音效
   * @param key - 音效名称
   * @returns 是否成功暂停
   */
  function pauseSounds(key: string): boolean {
    if (sounds.value && sounds.value[key]) {
      sounds.value[key].pause()
      return true
    }
    console.warn(`[useSound] Sound "${key}" not found`)
    return false
  }

  /**
   * 停止指定的音效
   * @param key - 音效名称
   * @returns 是否成功停止
   */
  function stopSounds(key: string): boolean {
    if (sounds.value && sounds.value[key]) {
      sounds.value[key].stop()
      return true
    }
    console.warn(`[useSound] Sound "${key}" not found`)
    return false
  }

  /**
   * 获取指定的音效实例
   * @param key - 音效名称
   * @returns Howl 实例或 undefined
   */
  function getSound(key: string) {
    return sounds.value[key]
  }

  /**
   * 获取所有音效实例
   * @returns 所有音效实例的映射对象
   */
  function getSounds() {
    return sounds.value
  }

  /**
   * 检查音效是否存在
   * @param key - 音效名称
   * @returns 是否存在
   */
  function hasSound(key: string): boolean {
    return !!(sounds.value && sounds.value[key])
  }

  /**
   * 销毁指定的音效
   * @param key - 音效名称
   */
  function unloadSounds(key: string) {
    if (sounds.value && sounds.value[key]) {
      sounds.value[key].unload()
      delete sounds.value[key]
    }
  }

  /**
   * 销毁所有音效
   */
  function unloadAllSounds() {
    Object.keys(sounds.value).forEach((key) => {
      const sound = sounds.value[key]
      if (sound) {
        sound.unload()
      }
    })
    sounds.value = {}
  }

  /**
   * 设置指定音效的音量
   * @param key - 音效名称
   * @param volume - 音量 (0-1)
   */
  function setVolume(key: string, volume: number) {
    if (sounds.value && sounds.value[key]) {
      sounds.value[key].volume(volume)
    }
  }

  /**
   * 静音/取消静音指定音效
   * @param key - 音效名称
   * @param muted - 是否静音
   */
  function muteSounds(key: string, muted: boolean) {
    if (sounds.value && sounds.value[key]) {
      sounds.value[key].mute(muted)
    }
  }

  /**
   * 静音/取消静音所有音效
   * @param muted - 是否静音
   */
  function muteAllSounds(muted: boolean) {
    Object.keys(sounds.value).forEach((key) => {
      const sound = sounds.value[key]
      if (sound) {
        sound.mute(muted)
      }
    })
  }

  return {
    createSounds,
    playSounds,
    pauseSounds,
    stopSounds,
    getSound,
    getSounds,
    hasSound,
    unloadSounds,
    unloadAllSounds,
    setVolume,
    muteSounds,
    muteAllSounds
  }
}
